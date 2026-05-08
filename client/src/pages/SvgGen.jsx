import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import { useSelector, useDispatch } from 'react-redux';
import { updateCredit } from '../redux/userSlice';
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

const SvgGen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [prompt, setPrompt] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [previewTheme, setPreviewTheme] = useState('light');
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        if (!document.getElementById('tailwind-cdn')) {
            const script = document.createElement('script');
            script.id = 'tailwind-cdn';
            script.src = 'https://cdn.tailwindcss.com';
            document.head.appendChild(script);
        }
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt!");
            return;
        }

        if (user.credit < 20) {
            toast.error("you have not sufficient credit");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Generating your component...");

        try {
            const response = await Axios({
                ...SummaryApi.svgAiGeneration,
                data: { prompt }
            });

            if (response.data.success) {
                let cleanCode = response.data.message;
                cleanCode = cleanCode.replace(/```(?:jsx|javascript|js)?\n?([\s\S]*?)```/g, '$1').trim();
                setCode(cleanCode);

                // Update credits in Redux
                if (response.data.updatedCredits !== undefined) {
                    dispatch(updateCredit(response.data.updatedCredits));
                }

                toast.success("Component generated successfully!", { id: loadingToast });
            } else {
                toast.error(response.data.message || "Failed to generate component.", { id: loadingToast });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };
    
    const handleSave = async () => {
        if (!code.trim()) {
            toast.error("Nothing to save!");
            return;
        }
        if (!title.trim()) {
            toast.error("Please enter a title for your SVG!");
            return;
        }

        setIsSaving(true);
        const savingToast = toast.loading("Saving your SVG...");

        try {
            const response = await Axios({
                ...SummaryApi.saveSvg,
                data: {
                    svgCode: code,
                    title,
                    status: 'Public', // Default to public
                    theme: previewTheme
                }
            });

            if (response.data.success) {
                toast.success("SVG saved successfully!", { id: savingToast });
                setTitle('');
            } else {
                toast.error(response.data.message || "Failed to save SVG.", { id: savingToast });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong", { id: savingToast });
        } finally {
            setIsSaving(false);
        }
    };



    return (
        <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/2 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/2 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] bg-size-[32px_32px] opacity-[0.4]"></div>
            </div>

            <div className="max-w-400 mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10 flex flex-col lg:h-screen lg:max-h-screen">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 md:gap-6 shrink-0">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            {/* Icon badal kar Shapes ya PenTool kar diya hai jo SVG ke liye better hai */}
                            <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-sm">
                                <LucideIcons.Shapes className="text-yellow-500 w-5 h-5" />
                            </div>
                            <h1 className="text-xl md:text-3xl font-bold tracking-tight text-white">AI SVG Studio</h1>
                        </div>
                        <p className="text-gray-400 text-[12px] md:text-sm font-light max-w-xl">
                            Generate custom vector graphics and icons instantly. Describe your vision and get clean, production-ready SVG code.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* User Credits Display - Isse same rakha hai consistency ke liye */}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-sm h-11">
                            <LucideIcons.Coins className="w-4 h-4 text-yellow-500" />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Credits</span>
                                <span className="text-sm font-mono text-white">{user.credit || 0}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <input 
                                type="text"
                                placeholder="SVG Title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-white/5 border border-white/10 px-3 py-2 rounded-sm h-11 text-sm outline-none focus:border-yellow-500/50 transition-all w-32 md:w-48"
                            />
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !code}
                                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-sm h-11 transition-all disabled:opacity-50 font-bold text-xs uppercase tracking-widest"
                            >
                                <LucideIcons.Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>

                </header>

                {/* Main Workspace */}
                <LiveProvider code={code} scope={scope} transformCode={transformCode} noInline={true} onChange={setCode}>
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 mb-8 overflow-y-auto lg:overflow-hidden">
                        {/* Editor Panel */}
                        <section className="flex flex-col bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-2xl h-100 lg:h-full">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/2">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5 mr-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Source Code</span>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(code);
                                        toast.success("Copied to clipboard!");
                                    }}
                                    className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
                                >
                                    <LucideIcons.Copy className="w-3.5 h-3.5 group-hover:scale-110" />
                                    Copy
                                </button>
                            </div>

                            <div className="flex-1 relative group overflow-hidden">
                                <div className="h-full overflow-auto custom-scrollbar">
                                    <LiveEditor
                                        className="font-mono text-[12px] md:text-[13px] leading-relaxed outline-none min-h-full"
                                        style={{
                                            fontFamily: '"Fira Code", "Fira Mono", monospace',
                                            backgroundColor: 'transparent',
                                        }}
                                    />
                                </div>
                                {loading && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
                                        <div className="flex flex-col items-center gap-5">
                                            <div className="relative">
                                                <div className="w-12 h-12 border-2 border-white/5 rounded-full"></div>
                                                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-white rounded-full animate-spin"></div>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-white font-bold animate-pulse">Processing Prompt</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Preview Panel */}
                        <section className="flex flex-col bg-black border border-white/10 rounded-sm overflow-hidden shadow-2xl h-100 lg:h-full">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/2">
                                <div className="flex items-center gap-2">
                                    <LucideIcons.Play className="w-3.5 h-3.5 text-green-500" />
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Live Rendering</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-sm border border-white/5">
                                        <button
                                            onClick={() => setPreviewTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                                            className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/10 rounded-sm transition-colors text-gray-400 hover:text-white"
                                            title="Toggle Preview Theme"
                                        >
                                            {previewTheme === 'dark' ? <LucideIcons.Sun size={12} /> : <LucideIcons.Moon size={12} />}
                                            <span className="text-[10px] uppercase tracking-widest font-bold">Change Theme</span>
                                        </button>
                                        <div className="w-px h-3 bg-white/10 mx-1"></div>
                                        <button
                                            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                                            className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded-sm transition-colors"
                                        >
                                            <LucideIcons.Minus size={12} />
                                        </button>
                                        <span className="text-[10px] text-gray-500 font-mono w-8 text-center">{Math.round(zoom * 100)}%</span>
                                        <button
                                            onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
                                            className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded-sm transition-colors"
                                        >
                                            <LucideIcons.Plus size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex-1 overflow-auto relative p-4 md:p-8 custom-scrollbar transition-colors duration-300 ${previewTheme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f0f0f0]'}`}>
                                <div
                                    className="min-h-full w-full flex justify-center items-center transition-transform duration-300 ease-out"
                                    style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                                >
                                    {code.trim().toLowerCase().startsWith('<svg') ? (
                                        <div dangerouslySetInnerHTML={{ __html: code }} className="w-full h-full flex justify-center items-center [&>svg]:max-w-[30%] [&>svg]:max-h-[60%] [&>svg]:w-auto [&>svg]:h-auto" />
                                    ) : (
                                        <LivePreview className="w-full" />
                                    )}
                                </div>
                                {code.trim().toLowerCase().startsWith('<svg') ? null : (
                                    <LiveError className="text-red-400 text-[11px] mt-8 font-mono whitespace-pre-wrap bg-red-500/5 p-5 border border-red-500/10 rounded-sm backdrop-blur-md" />
                                )}
                            </div>
                        </section>
                    </div>
                </LiveProvider>

                {/* Prompt Section - Mobile friendly */}
                <div className="shrink-0 pb-6">
                    <div className="relative max-w-4xl mx-auto group">
                        <div className="absolute -inset-1 bg-linear-to-r from-white/20 to-white/5 rounded-sm blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                        <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-[#0a0a0a] border border-white/10 p-2 rounded-sm shadow-2xl focus-within:border-white/30 transition-all duration-300">
                            <div className="hidden md:flex pl-4 items-center gap-3 text-gray-500">
                                <LucideIcons.Sparkles className="w-5 h-5 text-white/40" />
                                <div className="w-px h-6 bg-white/10"></div>
                            </div>
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                placeholder="Describe any SVG..."
                                className="flex-1 bg-transparent border-none outline-none py-3 md:py-4 px-2 text-[14px] md:text-[15px] text-gray-200 placeholder:text-gray-600 font-light"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="relative flex items-center justify-center gap-2 bg-white text-black px-7 py-3.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all hover:bg-gray-100 disabled:opacity-50"
                            >
                                <span>{loading ? 'Generating...' : 'Generate UI'}</span>
                                {!loading && <LucideIcons.Zap className="w-4 h-4 fill-current" />}
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-center gap-6 mt-4">
                        {['Glassmorphism', 'Neumorphism', 'Minimalist', 'Animated'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setPrompt(prev => prev + ' ' + tag)}
                                className="text-[9px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
                            >
                                + {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}} />
        </div>
    );
};

export default SvgGen;
