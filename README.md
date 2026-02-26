<<<<<<< HEAD
# Mahadev Property - Production-Ready Full Stack App

Modern responsive property dealer platform for village/city real estate business.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Maps: Google Maps (embed + directions)
- Deployment: Frontend on Vercel, Backend on Render

## Project Structure
```text
MAHADEV-PROPERTY/
  backend/
    src/
      config/db.js
      controllers/
      middleware/
      models/
      routes/
      seed/seed.js
      server.js
    uploads/
    package.json
    .env.example
  frontend/
    src/
      api/
      components/
      context/
      hooks/
      i18n/
      pages/
      styles/
      App.jsx
      main.jsx
    package.json
    .env.example
    vercel.json
  render.yaml
  package.json
```

## Features Implemented
- Property listing system with complete fields (title, price, type, area, BHK, status, highlights, nearby, gallery, video, floor-plan)
- Location details (city, locality, pincode, address, lat/lng, map, directions)
- Dealer profile card with verified badge, rating, contact actions
- Contact and lead flows (inquiry, callback, site visit with date)
- Search and filters (location, type, status, price, area/BHK, nearby)
- User auth (signup/login/JWT)
- Favorites, recently viewed, compare properties
- Reviews with rating/comment/helpful + property report workflow
- Admin dashboard:
  - Add/edit/delete/mark sold properties
  - Upload property images
  - Manage inquiries and site visits
  - Manage reports and reviews
  - View analytics (views/leads/totals)
- Responsive mobile-first UI with sticky WhatsApp button
- Hindi toggle support
- SEO basics with dynamic page metadata
- Lazy loaded images for low bandwidth users

## Environment Variables

### Backend (`backend/.env`)
Use `backend/.env.example` as template:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GOOGLE_MAPS_API_KEY=your_google_maps_key
UPLOAD_DIR=uploads
```

### Frontend (`frontend/.env`)
Use `frontend/.env.example` as template:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_DEFAULT_WHATSAPP=919876543210
```

## Install Dependencies
Run from repository root:
```bash
npm run install:all
```

Alternative manual install:
```bash
cd backend && npm install
cd ../frontend && npm install
```

## Run Locally
Open two terminals:
```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Seed Sample Data
```bash
npm run seed
```
Seed creates:
- Admin user: `admin@mahadevproperty.com`
- Password: `Admin@123`
- Multiple sample properties

## API Summary
- Auth: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`
- Properties: `/api/properties`
- Reviews: `/api/reviews/:propertyId`
- Inquiries: `/api/inquiries`
- Reports: `/api/reports`
- User collections: `/api/users/collections`
- Admin stats: `/api/admin/stats`
- Upload images: `/api/upload/images`

## Deploy to Render (Backend)
1. Push repository to GitHub.
2. In Render, create new Blueprint using `render.yaml` OR create Web Service manually:
   - Root directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
3. Set env vars from `backend/.env.example`.
4. Update `CLIENT_URL` to deployed Vercel domain.

## Deploy to Vercel (Frontend)
1. Import repo in Vercel.
2. Configure project root directory as `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env vars from `frontend/.env.example`
   - Set `VITE_API_BASE_URL` to your Render backend URL (`https://your-api.onrender.com/api`)
6. Deploy.

## Production Notes
- Store secrets in Render/Vercel env settings only.
- Use MongoDB Atlas IP/network access for Render.
- Keep upload size limits controlled (current: 5MB/image).
- Configure CDN/image optimization in production as needed.
=======
# Mahadev Property - Production Ready Real Estate Platform

A full-stack property dealer web app for village and city real estate business.

## Tech Stack
- Frontend: React + Tailwind CSS (Vite)
- Backend: Node.js + Express
- Database: MongoDB Atlas (Mongoose)
- Maps: Google Maps embed/API ready
- Deploy: Frontend on Vercel, Backend on Render

## Project Structure
```bash
.
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   └── services
│   └── .env.example
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   └── seeds
│   └── .env.example
└── package.json
```

## Features Included
- Property listing with full details, images, status, floor-plan, nearby places.
- Filter/search by location, price, type, BHK, status.
- Property details page with map + directions-ready coordinates.
- Dealer profile with verified badge, call and WhatsApp.
- Lead forms: inquiry, callback, site visit date picker.
- User auth API (signup/login).
- Favorite-ready and recently viewed behavior (frontend state).
- Compare properties page.
- Review/report APIs.
- Admin dashboard view and protected admin CRUD APIs.
- SEO tags, responsive mobile-first UI, lazy-loaded listing images.

## Install & Run Locally
1. Install dependencies:
```bash
npm run install:all
```
2. Create env files:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```
3. Update `server/.env` with MongoDB Atlas URI + JWT secret.
4. Seed sample data:
```bash
npm run seed
```
5. Run full stack in dev:
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints (Core)
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/properties`
- `GET /api/properties/:id`
- `POST /api/properties` (admin)
- `PATCH /api/properties/:id` (admin)
- `DELETE /api/properties/:id` (admin)
- `POST /api/leads/inquiry`
- `POST /api/leads/callback`
- `POST /api/leads/site-visit`
- `GET /api/leads` (admin)
- `GET /api/reviews/:propertyId`
- `POST /api/reviews`
- `PATCH /api/reviews/:id/helpful`
- `POST /api/reviews/report`

## Production Deployment
### Frontend (Vercel)
1. Import `client` directory as project.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Env: `VITE_API_URL=https://<render-backend-url>/api`

### Backend (Render)
1. Create Web Service from `server` directory.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add env variables from `server/.env.example`.
5. Allow CORS to frontend domain.

## Low-Internet Optimization Notes
- Compressed external image URLs and lazy loading on cards.
- Lightweight single-page navigation.
- Touch-friendly action buttons and WhatsApp-first conversion flow.
>>>>>>> cd4b46f7c61d4c749443ee52e216c4a57340f7f4
