import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';

export const CheckoutPage = () => {
    const { formatPrice } = useCurrency();
    const { cartItems, subtotal, discount, shippingFee, tax, total, clearCart } = useCart();
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            addToast('Please sign in to proceed with your order checkout.', 'info');
            navigate('/signin');
        }
    }, [user, navigate, addToast]);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        fullName: user?.full_name || '',
        address: '742 Evergreen Terrace',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94107',
        country: 'United States',
        cardNumber: '4242 •••• •••• 4242',
        expDate: '12/28',
        cvc: '888',
        shippingSpeed: 'express'
    });

    const getDeliveryEstimate = () => {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() + 2);
        const end = new Date(today);
        end.setDate(today.getDate() + 4);
        const options = { month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    };

    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cod'
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePlaceOrder = async (e, overrideMethod = null) => {
        if (e) e.preventDefault();
        setIsProcessing(true);

        const chosenMethod = overrideMethod || paymentMethod;
        const orderId = `VEL-${Math.floor(10000 + Math.random() * 90000)}`;
        const newOrder = {
            id: orderId,
            user_id: user?.id || 'u-demo',
            customer_name: formData.fullName,
            email: formData.email,
            status: 'Processing',
            payment_method: chosenMethod === 'cod' ? 'Cash on Delivery (COD)' : chosenMethod === 'express' ? 'Express Pay' : 'Credit Card (Stripe)',
            payment_status: chosenMethod === 'cod' ? 'Pending (Pay upon delivery)' : 'Paid',
            total_amount: total,
            date: new Date().toISOString().split('T')[0],
            placed_at: new Date().toISOString(),
            shipping_address: {
                address_line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postalCode,
                country: formData.country
            },
            items: cartItems.map(item => ({
                product_id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size || '9.5',
                color: item.color || 'Standard',
                image: item.image
            }))
        };

        // Save order to localStorage
        try {
            const existingOrders = JSON.parse(localStorage.getItem('velocity_user_orders') || '[]');
            localStorage.setItem('velocity_user_orders', JSON.stringify([newOrder, ...existingOrders]));
        } catch (err) {
            console.error('LocalStorage error:', err);
        }

        try {
            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
            });
        } catch (err) {
            console.warn('API POST /api/orders fallback to local state:', err);
        }

        setTimeout(() => {
            setIsProcessing(false);
            clearCart();
            navigate(`/order-confirmed/${orderId}`);
        }, 1200);
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-container-max mx-auto px-6 py-24 text-center">
                <h2 className="text-2xl font-bold text-primary mb-4">No items in checkout</h2>
                <button onClick={() => navigate('/shop')} className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg">Return to Shop</button>
            </div>
        );
    }

    return (
        <div className="max-w-container-max mx-auto px-6 md:px-8 py-10 min-h-screen">
            <div className="mb-8 border-b border-surface-container-high pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-1 block">Checkout</span>
                    <h1 className="text-3xl md:text-4xl font-black text-primary">Secure Payment & Shipping</h1>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0">
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                    <span>Estimated Delivery: <strong className="text-emerald-700 dark:text-emerald-300">{getDeliveryEstimate()}</strong></span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Form Column */}
                <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">

                    {/* Express Checkout */}
                    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/40 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Express Checkout</span>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                className="bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-md active:scale-98"
                            >
                                <span className="font-extrabold text-sm"> Pay</span>
                            </button>
                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                className="bg-white text-black border border-outline-variant py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-md active:scale-98"
                            >
                                <span className="font-extrabold text-sm text-blue-600">G</span> Pay
                            </button>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 space-y-4">
                        <h3 className="font-extrabold text-lg text-primary flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">contact_mail</span>
                            1. Contact Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 space-y-4">
                        <h3 className="font-extrabold text-lg text-primary flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">local_shipping</span>
                            2. Shipping Address
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Street Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary"
                            />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">State / Province</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Options */}
                    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 space-y-5">
                        <div className="flex justify-between items-center">
                            <h3 className="font-extrabold text-lg text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary">payments</span>
                                3. Payment Method
                            </h3>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">lock</span> 256-Bit SSL Encrypted
                            </span>
                        </div>

                        {/* Payment Method Selector Tabs */}
                        <div className="grid grid-cols-2 gap-3 p-1 bg-surface-container rounded-xl">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={`py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card'
                                    ? 'bg-surface-container-lowest text-primary shadow border border-outline-variant/50'
                                    : 'text-on-surface-variant hover:text-primary'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-lg">credit_card</span>
                                Credit / Debit Card
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('cod')}
                                className={`py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${paymentMethod === 'cod'
                                    ? 'bg-surface-container-lowest text-primary shadow border border-outline-variant/50'
                                    : 'text-on-surface-variant hover:text-primary'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-lg">local_atm</span>
                                Cash on Delivery (COD)
                            </button>
                        </div>

                        {/* Card Form View */}
                        {paymentMethod === 'card' ? (
                            <div className="space-y-4 pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Card Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            required={paymentMethod === 'card'}
                                            className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary font-mono"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs font-bold text-primary bg-surface-container-lowest px-2 py-0.5 rounded border">VISA</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Expiration (MM/YY)</label>
                                        <input
                                            type="text"
                                            name="expDate"
                                            value={formData.expDate}
                                            onChange={handleChange}
                                            required={paymentMethod === 'card'}
                                            className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">CVC Code</label>
                                        <input
                                            type="password"
                                            name="cvc"
                                            value={formData.cvc}
                                            onChange={handleChange}
                                            required={paymentMethod === 'card'}
                                            maxLength={4}
                                            className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Cash on Delivery Informational Banner */
                            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
                                <span className="material-symbols-outlined text-emerald-600 text-2xl mt-0.5">verified_user</span>
                                <div>
                                    <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">Cash on Delivery (COD) Selected</h4>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 leading-relaxed">
                                        Pay <strong>{formatPrice(total)}</strong> in cash or via UPI/Mobile QR scan upon delivery at your shipping address. No advance payment required!
                                    </p>
                                    <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                                        <span className="material-symbols-outlined text-sm">local_shipping</span> Free COD Verification • Fast Courier Dispatch
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Order Button */}
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-secondary text-on-primary font-extrabold text-lg py-4 rounded-xl hover:bg-secondary-container transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Processing Order...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined">{paymentMethod === 'cod' ? 'handshake' : 'lock'}</span>
                                {paymentMethod === 'cod' ? `Place Order with Cash on Delivery (${formatPrice(total)})` : `Pay ${formatPrice(total)} Now`}
                            </span>
                        )}
                    </button>
                </form>

                {/* Sidebar Summary */}
                <div className="lg:col-span-5 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/40 space-y-6 self-start shadow-sm">
                    <h3 className="font-extrabold text-xl text-primary border-b border-outline-variant/40 pb-3">Order Items ({cartItems.length})</h3>

                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                        {cartItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-surface-container-lowest rounded-xl">
                                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg bg-surface-container" />
                                <div className="flex-grow text-xs">
                                    <p className="font-bold text-primary line-clamp-1">{item.name}</p>
                                    <p className="text-on-surface-variant">Size {item.size} • Qty {item.quantity}</p>
                                </div>
                                <span className="font-bold text-sm text-primary">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 text-xs text-on-surface-variant pt-4 border-t border-outline-variant/40">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-bold text-primary">{formatPrice(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-bold">
                                <span>Discount</span>
                                <span>-{formatPrice(discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Shipping Fee</span>
                            <span className="font-bold text-primary">{shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(shippingFee)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Estimated Tax</span>
                            <span className="font-bold text-primary">{formatPrice(tax)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-black text-primary pt-3 border-t border-outline-variant/40">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
