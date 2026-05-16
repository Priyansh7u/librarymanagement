import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Transactions from './pages/Transactions';

export default function App() {

  useEffect(() => {

    // Disable Right Click
    const disableContextMenu = (e) => {
      e.preventDefault();
    };

    // Disable Inspect / DevTools shortcuts
    const disableDevTools = (e) => {

      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }

      // Ctrl+Shift+I / J / C
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ['I', 'J', 'C'].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Ctrl+U
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableDevTools);

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableDevTools);
    };

  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/books"        element={<Books />} />
          <Route path="/members"      element={<Members />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </main>
    </div>
  );
}
