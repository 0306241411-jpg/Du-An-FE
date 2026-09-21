import React, { useState } from 'react';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    setNotes([...notes, { id: Date.now(), title }]);
    setTitle('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '320px', margin: '0 auto' }}>
      <h3 style={{ textAlign: 'center' }}>📝 Ghi chú</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <input
          placeholder="Nhập tiêu đề..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={handleAdd} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          Thêm
        </button>
      </div>

      <div>
        {notes.length === 0 && <p style={{ fontSize: '13px', color: '#888' }}>Chưa có ghi chú nào.</p>}
        {notes.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '8px',
              color: '#000',
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;