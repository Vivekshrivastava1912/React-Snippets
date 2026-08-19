import React from 'react';

const AuthGuard = ({ children }) => {
    // All features are accessible without login (guest mode enabled)
    return children;
};

export default AuthGuard;
