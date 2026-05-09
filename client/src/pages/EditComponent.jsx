import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { LiveProvider, LiveEditor, LivePreview, LiveError, LiveContext } from 'react-live';
import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
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

    result = result.replace(/\bfixed\b/g, 'absolute');

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

const InterceptingLiveEditor = ({ codeRef, ...props }) => {
    const live = React.useContext(LiveContext);

    const handleChange = (newCode) => {
        codeRef.current = newCode;
        if (live && typeof live.onChange === 'function') {
            live.onChange(newCode);
        }
    };

    return <LiveEditor {...props} onChange={handleChange} />;
};

const EditComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [initialCode] = useState(location.state?.code || '');
    const codeRef = useRef(location.state?.code || '');
    const [title, setTitle] = useState(location.state?.title || '');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [status, setStatus] = useState('Public');
    const [loading, setLoading] = useState(false);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (!document.getElementById('tailwind-cdn')) {
            const script = document.createElement('script');
            script.id = 'tailwind-cdn';
            script.src = 'https://cdn.tailwindcss.com';
            document.head.appendChild(script);
        }
    }, []);

    if (!location.state) {
        return <Navigate to="/components" />;
    }

    const handleFinalSave = async (e) => {
        e.preventDefault();
        const currentCode = codeRef.current;
        if (!title.trim() || !currentCode.trim()) {
            toast.error("Please fill all fields!");
            return;
        }

        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.saveCode,
                data: { title, code: currentCode, status },
                withCredentials: true
            });

            if (response.data.success) {
                toast.success(response.data.message || "Snippet saved successfully!");
                navigate('/components');
            } else {
                toast.error(response.data.message || "Failed to save snippet.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
            setShowSaveModal(false);
        }
    };

    const memoizedLiveWorkspace = useMemo(() => (
        <LiveProvider code={initialCode} scope={scope} transformCode={transformCode} noInline={true}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor */}
                <div className="space-y-4">
                    <label className="text-sm uppercase tracking-widest text-gray-500">Edit Source Code</label>
                    <div className="w-full h-150 bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden focus-within:border-yellow-500/30 transition-all">
                        <div className="h-full overflow-auto custom-scrollbar">
                            <InterceptingLiveEditor
                                codeRef={codeRef}
                                className="font-mono text-sm min-h-full"
                                style={{
                                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                                    backgroundColor: 'transparent',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                    {/* Title and Zoom Controls in the same line */}
                    <div className="flex justify-between items-center">
                        <label className="text-sm uppercase tracking-widest text-gray-500">Live Preview</label>
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.3))}
                                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-yellow-500/10 border border-white/10 rounded text-gray-400 hover:text-yellow-500 transition-colors"
                            >
                                -
                            </button>
                            <span className="text-[10px] text-yellow-500/50 uppercase tracking-tighter w-10 text-center font-mono">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
                                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-yellow-500/10 border border-white/10 rounded text-gray-400 hover:text-yellow-500 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-150 bg-black border border-white/10 rounded-lg p-6 overflow-auto relative z-0 focus-within:border-yellow-500/20 transition-all" style={{ transform: 'translate3d(0,0,0)' }}>
                        <div
                            className="min-h-full w-full flex justify-center items-start transition-transform duration-200 ease-out"
                            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                        >
                            <LivePreview className="w-full" />
                        </div>
                        <LiveError className="text-red-400 text-xs mt-6 font-mono whitespace-pre-wrap bg-red-400/10 p-4 rounded border border-red-400/20" />
                    </div>
                </div>
            </div>
        </LiveProvider>
    ), [initialCode, zoom]);

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-10 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Edit Component</h1>
                        <p className="text-gray-500 text-sm mt-1">Live preview and modify "{title}"</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 border border-white/20 rounded text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="px-6 py-2 bg-yellow-500 text-black rounded text-sm uppercase tracking-widest font-bold hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                        >
                            Continue to Save
                        </button>
                    </div>
                </div>

                {memoizedLiveWorkspace}
            </div>

            {/* Modal Overlay */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
                    <div className="w-full max-w-xl bg-[#050505] border border-white/10 shadow-[0_0_25px_rgba(234,179,8,0.05)] p-8 rounded-lg relative">
                        <button
                            onClick={() => setShowSaveModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-yellow-500 transition-colors"
                        >
                            <LucideIcons.X size={20} />
                        </button>

                        <h2 className="text-xl font-light tracking-widest mb-8 border-b border-white/5 pb-3 uppercase text-center text-yellow-500">
                            Save Snippet
                        </h2>

                        <form onSubmit={handleFinalSave} className="space-y-7">
                            <div className="group">
                                <label className="block text-[11px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-yellow-500 transition-colors">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter snippet title..."
                                    className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-yellow-500/60 text-gray-200 transition-colors font-light placeholder:text-gray-700"
                                    required
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[11px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-yellow-500 transition-colors">Visibility</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border-b border-white/10 py-2 px-1 outline-none focus:border-yellow-500/60 text-sm font-light cursor-pointer text-gray-300"
                                >
                                    <option value="Public">Public</option>
                                    <option value="Private">Private</option>
                                </select>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto bg-yellow-500 text-black px-10 py-2.5 rounded-sm text-xs uppercase tracking-[0.2em] font-bold hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all duration-300 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Execute Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditComponent;