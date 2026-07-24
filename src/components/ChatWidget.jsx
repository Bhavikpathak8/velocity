import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Hello! I am VELOCITY AI. How can I assist your athletic journey today?',
            time: 'Just now'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSendMessage = (textToSend) => {
        const query = textToSend || input;
        if (!query.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: query,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        if (!textToSend) setInput('');
        setIsTyping(true);

        setTimeout(() => {
            let botReply = "I'm happy to help! You can check product specs, shipping options, or contact support anytime at support@velocity.com.";

            const lower = query.toLowerCase();
            if (lower.includes('order') || lower.includes('track') || lower.includes('where')) {
                botReply = "You can track your live fulfillment status in real-time under 'My Account -> Order History'. Need to cancel? Orders in 'Processing' state can be cancelled instantly with one click!";
            } else if (lower.includes('size') || lower.includes('fit')) {
                botReply = "Our footwear uses true-to-size performance last specs! Try our new 'Smart Fit AI' tool on any product detail page for a precision 98% size match.";
            } else if (lower.includes('cod') || lower.includes('cash') || lower.includes('delivery')) {
                botReply = "Yes! We offer 100% Cash on Delivery (COD) with zero extra fee across all available PIN codes & postal addresses.";
            } else if (lower.includes('return') || lower.includes('refund')) {
                botReply = "We offer a 30-day hassle-free return window for unworn items in original packaging with full instant refund processing.";
            } else if (lower.includes('coupon') || lower.includes('discount')) {
                botReply = "Use code 'VELOCITY10' for 10% OFF or 'WELCOME20' for 20% OFF your first order during checkout!";
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: botReply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {/* Chat Toggle Button */}
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary text-on-primary p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group border border-outline-variant/30"
                >
                    <span className="material-symbols-outlined text-2xl animate-pulse">smart_toy</span>
                    <span className="text-xs font-black uppercase tracking-wider hidden sm:inline group-hover:inline">
                        VELOCITY AI
                    </span>
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                </button>
            ) : (
                <div className="bg-surface-container-lowest dark:bg-surface-container-high w-[350px] sm:w-[380px] h-[520px] rounded-3xl shadow-2xl border border-outline-variant flex flex-col overflow-hidden animate-fadeIn">

                    {/* Header */}
                    <div className="bg-primary text-on-primary p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-surface-container-high text-secondary flex items-center justify-center font-bold">
                                ⚡
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                                    VELOCITY AI Assistant
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                                </h4>
                                <span className="text-[10px] opacity-80 uppercase tracking-widest block">Live Instant Support</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-on-primary/80 hover:text-on-primary w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container/20 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-container-low/50">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${m.sender === 'user'
                                            ? 'bg-primary text-on-primary rounded-br-none shadow-xs'
                                            : 'bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 text-primary rounded-bl-none shadow-xs'
                                        }`}
                                >
                                    {m.text}
                                </div>
                                <span className="text-[9px] text-on-surface-variant/70 mt-1 px-1">{m.time}</span>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container p-2.5 rounded-xl w-24">
                                <span className="animate-bounce">●</span>
                                <span className="animate-bounce delay-100">●</span>
                                <span className="animate-bounce delay-200">●</span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="p-2 border-t border-outline-variant/30 bg-surface-container-lowest flex gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
                        <button
                            onClick={() => handleSendMessage('Where is my order?')}
                            className="bg-surface-container text-primary font-bold px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-surface-container-high transition-colors"
                        >
                            📦 Track Order
                        </button>
                        <button
                            onClick={() => handleSendMessage('How does COD work?')}
                            className="bg-surface-container text-primary font-bold px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-surface-container-high transition-colors"
                        >
                            💵 Cash on Delivery
                        </button>
                        <button
                            onClick={() => handleSendMessage('Any active promo coupon?')}
                            className="bg-surface-container text-primary font-bold px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-surface-container-high transition-colors"
                        >
                            🎟️ Coupons
                        </button>
                    </div>

                    {/* Input Footer */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="p-3 border-t border-outline-variant/30 bg-surface-container-lowest flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask VELOCITY AI anything..."
                            className="flex-1 bg-surface-container text-xs px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-primary focus:outline-none focus:border-primary"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-on-primary w-9 h-9 rounded-xl flex items-center justify-center hover:bg-tertiary-container transition-colors shadow shrink-0"
                        >
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
