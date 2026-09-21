import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from './AppContext';

function Notes() {
  const { notes, fetchNotesByTopic, deleteNote } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('cong-viec');

  useEffect(() => {
    fetchNotesByTopic(selectedTopic);
  }, [selectedTopic]);

  // Lọc bỏ ghi chú riêng tư khỏi trang chủ công khai
  const publicNotes = (notes || []).filter((note) => {
    const isPublic = !note.isPrivate;
    const matchSearch =
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return isPublic && matchSearch;
  });

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '10px' }}>
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          style={styles.selectTopic}
        >
          <option value="hoc-tap">Học tập</option>
          <option value="cong-viec">Công việc</option>
          <option value="ca-nhan">Cá nhân</option>
        </select>
      </div>

      <div style={{ marginTop: '15px' }}>
        {publicNotes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontSize: '13px' }}>
            Không có ghi chú công khai nào!
          </p>
        ) : (
          publicNotes.map((note) => (
            <div key={note.id} style={styles.noteCard}>
              <div style={styles.noteHeader}>
                <span style={{ fontWeight: 'bold', fontSize: '13px' }}>📌 {note.title}</span>
                <button onClick={() => deleteNote(note.id)} style={styles.deleteBtn}>
                  Xóa
                </button>
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#555' }}>
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  searchBox: { display: 'flex', gap: '8px' },
  searchInput: { flex: 1, padding: '6px 10px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px' },
  selectTopic: { padding: '6px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px' },
  noteCard: { backgroundColor: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  noteHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  deleteBtn: { backgroundColor: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '12px' }
};

export default Notes;