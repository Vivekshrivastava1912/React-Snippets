import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaSignInAlt, FaUserPlus, FaArrowLeft } from 'react-icons/fa';

const AuthGuard = ({ children }) => {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    // Show loading state while checking user session
    if (user?.loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#050505] text-white p-6">
                <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 text-sm font-medium">Checking session...</p>
            </div>
        );
    }

    // If user is logged in, allow access to guarded feature
    if (user?._id) {
        return children;
    }

    // If user is NOT logged in, show Login Required page
    return (
        <div className="min-h-[78vh] flex items-center justify-center bg-[#050505] text-white p-6 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 text-center relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                
                {/* Lock Badge */}
                <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-center justify-center text-yellow-500 mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <FaLock size={28} />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500/70 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full inline-block mb-3">
                    Login Required
                </span>

                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-3">
                    Is Feature Ke Liye Login Karein
                </h2>

                <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">
                    Aapko is feature ko access karne ke liye apne account se login karna hoga. Login karne ke baad aap saare features normal tarike se upayog kar sakte hain.
                </p>

                <div className="space-y-3">
                    <Link
                        to="/login"
                        className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.25)] flex items-center justify-center gap-2 active:scale-95"
                    >
                        <FaSignInAlt size={16} /> Login Karein
                    </Link>

                    <Link
                        to="/register"
                        className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <FaUserPlus size={16} /> Account Banayein
                    </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs text-gray-500 hover:text-yellow-500 transition-colors inline-flex items-center gap-2 font-medium"
                    >
                        <FaArrowLeft size={12} /> Home Screen Per Jayein
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthGuard;

