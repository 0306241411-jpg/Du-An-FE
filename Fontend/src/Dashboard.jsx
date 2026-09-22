import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from './AppContext';

function Dashboard() {
  const context = useContext(AppContext);
  const notes = context?.notes || [];
  const fetchNotesByTopic = context?.fetchNotesByTopic || (() => {});
  const deleteNote = context?.deleteNote || (() => {});
  const updateNote = context?.updateNote || (() => {});

  const [searchTerm, setSearchTerm] = useState('');
  const [topic, setTopic] = useState('hoc-tap');

  // State quản lý việc chỉnh sửa ghi chú
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // 1. Tự động gọi API lấy ghi chú mới từ Backend khi đổi topic
  useEffect(() => {
    fetchNotesByTopic(topic);
  }, [topic]);

  // 2. Lọc ghi chú công khai theo từ khóa
  const filteredNotes = notes.filter((note) => {
    if (!note) return false;
    const isPublic = !note.isPrivate;
    const noteTitle = note.title || '';
    const noteContent = note.content || '';
    const term = (searchTerm || '').toLowerCase();
    const matchSearch = noteTitle.toLowerCase().includes(term) || noteContent.toLowerCase().includes(term);
    return isPublic && matchSearch;
  });

  // 3. Xử lý xóa ghi chú
  const handleDelete = (id) => {
    deleteNote(id, topic);
  };

  // 4. Mở popup chỉnh sửa
  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setEditTitle(note.title || '');
    setEditContent(note.content || '');
  };

  // 5. Lưu thông tin chỉnh sửa
  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    await updateNote(editingNote.id, topic, {
      title: editTitle,
      content: editContent,
    });
    setEditingNote(null);
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
              
              {/* Cụm nút Sửa và Xóa */}
              <div style={styles.actionGroup}>
                <button onClick={() => handleOpenEdit(note)} style={styles.editBtn}>Sửa</button>
                <button onClick={() => handleDelete(note.id)} style={styles.deleteBtn}>Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popup / Modal Sửa Ghi Chú */}
      {editingNote && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px' }}>Chỉnh sửa Ghi chú</h4>
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

export default Dashboard;