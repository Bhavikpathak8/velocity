import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartPage = () => {
    const {
        cartItems,
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

    const remainingForFreeShipping = freeShippingThreshold - subtotal;
    const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

    if (cartItems.length === 0) {
        return (
            <div className="max-w-container-max mx-auto px-6 py-24 text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-3">shopping_bag</span>
                <h1 className="text-3xl font-extrabold text-primary mb-2">Your Shopping Cart is Empty</h1>
                <p className="text-sm text-on-surface-variant mb-8 max-w-md mx-auto">
                    Explore our collection of carbon-propelled footwear and high-performance technical apparel.
                </p>
                <Link
                    to="/shop"
                    className="bg-primary text-on-primary font-bold px-8 py-4 rounded-xl hover:bg-tertiary-container transition-colors inline-block shadow-lg"
                >
                    Explore All Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-container-max mx-auto px-6 md:px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">Shopping Bag ({totalCount})</h1>
            <p className="text-sm text-on-surface-variant mb-8">Review your selected kinetic items before proceeding to secure checkout.</p>

            {/* Free Shipping Alert Bar */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 mb-8">
                {remainingForFreeShipping > 0 ? (
                    <p className="text-xs font-semibold text-on-surface-variant mb-2">
                        Add <span className="font-extrabold text-primary">${remainingForFreeShipping.toFixed(2)}</span> more to qualify for <span className="font-bold text-secondary">FREE Express Delivery</span>!
                    </p>
                ) : (
                    <p className="text-xs font-bold text-emerald-600 mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">check_circle</span> You have unlocked FREE Express Delivery!
                    </p>
                )}
                <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Items Table */}
                <div className="lg:col-span-8 space-y-4">
                    {cartItems.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex flex-col sm:flex-row gap-6 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm items-center">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-surface-container shrink-0" />
                            <div className="flex-grow space-y-1 text-center sm:text-left">
                                <h3 className="font-extrabold text-base text-primary">{item.name}</h3>
                                <p className="text-xs text-on-surface-variant">
                                    Size: <span className="font-bold text-primary">{item.size}</span> • Color: <span className="font-bold text-primary">{item.color}</span>
                                </p>
                                <p className="text-xs text-on-surface-variant">SKU: {item.sku}</p>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="flex items-center border border-outline-variant rounded-lg bg-surface-container-low">
                                    <button onClick={() => updateQuantity(item.id, item.size, item.color, -1)} className="px-3 py-1 font-bold text-on-surface-variant hover:text-primary">-</button>
                                    <span className="px-3 font-bold text-sm text-primary">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.size, item.color, 1)} className="px-3 py-1 font-bold text-on-surface-variant hover:text-primary">+</button>
                                </div>

                                <span className="font-extrabold text-base text-primary min-w-[80px] text-right">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>

                                <button onClick={() => removeFromCart(item.id, item.size, item.color)} className="p-2 text-on-surface-variant hover:text-error">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary Box */}
                <div className="lg:col-span-4 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/40 space-y-4 self-start shadow-sm">
                    <h3 className="font-extrabold text-xl text-primary border-b border-outline-variant/40 pb-3">Order Summary</h3>

                    {/* Promo code */}
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Promo Code (VELOCITY10)"
                                className="bg-surface-container-lowest text-xs px-3 py-2.5 rounded-lg border border-outline-variant/30 flex-grow focus:outline-none focus:border-primary text-primary"
                            />
                            <button onClick={() => applyPromoCode(promoCode)} className="bg-primary text-on-primary px-4 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-tertiary-container">
                                Apply
                            </button>
                        </div>
                        {promoSuccess && <p className="text-xs text-emerald-600 font-bold">{promoSuccess}</p>}
                        {promoError && <p className="text-xs text-error font-bold">{promoError}</p>}
                    </div>

                    <div className="space-y-2 text-sm text-on-surface-variant pt-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-bold text-primary">${subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-bold">
                                <span>VIP Discount</span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Estimated Express Delivery</span>
                            <span className="font-bold text-primary">{shippingFee === 0 ? <span className="text-emerald-600 font-extrabold">FREE</span> : `$${shippingFee.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Estimated Tax (8%)</span>
                            <span className="font-bold text-primary">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-primary pt-3 border-t border-outline-variant/40">
                            <span>Order Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-secondary text-on-primary font-bold py-4 rounded-xl hover:bg-secondary-container transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        Proceed to Checkout
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
