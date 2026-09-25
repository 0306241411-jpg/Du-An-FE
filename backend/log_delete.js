const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "data", "delete.log");

function writeDeleteLog({ topic, id, title, isPrivate = false }) {
  try {
    const now = new Date();
    

    const timestamp = now.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

    const logLine = isPrivate
      ? `[${timestamp}] [DELETE PRIVATE] | ID: ${id} | Title: "${title}"\n`
      : `[${timestamp}] [DELETE PUBLIC] | Topic: "${topic}" | ID: ${id} | Title: "${title}"\n`;

    fs.appendFileSync(logFilePath, logLine, "utf8");
    console.log("-> Đã ghi log thành công vào delete.log");
  } catch (error) {
    console.error("Lỗi ghi log:", error);
  }
}

module.exports = { writeDeleteLog };