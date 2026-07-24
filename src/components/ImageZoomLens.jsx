import React, { useState } from 'react';

export const ImageZoomLens = ({ src, alt }) => {
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, show: false });

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y, show: true });
    };

    const handleMouseLeave = () => {
        setZoomPosition(prev => ({ ...prev, show: false }));
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden rounded-2xl bg-surface-container-low border border-outline-variant/30 aspect-[4/5] cursor-crosshair group"
        >
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Magnifier Glass Lens */}
            {zoomPosition.show && (
                <div
                    className="absolute inset-0 pointer-events-none z-20 border-2 border-secondary/60 rounded-2xl shadow-2xl transition-all duration-75"
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: '250%',
                    }}
                >
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-md">
                        🔍 2.5x HD Lens Zoom
                    </div>
                </div>
            )}

            {!zoomPosition.show && (
                <div className="absolute bottom-3 right-3 bg-surface-container-lowest/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-on-surface-variant flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-xs">zoom_in</span> Hover to Zoom
                </div>
            )}
        </div>
    );
};
