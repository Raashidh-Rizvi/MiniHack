# Frontend Setup & Run Guide

Welcome to the **GramaFix Frontend**! This project is built using React, TypeScript, Vite, and Tailwind CSS.

Follow these simple steps to install dependencies, configure the environment, and run the frontend on your local machine.

---

## 📦 1. Prerequisites

Before you begin, make sure you have the following installed on your computer:
- **Node.js** (Version 18 or higher is recommended)
- **Git**

You can check if Node.js is installed by opening your terminal and typing:
```bash
node -v
npm -v
```

---

## 🛠️ 2. Installation

**Step 1:** Open your terminal and navigate to the `client` folder.
```bash
cd client
```

**Step 2:** Install all the required dependencies. This command will read the `package.json` file and download everything needed.
```bash
npm install
```

---

## ⚙️ 3. Environment Setup

The frontend needs to know where the backend API is running.

**Step 1:** Inside the `client` folder, create a new file named `.env`.
**Step 2:** Add the following line to the `.env` file (adjust the port if your backend runs on a different one):

```env
VITE_API_URL=http://localhost:5000/api
```

*(Note: Vite requires environment variables to start with `VITE_` so they can be exposed to the browser.)*

---

## 🚀 4. Running the Development Server

To start the frontend in development mode, run:
```bash
npm run dev
```

You should see output similar to this:
```text
  VITE v6.4.3  ready in 939 ms

  ➜  Local:   http://localhost:5173/
```

**Step 1:** Hold `Ctrl` (or `Cmd` on Mac) and click the `http://localhost:5173/` link in your terminal, or open your web browser and type it in.

---

## 🏗️ 5. Building for Production

When you are ready to deploy your application to the internet (like on Vercel, Netlify, or Render), you need to create an optimized production build.

Run this command inside the `client` folder:
```bash
npm run build
```

This will create a `dist/` folder containing your minified and optimized frontend ready for deployment.

---

## 🐞 Troubleshooting

* **"npm is not recognized as an internal or external command"**
  * **Fix:** Node.js is not installed correctly or not added to your system's PATH. Download and reinstall Node.js from the official website.
* **Changes in the code are not showing up in the browser?**
  * **Fix:** Make sure you saved your files. If it still doesn't update, stop the server (press `Ctrl + C` in the terminal) and run `npm run dev` again.
* **API calls are failing or showing Network Errors?**
  * **Fix:** Check that your backend server is actually running. Also, verify that your `.env` file exists in the `client` folder and the `VITE_API_URL` is correct.
