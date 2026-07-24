import React, { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const { addToast } = useToast();

    const addToCompare = (product) => {
        if (compareList.some(p => p.id === product.id)) {
            addToast(`"${product.name}" is already in comparison`, 'info');
            setIsCompareOpen(true);
            return;
        }

        if (compareList.length >= 3) {
            addToast(`You can compare up to 3 products at a time`, 'warning');
            setIsCompareOpen(true);
            return;
        }

        setCompareList(prev => [...prev, product]);
        addToast(`Added "${product.name}" to Compare`, 'success');
        setIsCompareOpen(true);
    };

    const removeFromCompare = (productId) => {
        setCompareList(prev => prev.filter(p => p.id !== productId));
    };

    const clearCompare = () => {
        setCompareList([]);
        setIsCompareOpen(false);
    };

    return (
        <CompareContext.Provider
            value={{
                compareList,
                addToCompare,
                removeFromCompare,
                clearCompare,
                isCompareOpen,
                setIsCompareOpen
            }}
        >
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => useContext(CompareContext);
