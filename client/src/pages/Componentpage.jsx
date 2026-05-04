import React, { useState, useEffect } from 'react';
import { FaSearch, FaCode, FaCopy, FaCheck } from 'react-icons/fa';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const Componentpage = () => {
    const [components, setComponents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const fetchComponents = async (searchQuery = '') => {
        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.getUserCodes,
                params: { search: searchQuery }
            });
            
            if (response.data.success) {
                setComponents(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching components:", error);
            toast.error("Failed to load components");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search query to avoid too many API calls
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

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-10 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header & Search */}
                <div className="flex flex-col items-center text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">Components</span>
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base max-w-2xl">
                        Discover public UI components, snippets, and utilities saved by the community. 
                        Search for specific elements and integrate them into your project instantly.
                    </p>

                    <div className="w-full max-w-2xl relative group mt-8">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors">
                            <FaSearch />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search components by title..."
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-full py-4 pl-12 pr-6 outline-none focus:border-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.05)] text-white placeholder:text-gray-600 transition-all font-light"
                        />
                    </div>
                </div>

                {/* Components Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) : components.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 bg-white/[0.02] rounded-2xl">
                        <FaCode className="mx-auto text-4xl text-gray-700 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No components found</h3>
                        <p className="text-gray-600 text-sm mt-2">Try adjusting your search query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {components.map((comp) => (
                            <div key={comp._id} className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(255,255,255,0.02)] flex flex-col">
                                <div className="p-5 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                                    <div>
                                        <h3 className="text-lg font-bold tracking-tight capitalize group-hover:text-white text-gray-200 transition-colors">
                                            {comp.title}
                                        </h3>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">
                                            {new Date(comp.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="bg-white/10 text-white text-[9px] px-2 py-1 rounded uppercase tracking-widest font-bold">
                                        {comp.status}
                                    </div>
                                </div>
                                
                                <div className="p-5 flex-1 relative bg-black">
                                    <div className="absolute top-3 right-3 z-10">
                                        <button
                                            onClick={() => handleCopy(comp.code, comp._id)}
                                            className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all"
                                            title="Copy Code"
                                        >
                                            {copiedId === comp._id ? <FaCheck className="text-green-400" /> : <FaCopy />}
                                        </button>
                                    </div>
                                    <pre className="text-xs text-gray-400 font-mono overflow-x-auto overflow-y-hidden max-h-48">
                                        <code>{comp.code}</code>
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Componentpage;
