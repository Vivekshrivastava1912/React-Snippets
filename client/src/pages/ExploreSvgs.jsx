import React, { useState, useEffect } from 'react';
import { FaSearch, FaCopy, FaCheck, FaShapes } from 'react-icons/fa';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const scope = {
    React,
    ...React,
    ...LucideIcons,
    ...FaIcons,
    motion,
    AnimatePresence
};

const transformCode = (code) => {
    if (!code) return '';
    let result = code.replace(/import\s+(?:[\w\s{},*]+\s+from\s+)?['"][^'"]+['"]\s*;?/g, '');
    result = result.replace(/export\s+default\s+function\s+([a-zA-Z0-9_]+)/g, 'function $1');
    result = result.replace(/export\s+default\s+([a-zA-Z0-9_]+);?/g, '');
    result = result.replace(/export\s+(const|function|let|var)\s+/g, '$1 ');

    if (result.includes('render(')) {
        return result;
    }

    let componentName = '';
    const componentRegex = /(?:const|let|var|function)\s+([A-Z][a-zA-Z0-9_]*)\s*(?:=|\()/g;
    let match;
    while ((match = componentRegex.exec(result)) !== null) {
        componentName = match[1];
    }

    if (componentName) {
        result += `\nrender(<${componentName} />);`;
    } else {
        result = `render(<>\n${result}\n</>);`;
    }
    return result;
};

const ExploreSvgs = () => {
    const [svgs, setSvgs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [cardThemes, setCardThemes] = useState({}); // Stores theme per SVG ID
    const navigate = useNavigate();

    useEffect(() => {
        if (!document.getElementById('tailwind-cdn')) {
            const script = document.createElement('script');
            script.id = 'tailwind-cdn';
            script.src = 'https://cdn.tailwindcss.com';
            document.head.appendChild(script);
        }
    }, []);

    const fetchSvgs = async (searchQuery = '') => {
        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.getPublicSvgs,
                params: { search: searchQuery }
            });

            if (response.data.success) {
                setSvgs(response.data.data);
                // Initialize themes from database
                const initialThemes = {};
                response.data.data.forEach(svg => {
                    initialThemes[svg._id] = svg.theme || 'light';
                });
                setCardThemes(initialThemes);
            }
        } catch (error) {
            console.error("Error fetching SVGs:", error);
            toast.error("Failed to load SVGs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchSvgs(search);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);
    
    const toggleCardTheme = (id) => {
        setCardThemes(prev => ({
            ...prev,
            [id]: prev[id] === 'light' ? 'dark' : 'light'
        }));
    };

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success("SVG Code copied!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-10 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex flex-col items-center text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Explore SVG Library
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base max-w-2xl">
                        Discover public vector graphics and icons created by our community.
                        Find the perfect visual element for your next project.
                    </p>

                    <div className="w-full max-w-2xl relative group mt-8">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                            <FaSearch />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search public SVGs..."
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-full py-4 pl-12 pr-6 outline-none focus:border-yellow-500/30 focus:shadow-[0_0_30px_rgba(234,179,8,0.2)] text-white placeholder:text-gray-600 transition-all font-light"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-2 border-white/20 border-t-yellow-500 rounded-full animate-spin"></div>
                    </div>
                ) : svgs.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 bg-white/2 rounded-2xl">
                        <FaShapes className="mx-auto text-4xl text-gray-700 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No SVGs found</h3>
                        <p className="text-gray-600 text-sm mt-2">Be the first to share a beautiful SVG!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {svgs.map((svg) => (
                            <div key={svg._id} className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500/20 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(234,179,8,0.02)] flex flex-col">
                                <div className="p-5 border-b border-white/5 flex justify-between items-start bg-white/2">
                                    <div>
                                        <h3 className="text-lg font-bold tracking-tight capitalize group-hover:text-yellow-500 text-gray-200 transition-colors truncate">
                                            {svg.title}
                                        </h3>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">
                                            {new Date(svg.createdAt).toLocaleDateString()} {svg.userId?.name ? `• by ${svg.userId.name}` : ''}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-500/10 text-yellow-500 text-[9px] px-2 py-1 rounded uppercase tracking-widest font-bold border border-yellow-500/20">
                                        {svg.status}
                                    </div>
                                </div>

                                <div className="p-5 flex-1 relative bg-black min-h-62.5 flex flex-col">
                                    <div className="absolute top-3 right-3 z-10 flex gap-2">
                                        <button
                                            onClick={() => toggleCardTheme(svg._id)}
                                            className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all border border-transparent hover:border-yellow-500/20"
                                            title="Toggle Theme"
                                        >
                                            {cardThemes[svg._id] === 'light' ? <LucideIcons.Moon size={12} /> : <LucideIcons.Sun size={12} />}
                                        </button>
                                        <button
                                            onClick={() => handleCopy(svg.svgCode, svg._id)}
                                            className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all border border-transparent hover:border-yellow-500/20"
                                            title="Copy SVG Code"
                                        >
                                            {copiedId === svg._id ? <FaCheck size={12} className="text-yellow-500" /> : <FaCopy size={12} />}
                                        </button>
                                    </div>
                                    <div className={`mt-8 text-sm overflow-hidden flex-1 flex justify-center items-center transition-colors duration-300 ${cardThemes[svg._id] === 'light' ? 'bg-[#f0f0f0]' : 'bg-black'}`}>
                                        {svg.svgCode.trim().toLowerCase().startsWith('<svg') ? (
                                            <div 
                                                dangerouslySetInnerHTML={{ __html: svg.svgCode }} 
                                                className="w-full h-full flex justify-center items-center [&>svg]:max-w-[100%] [&>svg]:max-h-[200px] [&>svg]:w-auto [&>svg]:h-auto" 
                                            />
                                        ) : (
                                            <LiveProvider code={svg.svgCode} scope={scope} transformCode={transformCode} noInline={true}>
                                                <div className="w-full flex justify-center items-center">
                                                    <LivePreview className="w-full max-h-64 overflow-y-auto flex justify-center items-center" />
                                                </div>
                                            </LiveProvider>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExploreSvgs;
