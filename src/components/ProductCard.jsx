import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { QuickViewModal } from './QuickViewModal';

export const ProductCard = ({ product }) => {
    const { wishlist, toggleWishlist } = useProducts();
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const { addToCompare, compareList } = useCompare();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const navigate = useNavigate();

    const isFavorite = wishlist.includes(product.id);
    const isInCompare = compareList.some(p => p.id === product.id);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (!user) {
            addToast('Please sign in to save items to your wishlist.', 'info');
            navigate('/signin');
            return;
        }
        toggleWishlist(product.id);
    };

    const handleCardClick = (e) => {
        // If user didn't click favorite or quick action buttons
        if (!e.target.closest('.card-action-btn')) {
            navigate(`/product/${product.slug || product.id}`);
        }
    };

    return (
        <>
            <div
                onClick={handleCardClick}
                className="group flex flex-col cursor-pointer bg-surface-container-lowest/50 dark:bg-surface-container-high/30 rounded-xl p-2 transition-all hover:shadow-lg"
            >
                {/* Image Wrapper */}
                <div className="relative bg-surface-container-low rounded-xl overflow-hidden aspect-[4/5] mb-3 border border-outline-variant/30">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.sale_price && (
                            <span className="bg-error text-on-error px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider shadow">
                                SAVE {Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                            </span>
                        )}
                        {product.metadata?.zero_waste && (
                            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider shadow flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">eco</span> Eco
                            </span>
                        )}
                    </div>

                    {/* Top Action Buttons (Favorite + Compare) */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                        <button
                            onClick={handleFavoriteClick}
                            className={`card-action-btn p-2 rounded-full backdrop-blur-md transition-colors shadow ${isFavorite ? 'bg-error text-white' : 'bg-surface-container-lowest/80 text-primary hover:text-error'}`}
                            title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <span className={`material-symbols-outlined text-lg ${isFavorite ? 'fill' : ''}`}>
                                favorite
                            </span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCompare(product);
                            }}
                            className={`card-action-btn p-2 rounded-full backdrop-blur-md transition-colors shadow ${isInCompare ? 'bg-secondary text-on-secondary' : 'bg-surface-container-lowest/80 text-primary hover:text-secondary'}`}
                            title={isInCompare ? "In Comparison" : "Add to Compare Specs"}
                        >
                            <span className="material-symbols-outlined text-lg">
                                compare_arrows
                            </span>
                        </button>
                    </div>

                    {/* Quick Action Overlay Buttons */}
                    <div className="card-action-btn absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsQuickViewOpen(true);
                            }}
                            className="flex-1 bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-primary text-xs font-bold uppercase py-2 rounded-lg flex items-center justify-center gap-1 shadow-md"
                        >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            Quick View
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product, product.sizes?.[0] || '9.5', product.colors?.[0]?.name || 'Standard');
                            }}
                            className="bg-primary hover:bg-tertiary-container text-on-primary text-xs font-bold uppercase p-2 rounded-lg flex items-center justify-center shadow-md"
                            title="Quick Add to Cart"
                        >
                            <span className="material-symbols-outlined text-sm">shopping_bag</span>
                        </button>
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex justify-between items-start px-1">
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">
                            {product.category}
                        </div>
                        <h3 className="font-semibold text-base text-primary dark:text-on-primary group-hover:text-secondary transition-colors line-clamp-1">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-xs text-amber-500">
                            <span className="material-symbols-outlined text-sm fill">star</span>
                            <span className="font-bold text-on-surface">{product.rating || 4.9}</span>
                            <span className="text-on-surface-variant text-[11px]">({product.reviews_count || 42})</span>
                        </div>
                    </div>
                    <div className="text-right">
                        {product.sale_price ? (
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-base text-error">{formatPrice(product.sale_price)}</span>
                                <span className="text-xs text-on-surface-variant line-through">{formatPrice(product.price)}</span>
                            </div>
                        ) : (
                            <span className="font-bold text-base text-primary dark:text-on-primary">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            {isQuickViewOpen && (
                <QuickViewModal
                    product={product}
                    onClose={() => setIsQuickViewOpen(false)}
                />
            )}
        </>
    );
};

