import React, { useState } from 'react';

export const SizeGuideModal = ({ onClose }) => {
    const [unit, setUnit] = useState('inches'); // 'inches' | 'cm'
    const [footLength, setFootLength] = useState('10.2');

    const getRecommendedSize = (val, u) => {
        let cm = parseFloat(val) || 26;
        if (u === 'inches') cm = cm * 2.54;

        if (cm < 24) return { us: '7', uk: '6', eu: '40' };
        if (cm < 25) return { us: '8', uk: '7', eu: '41' };
        if (cm < 25.8) return { us: '8.5', uk: '7.5', eu: '41.5' };
        if (cm < 26.5) return { us: '9', uk: '8', eu: '42' };
        if (cm < 27.2) return { us: '9.5', uk: '8.5', eu: '42.5' };
        if (cm < 28) return { us: '10', uk: '9', eu: '43' };
        if (cm < 28.8) return { us: '10.5', uk: '9.5', eu: '44' };
        if (cm < 29.5) return { us: '11', uk: '10', eu: '45' };
        return { us: '12', uk: '11', eu: '46' };
    };

    const rec = getRecommendedSize(footLength, unit);

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest dark:bg-surface-container-high w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary block mb-1">
                    Precision Sizing Tool
                </span>
                <h3 className="font-extrabold text-2xl text-primary mb-4">VELOCITY Athletic Size Calculator</h3>

                <div className="space-y-4">
                    {/* Unit Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setUnit('inches')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${unit === 'inches' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container text-primary border-outline-variant'
                                }`}
                        >
                            Inches (in)
                        </button>
                        <button
                            onClick={() => setUnit('cm')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${unit === 'cm' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container text-primary border-outline-variant'
                                }`}
                        >
                            Centimeters (cm)
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                            Enter Heel-to-Toe Foot Length ({unit}):
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={footLength}
                            onChange={(e) => setFootLength(e.target.value)}
                            className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-bold"
                        />
                    </div>

                    {/* Calculator Output */}
                    <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 text-center space-y-2">
                        <span className="text-xs font-bold text-secondary uppercase tracking-wider block">Recommended Size Fit</span>
                        <div className="flex justify-center gap-6 text-primary">
                            <div>
                                <span className="text-2xl font-black">{rec.us}</span>
                                <span className="block text-[10px] font-extrabold text-on-surface-variant uppercase">US</span>
                            </div>
                            <div>
                                <span className="text-2xl font-black">{rec.uk}</span>
                                <span className="block text-[10px] font-extrabold text-on-surface-variant uppercase">UK</span>
                            </div>
                            <div>
                                <span className="text-2xl font-black">{rec.eu}</span>
                                <span className="block text-[10px] font-extrabold text-on-surface-variant uppercase">EU</span>
                            </div>
                        </div>
                    </div>

                    {/* Conversion Reference Table */}
                    <div className="overflow-x-auto text-xs">
                        <table className="w-full text-center border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low text-on-surface-variant font-bold border-b border-outline-variant/30">
                                    <th className="p-2">US</th>
                                    <th className="p-2">UK</th>
                                    <th className="p-2">EU</th>
                                    <th className="p-2">CM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20 text-primary">
                                <tr><td className="p-1.5 font-bold">8</td><td>7</td><td>41</td><td>25.0</td></tr>
                                <tr><td className="p-1.5 font-bold">9</td><td>8</td><td>42</td><td>26.5</td></tr>
                                <tr><td className="p-1.5 font-bold">9.5</td><td>8.5</td><td>42.5</td><td>27.0</td></tr>
                                <tr><td className="p-1.5 font-bold">10</td><td>9</td><td>43</td><td>27.5</td></tr>
                                <tr><td className="p-1.5 font-bold">11</td><td>10</td><td>45</td><td>29.0</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
