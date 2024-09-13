import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/EmployerSignUp.module.css'; // Import the CSS module

const EmployerSignUp = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
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
    <div className={styles.formContainer}>
      <h2>Employer Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
          {errors.companyName && <p className={styles.errorText}>{errors.companyName}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className={styles.errorText}>{errors.password}</p>}
        </div>

        {errors.server && <p className={styles.errorText}>{errors.server}</p>}
        {message && <p className={styles.successText}>{message}</p>}

        <button type="submit" className={styles.submitButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default EmployerSignUp;
