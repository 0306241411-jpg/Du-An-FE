import React, { useState, useContext } from 'react';
import { AppContext } from './AppContext';

function Settings() {
  const { profile, updateProfile, showToast } = useContext(AppContext);
  const [theme, setTheme] = useState('sang');
  const [activeModal, setActiveModal] = useState(null); // 'account' | 'privatePass' | 'password'
  const [inputValue, setInputValue] = useState('');

  // Mở popup chỉnh sửa thông tin tương ứng khi bấm vào từng mục
  const handleOpenModal = (type, defaultValue) => {
    setActiveModal(type);
    setInputValue(defaultValue || '');
  };

  // Lưu thông tin vừa sửa
  const handleSaveModal = () => {
    if (!inputValue.trim()) {
      showToast('Vui lòng nhập nội dung!', 'error');
      return;
    }

    if (activeModal === 'account') {
      updateProfile({ ...profile, displayName: inputValue });
      showToast('Đã đổi tên Tài khoản thành công!', 'success');
    } else if (activeModal === 'privatePass') {
      updateProfile({ ...profile, privatePass: inputValue });
      showToast('Đã đổi Private-Pass thành công!', 'success');
    } else if (activeModal === 'password') {
      showToast('Đã đổi Mật khẩu tài khoản!', 'success');
    }

    setActiveModal(null);
  };

  const handleLogout = () => {
    showToast('Đã đăng xuất tài khoản!', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.headerTitle}>Cài đặt</h3>

      {/* 1. Tài khoản */}
      <div style={styles.menuItem} onClick={() => handleOpenModal('account', profile.displayName)}>
        <div style={styles.leftGroup}>
          <span style={styles.icon}>👤</span>
          <span>Tài khoản</span>
        </div>
        <span style={styles.arrow}>&gt;&gt;</span>
      </div>

      {/* 2. Private-Pass */}
      <div style={styles.menuItem} onClick={() => handleOpenModal('privatePass', profile.privatePass)}>
        <div style={styles.leftGroup}>
          <span style={styles.icon}>🔑</span>
          <span>Private-Pass</span>
        </div>
        <span style={styles.arrow}>&gt;&gt;</span>
      </div>

      {/* 3. Đổi mật khẩu */}
      <div style={styles.menuItem} onClick={() => handleOpenModal('password', '')}>
        <div style={styles.leftGroup}>
          <span style={styles.icon}>🔒</span>
          <span>Đổi mật khẩu</span>
        </div>
        <span style={styles.arrow}>&gt;&gt;</span>
      </div>

      {/* 4. Giao diện */}
      <div style={styles.menuItem}>
        <span>Giao diện</span>
        <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="radio"
              name="theme"
              checked={theme === 'sang'}
              onChange={() => setTheme('sang')}
            /> Sáng
          </label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="radio"
              name="theme"
              checked={theme === 'toi'}
              onChange={() => setTheme('toi')}
            /> Tối
          </label>
        </div>
      </div>

      {/* 5. Thùng rác */}
      <div style={styles.menuItem} onClick={() => showToast('Thùng rác hiện đang trống!', 'success')}>
        <div style={styles.leftGroup}>
          <span style={styles.icon}>🗑️</span>
          <span>Thùng rác</span>
        </div>
        <span style={styles.arrow}>&gt;&gt;</span>
      </div>

      {/* 6. Đăng Xuất */}
      <div style={styles.menuItem} onClick={handleLogout}>
        <div style={styles.leftGroup}>
          <span style={styles.icon}>🚪</span>
          <span style={{ fontWeight: 'bold' }}>Đăng Xuất</span>
        </div>
      </div>

      {/* Popup nhập liệu nhanh khi bấm vào các mục */}
      {activeModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px' }}>
              {activeModal === 'account' && 'Chỉnh sửa Tên tài khoản'}
              {activeModal === 'privatePass' && 'Đổi Private-Pass mới'}
              {activeModal === 'password' && 'Đổi Mật khẩu đăng nhập'}
            </h4>
            <input
              type={activeModal === 'account' ? 'text' : 'password'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập giá trị mới..."
              style={styles.modalInput}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setActiveModal(null)} style={styles.cancelBtn}>Hủy</button>
              <button onClick={handleSaveModal} style={styles.saveBtn}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '320px',
    margin: '20px auto',
    padding: '20px 15px',
    borderRadius: '8px',
    boxSizing: 'border-box',
    position: 'relative'
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0 0 20px 0'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#d9d9d9',
    padding: '10px 12px',
    marginBottom: '15px',
    borderRadius: '3px',
    fontSize: '12px',
    cursor: 'pointer',
    color: '#000'
  },
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  icon: {
    fontSize: '14px'
  },
  arrow: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#333'
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px'
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '6px',
    width: '80%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  modalInput: {
    width: '100%',
    padding: '6px',
    fontSize: '12px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none'
  },
  cancelBtn: {
    padding: '4px 10px',
    fontSize: '11px',
    border: 'none',
    backgroundColor: '#ccc',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  saveBtn: {
    padding: '4px 10px',
    fontSize: '11px',
    border: 'none',
    backgroundColor: '#52c41a',
    color: '#fff',
    borderRadius: '3px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Settings;