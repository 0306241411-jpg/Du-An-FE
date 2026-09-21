import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

function AddNote() {
  const { addNote, showToast } = useContext(AppContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('public');
  const [topic, setTopic] = useState('hoc-tap');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Vui lòng nhập tiêu đề!', 'error');
      return;
    }

    addNote({ title, content, type, topic });
    
    // Điều hướng trang ngay sau khi thêm
    if (type === 'public') {
      navigate('/');
    } else {
      navigate('/private');
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.headerTitle}>Thêm note</h3>

      <div style={styles.row}>
        <label style={styles.label}>Tiêu đề</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />
      </div>

      <div style={styles.rowTop}>
        <label style={styles.label}>Nội dung</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} style={styles.textarea} />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Loại</label>
        <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
          <label style={{ cursor: 'pointer' }}>
            <input type="radio" name="type" checked={type === 'public'} onChange={() => setType('public')} /> Công khai
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input type="radio" name="type" checked={type === 'private'} onChange={() => setType('private')} /> Riêng tư
          </label>
        </div>
      </div>

      <div style={{ ...styles.row, marginTop: '10px' }}>
        <label style={styles.label}>Chủ đề</label>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} style={styles.select}>
          <option value="hoc-tap">Học tập</option>
          <option value="cong-viec">Công việc</option>
          <option value="ca-nhan">Cá nhân</option>
        </select>
      </div>

      <button onClick={handleSubmit} style={styles.saveBtn}>Lưu Note</button>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#fff', width: '100%', maxWidth: '320px', margin: '20px auto', padding: '20px 15px', borderRadius: '8px', boxSizing: 'border-box' },
  headerTitle: { textAlign: 'center', fontSize: '14px', margin: '0 0 15px 0' },
  row: { display: 'flex', alignItems: 'center', marginBottom: '12px' },
  rowTop: { display: 'flex', alignItems: 'flex-start', marginBottom: '12px' },
  label: { width: '70px', fontSize: '12px' },
  input: { flex: 1, height: '24px', backgroundColor: '#d9d9d9', border: 'none', padding: '0 8px', outline: 'none' },
  textarea: { flex: 1, height: '60px', backgroundColor: '#d9d9d9', border: 'none', padding: '6px 8px', resize: 'none', outline: 'none' },
  select: { backgroundColor: '#d9d9d9', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', outline: 'none' },
  saveBtn: { display: 'block', margin: '20px auto 0 auto', padding: '8px 20px', backgroundColor: '#d9d9d9', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }
};

export default AddNote;