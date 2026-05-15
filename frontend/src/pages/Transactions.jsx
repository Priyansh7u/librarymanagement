import { useEffect, useState } from 'react';
import { getTransactions, issueBook, returnBook, getBooks, getMembers } from '../services/api';
import { useToast, ToastContainer } from '../components/Toast';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal]             = useState(null); // null | 'issue'
  const [books, setBooks]             = useState([]);
  const [members, setMembers]         = useState([]);
  const [form, setForm]               = useState({ bookId: '', memberId: '', daysAllowed: 14 });
  const [submitting, setSubmitting]   = useState(false);
  const { toasts, addToast }          = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const r = await getTransactions({ status: statusFilter });
      setTransactions(r.data);
    } catch { addToast('Failed to load transactions', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const openIssue = async () => {
    setForm({ bookId: '', memberId: '', daysAllowed: 14 });
    setModal('issue');
    try {
      const [bRes, mRes] = await Promise.all([getBooks(), getMembers()]);
      setBooks(bRes.data.filter(b => b.available > 0));
      setMembers(mRes.data);
    } catch { addToast('Failed to load data', 'error'); }
  };

  const handleIssue = async () => {
    if (!form.bookId || !form.memberId) return addToast('Please select both book and member', 'error');
    setSubmitting(true);
    try {
      await issueBook(form);
      addToast('Book issued successfully', 'success');
      setModal(null); load();
    } catch (e) {
      addToast(e.response?.data?.error || 'Failed to issue', 'error');
    } finally { setSubmitting(false); }
  };

  const handleReturn = async (id) => {
    if (!confirm('Mark this book as returned?')) return;
    try {
      const r = await returnBook(id);
      const fine = r.data.fine;
      addToast(fine > 0 ? `Book returned. Fine: ₹${fine}` : 'Book returned successfully', fine > 0 ? 'info' : 'success');
      load();
    } catch (e) { addToast(e.response?.data?.error || 'Failed to return', 'error'); }
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const statusBadge = (s) => {
    const m = { issued: 'badge-blue', returned: 'badge-green', overdue: 'badge-red' };
    return <span className={`badge ${m[s] || 'badge-muted'}`}>{s}</span>;
  };

  const isOverdue = (t) => {
    if (t.status === 'returned') return false;
    return new Date(t.dueDate) < new Date();
  };

  return (
    <div className="page-body">
      <div className="flex-between page-header">
        <div>
          <h1>Transactions</h1>
          <p>Track book issuance and returns</p>
        </div>
        <button className="btn btn-primary" onClick={openIssue}>＋ Issue Book</button>
      </div>

      <div className="search-row">
        {['all', 'issued', 'returned', 'overdue'].map(s => (
          <button
            key={s}
            className={`btn ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize' }}
            onClick={() => setStatusFilter(s)}
          >{s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {loading
        ? <div className="loading-spinner"><div className="spinner" />Loading transactions…</div>
        : transactions.length === 0
          ? <div className="empty-state"><span className="empty-icon">↕️</span><h3>No transactions found</h3></div>
          : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Fine</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} style={isOverdue(t) ? { background: 'rgba(184,92,56,.04)' } : {}}>
                    <td style={{ fontWeight: 500 }}>{t.bookTitle}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{t.memberName}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>{t.issueDate}</td>
                    <td style={{ color: isOverdue(t) ? '#E09070' : 'var(--text-muted)', fontSize: '.82rem', fontWeight: isOverdue(t) ? 600 : 400 }}>{t.dueDate}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>{t.returnDate || '—'}</td>
                    <td style={{ color: t.fine > 0 ? '#E09070' : 'var(--text-muted)', fontWeight: t.fine > 0 ? 600 : 400 }}>
                      {t.fine > 0 ? `₹${t.fine}` : '—'}
                    </td>
                    <td>{statusBadge(isOverdue(t) && t.status !== 'returned' ? 'overdue' : t.status)}</td>
                    <td>
                      {t.status !== 'returned' && (
                        <button className="btn btn-secondary btn-sm" onClick={() => handleReturn(t.id)}>Return</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      {/* Issue Modal */}
      {modal === 'issue' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Issue a Book</h2>
              <button className="btn-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Select Book *</label>
                <select className="form-control" value={form.bookId} onChange={f('bookId')}>
                  <option value="">— Choose available book —</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>{b.title} — {b.author} ({b.available} avail.)</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Select Member *</label>
                <select className="form-control" value={form.memberId} onChange={f('memberId')}>
                  <option value="">— Choose member —</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} — {m.email}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Loan Period (days)</label>
                <input className="form-control" type="number" min="1" max="90" value={form.daysAllowed} onChange={f('daysAllowed')} />
              </div>
              {form.daysAllowed && (
                <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '.83rem', color: 'var(--text-secondary)' }}>
                  Due date: <strong style={{ color: 'var(--gold-light)' }}>
                    {new Date(Date.now() + form.daysAllowed * 86400000).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </strong>
                  &nbsp;· Fine rate: ₹5/day after due
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleIssue} disabled={submitting}>
                {submitting ? 'Issuing…' : 'Issue Book'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
