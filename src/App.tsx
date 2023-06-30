import React from 'react'
import LoginForm from './components/login-form'
import EvaluationForm from './components/evaluation-form';
import AdminLoginForm from './components/admin-login-form';
import './App.css'
import { Link, Outlet, Route, Routes } from "react-router-dom";
import AdminNavbar from './components/admin-navbar';
import ViewSubmissions from './components/view-submissions';
import ViewSubmissionsAdmin from './components/view-submissions-admin';
import ViewCredentialsAdmin from './components/view-credentials-admin';
import AdminHome from './components/admin-home';

const App: React.FC = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="evaluate" element={<EvaluationForm />} />
        <Route path="submissions" element={<ViewSubmissions />} />

        <Route path="admin" element={<AdminNavbar />}>
          <Route index element={<AdminLoginForm />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="submissions" element={<ViewSubmissionsAdmin />} />
          <Route path="credentials" element={<ViewCredentialsAdmin />} />
          <Route path="references" element={<ViewCredentialsAdmin />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App
