import React, { useState } from 'react';
import SignIn from '../components/Auth/SignIn';
import SignUpChoice from './SignUpChoice'; // Import SignUpChoice modal
import EmployerSignUp from '../components/Auth/EmployerSignUp'; // Import EmployerSignUp modal
import JobseekerSignUp from '../components/Auth/JobseekerSignup'; // Import JobseekerSignUp modal
import './Home.css'; // Ensure necessary styles are here

const Home = () => {
  const [isSignInOpen, setSignInOpen] = useState(false);
  const [isSignUpChoiceOpen, setSignUpChoiceOpen] = useState(false);
  const [isEmployerSignUpOpen, setEmployerSignUpOpen] = useState(false);
  const [isJobseekerSignUpOpen, setJobseekerSignUpOpen] = useState(false);

  const openSignInModal = () => {
    setSignInOpen(true);
  };

  const closeSignInModal = () => {
    setSignInOpen(false);
  };

  const openSignUpChoiceModal = () => {
    setSignInOpen(false); // Close SignIn modal first
    setSignUpChoiceOpen(true); // Open the Signup Choice modal
  };

  const closeSignUpChoiceModal = () => {
    setSignUpChoiceOpen(false);
  };

  const openEmployerSignUp = () => {
    setSignUpChoiceOpen(false); // Close SignUpChoice modal
    setEmployerSignUpOpen(true); // Open EmployerSignUp modal
  };

  const openJobseekerSignUp = () => {
    setSignUpChoiceOpen(false); // Close SignUpChoice modal
    setJobseekerSignUpOpen(true); // Open Jobseeker SignUp modal
  };

  const closeEmployerSignUpModal = () => {
    setEmployerSignUpOpen(false); // Close Employer SignUp modal
  };

  const closeJobseekerSignUp = () => {
    setJobseekerSignUpOpen(false); // Close Jobseeker SignUp modal
  };

  return (
    <div className="home-page-content">
      {/* Navigation Bar */}
      <nav className="navbar-home">
        <div className="logo">JobHub</div>
        
        <div className="auth-buttons">
          <button onClick={openSignInModal} className="nav-button">
            Sign In
          </button>
          <button className="nav-button signup-btn" onClick={openSignUpChoiceModal}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="text-section">
          <h1>Your dream job is just a click away</h1>
          <p>
            A modern recruitment platform designed to streamline the connection between 
            employers and job seekers.
          </p>

          {/* Search and Find Button */}
          <div className="search-login">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Find Now" 
            />
            <button className="search-btn">Find</button>
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      {isSignInOpen && (
        <SignIn showModal={isSignInOpen} onClose={closeSignInModal} openSignupModal={openSignUpChoiceModal} />
      )}

      {/* Signup Choice Modal */}
      {isSignUpChoiceOpen && (
        <SignUpChoice 
          showModal={isSignUpChoiceOpen} 
          onClose={closeSignUpChoiceModal} 
          openEmployerSignUp={openEmployerSignUp} // Pass the transition handler to SignUpChoice
          openJobseekerSignUp={openJobseekerSignUp} // Pass the Jobseeker transition handler
        />
      )}

      {/* Employer Signup Modal */}
      {isEmployerSignUpOpen && (
        <EmployerSignUp showModal={isEmployerSignUpOpen} onClose={closeEmployerSignUpModal} />
      )}

      {/* Jobseeker SignUp Modal */}
      {isJobseekerSignUpOpen && (
        <JobseekerSignUp showModal={isJobseekerSignUpOpen} onClose={closeJobseekerSignUp} />
      )}
    </div>
  );
};

export default Home;
