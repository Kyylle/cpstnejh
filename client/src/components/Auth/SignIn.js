import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import '../css/SignIn.css'; // New CSS file for unique design

const SignIn = ({ showModal, onClose, openSignupModal }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Username is required';
    }
    if (!formData.password) {
      errors.password = 'Password field is empty';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login/email', formData);
      setErrors({});

      const { token, userType } = response.data;
      localStorage.setItem('authToken', token);
      console.log("Token after login:", token);

      if (userType === 'employer') {
        navigate('/employerdashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrors({ server: err.response ? err.response.data.message : 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="styled-modal-overlay">
      <div className="styled-modal-container">
        {/* Left side - Gradient background */}
        <div className="styled-left-panel">
          <h1>Welcome Back!</h1>
        </div>

        {/* Right side - Login Form */}
        <div className="styled-right-panel">
        <button className="close-button" onClick={onClose}>
        <FiX size={24} />
        </button>
          <div className="styled-signin-form-box">
            <h1 className="styled-title">Login</h1>
            <p>Welcome back! Please login to your account.</p>
            <form onSubmit={handleSubmit}>
              <div className="styled-signin-form-group">
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="styled-input-field"
                />
                {errors.email && <p className="styled-error-text">{errors.email}</p>}
              </div>

              <div className="styled-signin-form-group">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="styled-input-field"
                />
                {errors.password && <p className="styled-error-text">{errors.password}</p>}
              </div>

              {errors.server && <p className="styled-error-text">{errors.server}</p>}

              <div className="styled-remember-me">
                <label>
                  <input type="checkbox" /> Remember Me
                </label>
                <a href="/forgot-password" className="styled-forgot-password-link">Forgot Password?</a>
              </div>

              <button type="submit" className="styled-submit-button" disabled={loading}>
                {loading ? 'Signing In...' : 'Login'}
              </button>
            </form>

            <p className="styled-new-user-text">
              New User? <span className="styled-signup-link" onClick={openSignupModal}>Signup</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
