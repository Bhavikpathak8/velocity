import React, { useState } from 'react';

export const ReviewModal = ({ product, onClose, onSubmitReview }) => {
    const [rating, setRating] = useState(5);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && comment) {
            onSubmitReview({
                id: `rev-${Date.now()}`,
                name,
                rating,
                comment,
                date: 'Just now',
                is_verified: true
            });
            setSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 1200);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface-container-lowest dark:bg-surface-container-high w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-1"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <h3 className="font-extrabold text-xl text-primary dark:text-on-primary mb-1">Write a Review</h3>
                <p className="text-xs text-on-surface-variant mb-4">Sharing feedback for <span className="font-bold">{product.name}</span></p>

                {submitted ? (
                    <div className="py-8 text-center text-emerald-600">
                        <span className="material-symbols-outlined text-5xl mb-2">check_circle</span>
                        <p className="font-bold text-lg">Thank you for your review!</p>
                        <p className="text-xs text-on-surface-variant mt-1">Your feedback helps athletes make precise choices.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="text-amber-500 hover:scale-110 transition-transform p-1"
                                    >
                                        <span className={`material-symbols-outlined text-2xl ${star <= rating ? 'fill' : ''}`}>
                                            star
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Your Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Alex Rivera"
                                required
                                className="w-full bg-surface-container text-sm px-4 py-2.5 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Review Comments</label>
                            <textarea
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Describe fit, responsiveness, carbon plate propulsion, and material quality..."
                                required
                                className="w-full bg-surface-container text-sm p-4 rounded-lg border border-outline-variant/30 focus:outline-none focus:border-primary text-primary resize-none"
                            />
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-lg border border-outline-variant text-xs font-bold uppercase hover:bg-surface-container"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold uppercase hover:bg-tertiary-container transition-colors shadow"
                            >
                                Submit Verified Review
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
