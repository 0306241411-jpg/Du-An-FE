import { useState, useEffect } from "react";

function PrivateNotes() {
  /* ==========================================================
   | VÙNG 1: KHỞI TẠO STATE
   | - isUnlocked: cờ đã mở khóa hay chưa (bị reset về false
   |   mỗi khi component render lại / F5 trang -> đúng yêu cầu
   |   "bảo mật FE" trong tài liệu)
   ========================================================== */
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:5000/api/private";

  /* ==========================================================
   | VÙNG 2: XÁC THỰC (Auth) — gọi API thật, KHÔNG hardcode pass
   ========================================================== */
  const handleUnlock = (e) => {
    e.preventDefault();

    fetch(`${API_BASE}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsUnlocked(true);
          setPassword("");
        } else {
          alert("Sai mật khẩu, vui lòng thử lại!");
          setPassword("");
        }
      })
      .catch((err) => console.error("Lỗi xác thực:", err));
  };

  // Khóa lại thủ công
  const handleLock = () => {
    setIsUnlocked(false);
    setNotes([]);
    setFormData({ id: null, title: "", content: "" });
  };

  /* ==========================================================
   | VÙNG 3: CRUD GHI CHÚ RIÊNG TƯ (chỉ gọi khi đã mở khóa)
   ========================================================== */
  const fetchPrivateNotes = () => {
    setLoading(true);
    fetch(`${API_BASE}/notes`)
      .then((res) => res.json())
      .then((data) => setNotes(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Lỗi tải ghi chú riêng tư:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isUnlocked) fetchPrivateNotes();
  }, [isUnlocked]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Vui lòng nhập đầy đủ Tiêu đề và Nội dung!");
      return;
    }

    const isEditing = Boolean(formData.id);
    const url = isEditing
      ? `${API_BASE}/notes/${formData.id}`
      : `${API_BASE}/notes`;
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
        fetchPrivateNotes();
        setFormData({ id: null, title: "", content: "" });
      })
      .catch((err) => console.error("Lỗi lưu ghi chú riêng tư:", err));
  };

  const handleEdit = (note) => {
    setFormData({ id: note.id, title: note.title, content: note.content });
  };

  const handleCancelEdit = () => {
    setFormData({ id: null, title: "", content: "" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa ghi chú bí mật này?")) return;

    fetch(`${API_BASE}/notes/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchPrivateNotes())
      .catch((err) => console.error("Lỗi xóa ghi chú riêng tư:", err));
  };

  /* ==========================================================
   | VÙNG 4: GIAO DIỆN
   ========================================================== */

  // 1. Màn hình khóa khi chưa mở
  if (!isUnlocked) {
    return (
      <div
        className="card"
        style={{ maxWidth: "400px", margin: "60px auto", textAlign: "center" }}
      >
        <h2
          style={{ marginBottom: "12px", fontSize: "20px", color: "#1e1b4b" }}
        >
          🔒 Vùng Kín Bảo Mật
        </h2>
        <p style={{ marginBottom: "20px", color: "#64748b", fontSize: "14px" }}>
          Vui lòng nhập mật khẩu để truy cập
        </p>
        <form onSubmit={handleUnlock}>
          <div className="form-group">
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn" style={{ width: "100%" }}>
            Mở khóa
          </button>
        </form>
      </div>
    );
  }

  // 2. Màn hình sau khi mở khóa thành công
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 className="page-title" style={{ margin: 0 }}>
          Ghi chú Vùng Kín 🔒
        </h1>
        <button className="btn btn-danger" onClick={handleLock}>
          Khóa lại
        </button>
      </div>

      {/* Form Thêm mới / Sửa ghi chú riêng tư */}
      <div className="card">
        <h3 className="card-title">
          {formData.id ? "Sửa ghi chú bí mật" : "Thêm ghi chú bí mật mới"}
        </h3>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Tiêu đề bí mật..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <textarea
              rows="3"
              placeholder="Nội dung bí mật..."
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

      {/* Danh sách ghi chú riêng tư */}
      <h3 className="card-title">Danh sách ghi chú bí mật</h3>
      {loading ? (
        <p style={{ color: "#94a3b8" }}>Đang tải...</p>
      ) : notes.length === 0 ? (
        <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
          Chưa có ghi chú bí mật nào.
        </p>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div
              key={note.id}
              className="note-card"
              style={{ backgroundColor: "#fef2f2", borderLeftColor: "#ef4444" }}
            >
              <div>
                <div className="note-header" style={{ color: "#991b1b" }}>
                  {note.title}
                </div>
                <div className="note-content" style={{ color: "#7f1d1d" }}>
                  {note.content}
                </div>
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

export default PrivateNotes;
