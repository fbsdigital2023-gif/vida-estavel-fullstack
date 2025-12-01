# Vida Estavel - Complete Fullstack Health Tracking Application

A production-ready fullstack web application for health and metabolic tracking.

## Features
- User Authentication with JWT
- Real-time Dashboard
- Product Management (CRUD)
- Shopping Cart & Checkout
- Order Management
- Responsive Design
- PostgreSQL Database with Supabase

## Tech Stack
- Backend: Node.js, Express.js, JWT
- Frontend: React 18+, Vite
- Database: Supabase (PostgreSQL)

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/products
- GET /api/products/:id
- POST /api/cart/add
- GET /api/cart
- POST /api/orders
- GET /api/orders
- GET /api/users/me

## Environment Variables

### Backend (.env)
PORT=5000
NODE_ENV=production
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
CORS_ORIGIN=http://localhost:3000

### Frontend (.env)
VITE_API_URL=http://localhost:5000/api

## License
MIT

## Support
For issues, create a GitHub issue.
