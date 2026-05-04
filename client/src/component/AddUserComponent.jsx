import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from '../utils/Axios'; 
import toast from 'react-hot-toast'; // Alert ki jagah Toast add kiya hai
import SummaryApi from '../common/SummaryApi';

const AddUserComponent = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        title: location.state?.title || '',
        code: location.state?.code || '',
        status: 'Public'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if(!formData.title.trim() || !formData.code.trim()) {
            toast.error("Please fill all fields!");
            return;
        }

        setLoading(true);

        try {
            // Sahi format me axios request
            const response = await Axios({
                ...SummaryApi.saveCode, 
                data: formData, // Yahan data me formData bhej rahe hain
                withCredentials: true 
            });

            if (response.data.success) {
                toast.success(response.data.message || "Snippet saved successfully!"); // Alert ki jagah success toast
                setFormData({ title: '', code: '', status: 'Public' });
            } else {
                toast.error(response.data.message || "Failed to save snippet.");
            }
        } catch (error) {
            console.error("Error saving code:", error);
            toast.error(error.response?.data?.message || "Something went wrong"); // Alert ki jagah error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex justify-center items-center">
            {/* Design thoda premium kiya gaya hai (shadows, hover effect, rounded corners) */}
            <div className="w-full max-w-2xl bg-[#050505] border border-white/10 shadow-[0_0_15px_rgba(234,179,8,0.02)] p-8 rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(234,179,8,0.05)] hover:border-yellow-500/20">
                <h2 className="text-xl font-light tracking-widest mb-8 border-b border-white/5 pb-3 uppercase text-center text-yellow-500">
                    New Snippet
                </h2>

                <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Title Input */}
                    <div className="group">
                        <label className="block text-[11px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-yellow-500 transition-colors">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter snippet title..."
                            className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-yellow-500/60 text-gray-200 transition-colors font-light placeholder:text-gray-700"
                            required
                        />
                    </div>

                    {/* Code Textarea */}
                    <div className="group">
                        <label className="block text-[11px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-yellow-500 transition-colors">Source Code</label>
                        <textarea
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="// Paste your code here..."
                            className="w-full h-64 bg-[#0a0a0a] border border-white/5 p-4 rounded-md outline-none focus:border-yellow-500/30 focus:ring-1 focus:ring-yellow-500/10 transition-all font-mono text-sm resize-none text-gray-300 placeholder:text-gray-800"
                            required
                        />
                    </div>

                    {/* Status & Submit Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-2">
                        <div className="w-full sm:flex-1 group">
                            <label className="block text-[11px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-yellow-500 transition-colors">Visibility</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full sm:w-auto bg-[#0a0a0a] border-b border-white/10 py-2 px-1 outline-none focus:border-yellow-500/60 text-sm font-light cursor-pointer text-gray-300"
                            >
                                <option value="Public">Public</option>
                                <option value="Private">Private</option>
                            </select>
                        </div>

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
    );
};

export default AddUserComponent;
