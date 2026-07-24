import React, { useState } from 'react';

export const HelpCenter = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            q: 'What is VELOCITY\'s 30-Day Performance Guarantee?',
            a: 'We stand by our kinetic technology. Put our shoes or apparel to the test for 30 full days. If they don\'t elevate your stride or comfort, return them for a full refund—even if worn.'
        },
        {
            q: 'How long does Express Shipping take?',
            a: 'Express shipping orders are processed within 12 hours and arrive in 2-3 business days across North America and Europe. Free for orders over $150.'
        },
        {
            q: 'How do I choose the correct size for AeroPulse Pro X?',
            a: 'AeroPulse Pro X runs true to US athletic sizing. For a marathon performance fit with carbon lockdown, order your standard running shoe size.'
        },
        {
            q: 'Can I track my order live?',
            a: 'Yes! Once your order ships, you will receive a tracking link via email and can also track status under your Account Profile.'
        }
    ];

    return (
        <div className="max-w-container-max mx-auto px-6 md:px-8 py-16 min-h-screen">
            <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">Customer Support</span>
                <h1 className="text-4xl font-black text-primary mb-2">Help Center & FAQ</h1>
                <p className="text-sm text-on-surface-variant">Find answers regarding shipping, carbon plate sizing, returns, and order management.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm">
                        <button
                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            className="w-full text-left p-6 font-extrabold text-base text-primary flex justify-between items-center"
                        >
                            <span>{faq.q}</span>
                            <span className="material-symbols-outlined">{openFaq === idx ? 'expand_less' : 'expand_more'}</span>
                        </button>
                        {openFaq === idx && (
                            <div className="px-6 pb-6 text-sm text-on-surface-variant leading-relaxed border-t border-surface-container pt-4">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Support Box */}
            <div className="max-w-3xl mx-auto mt-16 p-8 bg-surface-container-low rounded-2xl border border-outline-variant/40 text-center space-y-3">
                <h3 className="font-extrabold text-lg text-primary">Need direct assistance from an athlete advisor?</h3>
                <p className="text-xs text-on-surface-variant">Our support team is online 24/7 to assist with orders and technical gear guidance.</p>
                <button className="bg-primary text-on-primary font-bold text-xs uppercase px-6 py-3 rounded-lg hover:bg-tertiary-container transition-colors shadow inline-block">
                    Email support@velocity.com
                </button>
            </div>
        </div>
    );
};
