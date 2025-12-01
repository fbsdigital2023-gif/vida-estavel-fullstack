const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase.auth.signUpWithPassword({
      email,
      password,
    });
    
    if (error) return res.status(400).json({ error: error.message });
    
    res.json({ user: data.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) return res.status(401).json({ error: error.message });
    
    const token = jwt.sign({ id: data.user.id }, process.env.JWT_SECRET);
    res.json({ token, user: data.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Routes
app.get('/api/users/me', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ user: data.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json({ products: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', authenticate, async (req, res) => {
  try {
    const { name, description, price, image_url, stock } = req.body;
    
    const { data, error } = await supabase.from('products').insert([
      { name, description, price, image_url, stock, created_at: new Date() }
    ]);
    
    if (error) return res.status(400).json({ error: error.message });
    res.json({ product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cart Routes
app.post('/api/cart/add', authenticate, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    
    const { data, error } = await supabase.from('cart_items').insert([
      { user_id: req.userId, product_id, quantity, created_at: new Date() }
    ]);
    
    if (error) return res.status(400).json({ error: error.message });
    res.json({ cartItem: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/cart', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase.from('cart_items').select('*').eq('user_id', req.userId);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ items: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order Routes
app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const { items, total_price } = req.body;
    
    const { data, error } = await supabase.from('orders').insert([
      { user_id: req.userId, total_price, status: 'pending', created_at: new Date() }
    ]);
    
    if (error) return res.status(400).json({ error: error.message });
    res.json({ order: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').eq('user_id', req.userId);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ orders: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
