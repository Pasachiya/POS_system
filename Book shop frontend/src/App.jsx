import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CustomerManagement from './components/customers/CustomerManagement';
import ItemManagement from './components/items/ItemManagement';
import BillingManagement from './components/billing/BillingManagement';
import Navigation from './components/common/Navigation';
import LoadingSpinner from './components/common/LoadingSpinner';
import './styles/components.css';

function App() {
  const { user, loading, isAuthenticated } = useAuth();

  // Add debugging
  console.log('App render:', { user, loading, isAuthenticated });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
            },
          }}
        />
        
        {!user || !isAuthenticated ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <div className="flex">
            <Navigation />
            <main className="flex-1 ml-64 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<CustomerManagement />} />
                <Route path="/items" element={<ItemManagement />} />
                <Route path="/billing" element={<BillingManagement />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;