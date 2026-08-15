import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const { addToast } = useToast();

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            if (addToast) {
                addToast('Welcome to VELOCITY VIP! Check your inbox for your 10% discount code.', 'success');
            }
        }
    };

    return (
        <footer className="bg-primary text-on-primary dark:bg-surface-container-lowest dark:text-primary w-full border-t border-outline-variant/20 mt-auto">
            <div className="max-w-container-max mx-auto px-6 md:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Col 1: Brand */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <Link to="/" className="font-black text-3xl tracking-tighter text-on-primary dark:text-primary flex items-center gap-2 mb-4">
                                <span className="bg-on-primary text-primary dark:bg-primary dark:text-on-primary px-2 py-0.5 rounded text-xl font-extrabold">V</span>
                                VELOCITY
                            </Link>
                            <p className="text-xs text-on-primary/70 dark:text-primary/70 leading-relaxed max-w-sm">
                                Engineered for elite performance. Designed for ultimate kinetic precision. World-class luxury athletic gear.
                            </p>
                        </div>
                        <div className="mt-6 text-xs opacity-60">
                            © 2026 VELOCITY ATHLETICS. ALL RIGHTS RESERVED.
                        </div>
                    </div>

                    {/* Col 2: Navigation */}
                    <div className="flex flex-col space-y-2 text-xs uppercase tracking-wider font-semibold">
                        <p className="text-on-primary/50 dark:text-primary/50 font-bold mb-2">Explore</p>
                        <Link to="/shop" className="hover:text-secondary transition-colors">All Products Catalog</Link>
                        <Link to="/shop?category=Footwear" className="hover:text-secondary transition-colors">Racing Footwear</Link>
                        <Link to="/shop?category=Apparel" className="hover:text-secondary transition-colors">Performance Apparel</Link>
                        <Link to="/shop?category=Accessories" className="hover:text-secondary transition-colors">Athletic Accessories</Link>
                        <Link to="/sustainability" className="hover:text-secondary transition-colors">Kinetic Polymer Tech</Link>
                    </div>

                    {/* Col 3: Support */}
                    <div className="flex flex-col space-y-2 text-xs uppercase tracking-wider font-semibold">
                        <p className="text-on-primary/50 dark:text-primary/50 font-bold mb-2">Customer Care</p>
                        <Link to="/help" className="hover:text-secondary transition-colors">Help Center & FAQ</Link>
                        <Link to="/help?tab=shipping" className="hover:text-secondary transition-colors">Shipping & Returns</Link>
                        <Link to="/profile" className="hover:text-secondary transition-colors">Account Profile</Link>
                        <Link to="/profile?tab=orders" className="hover:text-secondary transition-colors">Track Order Status</Link>
                        <Link to="/help?tab=contact" className="hover:text-secondary transition-colors">Contact Support</Link>
                    </div>

                    {/* Col 4: Newsletter */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wider font-bold mb-2">Join VELOCITY Club</p>
                            <p className="text-xs text-on-primary/70 dark:text-primary/70 mb-4">
                                Subscribe for exclusive drop access, athlete testing notes, and 10% off your first drop.
                            </p>
                            {subscribed ? (
                                <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-300 p-3 rounded-lg text-xs font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    You're on the VIP drops list!
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="flex gap-1">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="bg-primary-container text-on-primary border border-outline-variant/30 text-xs px-3 py-2.5 rounded-l-lg flex-grow focus:outline-none focus:border-on-primary"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-on-primary text-primary dark:bg-primary dark:text-on-primary px-4 py-2.5 rounded-r-lg font-bold text-xs uppercase hover:opacity-90 transition-opacity"
                                    >
                                        Join
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="flex space-x-4 mt-6 text-on-primary/60 dark:text-primary/60">
                            <span className="material-symbols-outlined cursor-pointer hover:text-on-primary">globe</span>
                            <span className="material-symbols-outlined cursor-pointer hover:text-on-primary">shield</span>
                            <span className="material-symbols-outlined cursor-pointer hover:text-on-primary">verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
