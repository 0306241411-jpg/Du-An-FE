import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Lấy thông báo Toast từ Context nếu có
  const context = useContext(AppContext);
  const showToast = context?.showToast;

  const API_URL = 'http://localhost:5000/api';

  // Xử lý Đăng nhập qua API Backend
  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra đầu vào rỗng
    if (!username.trim() || !password.trim()) {
      if (showToast) showToast('Vui lòng nhập đầy đủ Username và Password!', 'error');
      else alert('Vui lòng nhập đầy đủ Username và Password!');
      return;
    }

    try {
      // 2. Gọi API lấy thông tin profile từ Backend
      const res = await fetch(`${API_URL}/profile`);
      if (res.ok) {
        const profileData = await res.json();

        // Lấy tên người dùng chuẩn từ profile.json (displayName hoặc username)
        const validUsername = profileData.displayName || profileData.username;

        // 3. Đối chiếu CẢ Username VÀ Password
        const isUsernameValid = username.trim().toLowerCase() === (validUsername || '').toLowerCase();
        const isPasswordValid = password === profileData.password;

        if (isUsernameValid && isPasswordValid) {
          if (onLogin) onLogin(validUsername);
          if (showToast) showToast('Đăng nhập thành công!', 'success');
          navigate('/'); // Chuyển sang Trang chủ
        } else {
          // Báo lỗi chung để bảo mật tài khoản
          if (showToast) showToast('Tài khoản hoặc mật khẩu không chính xác!', 'error');
          else alert('Tài khoản hoặc mật khẩu không chính xác!');
        }
      } else {
        alert('Lỗi máy chủ không thể xác thực!');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert('Không thể kết nối đến máy chủ Backend!');
    }
  };

  return (
    <div style={styles.card}>
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