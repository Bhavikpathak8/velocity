import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ReviewModal } from '../components/ReviewModal';
import { ProductCard } from '../components/ProductCard';
import { ShoeViewer3D } from '../components/ShoeViewer3D';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { FitCalculatorModal } from '../components/FitCalculatorModal';
import { ImageZoomLens } from '../components/ImageZoomLens';

export const ProductDetail = () => {
    const { slug } = useParams();
    const { products, wishlist, toggleWishlist } = useProducts();
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const product = products.find(p => p.slug === slug || p.id === slug) || products[0];

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || 'Standard');
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '9.5');
    const [quantity, setQuantity] = useState(1);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isFitCalculatorOpen, setIsFitCalculatorOpen] = useState(false);

    const [reviewsList, setReviewsList] = useState([
        {
            id: 'rev-1',
            name: 'Marcus Vance',
            rating: 5,
            comment: 'The carbon propulsion plate is game-changing. Cut 14 seconds off my 5K PR on the first run.',
            date: '2 days ago',
            is_verified: true
        },
        {
            id: 'rev-2',
            name: 'Elena Rostova',
            rating: 5,
            comment: 'Ultra light and snappy foam return. Outsoles hold up incredibly well on wet track surfaces.',
            date: '1 week ago',
            is_verified: true
        }
    ]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (product) {
            setSelectedImageIndex(0);
            setSelectedColor(product.colors?.[0]?.name || 'Standard');
            setSelectedSize(product.sizes?.[0] || '9.5');
            setQuantity(1);

            // Record into recently viewed history
            try {
                const stored = JSON.parse(localStorage.getItem('velocity_recently_viewed') || '[]');
                const filtered = stored.filter(id => id !== product.id);
                localStorage.setItem('velocity_recently_viewed', JSON.stringify([product.id, ...filtered].slice(0, 6)));
            } catch (e) { }
        }
    }, [slug, product]);

    if (!product) {
        return (
            <div className="py-24 text-center">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <Link to="/shop" className="text-secondary font-bold underline mt-2 inline-block">Return to Shop</Link>
            </div>
        );
    }

    const isFavorite = wishlist.includes(product.id);
    const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

    const recentlyViewedIds = JSON.parse(localStorage.getItem('velocity_recently_viewed') || '[]').filter(id => id !== product.id);
    const recentlyViewedProducts = products.filter(p => recentlyViewedIds.includes(p.id)).slice(0, 4);

    const handleAddReview = (newReview) => {
        setReviewsList(prev => [newReview, ...prev]);
    };

    const handleAddToCart = () => {
        addToCart(product, selectedSize, selectedColor, quantity);
    };

    const handleBuyNow = () => {
        if (!user) {
            addToast('Please sign in to proceed with Express Buy.', 'info');
            navigate('/signin');
            return;
        }
        addToCart(product, selectedSize, selectedColor, quantity);
        navigate('/checkout');
    };

    const handleToggleWishlist = () => {
        if (!user) {
            addToast('Please sign in to save items to your wishlist.', 'info');
            navigate('/signin');
            return;
        }
        toggleWishlist(product.id);
    };

    const handleOpenReviewModal = () => {
        if (!user) {
            addToast('Please sign in to leave a verified review.', 'info');
            navigate('/signin');
            return;
        }
        setIsReviewModalOpen(true);
    };

    return (
        <div className="w-full">
            {/* Breadcrumb Navigation */}
            <div className="max-w-container-max mx-auto px-6 md:px-8 py-4">
                <nav className="flex text-xs font-semibold text-on-surface-variant">
                    <ol className="inline-flex items-center space-x-2">
                        <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                        <li><span className="material-symbols-outlined text-sm mx-1">chevron_right</span></li>
                        <li><Link to="/shop" className="hover:text-primary transition-colors">{product.category}</Link></li>
                        <li><span className="material-symbols-outlined text-sm mx-1">chevron_right</span></li>
                        <li className="text-primary font-bold">{product.name}</li>
                    </ol>
                </nav>
            </div>

            {/* Main Product Hero Layout */}
            <section className="max-w-container-max mx-auto px-6 md:px-8 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Gallery Column */}
                    <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 shrink-0">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImageIndex(idx)}
                                    className={`w-20 h-24 lg:w-24 lg:h-28 rounded-xl overflow-hidden border-2 transition-all relative ${selectedImageIndex === idx ? 'border-primary shadow-md scale-105' : 'border-outline-variant/40 hover:border-outline'
                                        }`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Featured Photo with Lens Zoom */}
                        <div className="w-full flex-1">
                            <ImageZoomLens
                                src={product.images?.[selectedImageIndex] || product.images?.[0]}
                                alt={product.name}
                            />
                        </div>

                        {/* Interactive 3D Orbit Shoe Viewer */}
                        {product.category === 'Footwear' && (
                            <div className="mt-4">
                                <ShoeViewer3D colorHex={product.colors?.[0]?.hex || '#0050cc'} />
                            </div>
                        )}
                    </div>

                    {/* Details Column */}
                    <div className="lg:col-span-5 flex flex-col justify-start">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold uppercase tracking-widest text-secondary">{product.category}</span>
                                <span className="text-xs text-on-surface-variant">• SKU: {product.sku}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight mb-2">{product.name}</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-extrabold text-primary">
                                    {formatPrice(product.sale_price || product.price)}
                                </span>
                                {product.sale_price && (
                                    <span className="text-lg text-on-surface-variant line-through">{formatPrice(product.price)}</span>
                                )}
                                <div className="flex items-center gap-1 text-xs text-amber-500 ml-auto">
                                    <span className="material-symbols-outlined text-base fill">star</span>
                                    <span className="font-bold text-primary">{product.rating || 4.9}</span>
                                    <span className="text-on-surface-variant">({product.reviews_count || 128} reviews)</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                            {product.description}
                        </p>

                        <div className="w-full h-px bg-outline-variant/40 mb-6" />

                        {/* Color Swatches */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase">
                                <span className="text-on-surface">Color:</span>
                                <span className="text-on-surface-variant">{selectedColor}</span>
                            </div>
                            <div className="flex gap-3">
                                {product.colors?.map((clr) => (
                                    <button
                                        key={clr.name}
                                        onClick={() => setSelectedColor(clr.name)}
                                        className={`w-10 h-10 rounded-full p-0.5 border-2 transition-all flex items-center justify-center ${selectedColor === clr.name ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-outline-variant hover:border-outline'
                                            }`}
                                    >
                                        <span className="w-full h-full rounded-full block border border-black/10" style={{ backgroundColor: clr.hex }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection Grid */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase">
                                <span className="text-on-surface">Select Size (US):</span>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsFitCalculatorOpen(true)}
                                        className="text-secondary hover:underline transition-colors flex items-center gap-1 font-extrabold"
                                    >
                                        <span className="material-symbols-outlined text-xs">auto_awesome</span> Smart Fit AI
                                    </button>
                                    <button
                                        onClick={() => setIsSizeGuideOpen(true)}
                                        className="text-on-surface-variant underline hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-xs">straighten</span> Size Guide
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {product.sizes?.map((sz) => (
                                    <button
                                        key={sz}
                                        onClick={() => setSelectedSize(sz)}
                                        className={`h-11 rounded-lg text-sm font-bold border transition-all ${selectedSize === sz
                                            ? 'bg-primary text-on-primary border-primary shadow'
                                            : 'bg-surface-container-lowest text-primary border-outline-variant hover:border-primary'
                                            }`}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-xs font-bold uppercase text-on-surface-variant">Quantity:</span>
                            <div className="flex items-center border border-outline-variant rounded-lg bg-surface-container-lowest">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-1.5 font-bold text-on-surface-variant hover:text-primary"
                                >
                                    -
                                </button>
                                <span className="px-3 font-bold text-sm text-primary">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-1.5 font-bold text-on-surface-variant hover:text-primary"
                                >
                                    +
                                </button>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 ml-auto flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">check_circle</span> In Stock ({product.stock_quantity || 42} pairs left)
                            </span>
                        </div>

                        {/* CTAs */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                className="w-full h-14 bg-secondary text-on-primary font-bold text-base rounded-xl hover:bg-secondary-container transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98"
                            >
                                Add To Cart
                                <span className="material-symbols-outlined text-xl">shopping_bag</span>
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleBuyNow}
                                    className="h-12 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-tertiary-container transition-colors shadow"
                                >
                                    Express Buy Now
                                </button>

                                <button
                                    onClick={handleToggleWishlist}
                                    className={`h-12 border font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 ${isFavorite
                                        ? 'bg-error text-white border-error'
                                        : 'border-outline-variant text-primary hover:bg-surface-container'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-lg ${isFavorite ? 'fill' : ''}`}>favorite</span>
                                    {isFavorite ? 'Saved' : 'Wishlist'}
                                </button>
                            </div>
                        </div>

                        {/* Sticky Mobile Purchase Bar */}
                        <div className="fixed bottom-0 left-0 right-0 p-3 bg-surface-container-lowest/95 dark:bg-surface-container-high/95 backdrop-blur-md border-t border-outline-variant/60 z-40 md:hidden flex items-center gap-3 shadow-2xl animate-slide-up">
                            <div className="flex-1">
                                <p className="text-[11px] font-extrabold uppercase text-secondary truncate">{product.name}</p>
                                <p className="text-sm font-black text-primary">{formatPrice(product.price)}</p>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="bg-secondary text-on-primary px-5 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase shadow-md active:scale-95 flex items-center gap-1 shrink-0"
                            >
                                <span>Add</span>
                                <span className="material-symbols-outlined text-base">shopping_bag</span>
                            </button>
                        </div>

                        {/* Micro Shipping Info */}
                        <div className="mt-6 p-4 bg-surface-container-low rounded-xl flex items-center gap-3 text-xs text-on-surface-variant">
                            <span className="material-symbols-outlined text-xl text-secondary">local_shipping</span>
                            <div>
                                <p className="font-bold text-primary">Free Express Delivery over {formatPrice(150)}</p>
                                <p>Ships within 24 hours with 30-day performance guarantee returns.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Bento Grid Technical Specs */}
            <section className="bg-surface-container-low py-20 border-y border-outline-variant/30">
                <div className="max-w-container-max mx-auto px-6 md:px-8">
                    <div className="mb-10 text-center max-w-xl mx-auto">
                        <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">Architecture</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-primary">Kinetic Precision Specs</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
                            <div className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-2xl">speed</span>
                            </div>
                            <h3 className="font-extrabold text-lg text-primary mb-2">Carbon Propulsion Plate</h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                Full-length rigid carbon fiber plate acts as a leverage spring to propel stride efficiency with minimal energy dissipation.
                            </p>
                        </div>

                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
                            <div className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-2xl">cloud</span>
                            </div>
                            <h3 className="font-extrabold text-lg text-primary mb-2">Hyper-Responsive Foam</h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                Lightest 85% energy-returning kinetic foam absorbs heel strike shock and snaps back instantly.
                            </p>
                        </div>

                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
                            <div className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-2xl">air</span>
                            </div>
                            <h3 className="font-extrabold text-lg text-primary mb-2">Engineered Micro-Mesh</h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                Ultra-breathable upper weave minimizes weight while holding lockdown stability during cornering.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Reviews Section */}
            <section className="max-w-container-max mx-auto px-6 md:px-8 py-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-4 border-b border-surface-variant gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">Athlete Feedback</span>
                        <h2 className="text-3xl font-extrabold text-primary">Verified Reviews ({reviewsList.length})</h2>
                    </div>
                    <button
                        onClick={handleOpenReviewModal}
                        className="bg-primary text-on-primary font-bold text-xs uppercase px-5 py-3 rounded-lg hover:bg-tertiary-container transition-colors shadow"
                    >
                        Write a Verified Review
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviewsList.map(rev => (
                        <div key={rev.id} className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-base text-primary">{rev.name}</span>
                                    {rev.is_verified && (
                                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-xs">verified</span> Verified Buyer
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-on-surface-variant">{rev.date}</span>
                            </div>
                            <div className="flex gap-1 text-amber-500 mb-2">
                                {[...Array(rev.rating)].map((_, i) => (
                                    <span key={i} className="material-symbols-outlined text-sm fill">star</span>
                                ))}
                            </div>
                            <p className="text-sm text-on-surface-variant leading-relaxed">"{rev.comment}"</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Complete The Look Cross-sells */}
            <section className="bg-surface-container-low py-20 border-t border-outline-variant/30">
                <div className="max-w-container-max mx-auto px-6 md:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-primary">Complete The Look</h2>
                        <Link to="/shop" className="text-xs font-bold text-secondary uppercase tracking-wider hover:underline">View All Gear</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Recently Viewed Products */}
            {recentlyViewedProducts.length > 0 && (
                <section className="py-16 border-t border-outline-variant/30">
                    <div className="max-w-container-max mx-auto px-6 md:px-8">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">Browsing History</span>
                                <h2 className="text-2xl font-extrabold text-primary">Recently Viewed Items</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {recentlyViewedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Review Modal */}
            {isReviewModalOpen && (
                <ReviewModal
                    product={product}
                    onClose={() => setIsReviewModalOpen(false)}
                    onSubmitReview={handleAddReview}
                />
            )}

            {/* Size Guide Modal */}
            {isSizeGuideOpen && (
                <SizeGuideModal onClose={() => setIsSizeGuideOpen(false)} />
            )}

            {/* Smart Fit Calculator Modal */}
            {isFitCalculatorOpen && (
                <FitCalculatorModal
                    onClose={() => setIsFitCalculatorOpen(false)}
                    onSelectSize={(size) => setSelectedSize(size)}
                />
            )}
        </div>
    );
};
