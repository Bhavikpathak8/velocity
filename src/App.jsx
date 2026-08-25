import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmed } from './pages/OrderConfirmed';
import { SignIn } from './pages/SignIn';
import { UserProfile } from './pages/UserProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import { Sustainability } from './pages/Sustainability';
import { HelpCenter } from './pages/HelpCenter';
import { StoreLocator } from './pages/StoreLocator';

import { ScrollToTop } from './components/ScrollToTop';
import { BackToTop } from './components/BackToTop';
import { CompareProvider } from './context/CompareContext';
import { CompareModal } from './components/CompareModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { ChatWidget } from './components/ChatWidget';

export function App() {
    return (
        <AuthProvider>
            <ProductsProvider>
                <CurrencyProvider>
                    <ToastProvider>
                        <CompareProvider>
                            <CartProvider>
                                <Router>
                                    <ScrollToTop />
                                    <BackToTop />
                                    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased font-sans transition-colors duration-200">
                                        <Navbar />
                                        <CartDrawer />
                                        <CompareModal />
                                        <CompareFloatingBar />
                                        <ChatWidget />

                                        <main className="flex-grow">
                                            <Routes>
                                                <Route path="/" element={<Home />} />
                                                <Route path="/shop" element={<Shop />} />
                                                <Route path="/product/:slug" element={<ProductDetail />} />
                                                <Route path="/cart" element={<CartPage />} />
                                                <Route path="/checkout" element={<CheckoutPage />} />
                                                <Route path="/order-confirmed/:orderId" element={<OrderConfirmed />} />
                                                <Route path="/order-confirmed" element={<OrderConfirmed />} />
                                                <Route path="/signin" element={<SignIn />} />
                                                <Route path="/join-us" element={<SignIn />} />
                                                <Route path="/profile" element={<UserProfile />} />
                                                <Route path="/admin" element={<AdminDashboard />} />
                                                <Route path="/sustainability" element={<Sustainability />} />
                                                <Route path="/help" element={<HelpCenter />} />
                                            </Routes>
                                        </main>

                                        <Footer />
                                    </div>
                                </Router>
                            </CartProvider>
                        </CompareProvider>
                    </ToastProvider>
                </CurrencyProvider>
            </ProductsProvider>
        </AuthProvider>
    );
}

export default App;
