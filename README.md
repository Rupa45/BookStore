# Bookstore — Full Stack MERN App

A full-stack bookstore web application built with the MERN stack (MongoDB, Express, React, Node.js).

**Developed by Rupa Maurya**

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Redux Toolkit, Firebase Auth
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Deployment**: Vercel (frontend & backend)

---

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` folder:

```
VITE_API_KEY=your_firebase_api_key
VITE_Auth_Domain=your_firebase_auth_domain
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDERID=your_firebase_messaging_sender_id
VITE_APPID=your_firebase_app_id
```

Then run:

```bash
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```
DB_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

> After deploying the frontend to Vercel, update `FRONTEND_URL` with your live Vercel URL.

Then run:

```bash
npm run start:dev
```

---

## Deployment

Both frontend and backend are configured for Vercel deployment via `vercel.json` files.

After deploying:
1. Set `FRONTEND_URL` in your backend Vercel environment variables to your frontend's Vercel URL.
2. Set all `VITE_*` variables in your frontend Vercel environment variables.
3. Set `DB_URL` and `JWT_SECRET_KEY` in your backend Vercel environment variables.
