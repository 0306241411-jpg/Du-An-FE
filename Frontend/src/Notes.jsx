import { useState, useEffect } from "react";

function Notes() {
  const [topic, setTopic] = useState("hoc-tap");
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);


  const API_BASE = "http://localhost:5000/api/notes";

 
  const fetchNotes = () => {
    setLoading(true);
    fetch(`${API_BASE}/${topic}`)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Lỗi lấy danh sách ghi chú:", err))
      .finally(() => setLoading(false));
  };


  useEffect(() => {
    fetchNotes();
  }, [topic]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Vui lòng nhập đầy đủ Tiêu đề và Nội dung!");
      return;
    }

    const isEditing = Boolean(formData.id);
    const url = isEditing
      ? `${API_BASE}/${topic}/${formData.id}`
      : `${API_BASE}/${topic}`;
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title,
        content: formData.content,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchNotes(); 
        setFormData({ id: null, title: "", content: "" });
      })
      .catch((err) => console.error("Lỗi lưu ghi chú:", err));
  };

 
  const handleEdit = (note) => {
    setFormData({ id: note.id, title: note.title, content: note.content });
  };

 
  const handleCancelEdit = () => {
    setFormData({ id: null, title: "", content: "" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa ghi chú này?")) return;

    fetch(`${API_BASE}/${topic}/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchNotes())
      .catch((err) => console.error("Lỗi xóa ghi chú:", err));
  };


  return (
    <div>
      <h1 className="page-title">Ghi chú Công khai</h1>

      <div className="card">
        <div className="form-group">
          <label className="form-label">Chủ đề:</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="hoc-tap">Học tập</option>
            <option value="cong-viec">Công việc</option>
            <option value="ca-nhan">Cá nhân</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">
          {formData.id ? "Sửa ghi chú" : "Thêm ghi chú mới"}
        </h3>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Tiêu đề ghi chú..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <textarea
              rows="3"
              placeholder="Nội dung ghi chú..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn">
            {formData.id ? "Cập nhật" : "Thêm mới"}
          </button>
          {formData.id && (
            <button
              type="button"
              className="btn"
              style={{ marginLeft: "10px", backgroundColor: "#94a3b8" }}
              onClick={handleCancelEdit}
            >
              Hủy
            </button>
          )}
        </form>
      </div>

  
      <h3 className="card-title">Danh sách ghi chú</h3>
      {loading ? (
        <p style={{ color: "#94a3b8" }}>Đang tải...</p>
      ) : notes.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>Chưa có ghi chú nào.</p>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <div>
                <div className="note-header">{note.title}</div>
                <div className="note-content">{note.content}</div>
              </div>
              <div className="note-footer">
                <button className="btn" onClick={() => handleEdit(note)}>
                  Sửa
                </button>
                <button
                  className="btn"
                  style={{ backgroundColor: "#ef4444", marginLeft: "8px" }}
                  onClick={() => handleDelete(note.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;
