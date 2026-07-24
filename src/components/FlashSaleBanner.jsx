import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const FlashSaleBanner = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 45 });
    const navigate = useNavigate();
    const { applyCoupon } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: 59, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return { hours: 0, minutes: 0, seconds: 0 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleClaim = () => {
        applyCoupon('WELCOME20');
        addToast('⚡ Promo Code "WELCOME20" (20% OFF) Applied!', 'success');
        navigate('/shop');
    };

    return (
        <div className="bg-gradient-to-r from-primary via-primary-container to-tertiary-container text-on-primary py-3 px-4 shadow-md relative overflow-hidden">
            <div className="max-w-container-max mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">

                {/* Banner Text */}
                <div className="flex items-center gap-3">
                    <span className="bg-secondary text-on-secondary text-[10px] font-black uppercase px-2.5 py-1 rounded-full animate-bounce">
                        FLASH DROP
                    </span>
                    <p className="text-xs sm:text-sm font-bold tracking-wide">
                        ⚡ Kinetic Carbon Series Launch: Get <span className="text-secondary font-black underline">20% OFF</span> all footwear!
                    </p>
                </div>

                {/* Live Countdown & Claim CTA */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 font-mono font-black text-xs bg-black/30 px-3 py-1 rounded-lg border border-white/10">
                        <span className="text-secondary">{String(timeLeft.hours).padStart(2, '0')}h</span>
                        <span>:</span>
                        <span className="text-secondary">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                        <span>:</span>
                        <span className="text-secondary">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                    </div>

                    <button
                        onClick={handleClaim}
                        className="bg-secondary text-on-secondary text-xs font-black uppercase px-4 py-1.5 rounded-lg hover:bg-secondary-container transition-transform hover:scale-105 shadow"
                    >
                        Claim 20% OFF
                    </button>
                </div>
            </div>
        </div>
    );
};
