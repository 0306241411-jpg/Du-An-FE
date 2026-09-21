import React, { useState, useContext } from 'react';
import { AppContext } from './AppContext';

function PrivateNotes() {
  // Lấy dữ liệu an toàn từ Context (tránh bị crash nếu dữ liệu bị undefined)
  const context = useContext(AppContext);
  const notes = context?.notes || [];
  const profile = context?.profile || {};
  const deleteNote = context?.deleteNote || (() => {});

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [topic, setTopic] = useState('hoc-tap');

  // Kiểm tra Mật khẩu
  const handleUnlock = (e) => {
    e.preventDefault();
    const correctPass = profile.privatePass || '1234';
    if (passInput === correctPass) {
      setIsUnlocked(true);
    } else {
      alert('Sai Private-Pass! (Mật khẩu mặc định: 1234)');
    }
  };

  // Màn hình khóa
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

  // Lọc dữ liệu an toàn
  const filteredNotes = notes.filter((note) => {
    if (!note) return false;
    const isPrivate = note.type === 'private';
    const matchTopic = note.topic === topic;
    const noteTitle = note.title || '';
    const matchSearch = noteTitle.toLowerCase().includes((searchTerm || '').toLowerCase());
    return isPrivate && matchTopic && matchSearch;
  });

  return (
    <div style={styles.card}>
      <h3 style={styles.headerTitle}>Danh sách các ghi chú riêng tư</h3>

      <div style={styles.searchBox}>
        <span style={{ marginRight: '6px' }}>🔍</span>
        <input
          placeholder="Tìm kiếm"
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
            Chưa có ghi chú riêng tư nào.
          </p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id || Math.random()} style={styles.noteCard}>
              <div style={{ fontWeight: 'bold' }}>🔒 {note.title}</div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>{note.content}</div>
              <button onClick={() => deleteNote(note.id)} style={styles.deleteBtn}>Xóa</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#fff', width: '100%', maxWidth: '320px', margin: '20px auto', padding: '20px 15px', borderRadius: '8px', boxSizing: 'border-box' },
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
  deleteBtn: { position: 'absolute', right: '8px', top: '8px', border: 'none', background: 'transparent', color: 'red', cursor: 'pointer', fontSize: '10px' }
};

export default PrivateNotes;