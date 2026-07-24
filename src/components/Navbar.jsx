import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useCurrency } from '../context/CurrencyContext';
import { SearchModal } from './SearchModal';

export const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { setIsCartOpen, totalCount } = useCart();
    const { wishlist } = useProducts();
    const { currency, setCurrency, currencies } = useCurrency();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <header className="bg-surface/90 dark:bg-primary/90 backdrop-blur-md sticky top-0 w-full z-50 border-b border-outline-variant/30 dark:border-outline-variant/10 transition-colors duration-200">
                <div className="flex justify-between items-center h-20 px-4 md:px-8 max-w-container-max mx-auto">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="font-black text-2xl md:text-3xl tracking-tighter text-primary dark:text-on-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                    >
                        <span className="bg-primary dark:bg-on-primary text-on-primary dark:text-primary px-2 py-0.5 rounded text-xl font-extrabold">V</span>
                        VELOCITY
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link
                            to="/shop"
                            className={`transition-colors py-1 ${isActive('/shop') ? 'text-primary dark:text-on-primary border-b-2 border-primary dark:border-on-primary font-bold' : 'text-on-surface-variant hover:text-primary dark:hover:text-on-primary'}`}
                        >
                            Shop All
                        </Link>
                        <Link
                            to="/shop?category=Footwear"
                            className="text-on-surface-variant hover:text-primary dark:hover:text-on-primary transition-colors py-1"
                        >
                            Footwear
                        </Link>
                        <Link
                            to="/shop?category=Apparel"
                            className="text-on-surface-variant hover:text-primary dark:hover:text-on-primary transition-colors py-1"
                        >
                            Apparel
                        </Link>
                        <Link
                            to="/sustainability"
                            className={`transition-colors py-1 ${isActive('/sustainability') ? 'text-primary dark:text-on-primary border-b-2 border-primary dark:border-on-primary font-bold' : 'text-on-surface-variant hover:text-primary dark:hover:text-on-primary'}`}
                        >
                            Sustainability
                        </Link>
                        <Link
                            to="/help"
                            className={`transition-colors py-1 ${isActive('/help') ? 'text-primary dark:text-on-primary border-b-2 border-primary dark:border-on-primary font-bold' : 'text-on-surface-variant hover:text-primary dark:hover:text-on-primary'}`}
                        >
                            Help Center
                        </Link>
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="bg-secondary/10 text-secondary border border-secondary/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider hover:bg-secondary hover:text-on-secondary transition-all"
                            >
                                ⚡ Admin Panel
                            </Link>
                        )}
                    </nav>

                    {/* Trailing Controls */}
                    <div className="flex items-center space-x-3 text-primary dark:text-on-primary">
                        {/* Currency Selector */}
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-surface-container text-xs font-bold px-2 py-1 rounded-md border border-outline-variant/40 text-primary cursor-pointer hover:border-primary transition-colors focus:outline-none hidden sm:block"
                        >
                            {Object.keys(currencies).map(code => (
                                <option key={code} value={code}>
                                    {currencies[code].label}
                                </option>
                            ))}
                        </select>

                        {/* Search Icon */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Search"
                            className="hover:opacity-70 p-2 transition-opacity"
                        >
                            <span className="material-symbols-outlined">search</span>
                        </button>

                        {/* Wishlist Icon */}
                        <Link
                            to="/shop?wishlist=true"
                            className="hover:opacity-70 p-2 transition-opacity relative hidden sm:block"
                            title="Saved Wishlist"
                        >
                            <span className="material-symbols-outlined">favorite</span>
                            {wishlist.length > 0 && (
                                <span className="absolute top-1 right-1 bg-primary dark:bg-on-primary text-on-primary dark:text-primary text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        {/* User Profile Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="hover:opacity-70 p-2 transition-opacity flex items-center gap-1"
                                aria-label="User Menu"
                            >
                                <span className="material-symbols-outlined">person</span>
                                {user && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest dark:bg-surface-container-high rounded-xl shadow-xl border border-outline-variant p-2 z-50 animate-fade-in">
                                    {user ? (
                                        <>
                                            <div className="px-3 py-2 border-b border-outline-variant/30">
                                                <p className="font-bold text-sm text-primary dark:text-on-primary truncate">{user.full_name}</p>
                                                <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                                                <span className="inline-block mt-1 bg-surface-container text-xs px-2 py-0.5 rounded capitalize font-medium">
                                                    {user.role}
                                                </span>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">person_outline</span>
                                                Profile & Addresses
                                            </Link>
                                            <Link
                                                to="/profile?tab=orders"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">local_shipping</span>
                                                Order History
                                            </Link>
                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-secondary font-bold hover:bg-secondary/10 rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                                                    Admin Management
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => { logout(); setIsUserMenuOpen(false); }}
                                                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-container/20 rounded-lg transition-colors mt-1"
                                            >
                                                <span className="material-symbols-outlined text-lg">logout</span>
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/signin"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg hover:bg-tertiary-container transition-colors mb-1"
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                to="/join-us"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold border border-primary text-primary rounded-lg hover:bg-surface-container transition-colors"
                                            >
                                                Create Account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart Drawer Trigger */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="hover:opacity-70 p-2 transition-opacity relative flex items-center"
                            aria-label="Shopping Cart"
                        >
                            <span className="material-symbols-outlined">shopping_bag</span>
                            {totalCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-secondary text-on-primary text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                                    {totalCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                            className="md:hidden hover:opacity-70 p-2 transition-opacity"
                            aria-label="Toggle Navigation Menu"
                        >
                            <span className="material-symbols-outlined">{isMobileNavOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMobileNavOpen && (
                    <div className="md:hidden bg-surface-container-lowest dark:bg-primary border-b border-outline-variant px-6 py-4 flex flex-col space-y-3 animate-fade-in">
                        <Link
                            to="/shop"
                            onClick={() => setIsMobileNavOpen(false)}
                            className="text-lg font-extrabold py-2 border-b border-surface-container text-primary dark:text-on-primary flex items-center justify-between"
                        >
                            <span>Shop All Catalog</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </Link>
                        <Link
                            to="/shop?category=Footwear"
                            onClick={() => setIsMobileNavOpen(false)}
                            className="py-1 text-on-surface-variant font-medium hover:text-primary"
                        >
                            👟 Footwear Collection
                        </Link>
                        <Link
                            to="/shop?category=Apparel"
                            onClick={() => setIsMobileNavOpen(false)}
                            className="py-1 text-on-surface-variant font-medium hover:text-primary"
                        >
                            👕 Apparel Collection
                        </Link>
                        <Link
                            to="/shop?wishlist=true"
                            onClick={() => setIsMobileNavOpen(false)}
                            className="py-1 text-on-surface-variant font-medium hover:text-primary flex items-center justify-between"
                        >
                            <span>❤️ Saved Wishlist</span>
                            {wishlist.length > 0 && (
                                <span className="bg-primary dark:bg-on-primary text-on-primary dark:text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/sustainability"
                            onClick={() => setIsMobileNavOpen(false)}
                            className="py-1 text-on-surface-variant font-medium hover:text-primary"
                        >
                            🌱 Sustainability & Tech
                        </Link>
                        <Link
                            to="/help"
                            onClick={() => setIsMobileNavOpen(false)}
                            className="py-1 text-on-surface-variant font-medium hover:text-primary"
                        >
                            ❓ Help Center & FAQ
                        </Link>

                        {/* Mobile Currency Switcher */}
                        <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                            <span className="text-xs font-bold text-on-surface-variant uppercase">Currency</span>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="bg-surface-container text-xs font-bold px-3 py-1.5 rounded-lg border border-outline-variant/40 text-primary cursor-pointer"
                            >
                                {Object.keys(currencies).map(code => (
                                    <option key={code} value={code}>
                                        {currencies[code].label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {isAdmin && (
                            <Link
                                to="/admin"
                                onClick={() => setIsMobileNavOpen(false)}
                                className="py-2.5 px-3 bg-secondary/10 border border-secondary/30 rounded-xl font-extrabold text-secondary flex items-center justify-center gap-2 mt-2"
                            >
                                <span className="material-symbols-outlined">admin_panel_settings</span>
                                Admin Dashboard
                            </Link>
                        )}
                    </div>
                )}
            </header>

            {/* Live Search Modal */}
            {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
        </>
    );
};
