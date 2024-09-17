import React, { useState } from 'react';
import axios from 'axios';
import '../css/EmployerSignUp.css'; // Import the regular CSS file

const EmployerSignUp = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '', // Add confirm password field
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.companyName) {
      errors.companyName = 'Company Name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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

    try {
      const response = await axios.post('/api/auth/employer', formData);
      setMessage(response.data.message);
      setErrors({});
    } catch (err) {
      setErrors({ server: err.response ? err.response.data.error : 'Server error' });
    }
  };

  return (
    <div className="signup-form-container">
      <div className="form-box">
        <h2 className="title">Employer Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                className="input-field"
                value={formData.companyName}
                onChange={handleChange}
              />
              {errors.companyName && <p className="error-text">{errors.companyName}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="input-field"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>
          </div>

          {errors.server && <p className="error-text">{errors.server}</p>}
          {message && <p className="success-text">{message}</p>}

          <button type="submit" className="submit-button">
            Sign Up
          </button>

          {/* Google sign-in button */}
          <button type="button" className="google-signin-button">
            <div className="google-logo"></div>
            <div className="google-text">
              <span className="g-letter">G</span>
              <span className="o-letter">o</span>
              <span className="o2-letter">o</span>
              <span className="g2-letter">g</span>
              <span className="l-letter">l</span>
              <span className="e-letter">e</span>
            </div>
          </button>

          <div className="blur-line"></div>
        </form>
      </div>
    </div>
  );
};

export default EmployerSignUp;
