import React, { useState, useEffect } from 'react';
import { FaCode, FaCopy, FaCheck, FaUserCircle } from 'react-icons/fa';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

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

const Profile = () => {
    const user = useSelector(state => state.user);
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!document.getElementById('tailwind-cdn')) {
            const script = document.createElement('script');
            script.id = 'tailwind-cdn';
            script.src = 'https://cdn.tailwindcss.com';
            document.head.appendChild(script);
        }
    }, []);

    const fetchMyComponents = async () => {
        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.getCodesForUser
            });

            if (response.data.success) {
                setComponents(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching user components:", error);
            toast.error("Failed to load your components");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchMyComponents();
        }
    }, [user]);

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success("Code copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!user?._id) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-[#050505] text-white">
                <div className="text-center space-y-4">
                    <FaUserCircle size={64} className="mx-auto text-gray-700" />
                    <h2 className="text-2xl font-bold">Please login to view your profile</h2>
                    <button onClick={() => navigate('/login')} className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-colors">
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-10 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Profile Header */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="w-32 h-32 rounded-full bg-yellow-500/10 text-yellow-500 border-2 border-yellow-500/20 flex items-center justify-center text-5xl font-black shrink-0 relative z-10">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 text-center md:text-left relative z-10 space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black capitalize tracking-tight">{user.name}</h1>
                        <p className="text-gray-400 text-lg">{user.email}</p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                            <div className="bg-white/5 px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Role</span>
                                <span className="text-sm font-bold text-white">{user.role || 'USER'}</span>
                            </div>
                            <div className="bg-white/5 px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Credits</span>
                                <span className="text-sm font-bold text-yellow-500">{user.credit || 0}</span>
                            </div>
                            <div className="bg-white/5 px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Components</span>
                                <span className="text-sm font-bold text-white">{components.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Components List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
                        <FaCode className="text-yellow-500" /> My Saved Components
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-10 h-10 border-2 border-white/20 border-t-yellow-500 rounded-full animate-spin"></div>
                        </div>
                    ) : components.length === 0 ? (
                        <div className="text-center py-20 border border-white/5 bg-white/2 rounded-2xl">
                            <FaCode className="mx-auto text-4xl text-gray-700 mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">No components created yet</h3>
                            <p className="text-gray-600 text-sm mt-2">Go to AI Lab or Components to create one.</p>
                            <button onClick={() => navigate('/aicomponent-gen')} className="mt-6 px-6 py-2 border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold rounded-full transition-colors">
                                Create Component
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {components.map((comp) => (
                                <div key={comp._id} className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500/20 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(234,179,8,0.02)] flex flex-col">
                                    <div className="p-5 border-b border-white/5 flex justify-between items-start bg-white/2">
                                        <div className="w-full pr-2">
                                            <h3 className="text-lg font-bold tracking-tight capitalize group-hover:text-yellow-500 text-gray-200 transition-colors truncate">
                                                {comp.title}
                                            </h3>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">
                                                {new Date(comp.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="bg-yellow-500/10 text-yellow-500 text-[9px] px-2 py-1 rounded uppercase tracking-widest font-bold border border-yellow-500/20 shrink-0">
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
                                                    <LivePreview className="w-full flex justify-center items-center" />
                                                </div>
                                                <LiveError className="text-red-400 text-xs mt-4 font-mono whitespace-pre-wrap" />
                                            </LiveProvider>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
