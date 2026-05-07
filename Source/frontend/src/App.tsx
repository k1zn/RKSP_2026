import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TreesPage from './pages/TreesPage';
import SpeciesPage from './pages/SpeciesPage';
import LocationsPage from './pages/LocationsPage';
import UsersPage from './pages/UsersPage';
import { isAuthenticated } from './api/auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Navbar />
                <main className="app-main">
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/trees" element={<TreesPage />} />
                    <Route path="/species" element={<SpeciesPage />} />
                    <Route path="/locations" element={<LocationsPage />} />
                    <Route path="/users" element={<ProtectedRoute requiredRole="admin"><UsersPage /></ProtectedRoute>} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
