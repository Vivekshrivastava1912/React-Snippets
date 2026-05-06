import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthGuard = ({ children }) => {
    const user = useSelector(state => state.user);

    // If user is not logged in (no _id), redirect to login
    if (!user?._id) {
        // Optional: show a message
        // toast.error("Please login to access this feature");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AuthGuard;
