import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/EmployerSignUp.css"; // Ensure unique CSS file

const EmployerSignUp = ({ showModal, onClose }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Define loading state here
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.companyName) {
      errors.companyName = "Company Name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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

    setLoading(true);  // Set loading state
    try {
      const response = await axios.post('/api/auth/employer', formData);
      setErrors({});

      const { token, userType } = response.data;
      if (!token || !userType) {
        setErrors({ server: 'Token or userType missing from response' });
        return;
      }

      // Store token in localStorage
      localStorage.setItem('authToken', token);

      // Redirect based on userType
      if (userType === 'employer') {
        navigate('/employerdashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrors({ server: err.response ? err.response.data.error : 'Server error' });
    } finally {
      setLoading(false);  // Clear loading state
    }
  };

  if (!showModal) return null; // Don't render if modal is not shown

  return (
    <div className="employer-modal-overlay">
      <div className="employer-signup-modal-container">
        <button className="employer-close-button" onClick={onClose}>X</button>
        <div className="employer-form-box">
          <h2 className="employer-title">Employer Signup</h2>
          <form onSubmit={handleSubmit}>
            <div className="employer-form-grid">
              <div className="employer-form-group">
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  className="employer-input-field"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
                />
                {errors.companyName && (
                  <p className="employer-error-text">{errors.companyName}</p>
                )}
              </div>

              <div className="employer-form-group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="employer-input-field"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="employer-error-text">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="employer-form-grid">
              <div className="employer-form-group">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="employer-input-field"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="employer-error-text">{errors.password}</p>
                )}
              </div>

              <div className="employer-form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="employer-input-field"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && (
                  <p className="employer-error-text">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {errors.server && <p className="employer-error-text">{errors.server}</p>}
            {message && <p className="employer-success-text">{message}</p>}

            <button type="submit" className="employer-submit-button" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignUp;
