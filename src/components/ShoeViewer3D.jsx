import React, { useState, useRef } from 'react';

export const ShoeViewer3D = ({ images = [], colorHex = '#0050cc' }) => {
    const [activeAngleIndex, setActiveAngleIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startXRef = useRef(0);

    // Fallback high-res product gallery angles if images list is short
    const angles = images.length >= 4 ? images : [
        images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80',
        images[1] || 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&q=80',
        images[2] || 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1000&q=80',
        images[3] || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&q=80'
    ];

    const angleLabels = ['Profile Side', 'Front Toe', 'Heel Cushion', 'Sole Grip'];

    const handleNextAngle = () => {
        setActiveAngleIndex((prev) => (prev + 1) % angles.length);
    };

    const handlePrevAngle = () => {
        setActiveAngleIndex((prev) => (prev - 1 + angles.length) % angles.length);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        startXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const handleMouseUp = (e) => {
        if (!isDragging) return;
        setIsDragging(false);
        const endX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
        const diff = endX - startXRef.current;

        if (diff > 30) {
            handlePrevAngle();
        } else if (diff < -30) {
            handleNextAngle();
        }
    };

    return (
        <div className="relative w-full bg-surface-container-lowest dark:bg-surface-container-high/60 rounded-2xl border border-outline-variant/40 p-4 shadow-sm overflow-hidden select-none">
            {/* Header Controls */}
            <div className="flex justify-between items-center z-10 mb-3">
                <span className="bg-primary/10 text-primary dark:bg-on-primary/10 dark:text-on-primary text-[11px] font-extrabold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 border border-primary/20">
                    <span className="material-symbols-outlined text-xs">3d_rotation</span> 360° Studio Angle Inspector
                </span>
                <span className="text-[11px] font-semibold text-on-surface-variant hidden sm:inline">
                    Swipe or drag to spin angle
                </span>
            </div>

            {/* Interactive Image Frame */}
            <div
                className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing bg-surface-container-low/40 flex items-center justify-center group"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
            >
                <img
                    src={angles[activeAngleIndex]}
                    alt={`Product angle view ${activeAngleIndex + 1}`}
                    className="w-full h-full object-contain p-2 transition-all duration-300 transform group-hover:scale-105"
                />

                {/* Left/Right Navigation Arrows */}
                <button
                    onClick={(e) => { e.stopPropagation(); handlePrevAngle(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/80 dark:bg-primary/80 backdrop-blur-md text-primary dark:text-on-primary flex items-center justify-center border border-outline-variant/30 shadow hover:scale-110 transition-transform"
                    aria-label="Previous Angle"
                >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); handleNextAngle(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/80 dark:bg-primary/80 backdrop-blur-md text-primary dark:text-on-primary flex items-center justify-center border border-outline-variant/30 shadow hover:scale-110 transition-transform"
                    aria-label="Next Angle"
                >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>

                {/* Badge showing current angle name */}
                <div className="absolute bottom-3 left-3 bg-primary/95 text-on-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow backdrop-blur-sm">
                    {angleLabels[activeAngleIndex] || `Angle ${activeAngleIndex + 1}`}
                </div>
            </div>

            {/* Angle Selection Dots */}
            <div className="flex justify-center items-center gap-2 mt-3">
                {angles.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveAngleIndex(idx)}
                        className={`h-2 rounded-full transition-all ${activeAngleIndex === idx ? 'w-6 bg-primary' : 'w-2 bg-outline-variant/60 hover:bg-primary/50'
                            }`}
                        aria-label={`View angle ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
