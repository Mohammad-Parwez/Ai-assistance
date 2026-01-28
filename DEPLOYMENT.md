# Deployment Guide for Fly Your Tech

This guide will walk you through deploying your full-stack application (React frontend and Express backend).

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for the database).
3.  Accounts on [Render](https://render.com/) (for backend) and [Vercel](https://vercel.com/) (for frontend).

---

## Phase 1: Prepare Your Code

1.  **Environment Variables**: Ensure you have all necessary environment variables in your backend `.env` file and frontend.
2.  **Git**: Initialize a git repository and push your code to GitHub.
    ```bash
    git init
    git add .
    git commit -m "Initialize project"
    git branch -M main
    git remote add origin <your-repo-url>
    git push -u origin main
    ```

---

## Phase 2: Deploy Backend (Render)

1.  Log in to [Render](https://render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository and select the repository.
4.  Configure the service:
    *   **Name**: `fly-tech-backend`
    *   **Root Directory**: `backend`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5.  Add **Environment Variables**:
    *   `PORT`: `5000`
    *   `GOOGLE_API_KEY`: Your Gemini API Key.
    *   `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/fly-tech`).
6.  Click **Create Web Service**.
7.  Once deployed, copy the URL (e.g., `https://fly-tech-backend.onrender.com`).

---

## Phase 3: Deploy Frontend (Vercel)

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** and select **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: `frontend`
5.  Add **Environment Variables**:
    *   `VITE_API_URL`: Use your Render backend URL followed by `/api` (e.g., `https://fly-tech-backend.onrender.com/api`).
6.  Click **Deploy**.

---

## Phase 4: Final Steps

1.  **Update CORS**: If you encounter CORS issues, make sure your backend `index.js` allows the frontend URL.
    ```javascript
    app.use(cors({
        origin: 'https://your-frontend.vercel.app'
    }));
    ```
2.  **Database Access**: In MongoDB Atlas, ensure you've added `0.0.0.0/0` to your IP Access List (for testing) or add Render's IP addresses.

Congratulations! Your app should now be live.
