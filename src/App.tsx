import React from 'react'
import LoginForm from './components/login-form'
import EvaluationForm from './components/evaluation-form';
import AdminLoginForm from './components/admin-login-form';
import './App.css'
import { Link, Outlet, Route, Routes } from "react-router-dom";
import AdminNavbar from './components/admin-navbar';
import ViewSubmissions from './components/view-submissions';
import ViewSubmissionsAdmin from './components/admin-view-submissions';
import ViewCredentialsAdmin from './components/admin-view-credentials';
import AdminHome from './components/admin-home';
import EditReferencesAdmin from './components/admin-edit-references';

const App: React.FC = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="evaluate" element={<EvaluationForm />} />
        <Route path="submissions" element={<ViewSubmissions />} />

        <Route path="admin" element={<AdminLoginForm />} />
        <Route path="admin" element={<AdminNavbar />}>
          <Route path="home" element={<AdminHome />} />
          <Route path="submissions" element={<ViewSubmissionsAdmin />} />
          <Route path="credentials" element={<ViewCredentialsAdmin />} />
          <Route path="references" element={<EditReferencesAdmin />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App
