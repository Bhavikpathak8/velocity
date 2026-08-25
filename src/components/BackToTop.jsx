import React, { useState, useEffect } from 'react';

export const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 350) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!visible) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="fixed bottom-6 right-6 z-40 bg-primary text-on-primary p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 border border-outline-variant/30 flex items-center justify-center group"
            title="Back to top"
        >
            <span className="material-symbols-outlined text-xl group-hover:-translate-y-0.5 transition-transform">
                keyboard_arrow_up
            </span>
        </button>
    );
};
