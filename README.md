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
