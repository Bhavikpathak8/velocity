import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { ProductCard } from '../components/ProductCard';

export const UserProfile = () => {
    const { formatPrice } = useCurrency();
    const { user, token, logout } = useAuth();
    const { products, wishlist } = useProducts();
    const { addToast } = useToast();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialTab = searchParams.get('tab') === 'orders' ? 'orders' : searchParams.get('tab') === 'wishlist' ? 'wishlist' : 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);

    const [orders, setOrders] = useState([]);
    const [savedSuccess, setSavedSuccess] = useState('');

    const [profileForm, setProfileForm] = useState({
        fullName: user?.full_name || 'Bhavik Pathak',
        email: user?.email || 'customer@velocity.com',
        preferredSize: '9.5',
        address: '742 Evergreen Terrace, San Francisco, CA 94107'
    });

    useEffect(() => {
        const loadOrders = async () => {
            let combined = [];

            // Read from LocalStorage first
            try {
                const stored = JSON.parse(localStorage.getItem('velocity_user_orders') || '[]');
                combined = [...stored];
            } catch (e) {
                console.error('LocalStorage order parse error', e);
            }

            // Attempt API fetch with token
            try {
                const res = await fetch('/api/orders', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        // Merge avoiding duplicate IDs
                        const ids = new Set(combined.map(o => o.id));
                        data.forEach(item => {
                            if (!ids.has(item.id)) combined.push(item);
                        });
                    }
                }
            } catch (err) {
                console.warn('API orders fetch fallback to offline storage', err);
            }

            // Fallback seed orders if none exist
            if (combined.length === 0) {
                combined = [
                    {
                        id: 'VEL-98421',
                        date: '2026-07-20',
                        total_amount: 235.00,
                        status: 'shipped',
                        items: [
                            { name: 'AeroPulse Pro X', size: '9.5', quantity: 1, price: 180.00 },
                            { name: 'Aero Split Shorts', size: 'M', quantity: 1, price: 55.00 }
                        ]
                    },
                    {
                        id: 'VEL-97104',
                        date: '2026-07-05',
                        total_amount: 180.00,
                        status: 'delivered',
                        items: [
                            { name: 'Velocity Vector Duffel', size: 'One Size', quantity: 1, price: 180.00 }
                        ]
                    }
                ];
            }

            setOrders(combined);
        };

        loadOrders();
    }, [token]);

    if (!user) {
        return (
            <div className="py-24 text-center">
                <h2 className="text-2xl font-bold mb-4">Please Sign In to Access Your Account Profile</h2>
                <button onClick={() => navigate('/signin')} className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg">Sign In Now</button>
            </div>
        );
    }

    const wishlistProducts = products.filter(p => wishlist.includes(p.id));

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setSavedSuccess('Profile details updated successfully!');
        setTimeout(() => setSavedSuccess(''), 3000);
    };

    const handleCancelOrder = (orderId) => {
        const updated = orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o);
        setOrders(updated);

        // Persist cancellation in localStorage
        try {
            const stored = JSON.parse(localStorage.getItem('velocity_user_orders') || '[]');
            const newStored = stored.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o);
            localStorage.setItem('velocity_user_orders', JSON.stringify(newStored));
        } catch (e) { }

        addToast(`Order #${orderId} has been cancelled successfully`, 'info');
    };

    return (
        <div className="max-w-container-max mx-auto px-6 md:px-8 py-10 min-h-screen">

            {/* Account Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-surface-container-high pb-6 mb-8 gap-4">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-1 block">Account Member</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-primary">{user.full_name}</h1>
                    <p className="text-xs text-on-surface-variant mt-0.5">{user.email} • Role: <span className="font-bold capitalize">{user.role}</span></p>
                </div>

                <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="bg-error-container/30 text-error px-4 py-2 rounded-lg text-xs font-bold hover:bg-error hover:text-white transition-colors"
                >
                    Sign Out
                </button>
            </div>

            {/* Tabs Bar */}
            <div className="flex space-x-4 border-b border-outline-variant/40 mb-8 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-3 font-extrabold text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                        }`}
                >
                    Profile & Preferences
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-3 font-extrabold text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                        }`}
                >
                    Order History ({orders.length})
                </button>
                <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`pb-3 font-extrabold text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'wishlist' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                        }`}
                >
                    Saved Wishlist ({wishlistProducts.length})
                </button>
            </div>

            {/* Profile & Settings Tab */}
            {activeTab === 'profile' && (
                <div className="max-w-2xl bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/40 shadow-sm">
                    <h3 className="font-extrabold text-xl text-primary mb-6">Personal Details</h3>

                    {savedSuccess && (
                        <div className="mb-4 bg-emerald-100 text-emerald-800 p-3 rounded-lg text-xs font-bold">
                            {savedSuccess}
                        </div>
                    )}

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Full Name</label>
                            <input
                                type="text"
                                value={profileForm.fullName}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                                className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 text-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Email Address</label>
                            <input
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 text-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Preferred Shoe Size</label>
                            <select
                                value={profileForm.preferredSize}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, preferredSize: e.target.value }))}
                                className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-bold"
                            >
                                {['7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'].map(sz => (
                                    <option key={sz} value={sz}>US {sz}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Saved Address</label>
                            <textarea
                                rows={2}
                                value={profileForm.address}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                                className="w-full bg-surface-container text-sm p-4 rounded-lg border border-outline-variant/30 text-primary resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-primary text-on-primary font-bold text-xs uppercase px-6 py-3 rounded-lg hover:bg-tertiary-container transition-colors shadow"
                        >
                            Save Profile Changes
                        </button>
                    </form>
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div className="space-y-4">
                    {orders.map((ord) => {
                        const dateStr = ord.date || (ord.placed_at ? new Date(ord.placed_at).toLocaleDateString() : 'Recent');
                        const statusLower = (ord.status || 'processing').toLowerCase();
                        const isDelivered = statusLower === 'delivered';
                        const isShipped = statusLower === 'shipped';
                        const isCancelled = statusLower === 'cancelled';
                        const canCancel = !isDelivered && !isShipped && !isCancelled;

                        return (
                            <div key={ord.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
                                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                                    <div>
                                        <span className="font-mono font-extrabold text-base text-primary">#{ord.id}</span>
                                        <span className="text-xs text-on-surface-variant ml-3 font-semibold">Date: {dateStr}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${isDelivered ? 'bg-emerald-100 text-emerald-800' :
                                            isShipped ? 'bg-blue-100 text-blue-800' :
                                                isCancelled ? 'bg-red-100 text-red-800' :
                                                    'bg-secondary/15 text-secondary'
                                            }`}>
                                            {ord.status}
                                        </span>
                                        {canCancel && (
                                            <button
                                                onClick={() => handleCancelOrder(ord.id)}
                                                className="bg-red-50 dark:bg-red-950/40 text-error hover:bg-error hover:text-white px-3 py-1 rounded-lg text-xs font-bold transition-all border border-red-200 dark:border-red-900 flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">cancel</span>
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {ord.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm p-2 bg-surface-container-low rounded-xl">
                                            <div className="flex items-center gap-3">
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-surface-container shrink-0" />
                                                )}
                                                <div>
                                                    <p className="font-bold text-primary">{item.name}</p>
                                                    <p className="text-xs text-on-surface-variant">Size: {item.size || 'Standard'} • Color: {item.color || 'Default'}</p>
                                                </div>
                                            </div>
                                            <span className="font-extrabold text-primary text-xs">Qty {item.quantity} • {formatPrice(item.price || 0)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/30">
                                    <span className="text-xs font-bold uppercase text-on-surface-variant">Total Amount Paid</span>
                                    <span className="text-lg font-black text-primary">{formatPrice(ord.total_amount || 0)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
                <div>
                    {wishlistProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlistProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/30">
                            <span className="material-symbols-outlined text-5xl mb-2 text-primary/40">favorite</span>
                            <p className="font-bold text-lg text-primary">Your Wishlist is Empty</p>
                            <p className="text-xs mt-1 mb-6 text-on-surface-variant">Tap the heart icon on any product to save items here for later.</p>
                            <button
                                onClick={() => navigate('/shop')}
                                className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-tertiary-container transition-colors shadow-sm"
                            >
                                Explore Catalog
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
