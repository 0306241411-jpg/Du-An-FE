import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from './AppContext';

function Settings() {
  const { profile, updateProfile, showToast } = useContext(AppContext);
  
  // Khởi tạo state dựa trên dữ liệu profile lấy từ Backend thay vì giá trị cứng
  const [theme, setTheme] = useState(profile?.theme || 'sang');
  const [activeModal, setActiveModal] = useState(null); // 'account' | 'privatePass' | 'password'
  const [inputValue, setInputValue] = useState('');

  // Cập nhật lại state theme khi dữ liệu API tải về hoàn tất
  useEffect(() => {
    if (profile?.theme) {
      setTheme(profile.theme);
    }
  }, [profile]);

  // Mở popup chỉnh sửa thông tin tương ứng khi bấm vào từng mục
  const handleOpenModal = (type, defaultValue) => {
    setActiveModal(type);
    setInputValue(defaultValue || '');
  };

  // Lưu thông tin vừa sửa đẩy lên Backend
  const handleSaveModal = async () => {
    if (!inputValue.trim()) {
      showToast('Vui lòng nhập nội dung!', 'error');
      return;
    }

    let updatedProfile = { ...profile };

    // Phân loại trường cần cập nhật dựa vào modal đang mở
    if (activeModal === 'account') {
      updatedProfile.displayName = inputValue;
    } else if (activeModal === 'privatePass') {
      updatedProfile.privatePass = inputValue;
    } else if (activeModal === 'password') {
      // Cập nhật thêm tính năng đổi mật khẩu thật thay vì chỉ hiện thông báo[cite: 22]
      updatedProfile.password = inputValue; 
    }

    // Gọi API thông qua hàm updateProfile ở Context
    await updateProfile(updatedProfile);
    
    // Đóng popup sau khi lưu thành công[cite: 22]
    setActiveModal(null);
  };

  // Hàm xử lý đổi Theme và lưu thẳng xuống Database (file JSON)
  const handleChangeTheme = async (newTheme) => {
    setTheme(newTheme);
    await updateProfile({ ...profile, theme: newTheme });
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
              onChange={() => handleChangeTheme('sang')}
            /> Sáng
          </label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="radio"
              name="theme"
              checked={theme === 'toi'}
              onChange={() => handleChangeTheme('toi')}
            /> Tối
          </label>
        </div>
      </div>


      {/* 5. Đăng Xuất */}
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
  card: { backgroundColor: '#fff', width: '100%', maxWidth: '320px', margin: '20px auto', padding: '20px 15px', borderRadius: '8px', boxSizing: 'border-box', position: 'relative' },
  headerTitle: { textAlign: 'center', fontSize: '14px', fontWeight: 'bold', margin: '0 0 20px 0' },
  menuItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#d9d9d9', padding: '10px 12px', marginBottom: '15px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', color: '#000' },
  leftGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
  icon: { fontSize: '14px' },
  arrow: { fontSize: '11px', fontWeight: 'bold', color: '#333' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', zIndex: 10 },
  modalBox: { backgroundColor: '#fff', padding: '15px', borderRadius: '6px', width: '80%', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
  modalInput: { width: '100%', padding: '6px', fontSize: '12px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', outline: 'none' },
  cancelBtn: { padding: '4px 10px', fontSize: '11px', border: 'none', backgroundColor: '#ccc', borderRadius: '3px', cursor: 'pointer' },
  saveBtn: { padding: '4px 10px', fontSize: '11px', border: 'none', backgroundColor: '#52c41a', color: '#fff', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Settings;