import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    FaEnvelope, FaPhone, FaCalendarAlt, FaSignOutAlt,
    FaTimes, FaCrown
} from "react-icons/fa";
import { toast } from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { setUserDetails } from '../redux/userSlice';

const UserDetails = ({ onClose }) => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.logout
            });
            if (response.data.success) {
                toast.success("Logged out successfully");
                dispatch(setUserDetails(null));
                // Reload to clear all states and navigate home
                window.location.href = "/";
            }
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    if (!user?._id) return null;

    return (
        <div className="fixed inset-0 z-50 bg-[#050505] text-white flex flex-col overflow-y-auto animate-fade-in">
            {/* Header / Close button */}
            <div className="p-6 flex justify-between items-center border-b border-white/10 sticky top-0 bg-[#050505]/90 backdrop-blur-md z-10">
                <h2 className="text-xl font-bold tracking-tighter">Menu</h2>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <FaTimes size={16} />
                </button>
            </div>

            <div className="flex-1 container mx-auto max-w-4xl p-6 flex flex-col gap-10">
                {/* Features Section (Visible ONLY on mobile) */}
                <div className="md:hidden space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">Features</h3>
                    <div className="flex flex-col gap-2">
                        <Link to="/" onClick={onClose} className="p-4 bg-white/5 border border-white/5 rounded-md hover:bg-white/10 transition-colors font-bold flex items-center justify-between text-gray-300 hover:text-white">
                            Home
                        </Link>
                        <Link to="/addsnippet" onClick={onClose} className="p-4 bg-white/5 border border-white/5 rounded-md hover:bg-white/10 transition-colors font-bold flex items-center justify-between text-gray-300 hover:text-white">
                            AI Lab
                        </Link>
                        <Link to="/components" onClick={onClose} className="p-4 bg-white/5 border border-white/5 rounded-md hover:bg-white/10 transition-colors font-bold flex items-center justify-between text-gray-300 hover:text-white">
                            Components
                        </Link>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">Profile Section</h3>
                    <div 
                        onClick={() => { navigate('/userdetailupdate'); onClose(); }}
                        className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8 shadow-2xl cursor-pointer hover:border-white/30 hover:bg-white/[0.02] transition-all group"
                    >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white text-black flex items-center justify-center text-4xl sm:text-6xl font-black shadow-[0_0_30px_rgba(255,255,255,0.1)] shrink-0 group-hover:scale-105 transition-transform">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-center sm:text-left w-full space-y-4">
                            <div>
                                <h2 className="text-2xl sm:text-4xl font-black capitalize">{user.name}</h2>
                                <p className="text-gray-400 text-sm tracking-widest uppercase mt-2">Developer</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4 border-t border-white/10">
                                <DetailRow icon={<FaEnvelope />} label="Email" value={user.email} />
                                <DetailRow icon={<FaPhone />} label="Mobile" value={user.mobile || "Not Linked"} />
                                <DetailRow icon={<FaCalendarAlt />} label="Last Active" value={user.last_login_date ? new Date(user.last_login_date).toLocaleDateString() : "Active Now"} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Section */}
                <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">Premium Section</h3>
                    <div className="bg-gradient-to-br from-yellow-900/30 via-[#0a0a0a] to-[#0a0a0a] border border-yellow-500/30 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.05)]">
                        <div className="absolute -top-10 -right-10 p-8 opacity-10 rotate-12 pointer-events-none">
                            <FaCrown size={150} className="text-yellow-500" />
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl sm:text-2xl font-bold text-yellow-500 flex items-center justify-center sm:justify-start gap-3">
                                    <FaCrown /> Pro Member
                                </h2>
                                <p className="text-gray-400 mt-3 max-w-md text-sm leading-relaxed">
                                    Unlock exclusive features, unlimited snippet saves, AI-powered generation, and early access to new components.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 items-center text-center bg-black/50 p-4 rounded-lg border border-yellow-500/20 w-full sm:w-auto">
                                <div className="text-4xl font-black text-white">{user.credit || 0}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Credits</div>
                                <button className="mt-3 px-8 py-2.5 bg-yellow-500 text-black font-bold rounded-full text-sm hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                    Upgrade Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pb-10 pt-4">
                    <button
                        onClick={handleLogout}
                        className="w-full max-w-xs mx-auto border border-red-500/30 text-red-500 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    >
                        <FaSignOutAlt size={16} /> Sign Out
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
}

const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
        <div className="text-gray-400">{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider leading-none mb-1">{label}</p>
            <p className="text-white text-xs font-medium truncate">{value}</p>
        </div>
    </div>
);

export default UserDetails;