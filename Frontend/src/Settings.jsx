import React, { useState, useEffect } from "react";

function Settings() {
  const [profile, setProfile] = useState({
    displayName: "",
    theme: "light",
    password: "",
  });

  const isDark = profile.theme === "dark";

  useEffect(() => {
    console.log("Setting đang chạy !");
    fetch("http://localhost:5000/api/profile")
      .then((res) => res.json())
      .then((data) => {
        console.log("Data từ back end:", data);
        setProfile(data);
        document.body.style.backgroundColor =
          data.theme === "dark" ? "#1e1e2e" : "#f4f6f8";
        document.body.style.color = data.theme === "dark" ? "#fff" : "#333";
      });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then((res) => res.json())
      .then(() => {
        document.body.style.backgroundColor =
          profile.theme === "dark" ? "#1e1e2e" : "#f4f6f8";
        document.body.style.color = profile.theme === "dark" ? "#fff" : "#333";
        alert("Đã lưu thay đổi thành công!");
      });
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: isDark ? "1px solid #444" : "1px solid #d1d5db",
    backgroundColor: isDark ? "#2b2b3b" : "#f9fafb",
    color: isDark ? "#fff" : "#111827",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "40px auto",
        padding: "28px",
        borderRadius: "16px",
        backgroundColor: isDark ? "#27273a" : "#ffffff",
        boxShadow: isDark
          ? "0 10px 25px rgba(0,0,0,0.3)"
          : "0 10px 25px rgba(0,0,0,0.05)",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "24px", fontSize: "22px" }}>
        ⚙️ Cài đặt hệ thống
      </h2>

      <div style={{ marginBottom: "18px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Tên hiển thị:
        </label>
        <input
          name="displayName"
          value={profile.displayName}
          onChange={handleChange}
          placeholder="Nhập tên hiển thị..."
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "18px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Giao diện:
        </label>
        <select name="theme" value={profile.theme} onChange={handleChange} style={inputStyle}>
          <option value="light">Sáng</option>
          <option value="dark">Tối</option>
        </select>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Mật khẩu ghi chú riêng tư:
        </label>
        <input
          type="password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          placeholder="••••••••"
          style={inputStyle}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#2563eb",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
          transition: "background-color 0.2s, transform 0.1s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
        onMouseDown={(e) => (e.target.style.transform = "scale(0.98)")}
        onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
      >
        Lưu thay đổi
      </button>
    </div>
  );
}

export default Settings;