# Nigerian Apartments - Airbnb-style Rental Web App

A full-stack Airbnb-like rental web application built with Next.js, specifically designed for the Nigerian market. Features apartment listings, search functionality, Google Maps integration, and user authentication.

## Features

- 🏠 Beautiful landing page with Hero, About Us, Featured Apartments, and Contact Us sections
- 🔍 Advanced search with Nigerian city/state filters
- 🗺️ Interactive Google Maps view showing apartment locations
- 📱 Responsive design for mobile, tablet, and desktop
- 🔐 User authentication with NextAuth.js
- 💰 Nigerian Naira (₦) pricing display
- 📍 Nigerian cities and states support
- 👤 User profiles with apartment listings

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Maps**: Google Maps JavaScript API
- **Styling**: Tailwind CSS
- **Font**: Poppins (Google Fonts)

## Color Scheme

- Primary Yellow: #FFD700
- Black: #000000
- White: #FFFFFF

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Maps API key

### Installation

1. Clone the repository:
```bash
cd Apartments
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/apartments_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-a-random-string"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key-here"
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/apartments
  /app
    /api              # API routes
    /apartments       # Apartment detail pages
    /map              # Map view page
    /profile          # User profile page
    /signin           # Sign in page
    /signup           # Sign up page
    page.tsx          # Landing page
    layout.tsx        # Root layout
  /components         # React components
  /lib                # Utility functions
  /prisma             # Database schema
  /types              # TypeScript type definitions
```

## Key Features Implementation

### Landing Page
- Hero section with call-to-action
- About Us section with company information
- Featured Apartments section displaying top listings
- Contact Us section with form

### Search Functionality
- Filter by Nigerian cities and states
- Price range filtering (in Naira)
- Bedroom count filtering
- Search results displayed as cards or on map

### Map View
- Google Maps integration
- Apartment markers with clickable info windows
- Toggle between map and list view

### User Authentication
- Sign up with email, password, name, and phone
- Sign in with credentials
- Protected routes
- Session management

### User Profiles
- View and edit profile information
- Display user's apartment listings
- Nigerian phone number format support

## Database Schema

### User Model
- id, email, password (hashed), name, phone, image, timestamps

### Apartment Model
- id, title, description, price (Naira), address, city, state, coordinates, images, bedrooms, bathrooms, amenities, ownerId, timestamps

## API Routes

- `POST /api/auth/signup` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints
- `GET /api/apartments` - List apartments with filters
- `POST /api/apartments` - Create new apartment (authenticated)
- `GET /api/apartments/[id]` - Get apartment details
- `GET /api/users` - Get current user profile
- `PATCH /api/users` - Update user profile

## Environment Variables

Make sure to set up all required environment variables in your `.env` file:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Secret key for NextAuth (generate a random string)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key

## Building for Production

```bash
npm run build
npm start
```

## License

This project is open source and available under the MIT License.

