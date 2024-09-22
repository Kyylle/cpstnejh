import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/JobseekerSignUp.css";

const JobseekerSignUp = () => {
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
      setMessage(response.data.message);
      setErrors({});
      navigate("/dashboard");
    } catch (err) {
      setErrors({
        server: err.response ? err.response.data.error : "Server error",
      });
    }
  };

  return (
    <div className="signup-form-container">
      <div className="form-box">
        <h2 className="title">Jobseeker Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="jobseeker-form-grid">
            <div className="jobseeker-form-group">
              <input
                type="text"
                name="name"
                id="name"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="jobseeker-form-group">
              <input
                type="email"
                name="email"
                id="email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="jobseeker-form-group">
              <input
                type="password"
                name="password"
                id="password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            <div className="jobseeker-form-group">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="input-field"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {errors.server && <p className="error-text">{errors.server}</p>}
          {message && <p className="success-text">{message}</p>}

          <button type="submit" className="submit-button small-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobseekerSignUp;
