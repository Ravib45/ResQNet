import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        console.log("AuthContext initializing...");
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("Auth state changed:", currentUser?.email);
            if (currentUser) {
                setUser(currentUser);
                
                // Check localStorage for role
                const storedRole = localStorage.getItem('userRole');
                console.log("Found role in localStorage:", storedRole);
                
                if (storedRole === 'admin') {
                    console.log("Setting user as admin");
                    setUserRole('admin');
                } else {
                    console.log("Setting user as regular user");
                    setUserRole('user');
                }
            } else {
                console.log("No user logged in");
                localStorage.removeItem('userRole');
                setUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Check if user is admin
    const isAdmin = userRole === 'admin';
    console.log("Current auth state:", { userRole, isAdmin });

    const value = {
        user,
        currentUser: user,
        isAuthenticated: !!user,
        userRole,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};