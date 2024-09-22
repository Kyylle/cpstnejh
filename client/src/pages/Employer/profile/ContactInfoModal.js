import React from "react";
import "./ContactInfoModal.css"; // Import the modal styles

const ContactInfoModal = ({
  isOpen,
  onClose,
  profileUrl,
  email,
  companyName,
  location,
}) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
            fill="currentColor"
            className="close-icon"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M18.3 5.71a.996.996 0 1 0-1.41-1.41L12 9.59 7.11 4.7A.996.996 0 1 0 5.7 6.11l4.88 4.88-4.88 4.88a.996.996 0 1 0 1.41 1.41L12 13.41l4.88 4.88a.996.996 0 1 0 1.41-1.41l-4.88-4.88 4.88-4.88z" />
          </svg>
        </button>
        <h2>{companyName || "User Name"}</h2> {/* Display the user's name */}
        <div className="modal-content">
          <h3>Contact Info</h3>
          {/* Profile Link */}
          <div className="contact-item">
            <img
              src="https://img.icons8.com/ios-glyphs/30/000000/link.png" // Chain link icon
              alt="Link"
            />
            <div>
              <strong>Your Profile</strong>
              <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                {profileUrl}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="contact-item">
            <img
              src="https://img.icons8.com/ios-glyphs/30/000000/gmail.png"
              alt="Email"
            />
            <div>
              <strong>Email</strong>
              <p>{email}</p>
            </div>
          </div>

          {/* Company Name */}
          <div className="contact-item">
            <img
              src="https://img.icons8.com/ios-glyphs/30/000000/map-marker.png"
              alt="Location"
            />
            <div>
              <strong>Location</strong> {/* Change the label to 'Location' */}
              <p>{location}</p>{" "}
              {/* Display the location from the passed prop */}
            </div>
          </div>

          <div className="enhance-profile-section">
            <h4>Enhance your profile with AI-powered suggestions</h4>
            <p>
              Members can receive up to 2x as many opportunities with a stronger
              profile.
            </p>
            <div className="premium-section">
              <img
                src="https://img.icons8.com/doodle/48/000000/group.png"
                alt="Premium Members"
              />
              <span>Millions of members use Premium</span>
            </div>
            <button className="premium-btn">Try Premium for PHP0</button>
            <p className="trial-info">
              1-month free trial. We’ll send you a reminder 7 days before your
              trial ends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoModal;
