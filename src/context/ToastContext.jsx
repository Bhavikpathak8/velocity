import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success', actionText = null, onAction = null) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, actionText, onAction }]);

        setTimeout(() => {
            removeToast(id);
        }, 4000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {/* Floating Toasts Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto p-4 rounded-xl shadow-2xl backdrop-blur-md border flex items-center justify-between gap-3 transform transition-all duration-300 animate-slide-up ${toast.type === 'error'
                                ? 'bg-red-900/90 text-white border-red-500/50'
                                : 'bg-neutral-900/90 text-white border-white/20'
                            }`}
                    >
                        <div className="flex items-center gap-2 text-xs font-bold">
                            <span className="text-secondary text-base">⚡</span>
                            <span>{toast.message}</span>
                        </div>

                        {toast.actionText && toast.onAction && (
                            <button
                                onClick={() => { toast.onAction(); removeToast(toast.id); }}
                                className="text-xs font-extrabold underline text-secondary hover:text-white transition-colors uppercase shrink-0"
                            >
                                {toast.actionText}
                            </button>
                        )}

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-neutral-400 hover:text-white text-xs ml-1"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
