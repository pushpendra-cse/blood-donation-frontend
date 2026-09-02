import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import FindBlood from './pages/public/FindBlood';
import BecomeDonor from './pages/public/BecomeDonor';
import NotFound from './pages/public/NotFound';
import ForgotPassword from './pages/public/ForgotPassword';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorProfile from './pages/donor/DonorProfile';
import AvailableRequests from './pages/donor/AvailableRequests';
import DonationHistory from './pages/donor/DonationHistory';

// Receiver Pages
import ReceiverDashboard from './pages/receiver/ReceiverDashboard';
import SearchBlood from './pages/receiver/SearchBlood';
import CreateRequest from './pages/receiver/CreateRequest';
import MyRequests from './pages/receiver/MyRequests';
import RequestDetails from './pages/receiver/RequestDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDonors from './pages/admin/ManageDonors';
import ManageRequests from './pages/admin/ManageRequests';
import ManageDonations from './pages/admin/ManageDonations';
import BloodInventory from './pages/admin/BloodInventory';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/find-blood" element={<FindBlood />} />
              <Route path="/become-donor" element={<BecomeDonor />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Donor Portal Protected Routes */}
              <Route
                path="/donor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor/profile"
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor/requests"
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <AvailableRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor/history"
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonationHistory />
                  </ProtectedRoute>
                }
              />

              {/* Receiver Portal Protected Routes */}
              <Route
                path="/receiver/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['receiver']}>
                    <ReceiverDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receiver/search"
                element={
                  <ProtectedRoute allowedRoles={['receiver']}>
                    <SearchBlood />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receiver/create-request"
                element={
                  <ProtectedRoute allowedRoles={['receiver']}>
                    <CreateRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receiver/my-requests"
                element={
                  <ProtectedRoute allowedRoles={['receiver']}>
                    <MyRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receiver/requests/:id"
                element={
                  <ProtectedRoute allowedRoles={['receiver']}>
                    <RequestDetails />
                  </ProtectedRoute>
                }
              />

              {/* Admin Portal Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/donors"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageDonors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/requests"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/donations"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageDonations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/inventory"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <BloodInventory />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
