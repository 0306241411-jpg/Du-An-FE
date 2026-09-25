const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { writeDeleteLog } = require("./log_delete"); 

const app = express();
app.use(cors());
app.use(express.json());


app.delete("/api/notes/:topic/:id", (req, res) => {
  const filePath = path.join(__dirname, "data", "notes", `${req.params.topic}.json`);
  try {
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Không tìm thấy file" });

    let notes = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const note = notes.find((n) => n.id === req.params.id && !n.isDeleted);

    if (!note) return res.status(404).json({ message: "Không tìm thấy ghi chú" });


    note.isDeleted = true;
    note.deletedAt = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), "utf8");


    writeDeleteLog({
      topic: req.params.topic,
      id: req.params.id,
      title: note.title,
      isPrivate: false
    });

    res.json({ success: true, message: "Đã xóa mềm và ghi log công khai thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi xóa ghi chú" });
  }
});


app.delete("/api/private/notes/:id", (req, res) => {
  const privateFilePath = path.join(__dirname, "data", "private.json");
  try {
    if (!fs.existsSync(privateFilePath)) return res.status(404).json({ message: "Không tìm thấy file" });

    let notes = JSON.parse(fs.readFileSync(privateFilePath, "utf8"));
    const note = notes.find((n) => n.id === req.params.id && !n.isDeleted);

    if (!note) return res.status(404).json({ message: "Không tìm thấy ghi chú" });


    note.isDeleted = true;
    note.deletedAt = new Date().toISOString();
    fs.writeFileSync(privateFilePath, JSON.stringify(notes, null, 2), "utf8");


    writeDeleteLog({
      id: req.params.id,
      title: note.title,
      isPrivate: true
    });

    res.json({ success: true, message: "Đã xóa mềm và ghi log riêng tư thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi xóa ghi chú riêng tư" });
  }
});