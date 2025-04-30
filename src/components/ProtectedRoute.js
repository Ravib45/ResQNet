import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component ensures users can only access certain routes if authenticated
 */
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

/**
 * AdminRoute component ensures only admin users can access certain routes
 */
export const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, userRole } = useAuth();
    
    console.log("AdminRoute check:", { isAuthenticated, isAdmin, userRole });

    if (!isAuthenticated) {
        console.log("AdminRoute: User not authenticated, redirecting to login");
        return <Navigate to="/login" />;
    }

    const isAdminUser = isAdmin || userRole === 'admin';
    
    if (!isAdminUser) {
        console.log("AdminRoute: User not admin, redirecting to home");
        return <Navigate to="/home" />;
    }

    console.log("AdminRoute: Admin access granted");
    return children;
};

/**
 * PublicOnlyRoute component ensures authenticated users can't access public routes
 * e.g. login and register pages
 */
export const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    // If authenticated, redirect based on role
    if (isAuthenticated) {
        if (isAdmin) {
            return <Navigate to="/admin" />;
        }
        return <Navigate to="/home" />;
    }

    return children;
};