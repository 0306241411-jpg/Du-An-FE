import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [privateNotes, setPrivateNotes] = useState([]);
  const [profile, setProfile] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProfile();
  }, []);

  // Lấy thông tin profile
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data || {});
      }
    } catch (error) {
      console.error('Lỗi tải profile:', error);
    }
  };

  // Cập nhật thông tin profile
  const updateProfile = async (newProfileData) => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfileData),
      });

      if (res.ok) {
        setProfile(newProfileData);
        showToast('Đã cập nhật cài đặt!', 'success');
      }
    } catch (error) {
      showToast('Lỗi cập nhật cài đặt!', 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchNotesByTopic = async (topic) => {
    try {
      const res = await fetch(`${API_URL}/notes/${topic}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Lỗi tải ghi chú công khai:', error);
    }
  };

  const fetchPrivateNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/private/notes`);
      if (res.ok) {
        const data = await res.json();
        setPrivateNotes(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Lỗi tải ghi chú riêng tư:', error);
    }
  };

  const addNote = async (newNoteData) => {
    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNoteData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.note?.isPrivate) {
          await fetchPrivateNotes();
          showToast('Đã thêm ghi chú riêng tư!', 'success');
        } else {
          await fetchNotesByTopic(data.note.topic);
          showToast('Đã thêm ghi chú công khai!', 'success');
        }
      }
    } catch (error) {
      showToast('Lỗi khi thêm ghi chú!', 'error');
    }
  };

  const deleteNote = async (id, topic) => {
    try {
      const res = await fetch(`${API_URL}/notes/${topic}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        showToast('Đã xóa ghi chú!', 'success');
      }
    } catch (error) {
      showToast('Lỗi xóa ghi chú!', 'error');
    }
  };

  const deletePrivateNote = async (id) => {
    try {
      const res = await fetch(`${API_URL}/private/notes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPrivateNotes((prev) => prev.filter((n) => n.id !== id));
        showToast('Đã xóa ghi chú riêng tư!', 'success');
      }
    } catch (error) {
      showToast('Lỗi xóa ghi chú riêng tư!', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        notes,
        privateNotes,
        profile,
        fetchProfile,
        updateProfile,
        fetchNotesByTopic,
        fetchPrivateNotes,
        addNote,
        deleteNote,
        deletePrivateNote,
        showToast,
        toastMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}