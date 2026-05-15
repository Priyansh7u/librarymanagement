import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../services/api';
import './Dashboard.css';

const ACCENT = { totalBooks: '#C9A84C', availableBooks: '#4A7C59', issuedBooks: '#2E6B9E', overdueBooks: '#B85C38', totalMembers: '#8338EC', totalFines: '#E76F51' };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-body">
      <div className="loading-spinner"><div className="spinner" />Loading dashboard…</div>
    </div>
  );

  const { stats, recentTransactions, genreStats } = data;

  const statCards = [
    { key: 'totalBooks',    icon: '📚', label: 'Total Books',    value: stats.totalBooks    },
    { key: 'availableBooks',icon: '✅', label: 'Available',      value: stats.availableBooks },
    { key: 'issuedBooks',   icon: '📤', label: 'Issued',         value: stats.issuedBooks   },
    { key: 'overdueBooks',  icon: '⚠️', label: 'Overdue',        value: stats.overdueBooks  },
    { key: 'totalMembers',  icon: '👥', label: 'Members',        value: stats.totalMembers  },
    { key: 'totalFines',    icon: '💰', label: 'Total Fines',    value: `₹${stats.totalFines}` },
  ];

  const maxGenre = Math.max(...Object.values(genreStats));

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back — here's what's happening in your library today.</p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {statCards.map(({ key, icon, label, value }) => (
          <div className="stat-card" key={key} style={{ '--accent': ACCENT[key] }}>
            <span className="stat-icon">{icon}</span>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom">
        {/* Recent Transactions */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h2 className="card-title">Recent Activity</h2>
            <Link to="/transactions" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {recentTransactions.length === 0
            ? <div className="empty-state"><span className="empty-icon">📋</span><h3>No transactions yet</h3></div>
            : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Member</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{t.bookTitle}</div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{t.memberName}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>{t.dueDate}</td>
                      <td><StatusBadge status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Genre Chart */}
        <div className="card genre-card">
          <h2 className="card-title" style={{ marginBottom: 20 }}>Books by Genre</h2>
          <div className="genre-list">
            {Object.entries(genreStats).map(([genre, count]) => (
              <div key={genre} className="genre-row">
                <div className="genre-name">{genre}</div>
                <div className="genre-bar-wrap">
                  <div className="genre-bar" style={{ width: `${(count / maxGenre) * 100}%` }} />
                </div>
                <div className="genre-count">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { issued: 'badge-blue', returned: 'badge-green', overdue: 'badge-red' };
  return <span className={`badge ${map[status] || 'badge-muted'}`}>{status}</span>;
}
