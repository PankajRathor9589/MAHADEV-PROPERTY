# Mahadev Property

Mahadev Property is a full-stack MERN real estate platform inspired by products like 99acres and MagicBricks.

It includes:

- JWT authentication with hashed passwords
- `admin` and `user` roles
- Property create, edit, delete, approve, reject, and feature flows
- Image upload with Multer
- Public property browsing with search, filters, and pagination
- Property detail pages with gallery and Google Maps embed
- Favorites / saved properties
- Inquiry system between buyer and property owner
- Responsive Tailwind CSS UI
- Admin panel for user management and listing moderation

Extra features included:

- Google Maps integration on property detail pages
- Featured property system for premium / paid listings

## Project Structure

```text
MAHADEV-PROPERTY/
  client/
    app/
      components/
      context/
      pages/
      services/
      utils/
      App.jsx
      main.jsx
      index.css
    .env.example
    index.html
    vercel.json
    package.json
    tailwind.config.js
    vite.config.js

  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      index.js
    .env.example
    package.json

  uploads/
    properties/

  package.json
  render.yaml
  README.md
```

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Axios, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer, bcryptjs
- Deployment: Vercel (frontend) + Render (backend) + MongoDB Atlas

## Main Features

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Passwords are hashed with `bcryptjs` and sessions are handled with JWT tokens.

### Property Listings

Users can:

- create listings
- upload multiple images
- edit their own listings
- view approval status (`pending`, `approved`, `rejected`)

Admins can:

- approve or reject listings
- delete any property
- mark properties as featured

### Browse and Search

The listing page supports:

- keyword search
- city filter
- state filter
- sale / rent filter
- category filter
- min / max price
- bedroom count
- sorting by latest, price, or popularity

### Favorites

Authenticated users can save approved properties and manage them from a dedicated Favorites page.

### Admin Panel

Admins can:

- view platform analytics
- review all properties
- approve / reject listings
- enable or disable users
- change user role between `user` and `admin`
- inspect all inquiries

## MongoDB Schemas

### User

File: `server/src/models/User.js`

Fields:

- `name`
- `email`
- `phone`
- `password`
- `role`
- `isActive`
- `favorites`

### Property

File: `server/src/models/Property.js`

Fields:

- `title`
- `description`
- `listingType`
- `category`
- `price`
- `bedrooms`
- `bathrooms`
- `area`
- `amenities`
- `location.city`
- `location.state`
- `location.address`
- `location.landmark`
- `location.pincode`
- `location.coordinates.lat`
- `location.coordinates.lng`
- `images`
- `contactName`
- `contactEmail`
- `contactPhone`
- `postedBy`
- `approvalStatus`
- `rejectionReason`
- `isFeatured`
- `featuredUntil`
- `views`

### Inquiry

File: `server/src/models/Inquiry.js`

Fields:

- `property`
- `owner`
- `buyer`
- `name`
- `email`
- `phone`
- `message`
- `status`

## Backend API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Properties

- `GET /api/properties`
- `GET /api/properties/mine`
- `GET /api/properties/:id`
- `POST /api/properties`
- `PUT /api/properties/:id`
- `DELETE /api/properties/:id`
- `PATCH /api/properties/:id/approval`
- `PATCH /api/properties/:id/featured`
- `POST /api/properties/:id/inquiries`

### Favorites

- `GET /api/favorites`
- `POST /api/favorites/:propertyId`
- `DELETE /api/favorites/:propertyId`

### Inquiries

- `GET /api/inquiries`
- `PATCH /api/inquiries/:id/status`

### Admin

- `GET /api/admin/analytics`
- `GET /api/admin/properties`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`

## Local Setup

### 1. Prerequisites

- Node.js 18+
- MongoDB local instance or MongoDB Atlas

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment files

```bash
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

### 4. Configure backend environment

Open `server/.env` and update:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mahadev_property
CLIENT_URL=http://localhost:5173
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
ADMIN_REGISTRATION_KEY=change_admin_key
MAX_FILE_SIZE_MB=5
```

### 5. Configure frontend environment

Open `client/.env` and update:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Start the app

```bash
npm run dev
```

URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

## Beginner-Friendly Run Order

1. Start MongoDB.
2. Run `npm install`.
3. Copy both `.env.example` files.
4. Add your MongoDB URI and JWT secret.
5. Run `npm run dev`.
6. Register a normal user account.
7. Register an admin account using `ADMIN_REGISTRATION_KEY`.
8. Log in as user to create properties.
9. Log in as admin to approve and feature those properties.

## Deployment

### Backend on Render

`render.yaml` is already included.

Recommended settings:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

Required environment variables:

- `NODE_ENV=production`
- `PORT=10000`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN=7d`
- `ADMIN_REGISTRATION_KEY`
- `CLIENT_URL=https://your-frontend-domain.vercel.app`
- `MAX_FILE_SIZE_MB=5`

### Backend or Full Stack on Railway

Railway also works well for this project.

Recommended approach:

1. Create a new Railway project.
2. Deploy the repo.
3. Set the service root to `server`.
4. Add environment variables:
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `ADMIN_REGISTRATION_KEY`
   - `CLIENT_URL`
   - `MAX_FILE_SIZE_MB`
5. Deploy the backend service.
6. Deploy the frontend separately from `client` on Vercel or Railway static hosting.
7. Set `VITE_API_URL` in the frontend to your Railway backend URL plus `/api`.

### Frontend on Vercel

The file `client/vercel.json` handles React Router rewrites.

Recommended settings:

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

Required environment variables:

- `VITE_API_URL=https://your-render-backend-domain/api`

## Production Notes

- Store uploads in Cloudinary or S3 for real production scale
- Use MongoDB Atlas instead of a local database in production
- Add rate limiting, validation, and logging if you extend this further
- Put Render backend URL into Vercel frontend env vars
- Allow the Vercel domain inside backend `CLIENT_URL`

## Verification

Verified locally in this workspace:

- Backend JavaScript syntax check passed
- Frontend production build passed with `npm run build -w client`
