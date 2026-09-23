import { useState, useEffect } from "react";

function Notes() {
  /* ==========================================================
   | VÙNG 1: KHỞI TẠO STATE (Trạng thái dữ liệu)
   | - topic: chủ đề đang chọn (quyết định gọi API nào)
   | - notes: danh sách ghi chú của chủ đề hiện tại
   | - formData: dữ liệu form (id=null nghĩa là đang THÊM MỚI,
   |   id có giá trị nghĩa là đang SỬA ghi chú đó)
   ========================================================== */
  const [topic, setTopic] = useState("hoc-tap");
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  /* ==========================================================
   | VÙNG 2: GỌI API (Fetch, Add, Edit, Delete)
   | Lưu ý: API đổi theo :topic trên URL, đúng thiết kế BE
   | trong tài liệu (app.get/post/put/delete '/api/notes/:topic')
   ========================================================== */
  const API_BASE = "http://localhost:5000/api/notes";

  // Lấy danh sách ghi chú theo chủ đề đang chọn
  const fetchNotes = () => {
    setLoading(true);
    fetch(`${API_BASE}/${topic}`)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Lỗi lấy danh sách ghi chú:", err))
      .finally(() => setLoading(false));
  };

  // Mỗi khi đổi chủ đề (topic) -> tự động gọi lại API tương ứng
  useEffect(() => {
    fetchNotes();
  }, [topic]);

  // Xử lý Thêm mới / Cập nhật (dùng chung 1 hàm)
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
        fetchNotes(); // Làm mới danh sách sau khi lưu
        setFormData({ id: null, title: "", content: "" }); // Reset form
      })
      .catch((err) => console.error("Lỗi lưu ghi chú:", err));
  };

  // Đổ dữ liệu cũ ra form khi bấm nút "Sửa"
  const handleEdit = (note) => {
    setFormData({ id: note.id, title: note.title, content: note.content });
  };

  // Hủy sửa, quay về trạng thái thêm mới
  const handleCancelEdit = () => {
    setFormData({ id: null, title: "", content: "" });
  };

  // Xóa ghi chú (có xác nhận trước khi xóa)
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa ghi chú này?")) return;

    fetch(`${API_BASE}/${topic}/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchNotes())
      .catch((err) => console.error("Lỗi xóa ghi chú:", err));
  };

  /* ==========================================================
   | VÙNG 3: GIAO DIỆN (Render JSX)
   ========================================================== */
  return (
    <div>
      <h1 className="page-title">Ghi chú Công khai</h1>

      {/* Chọn chủ đề: đổi topic sẽ tự động gọi lại API /api/notes/:topic */}
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

      {/* Form Thêm mới / Sửa ghi chú (dùng chung 1 form) */}
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

      {/* Danh sách ghi chú dạng lưới (Grid) */}
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
