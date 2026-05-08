import React, { useState, useEffect } from 'react';
import { FaSearch, FaCode, FaCopy, FaCheck } from 'react-icons/fa';
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

const Componentpage = () => {
    const [components, setComponents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    // Tailwind CDN load karne ke liye useEffect taaki preview me classes chalein
    useEffect(() => {
        if (!document.getElementById('tailwind-cdn')) {
            const script = document.createElement('script');
            script.id = 'tailwind-cdn';
            script.src = 'https://cdn.tailwindcss.com';
            document.head.appendChild(script);
        }
    }, []);

    const fetchComponents = async (searchQuery = '') => {
        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.getUserCodes,
                params: { search: searchQuery }
            });

            if (response.data.success) {
                setComponents(response.data.data);
                setCurrentPage(1); // Reset to first page on search
            }
        } catch (error) {
            console.error("Error fetching components:", error);
            toast.error("Failed to load components");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchComponents(search);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success("Code copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = components.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(components.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-10 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex flex-col items-center text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Explore Components
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base max-w-2xl">
                        Discover public UI components, snippets, and utilities saved by the community.
                        Search for specific elements and integrate them into your project instantly.
                    </p>

                    <div className="w-full max-w-2xl relative group mt-8">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                            <FaSearch />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search components by title..."
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-full py-4 pl-12 pr-6 outline-none focus:border-yellow-500/30 focus:shadow-[0_0_20px_rgba(234,179,8,0.05)] text-white placeholder:text-gray-600 transition-all font-light"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-2 border-white/20 border-t-yellow-500 rounded-full animate-spin"></div>
                    </div>
                ) : components.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 bg-white/2 rounded-2xl">
                        <FaCode className="mx-auto text-4xl text-gray-700 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No components found</h3>
                        <p className="text-gray-600 text-sm mt-2">Try adjusting your search query.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentItems.map((comp) => (
                                <div key={comp._id} className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500/20 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(234,179,8,0.02)] flex flex-col">
                                    <div className="p-5 border-b border-white/5 flex justify-between items-start bg-white/2">
                                        <div>
                                            <h3 className="text-lg font-bold tracking-tight capitalize group-hover:text-yellow-500 text-gray-200 transition-colors">
                                                {comp.title}
                                            </h3>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">
                                                {new Date(comp.createdAt).toLocaleDateString()} {comp.userId?.name ? `• by ${comp.userId.name}` : ''}
                                            </p>
                                        </div>
                                        <div className="bg-yellow-500/10 text-yellow-500 text-[9px] px-2 py-1 rounded uppercase tracking-widest font-bold border border-yellow-500/20">
                                            {comp.status}
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 relative bg-black min-h-62.5 flex flex-col">
                                        <div className="absolute top-3 right-3 z-10 flex gap-2">
                                            <button
                                                onClick={() => navigate('/edit-component', { state: { title: comp.title, code: comp.code } })}
                                                className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all border border-transparent hover:border-yellow-500/20"
                                                title="Edit Component"
                                            >
                                                <FaIcons.FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleCopy(comp.code, comp._id)}
                                                className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all border border-transparent hover:border-yellow-500/20"
                                                title="Copy Code"
                                            >
                                                {copiedId === comp._id ? <FaCheck className="text-yellow-500" /> : <FaCopy />}
                                            </button>
                                        </div>
                                        <div className="mt-8 text-sm overflow-hidden flex-1 flex justify-center items-center">
                                            <LiveProvider code={comp.code} scope={scope} transformCode={transformCode} noInline={true}>
                                                <div className="w-full flex justify-center items-center">
                                                    <LivePreview className="w-full max-h-64 overflow-y-auto flex justify-center items-center" />
                                                </div>
                                                <LiveError className="text-red-400 text-xs mt-4 font-mono whitespace-pre-wrap" />
                                            </LiveProvider>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12 pb-6">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-sm text-sm font-bold uppercase tracking-widest hover:border-yellow-500/50 disabled:opacity-30 disabled:hover:border-white/10 transition-all"
                                >
                                    Prev
                                </button>
                                
                                <div className="flex items-center gap-2">
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNum = index + 1;
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => paginate(pageNum)}
                                                    className={`w-10 h-10 flex items-center justify-center rounded-sm text-xs font-bold transition-all border ${
                                                        currentPage === pageNum
                                                            ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                                                            : 'bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-yellow-500/50'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            (pageNum === currentPage - 2 && pageNum > 1) ||
                                            (pageNum === currentPage + 2 && pageNum < totalPages)
                                        ) {
                                            return <span key={pageNum} className="text-gray-600">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-sm text-sm font-bold uppercase tracking-widest hover:border-yellow-500/50 disabled:opacity-30 disabled:hover:border-white/10 transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Componentpage;