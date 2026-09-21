import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Khởi tạo ghi chú từ localStorage (nếu chưa có thì lấy dữ liệu mẫu)
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('app_notes');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Bài tập ReactJS', content: 'Làm xong bài tập Sprint 2', type: 'public', topic: 'hoc-tap' },
      { id: 2, title: 'Họp nhóm đồ án', content: 'Thảo luận giao diện Frontend', type: 'public', topic: 'cong-viec' },
      { id: 3, title: 'Nhật ký cá nhân', content: 'Nội dung bí mật...', type: 'private', topic: 'ca-nhan' },
    ];
  });

  // 2. Khởi tạo Thông tin Cài đặt & Private Pass từ localStorage
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('app_profile');
    return saved ? JSON.parse(saved) : {
      displayName: 'Sinh viên FE',
      privatePass: '1234',
    };
  });

  // 3. Quản lý trạng thái Thông báo Toast
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2500);
  };

  // Tự động lưu vào localStorage mỗi khi notes thay đổi
  useEffect(() => {
    localStorage.setItem('app_notes', JSON.stringify(notes));
  }, [notes]);

  // Tự động lưu vào localStorage mỗi khi profile thay đổi
  useEffect(() => {
    localStorage.setItem('app_profile', JSON.stringify(profile));
  }, [profile]);

  const addNote = (newNote) => {
    setNotes([{ ...newNote, id: Date.now() }, ...notes]);
    showToast('Thêm ghi chú thành công!', 'success');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    showToast('Đã xóa ghi chú!', 'error');
  };

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    showToast('Cập nhật cài đặt thành công!', 'success');
  };

  return (
    <AppContext.Provider value={{ notes, addNote, deleteNote, profile, updateProfile, showToast }}>
      {children}

      {/* Giao diện Popup Toast Notification */}
      {toast.visible && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: toast.type === 'error' ? '#ff4d4f' : '#52c41a',
          color: '#fff',
          padding: '8px 18px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>{toast.type === 'error' ? '🗑️' : '✅'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </AppContext.Provider>
  );
}