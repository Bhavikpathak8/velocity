import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { useToast } from '../context/ToastContext';

export const AdminDashboard = () => {
    const { token, isAdmin, user } = useAuth();
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const { addToast } = useToast();

    const [activeTab, setActiveTab] = useState('products'); // 'products' | 'customers' | 'orders'
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // Product object being edited

    // Form state for adding new product
    const [newProd, setNewProd] = useState({
        name: '',
        category: 'Footwear',
        price: '',
        description: '',
        stock_quantity: 50,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA3tbQQ6tTWOJ7Y8sHLxPVvFFvT4z3qC3QOFoxu6nU1KszFOyagwueCO1oCfdxFa4hwuPWyOhZVOqqWUp3t8vmYew5ro4htE1HTwpBg-opxn63pqXDH3nOFTvKoPvOsK1Dn90cpg2oMstaWvveFFLiJ5Djn2V2jbla_GLicmHvvblU_wYS6IefWhVosYoQydrSXEIq9_T0HUIsKASs9arv8DjxSXuRrI0YlF1r4b2BbxBKa7fHsuDD'
    });

    // Mock Users / Customers Data
    const [customers, setCustomers] = useState([
        { id: 'u1', name: 'Bhavik Pathak', email: 'bhavik.pathak@velocity.com', role: 'Admin', orders: 12, totalSpent: 2840.00, status: 'Active VIP', joined: '2025-11-10' },
        { id: 'u2', name: 'Alexander Wright', email: 'alex.wright@gmail.com', role: 'Customer', orders: 4, totalSpent: 720.50, status: 'Active', joined: '2026-01-15' },
        { id: 'u3', name: 'Sophia Chen', email: 'sophia.c@techcorp.io', role: 'Customer', orders: 7, totalSpent: 1450.00, status: 'Active VIP', joined: '2026-02-01' },
        { id: 'u4', name: 'Marcus Sterling', email: 'marcus@sterling.co', role: 'Customer', orders: 2, totalSpent: 360.00, status: 'Active', joined: '2026-03-22' },
        { id: 'u5', name: 'Elena Rostova', email: 'elena.rostova@outfitters.com', role: 'Customer', orders: 9, totalSpent: 1980.00, status: 'Active VIP', joined: '2026-04-05' },
        { id: 'u6', name: 'David Miller', email: 'd.miller@gmail.com', role: 'Customer', orders: 1, totalSpent: 180.00, status: 'New Member', joined: '2026-06-18' }
    ]);

    // Mock Orders Data (augmented with local orders if present)
    const localOrders = JSON.parse(localStorage.getItem('velocity_user_orders') || '[]');
    const [orders, setOrders] = useState([
        ...localOrders,
        { id: 'VEL-98421', customer_name: 'Bhavik Pathak', email: 'bhavik@velocity.com', total_amount: 540.00, payment_method: 'Cash on Delivery (COD)', payment_status: 'Pending COD', status: 'Processing', date: '2026-07-23' },
        { id: 'VEL-98418', customer_name: 'Sophia Chen', email: 'sophia.c@techcorp.io', total_amount: 320.00, payment_method: 'Credit Card (Stripe)', payment_status: 'Paid', status: 'Shipped', date: '2026-07-21' },
        { id: 'VEL-98410', customer_name: 'Alexander Wright', email: 'alex.wright@gmail.com', total_amount: 180.00, payment_method: 'Cash on Delivery (COD)', payment_status: 'Pending COD', status: 'Delivered', date: '2026-07-19' },
        { id: 'VEL-98402', customer_name: 'Elena Rostova', email: 'elena.rostova@outfitters.com', total_amount: 890.00, payment_method: 'Credit Card (Stripe)', payment_status: 'Paid', status: 'Delivered', date: '2026-07-15' }
    ]);

    // Mock Discount Coupons Data
    const [coupons, setCoupons] = useState([
        { id: 'c1', code: 'VELOCITY10', discount: '10% OFF', type: 'Percentage', usage: 142, status: 'Active' },
        { id: 'c2', code: 'WELCOME20', discount: '20% OFF', type: 'Percentage', usage: 89, status: 'Active' },
        { id: 'c3', code: 'SUMMER50', discount: '$50 OFF', type: 'Fixed Amount', usage: 34, status: 'Active' },
        { id: 'c4', code: 'FREESHIP', discount: 'Free Shipping', type: 'Shipping', usage: 215, status: 'Active' }
    ]);

    if (!isAdmin) {
        return (
            <div className="py-24 text-center max-w-md mx-auto px-6">
                <div className="w-16 h-16 bg-red-100 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">lock</span>
                </div>
                <h2 className="text-2xl font-bold text-error mb-2">Admin Access Restricted</h2>
                <p className="text-sm text-on-surface-variant mb-6">You need Administrator privileges to access the command dashboard.</p>
                <div className="bg-surface-container p-4 rounded-xl text-xs text-left font-mono">
                    <p className="font-bold text-primary mb-1">⚡ Demo Admin Login Credentials:</p>
                    <p>Email: <span className="text-secondary font-bold">admin@velocity.com</span></p>
                    <p>Password: <span className="text-secondary font-bold">admin123</span></p>
                </div>
            </div>
        );
    }

    // Handle Adding New Product
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (newProd.name && newProd.price) {
            await addProduct({
                ...newProd,
                price: parseFloat(newProd.price),
                images: [newProd.image_url],
                sizes: newProd.category === 'Footwear' ? ['8', '9', '10', '11'] : ['S', 'M', 'L', 'XL'],
                colors: [{ name: 'Standard', hex: '#000000' }],
                sku: `VEL-ADM-${Math.floor(100 + Math.random() * 900)}`
            }, token);

            setIsAddModalOpen(false);
            addToast(`⚡ Product "${newProd.name}" published to store catalog!`, 'success');
            setNewProd({
                name: '',
                category: 'Footwear',
                price: '',
                description: '',
                stock_quantity: 50,
                image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA3tbQQ6tTWOJ7Y8sHLxPVvFFvT4z3qC3QOFoxu6nU1KszFOyagwueCO1oCfdxFa4hwuPWyOhZVOqqWUp3t8vmYew5ro4htE1HTwpBg-opxn63pqXDH3nOFTvKoPvOsK1Dn90cpg2oMstaWvveFFLiJ5Djn2V2jbla_GLicmHvvblU_wYS6IefWhVosYoQydrSXEIq9_T0HUIsKASs9arv8DjxSXuRrI0YlF1r4b2BbxBKa7fHsuDD'
            });
        }
    };

    // Handle Updating Existing Product
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (editingProduct) {
            await updateProduct({
                ...editingProduct,
                price: parseFloat(editingProduct.price),
                stock_quantity: parseInt(editingProduct.stock_quantity || 50, 10),
                images: editingProduct.image_url ? [editingProduct.image_url] : editingProduct.images
            }, token);

            addToast(`✓ Product "${editingProduct.name}" updated successfully!`, 'success');
            setEditingProduct(null);
        }
    };

    // Handle Deleting Product
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
            await deleteProduct(id, token);
            addToast(`Product deleted from catalog`, 'info');
        }
    };

    // Handle Updating Order Status
    const handleOrderStatusChange = (orderId, newStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        // Persist admin order status change in localStorage
        try {
            const stored = JSON.parse(localStorage.getItem('velocity_user_orders') || '[]');
            const newStored = stored.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
            localStorage.setItem('velocity_user_orders', JSON.stringify(newStored));
        } catch (e) { }

        addToast(`Order ${orderId} status updated to ${newStatus}`, 'success');
    };

    return (
        <div className="max-w-container-max mx-auto px-6 md:px-8 py-10 min-h-screen">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-surface-container-high pb-6 mb-8 gap-4">
                <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-secondary mb-1 block">⚡ VELOCITY Command Center</span>
                    <h1 className="text-3xl md:text-4xl font-black text-primary">Admin Control Dashboard</h1>
                </div>

                {activeTab === 'products' && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-secondary text-on-secondary font-bold text-xs uppercase px-5 py-3 rounded-xl hover:bg-secondary-container transition-colors shadow flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-base">add</span>
                        Add New Product
                    </button>
                )}
            </div>

            {/* Metrics Cards Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
                    <span className="text-xs font-bold uppercase text-on-surface-variant">Gross Store Revenue</span>
                    <p className="text-3xl font-black text-primary mt-2">$42,850.00</p>
                    <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">↑ 24% vs last month</span>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
                    <span className="text-xs font-bold uppercase text-on-surface-variant">Active Catalog Items</span>
                    <p className="text-3xl font-black text-primary mt-2">{products.length}</p>
                    <span className="text-xs text-primary font-bold mt-1 inline-block">Live on storefront</span>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
                    <span className="text-xs font-bold uppercase text-on-surface-variant">Registered Customers</span>
                    <p className="text-3xl font-black text-primary mt-2">{customers.length}</p>
                    <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">6 Active Members</span>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
                    <span className="text-xs font-bold uppercase text-on-surface-variant">Orders Processed</span>
                    <p className="text-3xl font-black text-primary mt-2">{orders.length}</p>
                    <span className="text-xs text-secondary font-bold mt-1 inline-block">Real-time fulfillment</span>
                </div>
            </div>

            {/* Navigation Tabs (Mobile Scrollable) */}
            <div className="flex border-b border-outline-variant/40 mb-8 gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`py-3 px-6 font-extrabold text-sm border-b-2 flex items-center gap-2 transition-all ${activeTab === 'products'
                        ? 'border-primary text-primary bg-surface-container-low rounded-t-xl'
                        : 'border-transparent text-on-surface-variant hover:text-primary'
                        }`}
                >
                    <span className="material-symbols-outlined text-lg">inventory_2</span>
                    Manage Products ({products.length})
                </button>

                <button
                    onClick={() => setActiveTab('customers')}
                    className={`py-3 px-6 font-extrabold text-sm border-b-2 flex items-center gap-2 transition-all ${activeTab === 'customers'
                        ? 'border-primary text-primary bg-surface-container-low rounded-t-xl'
                        : 'border-transparent text-on-surface-variant hover:text-primary'
                        }`}
                >
                    <span className="material-symbols-outlined text-lg">group</span>
                    Customers & Users ({customers.length})
                </button>

                <button
                    onClick={() => setActiveTab('orders')}
                    className={`py-3 px-6 font-extrabold text-sm border-b-2 flex items-center gap-2 transition-all ${activeTab === 'orders'
                        ? 'border-primary text-primary bg-surface-container-low rounded-t-xl'
                        : 'border-transparent text-on-surface-variant hover:text-primary'
                        }`}
                >
                    <span className="material-symbols-outlined text-lg">local_shipping</span>
                    Store Orders ({orders.length})
                </button>

                <button
                    onClick={() => setActiveTab('coupons')}
                    className={`py-3 px-6 font-extrabold text-sm border-b-2 flex items-center gap-2 transition-all ${activeTab === 'coupons'
                        ? 'border-primary text-primary bg-surface-container-low rounded-t-xl'
                        : 'border-transparent text-on-surface-variant hover:text-primary'
                        }`}
                >
                    <span className="material-symbols-outlined text-lg">confirmation_number</span>
                    Discount Coupons ({coupons.length})
                </button>
            </div>

            {/* TAB 1: PRODUCTS INVENTORY & EDIT */}
            {activeTab === 'products' && (
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-outline-variant/40 flex justify-between items-center">
                        <h3 className="font-extrabold text-xl text-primary">Catalog Inventory Management</h3>
                        <span className="text-xs font-semibold text-on-surface-variant">Showing {products.length} live products</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-surface-container-low text-on-surface-variant uppercase font-bold border-b border-outline-variant/30">
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Stock Level</th>
                                    <th className="p-4">SKU</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {products.map(p => (
                                    <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                                        <td className="p-4 font-bold text-primary flex items-center gap-3">
                                            <img src={p.images?.[0]} alt={p.name} className="w-11 h-11 object-cover rounded-lg bg-surface-container shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-primary">{p.name}</p>
                                                <p className="text-[11px] text-on-surface-variant line-clamp-1">{p.description}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-on-surface-variant">{p.category}</td>
                                        <td className="p-4 font-black text-sm text-primary">${p.price?.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-md font-extrabold text-[11px]">
                                                {p.stock_quantity || 50} units
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-on-surface-variant text-xs">{p.sku || `VEL-PROD-${p.id}`}</td>
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingProduct({ ...p, image_url: p.images?.[0] || '' })}
                                                    className="bg-primary/10 hover:bg-primary text-primary hover:text-on-primary px-3 py-1.5 rounded-lg transition-all font-bold text-xs flex items-center gap-1.5 shadow-xs"
                                                >
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id, p.name)}
                                                    className="bg-error/10 hover:bg-error text-error hover:text-on-error px-3 py-1.5 rounded-lg transition-all font-bold text-xs flex items-center gap-1.5 shadow-xs"
                                                >
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 2: CUSTOMERS & USERS MANAGEMENT */}
            {activeTab === 'customers' && (
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-outline-variant/40 flex justify-between items-center">
                        <h3 className="font-extrabold text-xl text-primary">Registered Customers & User Accounts</h3>
                        <span className="text-xs font-semibold text-on-surface-variant">Total Users: {customers.length}</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-surface-container-low text-on-surface-variant uppercase font-bold border-b border-outline-variant/30">
                                    <th className="p-4">Customer Name</th>
                                    <th className="p-4">Email Address</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Total Orders</th>
                                    <th className="p-4">Total Spent</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {customers.map(c => (
                                    <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                                        <td className="p-4 font-bold text-primary flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary font-black flex items-center justify-center text-sm border border-secondary/20">
                                                {c.name.charAt(0)}
                                            </div>
                                            <span className="text-sm">{c.name}</span>
                                        </td>
                                        <td className="p-4 font-mono text-on-surface-variant">{c.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${c.role === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                }`}>
                                                {c.role}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-primary">{c.orders} orders</td>
                                        <td className="p-4 font-black text-sm text-primary">${c.totalSpent.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full font-bold text-[10px]">
                                                ● {c.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-on-surface-variant font-mono">{c.joined}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 3: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-outline-variant/40 flex justify-between items-center">
                        <h3 className="font-extrabold text-xl text-primary">Store Orders & Fulfillment</h3>
                        <span className="text-xs font-semibold text-on-surface-variant">Recent Orders: {orders.length}</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-surface-container-low text-on-surface-variant uppercase font-bold border-b border-outline-variant/30">
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Payment Method</th>
                                    <th className="p-4">Fulfillment Status</th>
                                    <th className="p-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {orders.map(o => (
                                    <tr key={o.id} className="hover:bg-surface-container-low/50 transition-colors">
                                        <td className="p-4 font-mono font-bold text-primary">{o.id}</td>
                                        <td className="p-4">
                                            <p className="font-bold text-primary">{o.customer_name}</p>
                                            <p className="text-[11px] text-on-surface-variant">{o.email}</p>
                                        </td>
                                        <td className="p-4 font-black text-sm text-primary">${typeof o.total_amount === 'number' ? o.total_amount.toFixed(2) : o.total_amount}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-block ${o.payment_method?.includes('Cash on Delivery') ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                }`}>
                                                {o.payment_method || 'Cash on Delivery (COD)'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={o.status}
                                                onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                                                className="bg-surface-container font-extrabold text-xs px-3 py-1.5 rounded-lg border border-outline-variant/50 text-primary cursor-pointer"
                                            >
                                                <option value="Processing">⏳ Processing</option>
                                                <option value="Shipped">📦 Shipped</option>
                                                <option value="Delivered">🏠 Delivered</option>
                                                <option value="Cancelled">❌ Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="p-4 font-mono text-on-surface-variant">{o.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 4: DISCOUNT COUPONS */}
            {activeTab === 'coupons' && (
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-outline-variant/40 flex justify-between items-center">
                        <div>
                            <h3 className="font-extrabold text-xl text-primary">Store Promo Coupons & Offers</h3>
                            <p className="text-xs text-on-surface-variant mt-0.5">Manage promotional discount codes and tracking metrics</p>
                        </div>
                        <button
                            onClick={() => {
                                const code = prompt('Enter new coupon code (e.g. EXTRA15):');
                                const disc = prompt('Enter discount description (e.g. 15% OFF):');
                                if (code && disc) {
                                    setCoupons(prev => [...prev, { id: `c${prev.length + 1}`, code: code.toUpperCase(), discount: disc, type: 'Percentage', usage: 0, status: 'Active' }]);
                                    addToast(`Promo coupon "${code.toUpperCase()}" created!`, 'success');
                                }
                            }}
                            className="bg-secondary text-on-secondary font-bold text-xs uppercase px-4 py-2.5 rounded-lg shadow hover:bg-secondary-container transition-colors"
                        >
                            + Add New Coupon
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-surface-container-low text-on-surface-variant uppercase font-bold border-b border-outline-variant/30">
                                    <th className="p-4">Coupon Code</th>
                                    <th className="p-4">Discount Value</th>
                                    <th className="p-4">Discount Type</th>
                                    <th className="p-4">Times Claimed</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {coupons.map(c => (
                                    <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                                        <td className="p-4 font-mono font-extrabold text-sm text-primary">{c.code}</td>
                                        <td className="p-4 font-bold text-emerald-600">{c.discount}</td>
                                        <td className="p-4 text-on-surface-variant font-medium">{c.type}</td>
                                        <td className="p-4 font-bold text-primary">{c.usage} orders</td>
                                        <td className="p-4">
                                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                                                {c.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* EDIT PRODUCT MODAL */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest dark:bg-surface-container-high w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant p-6 relative">
                        <button
                            onClick={() => setEditingProduct(null)}
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className="font-extrabold text-xl text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">edit</span>
                            Edit Product: {editingProduct.name}
                        </h3>

                        <form onSubmit={handleEditSubmit} className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Product Title</label>
                                <input
                                    type="text"
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Category</label>
                                    <select
                                        value={editingProduct.category}
                                        onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full bg-surface-container text-xs px-3 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-bold"
                                    >
                                        <option value="Footwear">Footwear</option>
                                        <option value="Apparel">Apparel</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct(prev => ({ ...prev, price: e.target.value }))}
                                        required
                                        className="w-full bg-surface-container text-xs px-3 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Stock Level</label>
                                    <input
                                        type="number"
                                        value={editingProduct.stock_quantity || 50}
                                        onChange={(e) => setEditingProduct(prev => ({ ...prev, stock_quantity: e.target.value }))}
                                        required
                                        className="w-full bg-surface-container text-xs px-3 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Image URL</label>
                                <input
                                    type="url"
                                    value={editingProduct.image_url || ''}
                                    onChange={(e) => setEditingProduct(prev => ({ ...prev, image_url: e.target.value }))}
                                    required
                                    className="w-full bg-surface-container text-xs px-4 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={editingProduct.description}
                                    onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                                    required
                                    className="w-full bg-surface-container text-xs p-3 rounded-lg border border-outline-variant/30 text-primary resize-none"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="px-4 py-2.5 rounded-lg border border-outline-variant text-xs font-bold uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold uppercase shadow"
                                >
                                    Save Product Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD PRODUCT MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest dark:bg-surface-container-high w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant p-6 relative">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className="font-extrabold text-xl text-primary mb-4">Add Product to Velocity Catalog</h3>

                        <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Product Title</label>
                                <input
                                    type="text"
                                    value={newProd.name}
                                    onChange={(e) => setNewProd(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    placeholder="e.g. Kinetic Ultra Pant"
                                    className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 text-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Category</label>
                                    <select
                                        value={newProd.category}
                                        onChange={(e) => setNewProd(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-bold"
                                    >
                                        <option value="Footwear">Footwear</option>
                                        <option value="Apparel">Apparel</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Price ($ USD)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newProd.price}
                                        onChange={(e) => setNewProd(prev => ({ ...prev, price: e.target.value }))}
                                        required
                                        placeholder="180.00"
                                        className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 text-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Image URL</label>
                                <input
                                    type="url"
                                    value={newProd.image_url}
                                    onChange={(e) => setNewProd(prev => ({ ...prev, image_url: e.target.value }))}
                                    required
                                    className="w-full bg-surface-container text-xs px-4 py-2.5 rounded-lg border border-outline-variant/30 text-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={newProd.description}
                                    onChange={(e) => setNewProd(prev => ({ ...prev, description: e.target.value }))}
                                    required
                                    placeholder="Technical details, carbon fiber specs, and polymer weave features..."
                                    className="w-full bg-surface-container text-sm p-4 rounded-lg border border-outline-variant/30 text-primary resize-none"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2.5 rounded-lg border border-outline-variant text-xs font-bold uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold uppercase shadow"
                                >
                                    Publish to Catalog
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
