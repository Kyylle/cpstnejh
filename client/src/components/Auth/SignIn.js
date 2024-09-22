import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/SignIn.css'; // Make sure to create this file

const SignIn = () => {
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
      errors.email = 'Username is required'; // Changed to "Username" for visual consistency
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
  
      // Store token and userType
      const { token, userType } = response.data;
      localStorage.setItem('authToken', token);
  
      // Check the response data for the user type
      console.log('User type:', userType); // Debugging: Check the userType in the console
  
      // Redirect based on user type
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
  
  
  

  return (
    <div className="signin-form-container">
      <div className="signin-form-box">
        <h1 className="title">JOBHUB</h1>
        <form onSubmit={handleSubmit}>
          <div className="signin-form-group">
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Username"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="signin-form-group">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {errors.server && <p className="error-text">{errors.server}</p>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Login'}
          </button>

          <hr className="divider" />

          <button
            type="button"
            className="create-account-button"
            onClick={() => navigate('/signup')}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
