import React, { useState, useEffect } from 'react';
import { FaTrash, FaShapes, FaUser, FaCalendarAlt, FaCheck, FaCopy } from 'react-icons/fa';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
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

const AdminAllSvgs = () => {
    const [svgs, setSvgs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [cardThemes, setCardThemes] = useState({});

    const fetchAllSvgs = async () => {
        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.allSvgsAdmin
            });
            if (response.data.success) {
                setSvgs(response.data.data);
                const initialThemes = {};
                response.data.data.forEach(svg => {
                    initialThemes[svg._id] = svg.theme || 'light';
                });
                setCardThemes(initialThemes);
            }
        } catch (error) {
            toast.error("Failed to fetch SVGs");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSvg = async (svgId) => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteSvgAdmin,
                data: { svgId }
            });
            if (response.data.success) {
                toast.success("SVG deleted successfully");
                fetchAllSvgs();
            }
        } catch (error) {
            toast.error("Failed to delete SVG");
        }
    };

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

    useEffect(() => {
        if (!document.getElementById('tailwind-cdn')) {
            const script = document.createElement('script');
            script.id = 'tailwind-cdn';
            script.src = 'https://cdn.tailwindcss.com';
            document.head.appendChild(script);
        }
        fetchAllSvgs();
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-3">
                        <FaShapes className="text-yellow-500 shrink-0" /> 
                        <span>ADMIN: ALL SVGs</span>
                    </h1>
                    <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-sm border border-yellow-500/20 text-[10px] uppercase tracking-widest font-black">
                        {svgs.length} SVGs Total
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-white/20 border-t-yellow-500 rounded-sm animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {svgs.map((svg) => (
                            <div key={svg._id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all flex flex-col">
                                <div className="p-5 border-b border-white/5 bg-white/2">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg truncate capitalize">{svg.title}</h3>
                                            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 mt-1">
                                                <FaUser size={8} /> {svg.userId?.name || 'Unknown'} • <FaCalendarAlt size={8} /> {new Date(svg.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className={`text-[9px] px-2 py-0.5 rounded font-black uppercase border ${svg.status === 'Public' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                                            {svg.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 flex-1 bg-black min-h-62.5 relative flex flex-col justify-center items-center overflow-hidden">
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
                                            className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-gray-400 hover:text-yellow-500 transition-all border border-transparent hover:border-yellow-500/20"
                                        >
                                            {copiedId === svg._id ? <FaCheck size={12} /> : <FaCopy size={12} />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSvg(svg._id)}
                                            className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>

                                    <div className={`w-full flex justify-center items-center p-4 transition-colors duration-300 ${cardThemes[svg._id] === 'light' ? 'bg-[#f0f0f0]' : 'bg-black'}`}>
                                        {svg.svgCode.trim().toLowerCase().startsWith('<svg') ? (
                                            <div 
                                                dangerouslySetInnerHTML={{ __html: svg.svgCode }} 
                                                className="w-full flex justify-center items-center [&>svg]:max-w-[100%] [&>svg]:max-h-[150px] [&>svg]:w-auto [&>svg]:h-auto" 
                                            />
                                        ) : (
                                            <div className="w-full scale-90">
                                                <LiveProvider code={svg.svgCode} scope={scope} transformCode={transformCode} noInline={true}>
                                                    <LivePreview className="w-full flex justify-center" />
                                                    <LiveError className="text-[10px] text-red-500 mt-2 text-center" />
                                                </LiveProvider>
                                            </div>
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

export default AdminAllSvgs;
