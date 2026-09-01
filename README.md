# Online Blood Donation Management - Frontend

This is the frontend application for the Online Blood Donation Management System. It is built using **React** and **Vite** for a fast and modern development experience.

## 🚀 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and development server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for making API requests
- **Lucide React** - Beautiful and consistent icons
- **Vanilla CSS** - Styling

## 📋 Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/en/) (v16 or higher recommended)
- npm or yarn

## 🛠️ Installation & Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` file to `.env` (or create a new `.env` file) and specify your backend API URL.
   ```bash
   cp .env.example .env
   ```
   *Inside `.env`:*
   ```env
   # Set your deployed or local backend URL here
   ENDPOINT=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will start, typically accessible at `http://localhost:5173`.

## 📜 Available Scripts

- `npm run dev` - Starts the development server with hot-module replacement (HMR).
- `npm run build` - Builds the application for production into the `dist` directory.
- `npm run preview` - Locally previews the production build.

## 🗂️ Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Main application views (screens)
- `/src/context` - React Context providers (e.g., Authentication state)
- `/src/services` - API communication layer (Axios configurations)
- `/public` - Static assets

## 🔗 API Integration

All backend communication is centralized in `src/services/api.js`. The application dynamically reads the backend base URL from the `.env` file (supporting `ENDPOINT`, `VITE_API_URL`, etc.). Ensure your backend has properly configured CORS to allow requests from the frontend domain.
