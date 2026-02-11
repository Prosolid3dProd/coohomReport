import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { jwtDecode } from "jwt-decode";
import { getLocalToken, setLocalToken } from '../data/localStorage';
import { getUsers, updateUser as updateUserApi } from '../handlers/user';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to load/refresh user data from DB
    const refreshUser = async (tokenOverride) => {
        setLoading(true);
        const token = tokenOverride || getLocalToken();

        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        try {
            // 1. Decode token to get email
            const decoded = jwtDecode(token);
            const email = decoded?.usuario?.email;

            if (email) {
                // 2. Fetch fresh data from DB
                // TODO: Optimize backend to have a specific /me endpoint instead of fetching all users
                const usersList = await getUsers();
                if (usersList && Array.isArray(usersList)) {
                    const foundUser = usersList.find(u => u.email === email);
                    if (foundUser) {
                        setUser(foundUser);
                        setIsAuthenticated(true);
                    } else {
                        console.warn("User from token not found in DB list");
                        // Fallback to token data
                        setUser(decoded.usuario);
                        setIsAuthenticated(true);
                    }
                } else {
                    // Fallback if API fails
                    setUser(decoded.usuario);
                    setIsAuthenticated(true);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error loading user context:", error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        refreshUser();
    }, []);

    const login = (token) => {
        setLocalToken(token);
        refreshUser(token);
    };

    const logout = () => {
        setLocalToken(null);
        setUser(null);
        setIsAuthenticated(false);
        // Optional: redirect logic handled by router
    };

    const updateUser = async (fields) => {
        if (!user || !user._id) return false;

        try {
            const updateData = { ...fields, _id: user._id };
            const result = await updateUserApi(updateData);

            if (result) {
                // Optimistic update
                setUser(prev => ({ ...prev, ...fields }));
                message.success("Perfil actualizado");
                return true;
            } else {
                message.error("Error al actualizar perfil");
                return false;
            }
        } catch (error) {
            console.error(error);
            message.error("Error de conexión");
            return false;
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        refreshUser
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
