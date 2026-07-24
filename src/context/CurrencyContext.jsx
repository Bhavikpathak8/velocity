import React, { createContext, useContext, useState, useEffect } from 'react';

const currencies = {
    USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
    EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
    GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)' },
    CAD: { symbol: 'CA$', rate: 1.36, label: 'CAD ($)' },
    INR: { symbol: '₹', rate: 83.5, label: 'INR (₹)' }
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem('velocity_currency') || 'USD';
    });

    useEffect(() => {
        localStorage.setItem('velocity_currency', currency);
    }, [currency]);

    const currentCurr = currencies[currency] || currencies.USD;

    const formatPrice = (priceInUSD) => {
        if (typeof priceInUSD !== 'number') priceInUSD = parseFloat(priceInUSD) || 0;
        const converted = priceInUSD * currentCurr.rate;
        return `${currentCurr.symbol}${converted.toFixed(2)}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies, currentCurr }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
