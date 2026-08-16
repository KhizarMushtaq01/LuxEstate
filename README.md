# LuxEstate Realty Group — Full-Stack Real Estate Website

A professional, production-ready real estate website built with React + Vite (frontend) and Express + MongoDB (backend).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Fonts | Playfair Display, DM Sans (Google Fonts) |

---

## Project Structure

```
realestate/
├── backend/
│   ├── config/db.js           MongoDB connection
│   ├── controllers/           Route handlers
│   │   ├── authController.js  Login, register, profile
│   │   ├── propertyController.js  CRUD + search
│   │   ├── appointmentController.js  Showings
│   │   └── dataController.js  Leads, reviews, blogs, neighborhoods, admin
│   ├── middleware/auth.js      JWT + role authorization
│   ├── models/                Mongoose schemas
│   │   ├── User.js            Client / Agent / Admin
│   │   ├── Property.js        Full MLS property model
│   │   ├── Appointment.js     Showing scheduler
│   │   └── Other.js           Review, Lead, Blog, Neighborhood
│   ├── routes/index.js        All 40+ API endpoints
│   ├── seed.js                Demo data seeder
│   ├── server.js              Express app entry
│   └── .env                   Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/        Navbar, Footer, Layout
    │   │   ├── property/      PropertyCard, PropertySearch
    │   │   └── ui/            Spinner, Modal, Pagination, etc.
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── PropertiesPage.jsx
    │   │   ├── PropertyDetailPage.jsx
    │   │   ├── LoginPage.jsx / RegisterPage.jsx
    │   │   ├── AboutPage.jsx, AgentsPage.jsx, ContactPage.jsx
    │   │   ├── BlogPage.jsx, BlogDetailPage.jsx
    │   │   ├── NeighborhoodsPage.jsx, NeighborhoodDetailPage.jsx
    │   │   ├── MortgageCalculatorPage.jsx
    │   │   ├── HomeValuationPage.jsx
    │   │   ├── BuyersGuidePage.jsx, SellersGuidePage.jsx
    │   │   ├── FAQPage.jsx, SoldPage.jsx
    │   │   ├── RelocationPage.jsx, VendorsPage.jsx, CareersPage.jsx
    │   │   ├── admin/         Admin dashboard (8 pages)
    │   │   ├── agent/         Agent dashboard (6 pages)
    │   │   ├── client/        Client dashboard (4 pages)
    │   │   └── legal/         Privacy, Terms, Accessibility, DMCA
    │   ├── services/api.js    Axios API client
    │   ├── store/authStore.js Zustand auth state
    │   └── utils/helpers.js   Formatters, calculators
    └── tailwind.config.js     Custom gold/navy theme
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Edit .env:
# MONGODB_URI=mongodb://localhost:27017/luxestate
# JWT_SECRET=your_secret_here
# PORT=5000
# CLIENT_URL=http://localhost:5173

# Seed demo data
npm run seed

# Start server
npm start
# → Running on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Create .env:
# VITE_API_URL=http://localhost:5000/api

npm run dev
# → Running on http://localhost:5173
```

---

## Demo Accounts

Seeded demo users are created by `backend/seed.js` (run `npm run seed`).
See that file for the accounts and their credentials.

---

## All Pages & Routes

### Public Routes
| Route | Page |
|-------|------|
| `/` | Home (hero, featured listings, stats, testimonials) |
| `/properties` | Search results (grid/list view, advanced filters) |
| `/properties/:id` | Property detail (photos, tour, schedule showing, mortgage calc) |
| `/agents` | All agents gallery |
| `/agents/:id` | Agent profile + listings |
| `/about` | Company history, mission, team |
| `/contact` | Contact form + office info |
| `/blog` | Market reports & news |
| `/blog/:slug` | Blog post detail |
| `/neighborhoods` | Community guides gallery |
| `/neighborhoods/:slug` | Neighborhood detail + stats |
| `/mortgage-calculator` | Full mortgage + tax + insurance estimator |
| `/home-valuation` | CMA request form |
| `/buyers-guide` | 8-step buyer process |
| `/sellers-guide` | Seller strategy guide |
| `/faq` | Accordion FAQ |
| `/sold` | Recently sold properties |
| `/relocation` | Moving to Tucson guide |
| `/vendors` | Preferred vendors list |
| `/careers` | Join our team + application form |
| `/privacy-policy` | GDPR/CCPA compliant |
| `/terms` | MLS/IDX disclaimer + ToS |
| `/accessibility` | WCAG 2.1 AA statement |
| `/dmca` | Copyright takedown procedure |

