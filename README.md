# E-Commerce-project
# 🛒 MERN Marketplace – Microservices Architecture

A scalable **E-commerce Marketplace** built using **MERN Stack + Microservices**, featuring secure authentication, real-time communication, payment integration, and an AI-powered shopping assistant.

---

## 🚀 Features

### 👤 Authentication & User Management
- JWT-based authentication (Access + Refresh Tokens)
- Google OAuth (Passport.js)
- Secure httpOnly cookies
- Role-based access control (User / Seller / Admin)

---

### 🛍️ Product Management
- Create, update, delete products (Seller)
- Product search & filtering
- Category & price-based filtering
- Pagination & sorting

---

### 🛒 Cart System
- Add / remove products
- Update quantity
- Auto price recalculation
- Stock validation

---

### 📦 Order Management
- Create orders from cart
- Order status tracking:
  - Pending
  - Confirmed
  - Shipped
  - Delivered
  - Cancelled
- Address management

---

### 💳 Payment Integration
- Razorpay integration
- Order creation via backend
- Payment verification (signature-based)
- Payment status tracking

---

### 🔔 Notification System
- Event-driven notifications
- Email / SMS / Push (extendable)
- Tracks delivery status

---

### 🤖 AI Shopping Assistant (Unique Feature)
- Natural language queries
- Example:
  > "Find me red sneakers under ₹2000"
- Converts user input → product search
- Can assist in cart creation

---

### ⚡ Microservices Architecture
Each service is independently managed:

- Auth Service
- Product Service
- Cart Service
- Order Service
- Payment Service
- Notification Service
- AI Buddy Service
- Seller Dashboard Service

---

## 🧱 Tech Stack

### 💻 Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

### 🌐 Frontend
- React (Vite)
- RTK Query

### ⚙️ Tools & Services
- Redis (Caching & Rate Limiting)
- RabbitMQ (Event-driven communication)
- Razorpay (Payments)
- Passport.js (Google Auth)

### ☁️ Deployment
- AWS ECR
- ECS Fargate
- Application Load Balancer (ALB)

---

## 🔐 Security Features

- Helmet (secure headers)
- CORS configuration
- CSRF protection (double-submit cookie)
- XSS sanitization
- Rate limiting (Redis)
- JWT authentication

---

## 📊 System Design (High-Level)

- Microservices communicate using **RabbitMQ**
- Each service owns its own database logic
- API Gateway (via ALB routing)
- Event-driven architecture

---

## 📁 Entities (Database Models)

- User
- Product
- Cart
- Order
- Payment
- Notification

---

## 🔄 API Overview

### Auth Service
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Product Service
- `GET /products`
- `POST /products`
- `PATCH /products/:id`

### Cart Service
- `GET /cart`
- `POST /cart/items`

### Order Service
- `POST /orders`
- `GET /orders/me`

### Payment Service
- `POST /payments/razorpay/order`
- `POST /payments/verify`

---

## 🛠️ Installation & Setup

```bash
# Clone repo
git clone https://github.com/rakhi890rs/E-Commerce-project.git
# Install dependencies
npm install

# Run backend
npm run dev

# Run frontend
cd client
npm run dev
