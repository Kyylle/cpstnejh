import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './components/Auth/SignIn';
import SignUpChoice from './pages/SignUpChoice';
import EmployerSignUp from './components/Auth/EmployerSignUp';
import JobseekerSignUp from './components/Auth/JobseekerSignup';
import Dashboard from './pages/Jobseeker/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUpChoice/>} />
        <Route path="/signup/employer" element={<EmployerSignUp/>} />
        <Route path="/signup/jobseeker" element={<JobseekerSignUp/>} />
        <Route path = "/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
