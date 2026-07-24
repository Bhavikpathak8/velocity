import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export const CartDrawer = () => {
    const { formatPrice } = useCurrency();
    const {
        cartItems,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeFromCart,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        totalCount,
        applyPromoCode,
        promoCode,
        setPromoCode,
        promoError,
        promoSuccess,
        freeShippingThreshold
    } = useCart();

    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
    const remainingForFreeShipping = freeShippingThreshold - subtotal;

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                onClick={() => setIsCartOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-surface-container-lowest dark:bg-surface-container-high shadow-2xl border-l border-outline-variant flex flex-col animate-fade-in">
                    {/* Drawer Header */}
                    <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                            <h2 className="text-xl font-extrabold text-primary dark:text-on-primary">Your Cart</h2>
                            <span className="bg-primary/10 text-primary dark:bg-on-primary/10 dark:text-on-primary px-2 py-0.5 rounded-full text-xs font-bold">
                                {totalCount} {totalCount === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Shipping Threshold Progress Bar */}
                    <div className="bg-surface-container-low px-6 py-3 border-b border-outline-variant">
                        {remainingForFreeShipping > 0 ? (
                            <p className="text-xs text-on-surface-variant font-medium mb-1.5">
                                Add <span className="font-bold text-primary dark:text-on-primary">{formatPrice(remainingForFreeShipping)}</span> more for <span className="font-bold text-secondary">FREE Express Shipping</span>
                            </p>
                        ) : (
                            <p className="text-xs text-emerald-600 font-bold mb-1.5 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">local_shipping</span>
                                You unlocked FREE Express Shipping!
                            </p>
                        )}
                        <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                            <div
                                className="h-full bg-secondary transition-all duration-500 rounded-full"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-16 flex flex-col items-center">
                                <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-3">shopping_bag</span>
                                <p className="text-lg font-bold text-primary dark:text-on-primary">Your cart is empty</p>
                                <p className="text-sm text-on-surface-variant mt-1 mb-6">Discover record-breaking speed gear in our collection.</p>
                                <button
                                    onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                                    className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg hover:bg-tertiary-container transition-colors"
                                >
                                    Shop High Performance
                                </button>
                            </div>
                        ) : (
                            cartItems.map((item, idx) => (
                                <div key={`${item.id}-${item.size}-${item.color}-${idx}`} className="flex gap-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg bg-surface-container border border-surface-variant flex-shrink-0"
                                    />
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-sm text-primary dark:text-on-primary line-clamp-1">{item.name}</h4>
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                                                    className="text-on-surface-variant hover:text-error transition-colors p-1"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                            <p className="text-xs text-on-surface-variant mt-0.5">
                                                Size: <span className="font-semibold text-primary dark:text-on-primary">{item.size}</span> • Color: <span className="font-semibold text-primary dark:text-on-primary">{item.color}</span>
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center border border-outline-variant rounded-md bg-surface-container-lowest">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.size, item.color, -1)}
                                                    className="px-2.5 py-0.5 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="px-2 text-xs font-bold text-primary">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.size, item.color, 1)}
                                                    className="px-2.5 py-0.5 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="font-bold text-sm text-primary dark:text-on-primary">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Drawer Footer Summary */}
                    {cartItems.length > 0 && (
                        <div className="p-6 border-t border-outline-variant bg-surface-container-lowest dark:bg-surface-container-high space-y-3">
                            {/* Promo Code Box */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Promo code (e.g. VELOCITY10)"
                                    className="flex-grow bg-surface-container text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                                />
                                <button
                                    onClick={() => applyPromoCode(promoCode)}
                                    className="bg-primary text-on-primary px-3 py-2 rounded-lg text-xs font-bold uppercase hover:bg-tertiary-container transition-colors"
                                >
                                    Apply
                                </button>
                            </div>

                            {promoSuccess && <p className="text-xs text-emerald-600 font-bold">{promoSuccess}</p>}
                            {promoError && <p className="text-xs text-error font-bold">{promoError}</p>}

                            {/* Subtotal breakdown */}
                            <div className="space-y-1 text-xs text-on-surface-variant pt-2 border-t border-surface-container">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-primary dark:text-on-primary">{formatPrice(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-semibold">
                                        <span>Discount</span>
                                        <span>-{formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Estimated Shipping</span>
                                    <span className="font-semibold text-primary dark:text-on-primary">
                                        {shippingFee === 0 ? <span className="text-emerald-600 uppercase font-bold">FREE</span> : formatPrice(shippingFee)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Estimated Tax (8%)</span>
                                    <span className="font-semibold text-primary dark:text-on-primary">{formatPrice(tax)}</span>
                                </div>
                                <div className="flex justify-between text-base font-extrabold text-primary dark:text-on-primary pt-2 border-t border-outline-variant/30">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Checkout CTAs */}
                            <div className="pt-2 space-y-2">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-secondary text-on-primary font-bold py-3.5 rounded-xl hover:bg-secondary-container transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    Checkout Now
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                                <button
                                    onClick={() => { setIsCartOpen(false); navigate('/cart'); }}
                                    className="w-full bg-transparent text-primary dark:text-on-primary border border-outline-variant font-semibold py-2.5 rounded-xl hover:bg-surface-container transition-colors text-xs"
                                >
                                    View Detailed Cart Page
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
