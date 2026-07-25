import React, { createContext, useContext, useState, useEffect } from 'react';

const currencies = {
    INR: { symbol: '₹', rate: 83.5, label: 'INR (₹)' },
    USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
    EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
    GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)' },
    CAD: { symbol: 'CA$', rate: 1.36, label: 'CAD ($)' }
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem('velocity_currency') || 'INR';
    });

    useEffect(() => {
        localStorage.setItem('velocity_currency', currency);
    }, [currency]);

    const currentCurr = currencies[currency] || currencies.INR;

    const formatPrice = (priceInUSD) => {
        if (typeof priceInUSD !== 'number') priceInUSD = parseFloat(priceInUSD) || 0;
        const converted = priceInUSD * currentCurr.rate;
        const formattedNum = new Intl.NumberFormat(
            currency === 'INR' ? 'en-IN' : 'en-US',
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        ).format(converted);
        return `${currentCurr.symbol}${formattedNum}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies, currentCurr }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
