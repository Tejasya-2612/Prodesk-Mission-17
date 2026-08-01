# Prodesk Mission 17

Prodesk is a MERN task and workspace dashboard with authentication, task CRUD, projects, boards, reports, files, calendar data, team tools, Stripe checkout, and dashboard analytics.

## Tech Stack

Frontend: React 19, Vite, React Router, Axios, Recharts, plain CSS

Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs, Stripe, dotenv, cors

## Deployment:

Frontend Link: https://prodesk-mission-17.vercel.app/

Backend Link: https://prodesk-mission-17.onrender.com/

## Installation

Install frontend and backend dependencies separately.

```bash
cd server
npm install

cd ../client
npm install
```

## Backend Setup

```bash
cd server
cp .env.example .env
npm run dev
```

Required backend environment variables:

```env
PORT=
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
GEMINI_API_KEY=
```

Use `npm start` on Render. The start script runs `node server.js`.

## Frontend Setup

```bash
cd client
cp .env.example .env
npm run dev
```

Required frontend environment variable:

```env
VITE_API_URL=
```

Set `VITE_API_URL` to your deployed Render backend origin. Do not add `/api` at the end because the app adds it in `src/services/api.js`.

## Environment Variables

Keep real secrets only in `.env` files or hosting provider dashboards. The `.env.example` files are only templates and should not contain secret values.

## Render Deployment

1. Create a new Web Service from the backend folder.
2. Set the root directory to `server`.
3. Set build command to `npm install`.
4. Set start command to `npm start`.
5. Add all backend environment variables in Render.
6. Set `CLIENT_URL` to the final Vercel frontend URL.

## Vercel Deployment

1. Import the project in Vercel.
2. Set the root directory to `client`.
3. Set build command to `npm run build`.
4. Set output directory to `dist`.
5. Add `VITE_API_URL` with the Render backend URL.
6. The included `client/vercel.json` rewrites React Router pages to `index.html`.

## MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow Render access in Network Access.
4. Copy the connection string into `MONGODB_URI`.
5. Restart the Render service after saving the variable.

## Demo Instructions

1. Register a new account.
2. Log in.
3. Create a project.
4. Create, update, move, and delete tasks.
5. Open dashboard, boards, calendar, team, files, reports, and search pages.
6. Test Stripe checkout only with configured Stripe test keys.
