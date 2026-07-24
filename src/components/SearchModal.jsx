import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';

export const SearchModal = ({ onClose }) => {
    const { products } = useProducts();
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const results = query.trim() === '' ? [] : products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    const handleSelect = (slug) => {
        onClose();
        navigate(`/product/${slug}`);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in">
            <div className="bg-surface-container-lowest dark:bg-surface-container-high w-full max-w-2xl rounded-2xl shadow-2xl border border-outline-variant overflow-hidden">
                {/* Search Header */}
                <div className="flex items-center px-4 py-3 border-b border-outline-variant">
                    <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search AeroPulse, Strata, Hoodies, Duffels..."
                        className="w-full bg-transparent text-lg text-primary dark:text-on-primary focus:outline-none placeholder:text-on-surface-variant/60"
                    />
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Results List */}
                <div className="max-h-[60vh] overflow-y-auto p-4">
                    {query.trim() === '' ? (
                        <div className="text-center py-8">
                            <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Popular Searches</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['AeroPulse Pro X', 'Marathon Shoes', 'Track Pants', 'Windbreaker', 'Carbon Fiber'].map(term => (
                                    <button
                                        key={term}
                                        onClick={() => setQuery(term)}
                                        className="px-3 py-1.5 bg-surface-container text-xs rounded-full hover:bg-primary hover:text-on-primary transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Matching Products ({results.length})</p>
                            {results.map(prod => (
                                <div
                                    key={prod.id}
                                    onClick={() => handleSelect(prod.slug)}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container cursor-pointer transition-colors group"
                                >
                                    <img
                                        src={prod.images[0]}
                                        alt={prod.name}
                                        className="w-14 h-14 object-cover rounded-lg bg-surface-container-low border border-surface-variant group-hover:scale-105 transition-transform"
                                    />
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-primary dark:text-on-primary group-hover:text-secondary transition-colors">{prod.name}</h4>
                                        <p className="text-xs text-on-surface-variant">{prod.category} • SKU: {prod.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-primary dark:text-on-primary">${prod.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-on-surface-variant">
                            <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                            <p className="font-semibold">No products found matching "{query}"</p>
                            <p className="text-xs mt-1">Try searching for Footwear, Apparel, or Accessories</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
