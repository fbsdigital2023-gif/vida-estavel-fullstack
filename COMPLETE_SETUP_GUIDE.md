# COMPLETE SETUP GUIDE - Vida Estavel Fullstack Application

## Quick Start (5 minutes)

### 1. Clone and Setup Backend

```bash
# Create backend .env file
cd backend
cat > .env << 'EOF'
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_this
SUPABASE_URL=https://jlajqjjnsfhyanhhyart.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
CORS_ORIGIN=http://localhost:3000
EOF

# Install dependencies
npm install

# Start server
npm start
```

### 2. Create Frontend .env

```bash
cd ../frontend
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

# Install and run
npm install
npm run dev
```

## Database Setup (Supabase)

### Create these tables in Supabase SQL Editor:

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT now()
);

-- Products Table  
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Cart Items Table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT now()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  total_price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);
```

## Production Deployment

### Backend Deployment (Render.com)

1. Push code to GitHub
2. Go to render.com and create new Web Service
3. Connect GitHub repository
4. Set Build Command: `cd backend && npm install`
5. Set Start Command: `cd backend && npm start`
6. Add Environment Variables from .env
7. Deploy!

### Frontend Deployment (Vercel)

1. Go to vercel.com
2. Import GitHub repository  
3. Set Root Directory to `frontend`
4. Add VITE_API_URL environment variable with your Render backend URL
5. Deploy!

## API Documentation

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/users/me` - Get current user

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart & Orders
- `POST /api/cart/add` - Add to cart
- `GET /api/cart` - Get cart items
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

## Key Features Implemented

✅ JWT Authentication
✅ User Registration & Login
✅ Product CRUD Operations
✅ Shopping Cart System
✅ Order Management
✅ CORS Security
✅ Error Handling
✅ Input Validation
✅ Supabase Integration
✅ Production Ready

## Troubleshooting

### Backend won't start
- Check PORT is not in use
- Verify .env file has all variables
- Run `npm install` again

### Frontend connection error
- Check VITE_API_URL is correct
- Ensure backend is running
- Check CORS settings

### Database errors
- Verify Supabase credentials
- Check table names match queries
- Ensure RLS policies allow access

## Next Steps

1. Replace JWT_SECRET with secure random key
2. Update Supabase credentials
3. Test all API endpoints
4. Deploy to Render and Vercel
5. Monitor logs for errors

## Support

For issues or questions, check:
- Supabase Documentation: https://supabase.com/docs
- Express.js Docs: https://expressjs.com
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

---

**Application Status**: Ready for Production
**Last Updated**: 2024
**Version**: 1.0.0
