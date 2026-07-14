import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { SubscriptionAuthProvider } from '@/contexts/SubscriptionAuthContext.jsx';
import { LOGIN_PATH, PLANS_PATH, MANAGE_PATH } from '@/config/subscriptionRoutes.js';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PropertyRegistrationPage from './pages/PropertyRegistrationPage.jsx';
import EnvironmentChecklistPage from './pages/EnvironmentChecklistPage.jsx';
import CameraPage from './pages/CameraPage.jsx';
import ReviewGalleryPage from './pages/ReviewGalleryPage.jsx';
import CompletionPage from './pages/CompletionPage.jsx';
import PlansPage from './pages/PlansPage.jsx';
import SubscriptionsPage from './pages/SubscriptionsPage.jsx';

function App() {
  useEffect(() => {
    // Capacitor App Lifecycle Listeners
    let appStateListener;
    let backButtonListener;

    const setupListeners = async () => {
      try {
        appStateListener = await CapacitorApp.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active?', isActive);
          // Handle pause/resume logic here if needed
        });

        backButtonListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            CapacitorApp.exitApp();
          } else {
            window.history.back();
          }
        });
      } catch (e) {
        console.log('Capacitor App plugin not available (running in web browser)');
      }
    };

    setupListeners();

    return () => {
      if (appStateListener) appStateListener.remove();
      if (backButtonListener) backButtonListener.remove();
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <SubscriptionAuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path={LOGIN_PATH} element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path={PLANS_PATH} element={<PlansPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/new"
              element={
                <ProtectedRoute>
                  <PropertyRegistrationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/:id/environments"
              element={
                <ProtectedRoute>
                  <EnvironmentChecklistPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/:id/capture/:environmentIndex"
              element={
                <ProtectedRoute>
                  <CameraPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/:id/review"
              element={
                <ProtectedRoute>
                  <ReviewGalleryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/:id/completion"
              element={
                <ProtectedRoute>
                  <CompletionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={MANAGE_PATH}
              element={
                <ProtectedRoute>
                  <SubscriptionsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </SubscriptionAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;