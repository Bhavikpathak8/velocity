import React from 'react';
import { Link } from 'react-router-dom';

export const Sustainability = () => {
    return (
        <div className="w-full">
            {/* Hero */}
            <section className="bg-tertiary text-on-tertiary py-24 px-6 md:px-8 text-center relative overflow-hidden">
                <div className="max-w-container-max mx-auto relative z-10 space-y-4">
                    <span className="bg-secondary text-on-secondary text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-widest">
                        80% Recycled Polymers
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">Zero Waste. Unlimited Velocity.</h1>
                    <p className="text-lg text-on-tertiary-container max-w-2xl mx-auto">
                        We engineer peak athletic gear through sustainable closed-loop polymer recycling. No compromise on structural rigidity or carbon return.
                    </p>
                </div>
            </section>

            {/* Pillars Grid */}
            <section className="max-w-container-max mx-auto px-6 md:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
                        <span className="material-symbols-outlined text-4xl text-emerald-600">recycling</span>
                        <h3 className="text-xl font-extrabold text-primary">Closed-Loop Polymer</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                            Every worn shoe returned through our Trade-In program is ground down and re-extruded into next-gen midsole cushioning.
                        </p>
                    </div>

                    <div className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
                        <span className="material-symbols-outlined text-4xl text-secondary">co2</span>
                        <h3 className="text-xl font-extrabold text-primary">Carbon Neutral Freight</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                            100% of standard and express shipments are offset using certified reforestation and ocean plastic cleanup programs.
                        </p>
                    </div>

                    <div className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
                        <span className="material-symbols-outlined text-4xl text-amber-600">inventory_2</span>
                        <h3 className="text-xl font-extrabold text-primary">Biodegradable Packaging</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                            Unbox zero plastic. Our shoe boxes are constructed from 100% recycled FSC-certified post-consumer cardboard with soy ink print.
                        </p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link to="/shop" className="bg-primary text-on-primary font-bold px-8 py-4 rounded-xl hover:bg-tertiary-container transition-colors inline-block shadow-lg">
                        Shop Eco Collection
                    </Link>
                </div>
            </section>
        </div>
    );
};
