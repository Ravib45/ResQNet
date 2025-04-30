import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicOnlyRoute = ({ children }) => {
    const { currentUser } = useAuth();

    if (currentUser) {
        // If user is authenticated, redirect to home page
        return <Navigate to="/" replace />;
    }

    // If user is not authenticated, render the children
    return children;
};

export { PublicOnlyRoute }; 