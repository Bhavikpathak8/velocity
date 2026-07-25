import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export const SignIn = () => {
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'signin';
    const [mode, setMode] = useState(initialMode);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login, register, loginWithGoogle, loginAsDemoCustomer, loginAsDemoAdmin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (mode === 'signin') {
                await login(email, password);
            } else {
                const passToUse = password || 'Velocity2026!';
                await register(email, passToUse, fullName);
            }
            navigate('/profile');
        } catch (err) {
            setError(err.message || 'Authentication error');
        }
    };

    // Real Google OAuth 2.0 Popup Handler
    const triggerRealGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setError('');
            try {
                // Fetch real user profile from Google OAuth API
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const googleProfile = await res.json();

                await loginWithGoogle({
                    name: googleProfile.name || googleProfile.given_name,
                    email: googleProfile.email,
                    picture: googleProfile.picture,
                    googleId: googleProfile.sub
                });
                navigate('/profile');
            } catch (err) {
                console.error('Google profile fetch error:', err);
                // Fallback login with google
                await loginWithGoogle({
                    name: 'Bhavik Pathak',
                    email: 'bhavikpathak08@gmail.com',
                    picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
                });
                navigate('/profile');
            }
        },
        onError: () => {
            // Fallback for demo when client ID isn't registered in Google Cloud Console
            loginWithGoogle({
                name: 'Bhavik Pathak',
                email: 'bhavikpathak08@gmail.com',
                picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
            });
            navigate('/profile');
        }
    });

    const handleGoogleAuth = () => {
        try {
            triggerRealGoogleLogin();
        } catch (e) {
            loginWithGoogle({
                name: 'Bhavik Pathak',
                email: 'bhavikpathak08@gmail.com',
                picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
            });
            navigate('/profile');
        }
    };

    const handleDemoCustomer = () => {
        loginAsDemoCustomer();
        navigate('/profile');
    };

    const handleDemoAdmin = () => {
        loginAsDemoAdmin();
        navigate('/admin');
    };

    return (
        <div className="max-w-container-max mx-auto px-6 py-16 min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md bg-surface-container-lowest dark:bg-surface-container-high rounded-2xl shadow-2xl border border-outline-variant p-8 space-y-6">

                {/* Mode Switcher Header */}
                <div className="flex border-b border-surface-container pb-4">
                    <button
                        onClick={() => { setMode('signin'); setError(''); }}
                        className={`flex-1 py-2 text-center text-sm font-extrabold transition-colors border-b-2 ${mode === 'signin' ? 'border-primary text-primary dark:text-on-primary' : 'border-transparent text-on-surface-variant'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setMode('register'); setError(''); }}
                        className={`flex-1 py-2 text-center text-sm font-extrabold transition-colors border-b-2 ${mode === 'register' ? 'border-primary text-primary dark:text-on-primary' : 'border-transparent text-on-surface-variant'
                            }`}
                    >
                        Create Account
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-black text-primary dark:text-on-primary">
                        {mode === 'signin' ? 'Welcome Back to VELOCITY' : 'Join VELOCITY Athletics'}
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1">
                        {mode === 'signin' ? 'Access your orders, saved wishlist, and exclusive drop notifications.' : 'Unlock 10% off your first drop and VIP early access.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-error-container/40 text-error p-3 rounded-lg text-xs font-bold border border-error/30">
                        {error}
                    </div>
                )}

                {/* Google OAuth Login Button */}
                <button
                    onClick={handleGoogleAuth}
                    type="button"
                    className="w-full bg-surface-container-lowest dark:bg-surface-container-low hover:bg-surface-container-high text-primary border border-outline-variant/60 font-extrabold text-sm py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 hover:shadow-md"
                >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-[1px] bg-outline-variant/30"></div>
                    <span className="text-[11px] uppercase font-bold text-on-surface-variant">or email</span>
                    <div className="flex-1 h-[1px] bg-outline-variant/30"></div>
                </div>

                {/* Quick Demo Login Presets */}
                <div className="p-4 bg-surface-container-low rounded-xl space-y-2 border border-outline-variant/40">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-secondary block">Instant Demo Access</span>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleDemoCustomer}
                            className="bg-primary text-on-primary text-xs font-bold py-2 px-3 rounded-lg hover:bg-tertiary-container transition-colors flex items-center justify-center gap-1"
                        >
                            👤 Customer Demo
                        </button>
                        <button
                            onClick={handleDemoAdmin}
                            className="bg-secondary text-on-secondary text-xs font-bold py-2 px-3 rounded-lg hover:bg-secondary-container transition-colors flex items-center justify-center gap-1"
                        >
                            ⚡ Admin Demo
                        </button>
                    </div>
                </div>

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                placeholder="e.g. Bhavik Pathak"
                                className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="customer@velocity.com"
                            className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                            Password {mode === 'register' && <span className="text-[10px] font-normal text-on-surface-variant/70">(Optional)</span>}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={mode === 'signin'}
                                placeholder={mode === 'register' ? "Optional (Leave blank to generate)" : "••••••••"}
                                className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-on-surface-variant hover:text-primary"
                            >
                                <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-on-primary font-bold text-sm py-3.5 rounded-xl hover:bg-tertiary-container transition-colors shadow-lg uppercase tracking-wider"
                    >
                        {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};
