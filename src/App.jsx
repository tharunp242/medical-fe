import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Store from './pages/Store';
import Prescription from './pages/Prescription';
import OrderSummary from './pages/OrderSummary';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import BillingManual from './pages/BillingManual';
import ManualBilling from './pages/ManualBilling';
import ArcticAI from './components/ArcticAI';
import Appointments from './pages/Appointments';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Orders from './pages/Orders';

const AppShell = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? 'pt-0' : 'pt-20'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/billing-manual" element={<BillingManual />} />
          <Route
            path="/bill-calculator"
            element={
              <ProtectedRoute adminOnly>
                <ManualBilling />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/appointments" element={<Appointments />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/store" element={<Store />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-summary"
            element={
              <ProtectedRoute>
                <OrderSummary />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <ArcticAI />
      <Toaster position="bottom-right" />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppShell />
            </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}


export default App;