### Admin Dashboard (`/admin/*`)
| Route | Page |
|-------|------|
| `/admin` | Stats, recent leads & appointments |
| `/admin/properties` | All listings management |
| `/admin/users` | User management + role changes |
| `/admin/appointments` | All showings management |
| `/admin/leads` | Lead pipeline |
| `/admin/blogs` | Blog post management |
| `/admin/neighborhoods` | Community management |
| `/admin/settings` | Site settings |

### Agent Dashboard (`/agent/*`)
| Route | Page |
|-------|------|
| `/agent` | Stats, upcoming showings, recent leads |
| `/agent/properties` | My listings table |
| `/agent/properties/new` | Full listing creation form |
| `/agent/properties/:id/edit` | Edit existing listing |
| `/agent/appointments` | Confirm/cancel showings |
| `/agent/leads` | Lead management |
| `/agent/profile` | Agent profile editor |

### Client Dashboard (`/client/*`)
| Route | Page |
|-------|------|
| `/client` | Overview + upcoming showings |
| `/client/saved` | Saved/favorited properties |
| `/client/appointments` | My showings history |
| `/client/profile` | Profile editor |

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in, receive JWT
- `GET /api/auth/me` — Get current user (protected)
- `PUT /api/auth/profile` — Update profile (protected)
- `PUT /api/auth/password` — Change password (protected)
- `PUT /api/auth/save/:propertyId` — Toggle saved property (protected)

### Properties
- `GET /api/properties` — Search with filters: city, zip, mlsId, minPrice, maxPrice, beds, baths, type, listingType, minSqft, maxSqft, status, featured, sort, page, limit
- `GET /api/properties/featured` — Featured active listings
- `GET /api/properties/sold` — Recently sold
- `GET /api/properties/stats` — Market stats
- `GET /api/properties/agent/:agentId` — By agent
- `GET /api/properties/:id` — Single listing (increments view count)
- `POST /api/properties` — Create (agent/admin)
- `PUT /api/properties/:id` — Update (owner/admin)
- `DELETE /api/properties/:id` — Delete (owner/admin)

### Appointments
- `POST /api/appointments` — Book showing (protected)
- `GET /api/appointments` — My appointments (role-aware)
- `PUT /api/appointments/:id` — Update status
- `DELETE /api/appointments/:id` — Cancel
- `GET /api/appointments/slots?agentId=&date=` — Available time slots

### Other
- `POST /api/leads` — Submit inquiry (public)
- `GET /api/leads` — View leads (agent/admin)
- `GET /api/reviews` — Approved reviews (public)
- `POST /api/reviews` — Submit review (protected)
- `GET /api/blogs` — Published posts (public)
- `GET /api/blogs/:slug` — Single post (public)
- `GET /api/neighborhoods` — All communities
- `GET /api/agents` — All agents
- `GET /api/admin/dashboard` — Admin stats (admin only)
- `GET /api/admin/users` — All users (admin only)

---

## Legal Compliance (USA)

✅ Equal Housing Opportunity logo + statement in footer  
✅ WCAG 2.1 AA accessibility statement  
✅ Privacy Policy with GDPR/CCPA disclosures  
✅ Terms of Use with MLS/IDX data disclaimer  
✅ DMCA notice and takedown procedure  
✅ Property data accuracy disclaimer  
✅ DRE license number in footer  

---

## Production Deployment

### Backend (e.g., Railway, Render, Heroku)
1. Set environment variables
2. Use MongoDB Atlas for database
3. `npm start`

### Frontend (e.g., Vercel, Netlify)
1. Set `VITE_API_URL=https://your-backend-url.com/api`
2. `npm run build` → deploy `dist/` folder
3. Configure SPA redirects (all routes → `index.html`)

