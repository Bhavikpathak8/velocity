import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://velocity_user:velocity_pass@localhost:5432/velocity_db';

export const pool = new Pool({
    connectionString,
    ssl: (process.env.NODE_ENV === 'production' || connectionString.includes('render.com') || connectionString.includes('neon.tech') || connectionString.includes('sslmode=require'))
        ? { rejectUnauthorized: false }
        : false
});

// Auto-initialize PostgreSQL tables if they don't exist
export async function initDb() {
    try {
        const client = await pool.connect();
        console.log('⚡ Connected to PostgreSQL velocity_db successfully!');

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(100) PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                role VARCHAR(50) DEFAULT 'customer',
                is_google_user BOOLEAN DEFAULT FALSE,
                avatar_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(100) PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                slug VARCHAR(200) UNIQUE,
                description TEXT,
                price NUMERIC(10, 2) NOT NULL,
                category VARCHAR(100),
                stock_quantity INT DEFAULT 50,
                sku VARCHAR(100) UNIQUE,
                image_url TEXT
            );

            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(100) PRIMARY KEY,
                user_id VARCHAR(100),
                customer_name VARCHAR(150),
                customer_email VARCHAR(150),
                total_amount NUMERIC(10, 2) NOT NULL,
                payment_method VARCHAR(50) DEFAULT 'Credit Card',
                status VARCHAR(50) DEFAULT 'Processing',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS coupons (
                id VARCHAR(50) PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                discount_percentage INT NOT NULL,
                status VARCHAR(20) DEFAULT 'Active'
            );
        `);

        client.release();
        console.log('✅ PostgreSQL Schema Verified & Synced!');
    } catch (err) {
        console.warn('⚠️ PostgreSQL Connection Warning (Falling back to in-memory/localStorage engine):', err.message);
    }
}
