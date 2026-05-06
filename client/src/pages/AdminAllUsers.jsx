import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { FaTrash, FaUserShield, FaUser, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const AdminAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.allUsers
            });
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
       

        try {
            const response = await Axios({
                ...SummaryApi.deleteUser,
                data: { userId }
            });
            if (response.data.success) {
                toast.success("User deleted successfully");
                fetchAllUsers();
            }
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 pt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-3">
                        <FaUserShield className="text-yellow-500 shrink-0" /> 
                        <span>ADMIN: ALL USERS</span>
                    </h1>
                    <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-sm border border-yellow-500/20 text-[10px] uppercase tracking-widest font-black">
                        {users.length} Users Total
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-white/20 border-t-yellow-500 rounded-sm animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <div key={user._id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-yellow-500/30 transition-all group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-sm bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold text-xl border border-yellow-500/20">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-bold text-lg truncate flex items-center gap-2">
                                            {user.name}
                                            {(user.role === 'ADMIN' || user.role === 'admin') && (
                                                <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-black uppercase">Admin</span>
                                            )}
                                        </h2>
                                        <p className="text-gray-500 text-xs truncate flex items-center gap-1.5">
                                            <FaEnvelope size={10} /> {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 flex items-center gap-1.5"><FaCalendarAlt /> Joined</span>
                                        <span className="text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 flex items-center gap-1.5"><FaUser /> Credits</span>
                                        <span className="text-yellow-500 font-bold">{user.credit}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <FaTrash size={12} /> Delete User
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAllUsers;
