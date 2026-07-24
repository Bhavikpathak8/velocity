import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { initialProducts } from './productsData.js';
import { initialOrders } from './ordersData.js';
import { initDb, pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'velocity_hyper_kinetic_jwt_secret_2026';

app.use(cors());
app.use(express.json());

// Initialize PostgreSQL database connection
initDb();

// In-memory data store for live operation
let products = [...initialProducts];
let orders = [...initialOrders];
let users = [
    {
        id: "u-demo",
        email: "customer@velocity.com",
        password_hash: bcrypt.hashSync("password123", 10),
        full_name: "Bhavik Pathak",
        role: "customer"
    },
    {
        id: "u-admin",
        email: "admin@velocity.com",
        password_hash: bcrypt.hashSync("admin123", 10),
        full_name: "Velocity Admin",
        role: "admin"
    }
];

// Auth middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// Admin guard middleware
const adminMiddleware = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    next();
};

// ----------------------------------------------------
// AUTH ENDPOINTS (velocity_auth_api_implementation.md)
// ----------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
    const { email, password, full_name } = req.body;
    if (!email || !password || !full_name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        id: `u-${Date.now()}`,
        email,
        password_hash: hashedPassword,
        full_name,
        role: 'customer'
    };

    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, role: newUser.role, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
        token,
        user: { id: newUser.id, email: newUser.email, full_name: newUser.full_name, role: newUser.role }
    });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
        token,
        user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }
    });
});

app.post('/api/auth/google', async (req, res) => {
    const { email, full_name, avatar_url } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Google authentication failed' });
    }

    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        user = {
            id: `google-${Date.now()}`,
            email: email.toLowerCase(),
            full_name: full_name || email.split('@')[0],
            role: 'customer',
            avatar_url: avatar_url || 'https://lh3.googleusercontent.com/a/default-user=s96-c',
            is_google_user: true
        };
        users.push(user);

        // Try inserting into PostgreSQL if connected
        try {
            await pool.query(
                'INSERT INTO users (id, name, email, role, is_google_user, avatar_url) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
                [user.id, user.full_name, user.email, user.role, true, user.avatar_url]
            );
        } catch (dbErr) {
            console.log('PostgreSQL write optional:', dbErr.message);
        }
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            avatar_url: user.avatar_url,
            isGoogleUser: true
        }
    });
});

app.get('/api/users/me', authMiddleware, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, email: user.email, full_name: user.full_name, role: user.role });
});

// -----------------------------------------------------------
// PRODUCT MANAGEMENT ENDPOINTS (velocity_product_management_api.txt)
// -----------------------------------------------------------
app.get('/api/products', (req, res) => {
    let result = products.filter(p => p.is_active);
    const { category, search, sort, minPrice, maxPrice } = req.query;

    if (category && category !== 'All') {
        result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
        const q = search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (minPrice) {
        result = result.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
        result = result.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (sort === 'Price: Low-High') {
        result.sort((a, b) => a.price - b.price);
    } else if (sort === 'Price: High-Low') {
        result.sort((a, b) => b.price - a.price);
    } else if (sort === 'Rating') {
        result.sort((a, b) => b.rating - a.rating);
    }

    res.json(result);
});

app.get('/api/products/:slug', (req, res) => {
    const { slug } = req.params;
    const product = products.find(p => p.slug === slug || p.id === slug);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

app.post('/api/admin/products', authMiddleware, adminMiddleware, (req, res) => {
    const { name, category, description, price, sale_price, sku, stock_quantity, images } = req.body;
    if (!name || !price || !sku) {
        return res.status(400).json({ error: 'Missing required product fields' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct = {
        id: `p-${Date.now()}`,
        slug,
        name,
        category: category || 'Footwear',
        category_id: `cat-${(category || 'footwear').toLowerCase()}`,
        description: description || '',
        price: parseFloat(price),
        sale_price: sale_price ? parseFloat(sale_price) : null,
        sku,
        stock_quantity: parseInt(stock_quantity || 0, 10),
        is_active: true,
        rating: 5.0,
        reviews_count: 0,
        images: images && images.length > 0 ? images : ["https://lh3.googleusercontent.com/aida-public/AB6AXuCA3tbQQ6tTWOJ7Y8sHLxPVvFFvT4z3qC3QOFoxu6nU1KszFOyagwueCO1oCfdxFa4hwuPWyOhZVOqqWUp3t8vmYew5ro4htE1HTwpBg-opxn63pqXDH3nOFTvKoPvOsK1Dn90cpg2oMstaWvveFFLiJ5Djn2V2jbla_GLicmHvvblU_wYS6IefWhVosYoQydrSXEIq9_T0HUIsKASs9arv8DjxSXuRrI0YlF1r4b2BbxBKa7fHsuDD"],
        colors: [{ name: "Standard Obsidian", hex: "#000000" }],
        sizes: ["8", "9", "10", "11"]
    };

    products.unshift(newProduct);
    res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });

    products[index] = { ...products[index], ...req.body, updated_at: new Date().toISOString() };
    res.json(products[index]);
});

app.delete('/api/admin/products/:id', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;
    const product = products.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.is_active = false;
    res.json({ message: 'Product deactivated successfully' });
});

// ----------------------------------------------------
// ORDERS ENDPOINTS
// ----------------------------------------------------
app.get('/api/orders', authMiddleware, (req, res) => {
    if (req.user.role === 'admin') {
        return res.json(orders);
    }
    const userOrders = orders.filter(o => o.user_id === req.user.id || o.email.toLowerCase() === req.user.email.toLowerCase());
    res.json(userOrders);
});

app.post('/api/orders', (req, res) => {
    const { items, total_amount, shipping_address, customer_name, email } = req.body;
    if (!items || items.length === 0 || !total_amount) {
        return res.status(400).json({ error: 'Invalid order data' });
    }

    const orderId = `VEL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
        id: orderId,
        user_id: req.body.user_id || 'guest',
        customer_name: customer_name || 'Valued Customer',
        email: email || 'customer@velocity.com',
        status: 'processing',
        total_amount,
        placed_at: new Date().toISOString(),
        shipping_address,
        items
    };

    orders.unshift(newOrder);
    res.status(201).json(newOrder);
});

app.put('/api/admin/orders/:id/status', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    order.updated_at = new Date().toISOString();
    res.json(order);
});

// Stripe intent endpoint
app.post('/api/checkout/create-intent', (req, res) => {
    const { total_amount } = req.body;
    const clientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
    res.json({ clientSecret, amount: total_amount });
});

app.listen(PORT, () => {
    console.log(`VELOCITY Backend Server running on http://localhost:${PORT}`);
});
