import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const user = useSelector(state => state.user);

    // Show loading spinner while session status is being checked
    if (user?.loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#050505] text-white p-6">
                <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            </div>
        );
    }

    // If user is logged in, allow access to protected feature
    if (user?._id) {
        return children;
    }

    // If user is NOT logged in, redirect directly to Login page
    return <Navigate to="/login" replace />;
};

export default AuthGuard;
