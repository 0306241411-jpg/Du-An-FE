import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

function AddNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('cong-viec');
  const [isPrivate, setIsPrivate] = useState(false);

  const { addNote, showToast } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      if (showToast) showToast('Vui lòng nhập đầy đủ Tiêu đề và Nội dung!', 'error');
      return;
    }

    await addNote({
      title,
      content,
      topic,
      isPrivate
    });

    if (isPrivate) {
      navigate('/private-notes');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Thêm note</h3>
      <form onSubmit={handleSubmit}>
        <div style={styles.row}>
          <label style={styles.label}>Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Nội dung</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Loại</label>
          <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="radio"
                name="type"
                checked={!isPrivate}
                onChange={() => setIsPrivate(false)}
              /> Công khai
            </label>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="radio"
                name="type"
                checked={isPrivate}
                onChange={() => setIsPrivate(true)}
              /> Riêng tư
            </label>
          </div>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Chủ đề</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)} style={styles.select}>
            <option value="hoc-tap">Học tập</option>
            <option value="cong-viec">Công việc</option>
            <option value="ca-nhan">Cá nhân</option>
          </select>
        </div>

        <button type="submit" style={styles.saveBtn}>
          Lưu Note
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#fff', width: '100%', maxWidth: '350px', margin: '20px auto', padding: '20px', borderRadius: '8px' },
  title: { textAlign: 'center', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' },
  row: { display: 'flex', alignItems: 'center', marginBottom: '12px' },
  label: { width: '70px', fontSize: '12px', color: '#333' },
  input: { flex: 1, padding: '6px 10px', fontSize: '12px', border: 'none', backgroundColor: '#d9d9d9', outline: 'none' },
  textarea: { flex: 1, height: '60px', padding: '6px 10px', fontSize: '12px', border: 'none', backgroundColor: '#d9d9d9', outline: 'none', resize: 'none' },
  select: { backgroundColor: '#d9d9d9', border: 'none', padding: '4px 8px', fontSize: '12px', outline: 'none' },
  saveBtn: { display: 'block', margin: '20px auto 0 auto', padding: '8px 20px', backgroundColor: '#d9d9d9', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }
};

export default AddNote;