import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/UI/Toast';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/Home/Hero';
import { Categories } from './components/Home/Categories';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { GigDetail } from './components/Gigs/GigDetail';
import { GigList } from './components/Gigs/GigList';
import { CreateGig } from './components/Gigs/CreateGig';
import { OrderList } from './components/Orders/OrderList';
import { MessageList } from './components/Messages/MessageList';
import { FreelancerDashboard } from './components/Dashboard/FreelancerDashboard';
import { ClientDashboard } from './components/Dashboard/ClientDashboard';
import AdminPanel from './components/Admin/AdminPanel';
import { useAuth } from './context/AuthContext';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Categories />
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  
  if (user?.role === 'freelancer') {
    return <FreelancerDashboard />;
  } else if (user?.role === 'client') {
    return <ClientDashboard />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Please log in to access your dashboard.</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/gigs" element={<GigList />} />
                  <Route path="/gig/:id" element={<GigDetail />} />
                  <Route path="/create-gig" element={<CreateGig />} />
                  <Route path="/orders" element={<OrderList />} />
                  <Route path="/messages" element={<MessageList />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;