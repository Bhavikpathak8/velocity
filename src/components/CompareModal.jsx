import React from 'react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export const CompareModal = () => {
    const { compareList, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useCompare();
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();

    if (!isCompareOpen || compareList.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest dark:bg-surface-container-high w-full max-w-4xl rounded-2xl shadow-2xl border border-outline-variant p-6 relative max-h-[90vh] overflow-y-auto animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/40">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-2xl">compare_arrows</span>
                        <h3 className="font-extrabold text-xl text-primary">Side-by-Side Gear Comparison</h3>
                        <span className="text-xs bg-surface-container font-bold px-2.5 py-0.5 rounded-full text-on-surface-variant">
                            {compareList.length} / 3 Items
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearCompare}
                            className="text-xs text-on-surface-variant hover:text-error font-bold uppercase transition-colors"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={() => setIsCompareOpen(false)}
                            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {compareList.map((product) => (
                        <div key={product.id} className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/40 relative flex flex-col justify-between">
                            <button
                                onClick={() => removeFromCompare(product.id)}
                                className="absolute top-3 right-3 w-7 h-7 bg-surface-container text-on-surface-variant hover:text-error rounded-full flex items-center justify-center shadow-xs transition-colors"
                                title="Remove from comparison"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>

                            <div>
                                <img
                                    src={product.images?.[0]}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-lg mb-3 bg-surface-container"
                                />

                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary block">
                                    {product.category}
                                </span>
                                <h4 className="font-extrabold text-base text-primary mb-1 line-clamp-1">{product.name}</h4>
                                <p className="text-lg font-black text-primary mb-3">{formatPrice(product.price)}</p>

                                {/* Specs List */}
                                <div className="space-y-2 border-t border-outline-variant/30 pt-3 text-left">
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant font-medium">Customer Rating:</span>
                                        <span className="font-bold text-amber-500 flex items-center gap-0.5">
                                            {product.rating || 4.8} <span className="material-symbols-outlined text-xs fill">star</span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant font-medium">Stock Availability:</span>
                                        <span className="font-bold text-emerald-600">In Stock ({product.stock_quantity || 35})</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant font-medium">Propulsion Tech:</span>
                                        <span className="font-bold text-primary">Carbon Plate V2</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant font-medium">Cushioning Weight:</span>
                                        <span className="font-bold text-primary">185g (Ultralight)</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => addToCart(product, product.sizes?.[0] || '9.5', product.colors?.[0]?.name || 'Standard', 1)}
                                className="w-full mt-4 bg-primary text-on-primary font-bold py-2.5 rounded-lg hover:bg-tertiary-container transition-colors shadow flex items-center justify-center gap-1 text-xs uppercase"
                            >
                                <span className="material-symbols-outlined text-sm">shopping_bag</span> Add to Bag
                            </button>
                        </div>
                    ))}

                    {/* Placeholder Slot if less than 3 products */}
                    {compareList.length < 3 && (
                        <div className="border-2 border-dashed border-outline-variant/50 rounded-xl p-6 flex flex-col items-center justify-center text-center text-on-surface-variant min-h-[300px]">
                            <span className="material-symbols-outlined text-3xl mb-2 opacity-50">add_circle_outline</span>
                            <p className="font-bold text-xs mb-1">Add Another Product</p>
                            <p className="text-[11px] opacity-75">Click "Compare" on any product card in the store catalog.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
