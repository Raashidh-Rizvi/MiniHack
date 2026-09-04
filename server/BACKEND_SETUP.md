# GramaFix — Backend Setup Guide

> This is the complete guide to install, configure, and run the GramaFix backend server.
> Follow every step from top to bottom. It is written in very simple English.

---

## 📁 Backend Folder Location

All backend code lives inside the `server/` folder:

```
MiniHack/
├── client/        ← Frontend (React)
└── server/        ← Backend (Express + MongoDB) ← YOU ARE HERE
    ├── config/
    ├── controllers/
    ├── middleware/
    │   ├── authMiddleware.js    ← JWT authentication
    │   └── errorHandler.js
    ├── models/
    ├── routes/
    │   ├── authRoutes.js
    │   ├── officerRoutes.js
    │   ├── adminRoutes.js
    │   └── issueRoutes.js
    ├── utils/
    ├── server.js               ← Main entry point
    ├── package.json            ← Dependency list
    ├── .env.example            ← Secret keys template
    └── requirements.txt        ← Human-readable package list
```

---

## Step 1 — Open the Backend Folder in Your Terminal

First, go into the `server` folder. Open your terminal (PowerShell on Windows) and type:

```powershell
cd "c:\Users\Dell\Desktop\SLIIT_3rd_Year_1 SEM\SE Frame Works\Mini_Hackathon\MiniHack\server"
```

✅ You are now inside the backend folder.

---

## Step 2 — Install All Backend Packages

This command reads `package.json` and downloads all required packages into the `node_modules/` folder:

```powershell
npm install
```

This installs these packages:

| Package | What it does |
|---|---|
| `express` | Creates the web server and API routes |
| `mongoose` | Connects to and talks to MongoDB database |
| `dotenv` | Reads secret keys from the `.env` file |
| `cors` | Allows the frontend (React) to talk to the backend |
| `morgan` | Logs every API request in the terminal |
| `jsonwebtoken` | Creates and verifies login tokens (JWT) |
| `nodemon` | (Dev only) Auto-restarts server when you edit files |

Wait for it to finish. You will see: `added X packages`. ✅

---

## Step 3 — Create the `.env` Secret Keys File

Your backend needs secret passwords and database links. These are kept safe in a `.env` file.

### Step 3.1 — Copy the example file

In your terminal, run:

```powershell
copy .env.example .env
```

This creates a new file called `.env` in the `server/` folder.

### Step 3.2 — Open and fill in the `.env` file

Open `server/.env` in your code editor and fill in the values:

```env
PORT=5000
NODE_ENV=development

# Your MongoDB connection string from MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@clustergramafiz.mt9mcof.mongodb.net/gramafix?retryWrites=true&w=majority&appName=ClusterGramaFiz
MONGODB_URI=mongodb+srv://<username>:<password>@clustergramafiz.mt9mcof.mongodb.net/gramafix?retryWrites=true&w=majority&appName=ClusterGramaFiz

# A secret password used to sign login tokens — make it long and random
JWT_SECRET=gramafix_super_secret_key_change_this_in_production
```

> **Important:** Replace `<username>` and `<password>` with your real MongoDB Atlas credentials.
> The `JWT_SECRET` can be any long text — just make sure it is the same every time you start the server.

---

## Step 4 — Start the Backend Server

### For Development (recommended — auto-restarts when you change code):

```powershell
npm run dev
```

### For Production (no auto-restart):

```powershell
npm start
```

### ✅ You should see this output in the terminal:

```
🚀 GramaFix Server listening on port 5000
📡 Health Check: http://localhost:5000/api/health
📝 Citizen Intake API: http://localhost:5000/api/issues
🔐 Admin Priority Engine API: http://localhost:5000/api/admin/queue
👷 Officer Portal API: http://localhost:5000/api/officer/queue
✅ MongoDB Connected: clustergramafiz.mt9mcof.mongodb.net
```

If you see `Running in memory-store mode` — that means MongoDB is not connected. The server still works but uses temporary in-memory data.

---

## Step 5 — Verify the Server is Running

Open your browser and go to:

```
http://localhost:5000/api/health
```

You should see:

```json
{
  "status": "online",
  "product": "GramaFix REST API",
  "version": "1.0.0",
  "timestamp": "2026-09-04T..."
}
```

If you see this — the backend is working perfectly! ✅

---

## Step 6 — (Optional) Seed the Database with Test Data

If your MongoDB is connected and you want some test issues/users in the database:

```powershell
node seedDatabase.js
```

This will add sample issues and user accounts so the dashboard is not empty during the demo.

---

## 📡 All Available API Routes

| Method | Route | Who can use it | What it does |
|---|---|---|---|
| `POST` | `/api/auth/login` | Anyone | Log in and get a JWT token |
| `POST` | `/api/auth/register` | Anyone | Register a new account |
| `GET` | `/api/issues` | Anyone | Get all public issues |
| `POST` | `/api/issues` | Citizen | Submit a new issue |
| `GET` | `/api/officer/stats` | Officer (JWT) | Get this officer's dashboard stats |
| `GET` | `/api/officer/queue` | Officer (JWT) | Get issues assigned to this officer |
| `PUT` | `/api/officer/issues/:id/status` | Officer (JWT) | Update an issue's status + field notes |
| `GET` | `/api/officer/list` | Admin (JWT) | Get all officers (for reassignment UI) |
| `GET` | `/api/admin/queue` | Admin (JWT) | Get all issues for admin dashboard |
| `GET` | `/api/health` | Anyone | Check if the server is running |

---

## 🔐 How Authentication Works (Simple Explanation)

```
1. Officer goes to /login and enters email + password
2. Backend checks the credentials and creates a TOKEN (like a digital ID card)
3. The token is saved on the officer's browser (in localStorage)
4. Every time the officer calls the API, the token is sent automatically
5. The backend reads the token, confirms who the officer is, and returns their data
6. If no token → 401 (Not Authorized)
7. If wrong role (e.g. citizen tries to use officer route) → 403 (Forbidden)
```

---

## ❌ Common Errors and How to Fix Them

| Error Message | What it means | How to fix it |
|---|---|---|
| `npm : The term 'npm' is not recognized` | Node.js is not installed | Download Node.js from [nodejs.org](https://nodejs.org) |
| `EADDRINUSE: address already in use :::5000` | Port 5000 is busy | Run `npm run dev` (it auto-kills the process) or restart your computer |
| `MongoServerError: bad auth` | Wrong MongoDB username/password | Fix `MONGO_URI` in your `.env` file |
| `Token is invalid or has expired` | JWT token is wrong or expired | Log out and log in again to get a fresh token |
| `Cannot find module 'jsonwebtoken'` | Package not installed | Run `npm install` again inside the `server/` folder |
| `Not authorized. Please log in first.` | No token sent | Make sure the frontend is sending `Authorization: Bearer <token>` |

---

## 🔄 How to Update Packages in the Future

| Action | Command |
|---|---|
| Add a new package | `npm install <package-name>` |
| Remove a package | `npm uninstall <package-name>` |
| Check for security issues | `npm audit` |
| Fix security issues automatically | `npm audit fix` |

---

## 🗂️ Summary — Quick Start in 3 Commands

Every time you want to start the backend from scratch:

```powershell
# Step 1: Go to the backend folder
cd "c:\Users\Dell\Desktop\SLIIT_3rd_Year_1 SEM\SE Frame Works\Mini_Hackathon\MiniHack\server"

# Step 2: Install packages (only needed the first time or after git pull)
npm install

# Step 3: Start the server
npm run dev
```

That is it! The backend is now running on `http://localhost:5000` 🚀
