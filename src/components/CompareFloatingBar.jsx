import React from 'react';
import { useCompare } from '../context/CompareContext';

export const CompareFloatingBar = () => {
    const { compareList, removeFromCompare, clearCompare, setIsCompareOpen, isCompareOpen } = useCompare();

    if (compareList.length === 0 || isCompareOpen) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-surface-container-lowest dark:bg-surface-container-high border border-outline-variant rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-6 animate-slideUp">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">compare_arrows</span>
                <span className="text-xs font-black text-primary uppercase tracking-wider">
                    Comparing ({compareList.length}/3)
                </span>
            </div>

            <div className="flex items-center gap-3">
                {compareList.map(p => (
                    <div key={p.id} className="relative group flex items-center gap-2 bg-surface-container px-2.5 py-1.5 rounded-lg border border-outline-variant/30">
                        <img src={p.images?.[0]} alt={p.name} className="w-7 h-7 object-cover rounded bg-surface-variant" />
                        <span className="text-xs font-bold text-primary max-w-[100px] truncate">{p.name}</span>
                        <button
                            onClick={() => removeFromCompare(p.id)}
                            className="text-on-surface-variant hover:text-error ml-1"
                        >
                            <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 border-l border-outline-variant/40 pl-4">
                <button
                    onClick={() => setIsCompareOpen(true)}
                    className="bg-primary text-on-primary font-bold text-xs uppercase px-4 py-2 rounded-lg hover:bg-tertiary-container transition-colors shadow"
                >
                    View Specs
                </button>
                <button
                    onClick={clearCompare}
                    className="text-xs text-on-surface-variant hover:text-primary font-bold px-2"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};
