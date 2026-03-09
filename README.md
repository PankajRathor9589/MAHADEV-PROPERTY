# Mahadev Property

Mahadev Property is a production-ready real estate platform built with React + Tailwind, Node.js + Express, MongoDB, Multer, and Google Maps integration.

It supports three user roles:
- Admin
- Seller / Dealer
- Visitor (Buyer)

## 1. Complete Folder Structure

```text
MAHADEV-PROPERTY/
  client/
    src/
      components/
        AnalyticsCards.jsx
        DashboardPropertyTable.jsx
        ImageGallerySlider.jsx
        InquiryTable.jsx
        MapPicker.jsx
        Navbar.jsx
        PropertyCard.jsx
        PropertyForm.jsx
        ProtectedRoute.jsx
        SellerManagementTable.jsx
        WhatsAppFloat.jsx
      context/
        AuthContext.jsx
      hooks/
        useGoogleMapsScript.js
      pages/
        AdminDashboardPage.jsx
        HomePage.jsx
        LoginPage.jsx
        PropertiesPage.jsx
        PropertyDetailsPage.jsx
        RegisterPage.jsx
        SellerDashboardPage.jsx
      services/
        api.js
      App.jsx
      index.css
      main.jsx
    .env.example
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js

  server/
    src/
      config/
        db.js
      controllers/
        adminController.js
        authController.js
        propertyController.js
        sellerController.js
      middleware/
        auth.js
        errorHandler.js
        upload.js
      models/
        Inquiry.js
        Property.js
        User.js
      routes/
        adminRoutes.js
        authRoutes.js
        propertyRoutes.js
        sellerRoutes.js
      index.js
    .env.example
    package.json

  uploads/
    properties/
      .gitkeep

  package.json
  render.yaml
  README.md
```

## 2. Backend API Code

Base URL: `http://localhost:5000/api`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Property APIs (required)
- `POST /api/properties` - create property with image upload
- `GET /api/properties` - get all properties (supports advanced filters)
- `GET /api/properties/:id` - get property details
- `PUT /api/properties/:id` - update property
- `DELETE /api/properties/:id` - delete property

### Additional property workflow
- `PATCH /api/properties/:id/sold` - mark property as sold
- `PATCH /api/properties/:id/approval` - admin approve/reject listing
- `POST /api/properties/:id/inquiries` - buyer sends inquiry

### Seller Dashboard APIs
- `GET /api/seller/analytics`
- `GET /api/seller/inquiries`
- `PATCH /api/seller/inquiries/:id/status`

### Admin Dashboard APIs
- `GET /api/admin/analytics`
- `GET /api/admin/sellers`
- `PATCH /api/admin/sellers/:id/status`
- `GET /api/admin/inquiries`

## 3. MongoDB Schemas

### User (`server/src/models/User.js`)
- `name`, `email`, `phone`
- `password` (hashed)
- `role` (`admin | seller | visitor`)
- `isActive`

### Property (`server/src/models/Property.js`)
- Basic: `title`, `propertyType`, `price`, `areaSqFt`
- Location: `state`, `city`, `locality`, `address`, `pincode`, `latitude`, `longitude`, `mapPinUrl`, `coordinates`
- Features: `bedrooms`, `bathrooms`, `parking`, `waterSupply`, `electricity`, `roadAccess`
- Media: `images[]`
- Description: `description`, `nearbyPlaces[]`
- Workflow: `listingStatus`, `rejectedReason`, `isSold`, `views`
- Ownership: `seller`, `approvedBy`, `approvedAt`

### Inquiry (`server/src/models/Inquiry.js`)
- `property`, `seller`
- `buyerName`, `buyerPhone`, `buyerEmail`, `message`
- `status` (`new | contacted | closed`)

## 4. Multer Image Upload Setup

Configured in `server/src/middleware/upload.js`.

- Storage path: `uploads/properties`
- Multiple image upload via `uploadPropertyImages.array("images", 12)`
- File validation: image MIME only
- Size limit via env: `MAX_FILE_SIZE_MB`

Static serving is enabled in `server/src/index.js`:

- `app.use("/uploads", express.static(...))`

## 5. React Frontend Pages

### Public Pages
- Home page with hero search bar, categories, featured and trending properties
- Property listing page with advanced filters
- Property details page with image gallery slider, map, contact actions, inquiry form

### Auth Pages
- Login
- Register (seller / visitor / admin with registration key)

### Seller Dashboard
- Add property
- Upload multiple images
- Edit property
- Delete property
- Mark property as sold
- View and update inquiry status
- Seller analytics cards

### Admin Dashboard
- View all properties
- Approve / reject listings
- Delete fake listings
- Mark as sold
- Manage sellers (activate/deactivate)
- View platform analytics
- View all inquiries

## 6. Search & Filters (Implemented)

Implemented in backend and listing page UI:
- Location (`city`, `locality`, `state`, keyword search)
- Price range (`minPrice`, `maxPrice`)
- Property type
- Area range (`minArea`, `maxArea`)
- Bedrooms (`minBedrooms` or exact)

## 7. Run Locally

### Prerequisites
- Node.js 18+
- MongoDB local or Atlas

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

3. Update `server/.env` values:
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_REGISTRATION_KEY`
- `CLIENT_URL`

4. (Optional, for map pin picker) add Google key in `client/.env`:
- `VITE_GOOGLE_MAPS_API_KEY`

5. Start full stack:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 8. Deployment Instructions

### Backend (Render)

`render.yaml` is included for backend deployment.

Manual settings:
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check: `/api/health`

Required environment variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_REGISTRATION_KEY`
- `CLIENT_URL`
- `MAX_FILE_SIZE_MB`

### Frontend (Vercel)

- Root directory: `client`
- Build command: `npm run build`
- Output: `dist`

Frontend env vars:
- `VITE_API_URL=https://<your-backend-domain>/api`
- `VITE_GOOGLE_MAPS_API_KEY=<google-maps-key>`
- `VITE_DEFAULT_CONTACT_PHONE=<seller-phone>`
- `VITE_DEFAULT_WHATSAPP=<whatsapp-number>`

## 9. Production Notes

- Use MongoDB Atlas in production with network/IP security.
- Move local uploads to cloud object storage (S3/Cloudinary) for true horizontal scaling.
- Add API rate limiting and request validation hardening.
- Add monitoring/logging (Render logs + external APM).
- Use CDN for images and caching headers for static assets.

