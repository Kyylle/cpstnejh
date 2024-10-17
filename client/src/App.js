import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './components/Auth/SignIn';
import SignUpChoice from './pages/SignUpChoice';
import EmployerSignUp from './components/Auth/EmployerSignUp';
import JobseekerSignUp from './components/Auth/JobseekerSignup';
import Dashboard from './pages/Jobseeker/Dashboard';
import ProfileMain from './pages/Jobseeker/Profile';
import Job from './pages/Jobseeker/Job';
import Messaging from './pages/Jobseeker/Messaging';
import Notifications from './pages/Jobseeker/Notifications';
import EmployerHome from './pages/Employer/EmployerHome';
import ProtectedRoute from './components/ProtectedRoute'; 
import EmployerProfileSettings from './pages/Employer/EmployerProfileSettings';
import EmployerNotification from './pages/Employer/notifications/EmployerNotification';
import EmployerInquiries from './pages/Employer/Inquiries/EmployerInquiries';

import EmployerMessage from './pages/Employer/Message/EmployerMessage'
import JobseekerProfileSettings from './pages/Jobseeker/JobseekerProfileSettings';
import ViewProfile from './pages/Jobseeker/ViewProfile';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUpChoice />} />
        <Route path="/signup/employer" element={<EmployerSignUp />} />
        <Route path="/signup/jobseeker" element={<JobseekerSignUp />} />

        {/* Protected routes for Jobseeker */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ProfileMain"
          element={
            <ProtectedRoute>
              <ProfileMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job"
          element={
            <ProtectedRoute>
              <Job />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messaging"
          element={
            <ProtectedRoute>
              <Messaging />
            </ProtectedRoute>
          }
        />



        <Route
          path="/jobseekerprofilesettings"
          element={
            <ProtectedRoute>
              <JobseekerProfileSettings/>
            </ProtectedRoute>
          }
        />

        {/* Protected route for Employer */}
        <Route
          path="/employerdashboard"
          element={
            <ProtectedRoute>
              <EmployerHome />
            </ProtectedRoute>
          }
        />

        {/* Protected route for Profile Settings */}
        <Route
          path="/employerprofilesettings"
          element={
            <ProtectedRoute>
             <EmployerProfileSettings/>
            </ProtectedRoute>
          }
        />

      {/* {EmployerNotification Route} */}
      <Route
      path="/employernotifications"
      element={
        <ProtectedRoute>
          <EmployerNotification/>
        </ProtectedRoute>
      }
      />

      {/* Employeer  Inquiries*/}
      {/* Employeer inquiries  */}

      <Route
      path="/employerinquiries"
      element={
        <ProtectedRoute>
          <EmployerInquiries/>
        </ProtectedRoute>
      }
      />

    {/* Employer Message */}


      {/* Employer Message route */}

      <Route
      path="/employermessaging"
      element={
        <ProtectedRoute>
          <EmployerMessage/>
        </ProtectedRoute>
      }
      />

<Route path="/viewProfile/:type/:id" element={<ViewProfile/>} />


      </Routes>
    </Router>
  );
}

export default App;
