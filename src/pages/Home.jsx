import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThreeCanvas } from '../components/ThreeCanvas';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';

export const Home = () => {
    const { products } = useProducts();
    const navigate = useNavigate();

    const newArrivals = products.slice(0, 3);
    const lifestyleEssentials = products.slice(3, 7);

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative w-full min-h-[85vh] bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                {/* Three.js Animated Particle Mesh */}
                <ThreeCanvas />

                {/* Hero Background Shoe Callout */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZIn6Rha6Ly6i6uJvHUbAncYI5yMrysf5cjfauB6RGqnSz9349_Kqnp3gBIFx1vgmzkDyOnKW1RQwwq8JTP9GBBR7X2t5QTQQ29Ww5S0O4QgOm6BqDWA25Mgq7AFu_VVz4ZTk79z4nkzVJ9Y5AA4liosTYEyKIzP-QQAJrwzNhT2hSsQ3wDPBbKbANDUA-3bHbQ4awo4v6kmApJ78pFPVafkoRGsuWBOMJvhzqC-fJJ6AZv0qSzrdl"
                        alt="Futuristic Athletic Shoe"
                        className="w-full h-full object-cover object-center opacity-85 hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/40 to-transparent md:w-2/3 pointer-events-none" />
                </div>

                {/* Hero Content Overlay */}
                <div className="relative z-10 max-w-container-max mx-auto px-6 md:px-8 w-full flex flex-col items-start justify-center py-20">
                    <div className="max-w-xl flex flex-col items-start gap-6">
                        <span className="bg-primary text-on-primary font-bold text-xs px-3 py-1 uppercase tracking-widest rounded-full shadow">
                            2026 Kinetic Drop
                        </span>

                        <h1 className="font-extrabold text-5xl md:text-7xl tracking-tighter text-primary leading-none">
                            The Future <br />
                            <span className="text-secondary">of Motion.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-on-surface-variant font-medium max-w-md leading-relaxed">
                            Engineered for elite performance. Designed for ultimate precision. Experience the next generation of carbon-propelled kinetic footwear.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <button
                                onClick={() => navigate('/shop')}
                                className="bg-primary text-on-primary font-bold text-base px-8 py-4 rounded-lg hover:bg-tertiary-container transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                            >
                                Shop The Drop
                                <span className="material-symbols-outlined text-xl">arrow_forward</span>
                            </button>

                            <button
                                onClick={() => navigate('/product/aeropulse-pro-x')}
                                className="bg-surface-container-lowest/80 backdrop-blur text-primary border border-primary font-bold text-base px-6 py-4 rounded-lg hover:bg-surface-container transition-colors shadow"
                            >
                                Explore AeroPulse Pro X
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights Bar */}
            <section className="bg-primary text-on-primary py-6 px-6 border-y border-outline-variant/20">
                <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-secondary">local_shipping</span>
                        <span>Free Express Shipping &gt; $150</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-secondary">eco</span>
                        <span>80% Recycled Kinetic Polymer</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-secondary">published_with_changes</span>
                        <span>30-Day Performance Guarantee</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-secondary">verified</span>
                        <span>Carbon Propulsion Tech</span>
                    </div>
                </div>
            </section>

            {/* Featured Grid: New Arrivals */}
            <section className="max-w-container-max mx-auto px-6 md:px-8 py-20">
                <div className="flex justify-between items-end mb-10 border-b border-surface-variant pb-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-1 block">Selected Releases</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">New Arrivals</h2>
                    </div>
                    <Link
                        to="/shop"
                        className="font-bold text-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 group"
                    >
                        View Full Catalog
                        <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {newArrivals.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Editorial Section: Sustainable Innovation */}
            <section className="w-full bg-tertiary text-on-tertiary relative overflow-hidden py-24 my-8">
                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHWjvNafZtGR3TGtRMrZvSDtqwuVK9yLODa9GUSk_bvGUc6DEjI1SsQNwnt0mjoGaAeXJy1CxKOpzpmbSHltmjE8SPh7eRgZ7MRO--HazoXaT7qJviLvCB8lor0fh3lfXisKmrmw7Der4HHH08tvPGqnoTOwOgTUVAPZlDSTqfzagmwR6m8bEFF1YiD3lO2Snycyc6Hityvb-TylDMKla420zvpwBRcS1UnrD57fwxamTlVrNUHbDG"
                        alt="Sustainable Interwoven Fibers"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-10 max-w-container-max mx-auto px-6 md:px-8 flex flex-col items-center text-center gap-6">
                    <span className="bg-secondary text-on-secondary text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-widest shadow">
                        Sustainability Initiative
                    </span>

                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-on-tertiary">
                        Sustainable <br /> Innovation.
                    </h2>

                    <p className="text-base md:text-lg text-on-tertiary-container max-w-2xl leading-relaxed">
                        Performance shouldn't cost the planet. Our new collection utilizes 80% recycled kinetic polymers without sacrificing structural integrity or energy return.
                    </p>

                    <button
                        onClick={() => navigate('/sustainability')}
                        className="mt-2 bg-on-tertiary text-tertiary font-bold text-base px-8 py-3.5 rounded-lg hover:bg-surface-variant transition-colors shadow-lg"
                    >
                        Explore The Technology
                    </button>
                </div>
            </section>

            {/* Secondary Grid: Lifestyle Essentials */}
            <section className="max-w-container-max mx-auto px-6 md:px-8 py-20">
                <div className="flex justify-between items-end mb-10 border-b border-surface-variant pb-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-1 block">Daily Athletics</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Lifestyle Essentials</h2>
                    </div>
                    <Link
                        to="/shop?category=Apparel"
                        className="font-bold text-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 group"
                    >
                        Shop Apparel & Accessories
                        <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {lifestyleEssentials.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    );
};
