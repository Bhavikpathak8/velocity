import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

export const StoreLocator = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStore, setSelectedStore] = useState(null);
    const { addToast } = useToast();

    const stores = [
        {
            id: 'st-sf',
            name: 'San Francisco Flagship Innovation Lab',
            city: 'San Francisco',
            address: '742 Evergreen Terrace, San Francisco, CA 94107',
            phone: '+1 (415) 890-2100',
            hours: 'Mon-Sat: 10am - 8pm | Sun: 11am - 6pm',
            stockStatus: 'Full Stock Available',
            image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'st-nyc',
            name: 'New York SoHo Performance Hub',
            city: 'New York',
            address: '540 Broadway, New York, NY 10012',
            phone: '+1 (212) 431-8800',
            hours: 'Mon-Sat: 10am - 9pm | Sun: 11am - 7pm',
            stockStatus: 'High Demand (Popular Sizes Limited)',
            image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'st-tyo',
            name: 'Tokyo Shibuya Speed Store',
            city: 'Tokyo',
            address: 'Udagawacho 12-3, Shibuya-ku, Tokyo 150-0042',
            phone: '+81 3 5456 7000',
            hours: 'Mon-Sun: 11am - 9pm',
            stockStatus: 'Full Stock Available',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'st-ldn',
            name: 'London Regent Street Flagship',
            city: 'London',
            address: '184 Regent Street, London W1B 5TW',
            phone: '+44 20 7946 0920',
            hours: 'Mon-Sat: 10am - 8pm | Sun: 12pm - 6pm',
            stockStatus: 'Full Stock Available',
            image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80'
        }
    ];

    const filteredStores = stores.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBookFitting = (storeName) => {
        setSelectedStore(null);
        addToast(`✓ Fitting session reserved at ${storeName}! Check your email for details.`, 'success');
    };

    return (
        <div className="max-w-container-max mx-auto px-6 md:px-8 py-16 min-h-screen">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-secondary block">
                    Physical Retail Locations
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">
                    Find a VELOCITY Store
                </h1>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                    Experience our 3D foot scanning, carbon plate gait analysis, and try on live catalog products in person.
                </p>

                {/* Search Bar */}
                <div className="pt-4 max-w-md mx-auto relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                        search
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by city (e.g. San Francisco, Tokyo, London)..."
                        className="w-full bg-surface-container-lowest text-sm pl-11 pr-4 py-3.5 rounded-xl border border-outline-variant/40 text-primary shadow-sm focus:outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Stores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredStores.map(st => (
                    <div
                        key={st.id}
                        className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                        <div>
                            <div className="h-52 relative overflow-hidden bg-surface-container">
                                <img src={st.image} alt={st.name} className="w-full h-full object-cover" />
                                <span className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                                    ● {st.stockStatus}
                                </span>
                            </div>

                            <div className="p-6 space-y-3 text-left">
                                <h3 className="text-xl font-extrabold text-primary">{st.name}</h3>
                                <p className="text-xs text-on-surface-variant flex items-start gap-2">
                                    <span className="material-symbols-outlined text-base text-secondary shrink-0">location_on</span>
                                    {st.address}
                                </p>
                                <p className="text-xs text-on-surface-variant flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base text-secondary shrink-0">call</span>
                                    {st.phone}
                                </p>
                                <p className="text-xs text-on-surface-variant flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base text-secondary shrink-0">schedule</span>
                                    {st.hours}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={() => setSelectedStore(st)}
                                className="flex-1 bg-primary text-on-primary text-xs font-bold uppercase py-3 rounded-xl hover:bg-tertiary-container transition-colors shadow"
                            >
                                Book Gait & Size Fitting
                            </button>
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(st.address)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-3 bg-surface-container text-primary font-bold text-xs rounded-xl border border-outline-variant hover:bg-surface-container-high flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-base">directions</span>
                                Directions
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fitting Appointment Booking Modal */}
            {selectedStore && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest dark:bg-surface-container-high w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant p-6 relative">
                        <button
                            onClick={() => setSelectedStore(null)}
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className="font-extrabold text-xl text-primary mb-1">Reserve Gait & Size Scan</h3>
                        <p className="text-xs text-on-surface-variant mb-4">{selectedStore.name}</p>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleBookFitting(selectedStore.name);
                            }}
                            className="space-y-4 text-left"
                        >
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Full Name</label>
                                <input type="text" required placeholder="Bhavik Pathak" className="w-full bg-surface-container text-xs px-3.5 py-2.5 rounded-lg border border-outline-variant/30 text-primary" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Preferred Date</label>
                                <input type="date" required className="w-full bg-surface-container text-xs px-3.5 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-bold" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Time Slot</label>
                                <select className="w-full bg-surface-container text-xs px-3.5 py-2.5 rounded-lg border border-outline-variant/30 text-primary font-bold">
                                    <option>11:00 AM (Morning Session)</option>
                                    <option>02:30 PM (Afternoon Session)</option>
                                    <option>05:00 PM (Evening Session)</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-secondary text-on-secondary font-bold text-xs uppercase py-3 rounded-xl shadow hover:bg-secondary-container transition-colors"
                            >
                                Confirm In-Store Booking
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
