import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiX } from 'react-icons/fi';
import "../css/JobseekerSignUp.css"; // Ensure unique CSS file

const JobseekerSignUp = ({ showModal, onClose }) => { // Accept showModal and onClose props
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};

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

    try {
      const response = await axios.post("/api/auth/jobseeker", formData);
      
      // Assuming the response contains an authentication token and userType
      const { token, userType } = response.data;

      // Store token in localStorage
      localStorage.setItem('authToken', token);

      // Clear errors and set success message
      setMessage("Jobseeker registered successfully");

      // Redirect to dashboard immediately after successful signup
      navigate("/dashboard");

    } catch (err) {
      setErrors({
        server: err.response ? err.response.data.error : "Server error",
      });
    }
  };

  if (!showModal) return null; // Don't render if modal is not shown

  return (
    <div className="jobseeker-modal-overlay">
      <div className="jobseeker-signup-modal-container">
      <button className="close-button" onClick={onClose}>
        <FiX size={24} />
        </button>
        <div className="jobseeker-form-box">
          <h2 className="jobseeker-title">Jobseeker Signup</h2>
          <form onSubmit={handleSubmit}>
            <div className="jobseeker-form-grid">
              <div className="jobseeker-form-group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="jobseeker-input-field"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
                {errors.name && <p className="jobseeker-error-text">{errors.name}</p>}
              </div>

              <div className="jobseeker-form-group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="jobseeker-input-field"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                {errors.email && <p className="jobseeker-error-text">{errors.email}</p>}
              </div>

              <div className="jobseeker-form-group">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="jobseeker-input-field"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                {errors.password && <p className="jobseeker-error-text">{errors.password}</p>}
              </div>

              <div className="jobseeker-form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="jobseeker-input-field"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && <p className="jobseeker-error-text">{errors.confirmPassword}</p>}
              </div>
            </div>

            {errors.server && <p className="jobseeker-error-text">{errors.server}</p>}
            {message && <p className="jobseeker-success-text">{message}</p>}

            <button type="submit" className="jobseeker-submit-button small-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobseekerSignUp;
