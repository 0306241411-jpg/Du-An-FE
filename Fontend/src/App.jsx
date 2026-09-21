import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Dashboard from './Dashboard';
import AddNote from './AddNote';
import PrivateNotes from './PrivateNotes';
import Settings from './Settings';
import Login from './Login';

function BottomNav() {
  return (
    <div style={styles.bottomNav}>
      <NavLink to="/" style={({ isActive }) => ({ ...styles.navItem, opacity: isActive ? 1 : 0.4 })}>
        <span style={{ fontSize: '18px' }}>🏠</span>
        <span style={{ fontSize: '10px', marginTop: '2px' }}>Trang chủ</span>
      </NavLink>
      <NavLink to="/add-note" style={({ isActive }) => ({ ...styles.navItem, opacity: isActive ? 1 : 0.4 })}>
        <span style={{ fontSize: '18px' }}>📑</span>
        <span style={{ fontSize: '10px', marginTop: '2px' }}>Thêm ghi chú</span>
      </NavLink>
      <NavLink to="/private" style={({ isActive }) => ({ ...styles.navItem, opacity: isActive ? 1 : 0.4 })}>
        <span style={{ fontSize: '18px' }}>👤🔒</span>
        <span style={{ fontSize: '10px', marginTop: '2px' }}>Note riêng tư</span>
      </NavLink>
      <NavLink to="/settings" style={({ isActive }) => ({ ...styles.navItem, opacity: isActive ? 1 : 0.4 })}>
        <span style={{ fontSize: '18px' }}>👤</span>
        <span style={{ fontSize: '10px', marginTop: '2px' }}>Cài đặt</span>
      </NavLink>
    </div>
  );
}

function MainApp() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={(username) => setUser(username)} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div style={styles.appWrapper}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-note" element={<AddNote />} />
        <Route path="/private" element={<PrivateNotes />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <MainApp />
      </Router>
    </AppProvider>
  );
}

const styles = {
  appWrapper: { minHeight: '100vh', paddingBottom: '70px', backgroundColor: '#f5f5f5' },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '320px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0',
    zIndex: 1000,
  },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#000' },
};

export default App;