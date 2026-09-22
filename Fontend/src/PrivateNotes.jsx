import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from './AppContext';

function PrivateNotes() {
  const { 
    privateNotes, 
    fetchPrivateNotes, 
    deletePrivateNote, 
    updatePrivateNote, // 👈 Gọi hàm từ AppContext
    showToast 
  } = useContext(AppContext);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [topic, setTopic] = useState('hoc-tap');

  // State chỉnh sửa ghi chú
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (isUnlocked) {
      fetchPrivateNotes();
    }
  }, [isUnlocked]);

  // Xác thực mật khẩu
  const handleUnlock = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/private/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passInput }),
      });
      const data = await res.json();

      if (data.success) {
        setIsUnlocked(true);
        if (showToast) showToast('Đã mở khóa không gian riêng tư!', 'success');
      } else {
        alert(data.message || 'Sai Private-Pass!');
      }
    } catch (error) {
      alert('Lỗi kết nối máy chủ xác thực!');
    }
  };

  // Mở modal sửa
  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setEditTitle(note.title || '');
    setEditContent(note.content || '');
  };

  // Lưu thông tin sau khi sửa
  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;

    if (updatePrivateNote) {
      await updatePrivateNote(editingNote.id, {
        title: editTitle,
        content: editContent,
      });
    }
    setEditingNote(null);
  };

  if (!isUnlocked) {
    return (
      <div style={styles.card}>
        <h3 style={styles.headerTitle}>Trang Note Riêng Tư</h3>
        <form onSubmit={handleUnlock} style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{ fontSize: '12px', color: '#555', marginBottom: '15px' }}>
            🔒 Nhập Private-Pass để mở khóa
          </p>
          <input
            type="password"
            placeholder="Mật khẩu..."
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            style={styles.passInput}
          />
          <br />
          <button type="submit" style={styles.unlockBtn}>
            Mở khóa
          </button>
        </form>
      </div>
    );
  }

  const filteredNotes = (privateNotes || []).filter((note) => {
    if (!note) return false;
    const matchTopic = note.topic ? note.topic === topic : true;
    const noteTitle = note.title || '';
    const noteContent = note.content || '';
    const term = (searchTerm || '').toLowerCase();
    const matchSearch = noteTitle.toLowerCase().includes(term) || noteContent.toLowerCase().includes(term);
    return matchTopic && matchSearch;
  });

  return (
    <div style={styles.card}>
      <h3 style={styles.headerTitle}>Danh sách các ghi chú riêng tư</h3>

      <div style={styles.searchBox}>
        <span style={{ marginRight: '6px' }}>🔍</span>
        <input
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.filterRow}>
        <span style={styles.filterLabel}>Chủ đề</span>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} style={styles.select}>
          <option value="hoc-tap">Học tập</option>
          <option value="cong-viec">Công việc</option>
          <option value="ca-nhan">Cá nhân</option>
        </select>
      </div>

      <div style={styles.noteList}>
        {filteredNotes.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888' }}>
            Chưa có ghi chú riêng tư nào thuộc chủ đề này.
          </p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id || Math.random()} style={styles.noteCard}>
              <div style={{ fontWeight: 'bold' }}>🔒 {note.title}</div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>{note.content}</div>

              <div style={styles.actionGroup}>
                <button onClick={() => handleOpenEdit(note)} style={styles.editBtn}>Sửa</button>
                <button onClick={() => deletePrivateNote(note.id)} style={styles.deleteBtn}>Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popup / Modal Chỉnh Sửa */}
      {editingNote && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px' }}>Chỉnh sửa Note Riêng Tư</h4>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Tiêu đề..."
              style={styles.modalInput}
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Nội dung..."
              style={{ ...styles.modalInput, height: '60px', marginTop: '8px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setEditingNote(null)} style={styles.cancelBtn}>Hủy</button>
              <button onClick={handleSaveEdit} style={styles.saveBtn}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { position: 'relative', backgroundColor: '#fff', width: '100%', maxWidth: '320px', margin: '20px auto', padding: '20px 15px', borderRadius: '8px', boxSizing: 'border-box' },
  headerTitle: { textAlign: 'center', fontSize: '14px', margin: '0 0 15px 0' },
  passInput: { padding: '8px', borderRadius: '15px', border: 'none', backgroundColor: '#d9d9d9', outline: 'none', textAlign: 'center', width: '160px', marginBottom: '15px' },
  unlockBtn: { padding: '6px 20px', borderRadius: '15px', border: 'none', backgroundColor: '#d9d9d9', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#d9d9d9', padding: '6px 10px', borderRadius: '4px', marginBottom: '15px' },
  searchInput: { border: 'none', backgroundColor: 'transparent', outline: 'none', width: '100%', fontSize: '12px' },
  filterRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  filterLabel: { fontSize: '12px' },
  select: { backgroundColor: '#d9d9d9', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', outline: 'none' },
  noteList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  noteCard: { position: 'relative', backgroundColor: '#e0e0e0', padding: '10px', borderRadius: '4px', fontSize: '12px' },
  actionGroup: { position: 'absolute', right: '8px', top: '8px', display: 'flex', gap: '8px' },
  editBtn: { border: 'none', background: 'transparent', color: '#1890ff', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', padding: 0 },
  deleteBtn: { border: 'none', background: 'transparent', color: 'red', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', padding: 0 },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', zIndex: 10 },
  modalBox: { backgroundColor: '#fff', padding: '15px', borderRadius: '6px', width: '85%', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
  modalInput: { width: '100%', padding: '6px', fontSize: '12px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', outline: 'none' },
  cancelBtn: { padding: '4px 10px', fontSize: '11px', border: 'none', backgroundColor: '#ccc', borderRadius: '3px', cursor: 'pointer' },
  saveBtn: { padding: '4px 10px', fontSize: '11px', border: 'none', backgroundColor: '#1890ff', color: '#fff', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' },
};

export default PrivateNotes;