import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../../server/productsData.js';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('velocity_wishlist');
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length === 1 && parsed[0] === 'p1') {
                localStorage.removeItem('velocity_wishlist');
                return [];
            }
            return parsed;
        } catch {
            return [];
        }
    });

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [maxPrice, setMaxPrice] = useState(500);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('Newest');

    useEffect(() => {
        localStorage.setItem('velocity_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.warn('Using local fallback products dataset');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const addProduct = async (newProd, token) => {
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newProd)
            });
            if (res.ok) {
                const created = await res.json();
                setProducts(prev => [created, ...prev]);
                return created;
            }
        } catch (err) {
            const fallback = {
                id: `p-${Date.now()}`,
                slug: newProd.name.toLowerCase().replace(/ /g, '-'),
                ...newProd,
                is_active: true,
                rating: 5.0,
                reviews_count: 0
            };
            setProducts(prev => [fallback, ...prev]);
            return fallback;
        }
    };

    const deleteProduct = async (id, token) => {
        try {
            await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { }
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const updateProduct = async (updatedProd, token) => {
        try {
            await fetch(`/api/admin/products/${updatedProd.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedProd)
            });
        } catch (e) { }
        setProducts(prev => prev.map(p => p.id === updatedProd.id ? { ...p, ...updatedProd } : p));
    };

    // Filtered & sorted products computation
    const filteredProducts = products.filter(p => {
        if (!p.is_active) return false;
        if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const match = p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q);
            if (!match) return false;
        }
        if (selectedSizes.length > 0) {
            const hasSize = p.sizes?.some(s => selectedSizes.includes(s));
            if (!hasSize) return false;
        }
        if (p.price > maxPrice) return false;
        if (minRating > 0 && (p.rating || 5.0) < minRating) return false;
        return true;
    }).sort((a, b) => {
        if (sortBy === 'Price: Low-High') return a.price - b.price;
        if (sortBy === 'Price: High-Low') return b.price - a.price;
        if (sortBy === 'Rating') return b.rating - a.rating;
        return 0; // Newest
    });

    return (
        <ProductsContext.Provider value={{
            products,
            filteredProducts,
            loading,
            wishlist,
            toggleWishlist,
            selectedCategory,
            setSelectedCategory,
            searchQuery,
            setSearchQuery,
            selectedSizes,
            setSelectedSizes,
            selectedColors,
            setSelectedColors,
            maxPrice,
            setMaxPrice,
            minRating,
            setMinRating,
            sortBy,
            setSortBy,
            addProduct,
            updateProduct,
            deleteProduct,
            fetchProducts
        }}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => useContext(ProductsContext);
