import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from './AppContext';

function Dashboard() {
  const context = useContext(AppContext);
  const notes = context?.notes || [];
  const fetchNotesByTopic = context?.fetchNotesByTopic || (() => {});
  const deleteNote = context?.deleteNote || (() => {});

  const [searchTerm, setSearchTerm] = useState('');
  const [topic, setTopic] = useState('hoc-tap');

  // 1. Tự động gọi API lấy ghi chú mới từ Backend mỗi khi người dùng thay đổi Chủ đề (topic)
  useEffect(() => {
    fetchNotesByTopic(topic);
  }, [topic]);

  // 2. LỌC CHỈ LẤY GHI CHÚ CÔNG KHAI (!note.isPrivate) VÀ THEO TỪ KHÓA TÌM KIẾM
  const filteredNotes = notes.filter((note) => {
    if (!note) return false;
    const isPublic = !note.isPrivate; // Kiểm tra chỉ lấy note Công khai
    const noteTitle = note.title || '';
    const matchSearch = noteTitle.toLowerCase().includes((searchTerm || '').toLowerCase());
    return isPublic && matchSearch;
  });

  // 3. Xử lý xóa ghi chú
  const handleDelete = (id) => {
    deleteNote(id, topic);
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.headerTitle}>Danh sách các ghi chú</h3>

      {/* Tìm kiếm */}
      <div style={styles.searchBox}>
        <span style={{ marginRight: '6px' }}>🔍</span>
        <input
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Lọc Chủ đề */}
      <div style={styles.filterRow}>
        <span style={styles.filterLabel}>Chủ đề</span>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} style={styles.select}>
          <option value="hoc-tap">Học tập</option>
          <option value="cong-viec">Công việc</option>
          <option value="ca-nhan">Cá nhân</option>
        </select>
      </div>

      {/* Danh sách ghi chú động */}
      <div style={styles.noteList}>
        {filteredNotes.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888' }}>
            Không có ghi chú nào thuộc chủ đề này.
          </p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id || Math.random()} style={styles.noteCard}>
              <div style={{ fontWeight: 'bold' }}>📌 {note.title}</div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>{note.content}</div>
              <button onClick={() => handleDelete(note.id)} style={styles.deleteBtn}>Xóa</button>
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
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#d9d9d9', padding: '6px 10px', borderRadius: '4px', marginBottom: '15px' },
  searchInput: { border: 'none', backgroundColor: 'transparent', outline: 'none', width: '100%', fontSize: '12px' },
  filterRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  filterLabel: { fontSize: '12px' },
  select: { backgroundColor: '#d9d9d9', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', outline: 'none' },
  noteList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  noteCard: { position: 'relative', backgroundColor: '#e0e0e0', padding: '10px', borderRadius: '4px', fontSize: '12px' },
  deleteBtn: { position: 'absolute', right: '8px', top: '8px', border: 'none', background: 'transparent', color: 'red', cursor: 'pointer', fontSize: '10px' }
};

export default Dashboard;