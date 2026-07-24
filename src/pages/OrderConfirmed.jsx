import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const OrderConfirmed = () => {
    const { orderId } = useParams();

    // Retrieve order details from localStorage if available
    const savedOrders = JSON.parse(localStorage.getItem('velocity_user_orders') || '[]');
    const currentOrder = savedOrders.find(o => o.id === orderId) || savedOrders[0];

    const isCOD = currentOrder?.payment_method?.includes('Cash on Delivery');

    useEffect(() => {
        // Trigger celebratory confetti effect on order success!
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    return (
        <div className="max-w-container-max mx-auto px-6 md:px-8 py-16 min-h-screen">
            <div className="max-w-3xl mx-auto text-center space-y-6">

                {/* Animated Checkmark Badge */}
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                    <span className="material-symbols-outlined text-5xl font-bold">
                        {isCOD ? 'handshake' : 'check'}
                    </span>
                </div>

                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1 block">
                        {isCOD ? 'Order Placed with Cash on Delivery' : 'Payment Confirmed'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">Order Confirmed!</h1>
                    <p className="text-sm text-on-surface-variant mt-2">
                        Thank you for your purchase. Your order number is <span className="font-extrabold text-primary font-mono bg-surface-container px-2 py-0.5 rounded">#{currentOrder?.id || orderId || 'VEL-98421'}</span>
                    </p>
                </div>

                {/* Live Order Tracking Timeline */}
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/40 text-left space-y-4 shadow-sm">
                    <h3 className="font-extrabold text-base text-primary uppercase tracking-wider">Live Fulfillment Progress</h3>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                        <div className="space-y-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">✓</div>
                            <span className="text-emerald-600">Order Placed</span>
                        </div>
                        <div className="space-y-2">
                            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center mx-auto animate-pulse">⏳</div>
                            <span className="text-secondary">Processing</span>
                        </div>
                        <div className="space-y-2 opacity-40">
                            <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface flex items-center justify-center mx-auto">📦</div>
                            <span>Shipped</span>
                        </div>
                        <div className="space-y-2 opacity-40">
                            <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface flex items-center justify-center mx-auto">🏠</div>
                            <span>Delivered</span>
                        </div>
                    </div>
                </div>

                {/* Order Details Receipt Box */}
                <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/40 text-left space-y-6 shadow-sm">
                    <div className="flex justify-between items-center border-b border-outline-variant/40 pb-4">
                        <div>
                            <p className="text-xs text-on-surface-variant font-bold uppercase">Estimated Delivery</p>
                            <p className="text-lg font-black text-primary">3-5 Business Days (Express)</p>
                        </div>
                        <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase">Processing</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-on-surface-variant">
                        <div>
                            <p className="font-bold text-primary uppercase mb-1">Shipping To</p>
                            <p className="font-semibold text-primary">{currentOrder?.customer_name || 'Bhavik Pathak'}</p>
                            <p>{currentOrder?.shipping_address?.address || '742 Evergreen Terrace'}</p>
                            <p>{currentOrder?.shipping_address?.city || 'San Francisco'}, {currentOrder?.shipping_address?.state || 'CA'} {currentOrder?.shipping_address?.postalCode || '94107'}</p>
                        </div>
                        <div>
                            <p className="font-bold text-primary uppercase mb-1">Payment Method</p>
                            <p className="font-semibold text-primary">{currentOrder?.payment_method || 'Cash on Delivery (COD)'}</p>
                            <p className={`font-bold mt-1 ${isCOD ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {isCOD ? '💵 Pay cash/UPI upon delivery' : 'Transaction Authorized ✓'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <button
                        onClick={() => window.print()}
                        className="bg-surface-container text-primary font-bold text-sm px-6 py-3.5 rounded-xl border border-outline-variant hover:bg-surface-container-high transition-colors shadow flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Download PDF Invoice
                    </button>
                    <Link
                        to="/profile?tab=orders"
                        className="bg-primary text-on-primary font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-tertiary-container transition-colors shadow"
                    >
                        Track in My Account
                    </Link>
                    <Link
                        to="/shop"
                        className="bg-surface-container text-primary font-bold text-sm px-8 py-3.5 rounded-xl border border-outline-variant hover:bg-surface-container-high transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};
