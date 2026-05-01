import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    FaEnvelope, FaPhone, FaCalendarAlt, FaSignOutAlt,
    FaTimes, FaCheckCircle
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
        <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-start justify-end p-4 sm:p-6"
            onClick={onClose}
        >
            <div
                className="w-full max-w-[320px] bg-black border border-white/10 rounded-md shadow-2xl mt-16 animate-spring-entry overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="relative p-6 border-b border-white/10 text-center bg-white/5">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                    >
                        <FaTimes size={14} />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-2xl font-black mb-3 shadow-xl">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-white font-bold text-lg capitalize">{user.name}</h2>
                        <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mt-1 font-medium">Developer</p>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-5 space-y-5">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 border border-white/5 rounded-sm p-3 flex flex-col items-center justify-center">
                            <span className="text-white font-black text-sm">{user.credit || 0}</span>
                            <span className="text-[9px] text-gray-500 uppercase font-bold mt-0.5">Credits</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-sm p-3 flex flex-col items-center justify-center">
                            <span className="text-white font-black text-sm">{user.verify_email ? 'YES' : 'NO'}</span>
                            <span className="text-[9px] text-gray-500 uppercase font-bold mt-0.5">Verified</span>
                        </div>
                    </div>

                    {/* Detail Rows */}
                    <div className="space-y-4 pt-2">
                        <DetailRow icon={<FaEnvelope />} label="Email Address" value={user.email} />
                        <DetailRow icon={<FaPhone />} label="Mobile Number" value={user.mobile || "Not Linked"} />
                        <DetailRow icon={<FaCalendarAlt />} label="Last Session" value={user.last_login_date ? new Date(user.last_login_date).toLocaleDateString() : "Active Now"} />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col gap-2 pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-white text-black py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            <FaSignOutAlt size={12} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes springEntry {
                    0% { opacity: 0; transform: scale(0.98) translateY(-10px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-spring-entry { animation: springEntry 0.15s ease-out forwards; }
            `}</style>
        </div>
    );
}

const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="text-gray-500">{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-[8px] text-gray-500 uppercase font-black tracking-wider leading-none mb-1">{label}</p>
            <p className="text-white text-[11px] font-medium truncate">{value}</p>
        </div>
    </div>
);

export default UserDetails;