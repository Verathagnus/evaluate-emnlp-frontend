import React from 'react'
import LoginForm from './login-form'
import EvaluationForm from './evaluation-form';
import AdminLoginForm from './admin-login-form';
import './App.css'
import { Link, Outlet, Route, Routes } from "react-router-dom";
import AdminNavbar from './admin-navbar';
const App: React.FC = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="evaluate" element={<EvaluationForm />}/>
        <Route path="admin" element={<AdminNavbar />}>
          <Route index element={<AdminLoginForm />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App
