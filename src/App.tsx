import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import UserManagementPage from './pages/UserManagementPage'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UsersPage } from 'pages/UsersPage'
function App() {
  return (
    <>
    <ToastContainer />
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/usersPage" element={<UsersPage />} />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </>
  )
}

export default App