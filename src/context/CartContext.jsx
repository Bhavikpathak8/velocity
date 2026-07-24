import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { addToast } = useToast();
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('velocity_cart');
        return saved ? JSON.parse(saved) : [
            {
                id: 'p1',
                name: 'AeroPulse Pro X',
                price: 180.00,
                quantity: 1,
                size: '9.5',
                color: 'Obsidian / Electric Blue',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA3tbQQ6tTWOJ7Y8sHLxPVvFFvT4z3qC3QOFoxu6nU1KszFOyagwueCO1oCfdxFa4hwuPWyOhZVOqqWUp3t8vmYew5ro4htE1HTwpBg-opxn63pqXDH3nOFTvKoPvOsK1Dn90cpg2oMstaWvveFFLiJ5Djn2V2jbla_GLicmHvvblU_wYS6IefWhVosYoQydrSXEIq9_T0HUIsKASs9arv8DjxSXuRrI0YlF1r4b2BbxBKa7fHsuDD',
                sku: 'VEL-APX-001'
            }
        ];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');

    useEffect(() => {
        localStorage.setItem('velocity_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, selectedSize = '9.5', selectedColor = 'Obsidian / Electric Blue', qty = 1) => {
        setCartItems(prev => {
            const existingIndex = prev.findIndex(
                item => item.id === product.id && item.size === selectedSize && item.color === selectedColor
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += qty;
                return updated;
            } else {
                return [
                    ...prev,
                    {
                        id: product.id,
                        name: product.name,
                        price: product.sale_price || product.price,
                        quantity: qty,
                        size: selectedSize,
                        color: selectedColor,
                        image: product.images?.[0] || product.image,
                        sku: product.sku
                    }
                ];
            }
        });

        if (addToast) {
            addToast(`${product.name} added to cart!`, 'success', 'View Cart', () => setIsCartOpen(true));
        }
        setIsCartOpen(true);
    };

    const updateQuantity = (id, size, color, delta) => {
        setCartItems(prev => {
            return prev.map(item => {
                if (item.id === id && item.size === size && item.color === color) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            }).filter(Boolean);
        });
    };

    const removeFromCart = (id, size, color) => {
        setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size && item.color === color)));
    };

    const clearCart = () => {
        setCartItems([]);
        setDiscountPercent(0);
        setPromoCode('');
    };

    const applyPromoCode = (code) => {
        setPromoError('');
        setPromoSuccess('');
        const clean = code.trim().toUpperCase();
        if (clean === 'VELOCITY10' || clean === 'VELOCITY') {
            setDiscountPercent(10);
            setPromoSuccess('10% VELOCITY VIP Discount Applied!');
            if (addToast) addToast('10% VIP Promo Code Applied!', 'success');
        } else if (clean === 'FREESHIP') {
            setPromoSuccess('Free Express Shipping Applied!');
            if (addToast) addToast('Free Express Shipping Applied!', 'success');
        } else {
            setPromoError('Invalid Promo Code. Try "VELOCITY10"');
            if (addToast) addToast('Invalid Promo Code', 'error');
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = (subtotal * discountPercent) / 100;
    const freeShippingThreshold = 150;
    const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
    const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
    const total = Math.max(0, subtotal - discount + shippingFee + tax);
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            applyPromoCode,
            promoCode,
            setPromoCode,
            discountPercent,
            promoError,
            promoSuccess,
            subtotal,
            discount,
            shippingFee,
            tax,
            total,
            totalCount,
            freeShippingThreshold
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
