import { Routes, Route, Link } from 'react-router-dom';
import Notes from './Notes';
import PrivateNotes from './PrivateNotes';
import Settings from './Settings';

function App() {
  return (
    <div className="app-container">
      <div className="sidebar">
        <h2 className="sidebar-title">📝 Hệ Thống Quản Lý Ghi Chú</h2>
        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link">Ghi chú</Link>
          <Link to="/private" className="sidebar-link">Ghi chú riêng tư</Link>
          <Link to="/settings" className="sidebar-link">Cài đặt</Link>
        </nav>
      </div>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Notes />} />
          <Route path="/private" element={<PrivateNotes />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;