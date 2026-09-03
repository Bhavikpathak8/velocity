import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import { useCurrency } from '../context/CurrencyContext';

export const Shop = () => {
    const { formatPrice } = useCurrency();
    const {
        filteredProducts,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedSizes,
        setSelectedSizes,
        maxPrice,
        setMaxPrice,
        minRating,
        setMinRating,
        sortBy,
        setSortBy,
        wishlist
    } = useProducts();

    const [searchParams] = useSearchParams();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) {
            setSelectedCategory(cat);
        }
    }, [searchParams]);

    const categories = ['All', 'Footwear', 'Apparel', 'Accessories'];
    const sizesList = ['XS', 'S', 'M', 'L', 'XL', '7', '8', '9', '10', '11', '12'];

    const toggleSize = (sz) => {
        setSelectedSizes(prev =>
            prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
        );
    };

    const handleClearFilters = () => {
        setSelectedCategory('All');
        setSearchQuery('');
        setSelectedSizes([]);
        setMaxPrice(500);
        setMinRating(0);
        setSortBy('Newest');
    };

    const showWishlistOnly = searchParams.get('wishlist') === 'true';
    const displayProducts = showWishlistOnly
        ? filteredProducts.filter(p => wishlist.includes(p.id))
        : filteredProducts;

    const activeFilterCount = selectedSizes.length + (selectedCategory !== 'All' ? 1 : 0) + (minRating > 0 ? 1 : 0) + (maxPrice < 500 ? 1 : 0);

    return (
        <div className="w-full max-w-container-max mx-auto px-6 md:px-8 py-10 min-h-screen flex flex-col">
            {/* Header Banner */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-surface-container-high pb-6">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-1 block">Catalog</span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
                        {showWishlistOnly ? 'Your Saved Wishlist' : `${selectedCategory} Collection`}
                    </h1>
                    {searchQuery && (
                        <p className="text-sm text-on-surface-variant mt-1">
                            Showing results for "<span className="font-bold text-primary">{searchQuery}</span>"
                            <button onClick={() => setSearchQuery('')} className="ml-2 text-xs text-error font-bold underline">Clear search</button>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-sm text-on-surface-variant font-medium">
                        Showing <span className="font-bold text-primary">{displayProducts.length}</span> Results
                    </span>

                    <div className="flex items-center gap-2">
                        <label htmlFor="sort-select" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hidden sm:inline">Sort by:</label>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                            <option value="Newest">Newest Drops</option>
                            <option value="Price: Low-High">Price: Low to High</option>
                            <option value="Price: High-Low">Price: High to Low</option>
                            <option value="Rating">Customer Rating</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="flex flex-col md:flex-row gap-10 flex-grow">
                {/* Mobile Filter Button */}
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="md:hidden w-full bg-surface-container py-3 rounded-lg text-sm font-bold text-primary flex items-center justify-center gap-2 border border-outline-variant"
                >
                    <span className="material-symbols-outlined">tune</span>
                    Filter Products {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>

                {/* Sidebar Filters (Desktop) */}
                <aside className="w-full md:w-64 shrink-0 self-start hidden md:block border-r border-outline-variant/40 pr-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-lg text-primary">Filters</h3>
                            {activeFilterCount > 0 && (
                                <span className="bg-primary text-on-primary text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleClearFilters}
                            className="text-xs font-bold text-on-surface-variant hover:text-error transition-colors underline"
                        >
                            Reset All
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="border-b border-surface-container pb-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Category</h4>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group text-sm font-medium">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === cat}
                                        onChange={() => setSelectedCategory(cat)}
                                        className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
                                    />
                                    <span className={`group-hover:text-secondary transition-colors ${selectedCategory === cat ? 'font-bold text-primary' : 'text-on-surface-variant'}`}>
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Max Price Filter */}
                    <div className="border-b border-surface-container pb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Max Price</h4>
                            <span className="text-sm font-extrabold text-primary">{formatPrice(maxPrice)}</span>
                        </div>
                        <input
                            type="range"
                            min="30"
                            max="500"
                            step="10"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full accent-primary cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-on-surface-variant font-bold mt-1">
                            <span>{formatPrice(30)}</span>
                            <span>{formatPrice(500)}</span>
                        </div>
                    </div>

                    {/* Minimum Rating Filter */}
                    <div className="border-b border-surface-container pb-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Minimum Rating</h4>
                        <div className="space-y-1.5">
                            {[0, 4.5, 4.8].map(rt => (
                                <button
                                    key={rt}
                                    onClick={() => setMinRating(rt)}
                                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between border transition-all ${minRating === rt ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container text-primary border-outline-variant/30 hover:border-primary'
                                        }`}
                                >
                                    <span>{rt === 0 ? 'All Ratings' : `${rt}★ & Above`}</span>
                                    {minRating === rt && <span className="material-symbols-outlined text-sm">check</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div className="border-b border-surface-container pb-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Size</h4>
                        <div className="flex flex-wrap gap-2">
                            {sizesList.map(sz => {
                                const isSelected = selectedSizes.includes(sz);
                                return (
                                    <button
                                        key={sz}
                                        onClick={() => toggleSize(sz)}
                                        className={`w-10 h-10 rounded-lg text-xs font-bold border transition-all ${isSelected
                                            ? 'bg-primary text-on-primary border-primary shadow'
                                            : 'bg-surface-container-lowest text-primary border-outline-variant hover:border-primary'
                                            }`}
                                    >
                                        {sz}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Clear Filters CTA */}
                    <button
                        onClick={handleClearFilters}
                        className="w-full bg-surface-container text-primary font-bold text-xs uppercase tracking-wider py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors border border-outline-variant"
                    >
                        Clear Filters
                    </button>
                </aside>

                {/* Product Grid */}
                <main className="flex-grow">
                    {displayProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-surface-container-low/40 rounded-2xl border border-dashed border-outline-variant">
                            <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-3">inventory_2</span>
                            <h3 className="text-xl font-bold text-primary mb-1">No products match your filters</h3>
                            <p className="text-sm text-on-surface-variant mb-6">Try selecting different categories or sizes.</p>
                            <button
                                onClick={handleClearFilters}
                                className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg text-xs uppercase hover:bg-tertiary-container transition-colors"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
