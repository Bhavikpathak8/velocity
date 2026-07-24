import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('velocity_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('velocity_token') || null);

    useEffect(() => {
        if (user) {
            localStorage.setItem('velocity_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('velocity_user');
        }

        if (token) {
            localStorage.setItem('velocity_token', token);
        } else {
            localStorage.removeItem('velocity_token');
        }
    }, [user, token]);

    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            setUser(data.user);
            setToken(data.token);
            return data;
        } catch (err) {
            throw err;
        }
    };

    const register = async (email, password, full_name) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');
            setUser(data.user);
            setToken(data.token);
            return data;
        } catch (err) {
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    // Quick preset login helper for demo
    const loginAsDemoCustomer = () => {
        const demoUser = { id: 'u-demo', email: 'customer@velocity.com', full_name: 'Bhavik Pathak', role: 'customer' };
        setUser(demoUser);
        setToken('demo_customer_token_jwt');
    };

    const loginAsDemoAdmin = () => {
        const adminUser = { id: 'u-admin', email: 'admin@velocity.com', full_name: 'Velocity Admin', role: 'admin' };
        setUser(adminUser);
        setToken('demo_admin_token_jwt');
    };

    const loginWithGoogle = async (googleData) => {
        const googleUser = {
            id: `google-${Date.now()}`,
            email: googleData?.email || 'bhavikpathak08@gmail.com',
            full_name: googleData?.name || 'Bhavik Pathak',
            avatar_url: googleData?.picture || 'https://lh3.googleusercontent.com/a/default-user=s96-c',
            role: 'customer',
            isGoogleUser: true
        };

        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(googleUser)
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user || googleUser);
                setToken(data.token || 'google_oauth_token');
                return data;
            }
        } catch (e) {
            console.log('Google Auth fallback to local session state');
        }

        setUser(googleUser);
        setToken('google_oauth_token_jwt');
        return { user: googleUser, token: 'google_oauth_token_jwt' };
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            register,
            logout,
            loginWithGoogle,
            loginAsDemoCustomer,
            loginAsDemoAdmin,
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
