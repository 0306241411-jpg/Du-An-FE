import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      if (onLogin) onLogin(username);
      navigate('/'); // Đăng nhập xong tự động chuyển về Trang chủ
    } else {
      alert('Vui lòng nhập Username!');
    }
  };

  return (
    <div style={styles.card}>
      {/* Logo hình tròn */}
      <div style={styles.logoContainer}>
        <div style={styles.logo}>Logo</div>
      </div>

      <form onSubmit={handleLogin}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <a href="#forgot" style={{ fontSize: '11px', color: '#666', textDecoration: 'none' }}>
            Quên mật khẩu
          </a>
        </div>

        <button type="submit" style={styles.loginBtn}>
          Login
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '11px', marginTop: '20px' }}>
        Bạn chưa có tài khoản? <a href="#register" style={{ fontWeight: 'bold' }}>Đăng ký</a>
      </p>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '320px',
    margin: '30px auto',
    padding: '25px 20px',
    borderRadius: '8px',
    boxSizing: 'border-box',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '25px',
  },
  logo: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#d9d9d9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#555',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  label: {
    width: '70px',
    fontSize: '11px',
    color: '#333',
  },
  input: {
    flex: 1,
    padding: '6px 12px',
    borderRadius: '15px',
    border: 'none',
    backgroundColor: '#d9d9d9',
    outline: 'none',
    fontSize: '12px',
  },
  loginBtn: {
    width: '100px',
    display: 'block',
    margin: '0 auto',
    padding: '8px',
    borderRadius: '15px',
    border: 'none',
    backgroundColor: '#d9d9d9',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
};

export default Login;