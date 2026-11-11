# Online Legal Consultation Platform

A starter full-stack project with:
- React + Vite frontend
- Node.js + Express backend
- MongoDB + Mongoose
- Email/password registration and login (JWT)
- Google Sign-In (requires a Google OAuth Web Client ID)
- Lawyer directory and appointment booking

## 1. Requirements
Install Node.js LTS and MongoDB (local) or create a MongoDB Atlas database.

## 2. Backend setup
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and fill in your values:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: long random secret
- `CLIENT_URL`: frontend URL, normally `http://localhost:5173`
- `GOOGLE_CLIENT_ID`: Google OAuth Web Client ID (optional until Google Sign-In is configured)

Start:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

## 3. Frontend setup
Open a second terminal:
```bash
cd frontend
npm install
```
Copy `.env.example` to `.env` and set:
- `VITE_API_URL=http://localhost:5000`
- `VITE_GOOGLE_CLIENT_ID` to the same Google OAuth Web Client ID

Start:
```bash
npm run dev
```
Open `http://localhost:5173`.

## 4. Google Sign-In setup
In Google Cloud Console, create an OAuth 2.0 Client ID of type **Web application**.
Add `http://localhost:5173` as an authorized JavaScript origin.
Put the client ID in both backend and frontend `.env` files.
For deployment, add your deployed frontend domain to the authorized origins.

If you do not configure Google, email/password login still works.

## 5. API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me` (JWT required)
- `GET /api/lawyers`
- `POST /api/lawyers` (JWT required; starter route for adding a lawyer)
- `POST /api/bookings` (JWT required)
- `GET /api/bookings/my` (JWT required)

## 6. Important
This is a learning/demo starter, not a production legal-services platform. Do not enter confidential legal documents or sensitive client information. Before real-world use, add professional legal review, stronger validation, rate limiting, email verification, privacy/security controls, and appropriate lawyer verification.
