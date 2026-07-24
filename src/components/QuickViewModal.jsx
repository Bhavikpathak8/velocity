import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export const QuickViewModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();

    const [selectedImage, setSelectedImage] = useState(product?.images?.[0]);
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '9.5');
    const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || 'Standard');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    if (!product) return null;

    const handleAdd = () => {
        addToCart(product, selectedSize, selectedColor, quantity);
        setAdded(true);
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface-container-lowest dark:bg-surface-container-high w-full max-w-3xl rounded-2xl shadow-2xl border border-outline-variant overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface-container-high/80 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors shadow"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                {/* Gallery Preview Left */}
                <div className="w-full md:w-1/2 p-6 bg-surface-container-low flex flex-col justify-center items-center">
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-surface-container">
                        <img
                            src={selectedImage || product.images?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full justify-center">
                        {product.images?.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-primary scale-105' : 'border-outline-variant/40'
                                    }`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details Right */}
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary block mb-1">
                            {product.category}
                        </span>
                        <h2 className="text-2xl font-black text-primary mb-2">{product.name}</h2>
                        <p className="text-xl font-extrabold text-primary mb-3">{formatPrice(product.price)}</p>
                        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-4">
                            {product.description}
                        </p>

                        {/* Size Selector */}
                        <div className="mb-4">
                            <span className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">Select Size:</span>
                            <div className="flex flex-wrap gap-1.5">
                                {product.sizes?.map(sz => (
                                    <button
                                        key={sz}
                                        onClick={() => setSelectedSize(sz)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${selectedSize === sz ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container text-primary border-outline-variant'
                                            }`}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart CTA */}
                    <div className="space-y-2 pt-4 border-t border-outline-variant/30">
                        <button
                            onClick={handleAdd}
                            className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow flex items-center justify-center gap-2 ${added ? 'bg-emerald-600 text-white' : 'bg-secondary text-on-secondary hover:bg-secondary-container'
                                }`}
                        >
                            {added ? '✓ Added To Cart' : 'Add To Cart'}
                        </button>

                        <Link
                            to={`/product/${product.slug || product.id}`}
                            onClick={onClose}
                            className="block text-center text-xs font-bold text-primary hover:underline py-1"
                        >
                            View Full Product Page →
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};
