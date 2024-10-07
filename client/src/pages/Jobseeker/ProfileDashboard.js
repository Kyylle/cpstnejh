import React from 'react';
import '../css/ProfileDashboard.css';

function App() {
  return (
    <div className="app">
      <Header />
      <ProfileSection />
      <MainContent />
    </div>
  );
}

const Header = () => (
  <header className="header">
    <div className="logo">JobHub</div>
    <input type="text" placeholder="Search" className="search-bar" />
    <nav className="nav">
      <a href="#">Home</a>
      <a href="#">Messaging</a>
      <a href="#">Notifications</a>
    </nav>
    <div className="user-menu">
      <img className="user-icon" src="path-to-user-icon" alt="user" />
    </div>
  </header>
);

const ProfileSection = () => (
  <section className="profile-section">
    <div className="profile-card">
      <div className="profile-photo">
        <img src="path-to-default-profile" alt="profile" />
        <button className="new-photo-btn">New Photo</button>
      </div>
      <div className="profile-info">
        <h2>Kyle Khenier Duaglang</h2>
        <p>Argao National High School Region, Philippines</p>
        <a href="#">Contact Info</a>
      </div>
      <button className="edit-profile-btn">✎</button>
    </div>
  </section>
);

const MainContent = () => (
  <section className="main-content">
    <div className="resume-upload">
      <h3>Resume</h3>
      <input type="file" className="resume-upload-btn" />
    </div>
    <div className="previous-position">
      <h3>Previous Position</h3>
      <p>No previous position</p>
    </div>
    <EditableField title="Skills" />
    <EditableField title="Experience" />
    <References />
  </section>
);

const EditableField = ({ title }) => (
  <div className="editable-field">
    <h3>{title}</h3>
    <button className="edit-btn">✎</button>
  </div>
);

const References = () => (
  <div className="references">
    <h3>References</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Business</th>
          <th>Role</th>
          <th>Contact</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>--</td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
        </tr>
      </tbody>
    </table>
    <button className="edit-btn">✎</button>
  </div>
);

export default App;
