const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// --- ĐƯỜNG DẪN DỮ LIỆU ---
const dataDir = path.join(__dirname, 'data');
const profilePath = path.join(dataDir, 'profile.json');
const notesDir = path.join(dataDir, 'notes');
const privateNotesFile = path.join(dataDir, 'private.json');

if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir, { recursive: true });
}
if (!fs.existsSync(privateNotesFile)) {
  fs.writeFileSync(privateNotesFile, '[]', 'utf8');
}

/** SPRINT 1: PROFILE */
app.get('/api/profile', (req, res) => {
  try {
    if (!fs.existsSync(profilePath)) return res.json({});
    const rawData = fs.readFileSync(profilePath, 'utf8');
    res.json(JSON.parse(rawData));
  } catch (error) {
    res.status(500).json({ message: "Lỗi đọc file profile" });
  }
});

app.put('/api/profile', (req, res) => {
  try {
    fs.writeFileSync(profilePath, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true, message: "Đã cập nhật Profile" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi ghi file profile" });
  }
});

/** SPRINT 2: GHI CHÚ CÔNG KHAI */
const getFilePath = (topic) => path.join(notesDir, `${topic}.json`);

// Lấy danh sách ghi chú công khai theo chủ đề
app.get('/api/notes/:topic', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.json([]);
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: "Lỗi đọc danh sách ghi chú" });
  }
});

// Thêm mới ghi chú (Tự động phân loại lưu vào private.json hoặc [topic].json)
app.post('/api/notes', (req, res) => {
  try {
    const { title, content, topic, isPrivate } = req.body;
    const newNote = {
      id: Date.now().toString(),
      title: title || '',
      content: content || '',
      topic: topic || 'hoc-tap',
      isPrivate: Boolean(isPrivate),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (newNote.isPrivate) {
      // 🔴 Lưu vào file private.json
      let privateNotes = [];
      if (fs.existsSync(privateNotesFile)) {
        privateNotes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
      }
      privateNotes.push(newNote);
      fs.writeFileSync(privateNotesFile, JSON.stringify(privateNotes, null, 2), 'utf8');
    } else {
      // 🟢 Lưu vào file notes/[topic].json
      const filePath = getFilePath(newNote.topic);
      let topicNotes = [];
      if (fs.existsSync(filePath)) {
        topicNotes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      topicNotes.push(newNote);
      fs.writeFileSync(filePath, JSON.stringify(topicNotes, null, 2), 'utf8');
    }

    res.status(201).json({ success: true, note: newNote });
  } catch (error) {
    console.error("Lỗi thêm note:", error);
    res.status(500).json({ message: "Lỗi lưu ghi chú" });
  }
});

// Sửa ghi chú công khai
app.put('/api/notes/:topic/:id', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File chủ đề không tồn tại" });
    let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Ép kiểu String() khi so sánh id
    const index = notes.findIndex(n => String(n.id) === String(req.params.id));

    if (index !== -1) {
      notes[index].title = req.body.title ?? notes[index].title;
      notes[index].content = req.body.content ?? notes[index].content;
      notes[index].updatedAt = new Date().toISOString();
      fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
      return res.json({ success: true, message: "Đã sửa ghi chú công khai thành công!" });
    }
    res.status(404).json({ message: "Không tìm thấy ghi chú công khai" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật ghi chú công khai" });
  }
});

// Xóa ghi chú công khai
app.delete('/api/notes/:topic/:id', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File không tồn tại" });
    let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Ép kiểu String() khi lọc xóa
    const newNotes = notes.filter(n => String(n.id) !== String(req.params.id));
    fs.writeFileSync(filePath, JSON.stringify(newNotes, null, 2), 'utf8');
    res.json({ success: true, message: "Đã xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa ghi chú" });
  }
});

/** SPRINT 3: BẢO MẬT & GHI CHÚ RIÊNG TƯ */

// Xác thực mật khẩu
app.post('/api/private/auth', (req, res) => {
  try {
    if (!fs.existsSync(profilePath)) return res.status(400).json({ message: "Chưa cấu hình profile" });
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    if (profile.password === req.body.password) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Sai mật khẩu!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống xác thực" });
  }
});

// Lấy danh sách ghi chú riêng tư từ private.json 
app.get('/api/private/notes', (req, res) => {
  try {
    if (!fs.existsSync(privateNotesFile)) return res.json([]);
    const data = fs.readFileSync(privateNotesFile, 'utf8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.status(500).json({ message: "Lỗi đọc danh sách ghi chú riêng tư" });
  }
});

// Sửa ghi chú riêng tư trong private.json
app.put('/api/private/notes/:id', (req, res) => {
  try {
    if (!fs.existsSync(privateNotesFile)) return res.status(404).json({ message: "Không tìm thấy file" });
    let notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));

    // Ép kiểu String() khi so sánh id
    const index = notes.findIndex(n => String(n.id) === String(req.params.id));

    if (index !== -1) {
      notes[index].title = req.body.title ?? notes[index].title;
      notes[index].content = req.body.content ?? notes[index].content;
      notes[index].updatedAt = new Date().toISOString();
      fs.writeFileSync(privateNotesFile, JSON.stringify(notes, null, 2), 'utf8');
      return res.json({ success: true, message: "Đã sửa ghi chú riêng tư thành công!" });
    }
    res.status(404).json({ message: "Không tìm thấy ghi chú riêng tư" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật ghi chú riêng tư" });
  }
});

// Xóa ghi chú riêng tư trong private.json
app.delete('/api/private/notes/:id', (req, res) => {
  try {
    if (!fs.existsSync(privateNotesFile)) return res.status(404).json({ message: "Không tìm thấy file" });
    let notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
    
    // Ép kiểu String() khi lọc xóa
    const filtered = notes.filter(n => String(n.id) !== String(req.params.id));
    fs.writeFileSync(privateNotesFile, JSON.stringify(filtered, null, 2), 'utf8');
    res.json({ success: true, message: "Đã xóa ghi chú riêng tư" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa ghi chú riêng tư" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend chạy tại http://localhost:${PORT}`);
});