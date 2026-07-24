# VELOCITY Authentication API Documentation (Express.js)

This document outlines the authentication API implementation for the VELOCITY platform, utilizing **Express.js**, **JSON Web Tokens (JWT)** for session management, and **bcryptjs** for secure password hashing.

## 1. Environment Configuration
Required dependencies and environment variables.

```javascript
// Dependencies: npm install express jsonwebtoken bcryptjs dotenv cors
// .env file:
// PORT=5000
// JWT_SECRET=your_ultra_secure_long_random_string
// JWT_EXPIRES_IN=24h
```

## 2. Authentication Middleware
Verifies the JWT from the `Authorization` header.

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
```

## 3. Auth Routes & Controllers

### A. User Registration (`POST /api/auth/register`)
Hashes the password and saves the user to the PostgreSQL database.

```javascript
const bcrypt = require('bcryptjs');
const pool = require('./db'); // Your PG pool connection

async function register(req, res) {
  const { email, password, full_name } = req.body;

  try {
    // 1. Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) return res.status(400).json({ error: 'User already exists' });

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name',
      [email, hashedPassword, full_name]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
}
```

### B. User Login (`POST /api/auth/login`)
Validates credentials and issues a JWT.

```javascript
const jwt = require('jsonwebtoken');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    // 2. Validate password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.header('Authorization', token).json({
      token,
      user: { id: user.id, email: user.email, full_name: user.full_name }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
}
```

## 4. Protected Route Example (`GET /api/users/me`)
Accesses the current user's profile using the middleware.

```javascript
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await pool.query('SELECT id, email, full_name, role FROM users WHERE id = $1', [req.user.id]);
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
```
