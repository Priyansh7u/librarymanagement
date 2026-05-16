import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Transactions from './pages/Transactions';

export default function App() {

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
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
