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


  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

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

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, topic]);

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
    console.log(`[LOG DELETE] Yêu cầu xóa ghi chú ID: ${id} trong chủ đề: "${topic}"`);

    if (!window.confirm("Bạn có chắc muốn xóa ghi chú này?")) {
      console.log(`[LOG DELETE] Người dùng đã hủy yêu cầu xóa ghi chú ID: ${id}`);
      return;
    }

    fetch(`${API_BASE}/${topic}/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((resData) => {
        console.log(`[LOG DELETE] Đã xóa thành công ghi chú ID: ${id}`, resData);
        fetchNotes();
      })
      .catch((err) => console.error("Lỗi xóa ghi chú:", err));
  };

  
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortBy === "title-desc") return b.title.localeCompare(a.title);
    if (sortBy === "oldest") return a.id - b.id;
    return b.id - a.id; 
  });


  const totalPages = Math.ceil(sortedNotes.length / itemsPerPage) || 1;
  const indexOfLastNote = currentPage * itemsPerPage;
  const indexOfFirstNote = indexOfLastNote - itemsPerPage;
  const currentNotes = sortedNotes.slice(indexOfFirstNote, indexOfLastNote);

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

      
      <div className="card" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div className="form-group" style={{ flex: 1, minWidth: "200px", marginBottom: 0 }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm ghi chú theo tiêu đề hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ minWidth: "160px", marginBottom: 0 }}>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="title-asc">Tiêu đề (A-Z)</option>
            <option value="title-desc">Tiêu đề (Z-A)</option>
          </select>
        </div>
      </div>

      <h3 className="card-title">Danh sách ghi chú</h3>

      
      {loading ? (
        <p style={{ color: "#94a3b8" }}>Đang tải...</p>
      ) : sortedNotes.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
          {notes.length === 0 ? (
            <p style={{ margin: 0, fontSize: "16px" }}>📭 Chưa có ghi chú nào trong chủ đề này.</p>
          ) : (
            <p style={{ margin: 0, fontSize: "16px" }}>🔍 Không tìm thấy ghi chú nào phù hợp với từ khóa "{searchTerm}".</p>
          )}
        </div>
      ) : (
        <>
          <div className="notes-grid">
            {currentNotes.map((note) => (
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

          
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "24px" }}>
              <button
                className="btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
              >
                Trang trước
              </button>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className="btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
              >
                Trang sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Notes;