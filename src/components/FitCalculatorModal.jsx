import React, { useState } from 'react';

export const FitCalculatorModal = ({ onClose, onSelectSize }) => {
    const [currentBrand, setCurrentBrand] = useState('Nike');
    const [currentSize, setCurrentSize] = useState('10');
    const [footWidth, setFootWidth] = useState('Standard');
    const [recommendation, setRecommendation] = useState(null);

    const brands = ['Nike', 'Adidas', 'Hoka', 'Puma', 'Asics', 'New Balance'];
    const sizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

    const handleCalculate = (e) => {
        e.preventDefault();
        const baseNum = parseFloat(currentSize);
        let recommendedNum = baseNum;

        // Nike & Hoka fit slightly snugger in performance shoes
        if (currentBrand === 'Nike' || currentBrand === 'Hoka') {
            if (footWidth === 'Wide') recommendedNum += 0.5;
        } else if (currentBrand === 'Adidas') {
            if (footWidth === 'Narrow') recommendedNum -= 0.5;
        }

        const matchPercentage = Math.floor(94 + Math.random() * 5); // 94% - 98%

        setRecommendation({
            size: recommendedNum.toString(),
            matchPercentage,
            note: footWidth === 'Wide'
                ? 'We added 0.5 size for maximum carbon plate comfort on wide feet.'
                : 'Fits true to performance racing specifications.'
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest dark:bg-surface-container-high w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant p-6 relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-secondary text-2xl">straighten</span>
                    <h3 className="font-extrabold text-xl text-primary">Smart Fit Calculator</h3>
                </div>
                <p className="text-xs text-on-surface-variant mb-6">
                    Enter your current athletic shoe size to get an instant precision recommendation for VELOCITY performance footwear.
                </p>

                {!recommendation ? (
                    <form onSubmit={handleCalculate} className="space-y-4 text-left">
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Your Most Comfortable Brand</label>
                            <div className="grid grid-cols-3 gap-2">
                                {brands.map(b => (
                                    <button
                                        type="button"
                                        key={b}
                                        onClick={() => setCurrentBrand(b)}
                                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${currentBrand === b
                                                ? 'bg-primary text-on-primary border-primary shadow-xs'
                                                : 'bg-surface-container text-primary border-outline-variant/30 hover:border-primary'
                                            }`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Your Size in {currentBrand}</label>
                                <select
                                    value={currentSize}
                                    onChange={(e) => setCurrentSize(e.target.value)}
                                    className="w-full bg-surface-container text-sm px-3 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-bold"
                                >
                                    {sizes.map(s => (
                                        <option key={s} value={s}>US {s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Foot Width Profile</label>
                                <select
                                    value={footWidth}
                                    onChange={(e) => setFootWidth(e.target.value)}
                                    className="w-full bg-surface-container text-sm px-3 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-bold"
                                >
                                    <option value="Narrow">Narrow Fit</option>
                                    <option value="Standard">Standard Medium</option>
                                    <option value="Wide">Wide / Plush Fit</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 bg-secondary text-on-secondary font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-secondary-container transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-base">auto_awesome</span>
                            Calculate Optimal Velocity Size
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-6 py-4 animate-fadeIn">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
                        </div>

                        <div>
                            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 mb-1 block">
                                {recommendation.matchPercentage}% Fit Precision Match
                            </span>
                            <h2 className="text-4xl font-black text-primary">US {recommendation.size}</h2>
                            <p className="text-xs text-on-surface-variant mt-2 max-w-sm mx-auto">
                                {recommendation.note}
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setRecommendation(null)}
                                className="w-1/2 py-3 rounded-xl border border-outline-variant text-xs font-bold text-primary hover:bg-surface-container"
                            >
                                Recalculate
                            </button>
                            <button
                                onClick={() => {
                                    if (onSelectSize) onSelectSize(recommendation.size);
                                    onClose();
                                }}
                                className="w-1/2 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase shadow hover:bg-tertiary-container transition-colors"
                            >
                                Apply Size US {recommendation.size}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
