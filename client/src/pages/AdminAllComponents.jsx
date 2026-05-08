import React, { useState, useEffect } from 'react';
import { FaTrash, FaLaptopCode, FaUser, FaCalendarAlt, FaCheck, FaCopy } from 'react-icons/fa';
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

    if (!result.includes('render(')) {
        const componentMatch = result.match(/(?:const|function)\s+([A-Z][a-zA-Z0-9_]*)/);
        const componentName = componentMatch ? componentMatch[1] : null;

        if (componentName) {
            result += `\nrender(<${componentName} />);`;
        } else {
            result = `render(<>\n${result}\n</>);`;
        }
    }
    return result;
};

const AdminAllComponents = () => {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const fetchAllComponents = async () => {
        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.allComponentsAdmin
            });
            if (response.data.success) {
                setComponents(response.data.data);
                setCurrentPage(1);
            }
        } catch (error) {
            toast.error("Failed to fetch components");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComponent = async (componentId) => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteComponentAdmin,
                data: { componentId }
            });
            if (response.data.success) {
                toast.success("Component deleted successfully");
                fetchAllComponents();
            }
        } catch (error) {
            toast.error("Failed to delete component");
        }
    };

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success("Code copied!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        // Tailwind CDN check
        if (!document.getElementById('tailwind-cdn')) {
            const script = document.createElement('script');
            script.id = 'tailwind-cdn';
            script.src = 'https://cdn.tailwindcss.com';
            document.head.appendChild(script);
        }
        fetchAllComponents();
    }, []);

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
        <div className="min-h-screen bg-[#050505] text-white p-6 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-3">
                        <FaLaptopCode className="text-yellow-500 shrink-0" /> 
                        <span>ADMIN: ALL COMPONENTS</span>
                    </h1>
                    <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-sm border border-yellow-500/20 text-[10px] uppercase tracking-widest font-black">
                        {components.length} Components Total
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-white/20 border-t-yellow-500 rounded-sm animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentItems.map((comp) => (
                                <div key={comp._id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all flex flex-col">
                                    <div className="p-5 border-b border-white/5 bg-white/2">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg truncate capitalize">{comp.title}</h3>
                                                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 mt-1">
                                                    <FaUser size={8} /> {comp.userId?.name || 'Unknown'} • <FaCalendarAlt size={8} /> {new Date(comp.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className={`text-[9px] px-2 py-0.5 rounded font-black uppercase border ${comp.status === 'Public' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                                                {comp.status}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 bg-black min-h-62.5 relative flex flex-col justify-center items-center overflow-hidden">
                                        <div className="absolute top-3 right-3 z-10 flex gap-2">
                                            <button
                                                onClick={() => handleCopy(comp.code, comp._id)}
                                                className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-gray-400 hover:text-yellow-500 transition-all border border-transparent hover:border-yellow-500/20"
                                            >
                                                {copiedId === comp._id ? <FaCheck size={12} /> : <FaCopy size={12} />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComponent(comp._id)}
                                                className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>

                                        <div className="w-full scale-90">
                                            <LiveProvider code={comp.code} scope={scope} transformCode={transformCode} noInline={true}>
                                                <LivePreview className="w-full flex justify-center" />
                                                <LiveError className="text-[10px] text-red-500 mt-2 text-center" />
                                            </LiveProvider>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12 pb-10">
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

export default AdminAllComponents;