import { useEffect, useState } from 'react';
import { getMembers, addMember, updateMember, deleteMember } from '../services/api';
import { useToast, ToastContainer } from '../components/Toast';

const defaultForm = { name: '', email: '', phone: '', address: '', membershipType: 'Standard' };

function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

const avatarColors = ['#2D6A4F','#E76F51','#264653','#8338EC','#2E6B9E','#B85C38','#4A7C59'];

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]       = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const { toasts, addToast }  = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const r = await getMembers({ search: search || undefined });
      setMembers(r.data);
    } catch { addToast('Failed to load members', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search]);

  const openAdd  = () => { setForm(defaultForm); setModal('add'); };
  const openEdit = (m) => { setSelected(m); setForm({ ...m }); setModal('edit'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSubmit = async () => {
    if (!form.name || !form.email) return addToast('Name and email are required', 'error');
    setSubmitting(true);
    try {
      if (modal === 'add') { await addMember(form); addToast('Member added', 'success'); }
      else { await updateMember(selected.id, form); addToast('Member updated', 'success'); }
      closeModal(); load();
    } catch (e) {
      addToast(e.response?.data?.error || 'Failed to save', 'error');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this member?')) return;
    try { await deleteMember(id); addToast('Member removed', 'success'); load(); }
    catch { addToast('Failed to delete', 'error'); }
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="page-body">
      <div className="flex-between page-header">
        <div>
          <h1>Members</h1>
          <p>Manage library membership records</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>＋ Add Member</button>
      </div>

      <div className="search-row">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input className="form-control" placeholder="Search by name, email, phone…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading
        ? <div className="loading-spinner"><div className="spinner" />Loading members…</div>
        : members.length === 0
          ? <div className="empty-state"><span className="empty-icon">👥</span><h3>No members found</h3></div>
          : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Membership</th>
                  <th>Books Issued</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                          background: avatarColors[i % avatarColors.length],
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '.75rem', fontWeight: 700, color: 'rgba(255,255,255,.9)'
                        }}>{initials(m.name)}</div>
                        <span style={{ fontWeight: 500 }}>{m.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '.85rem' }}>{m.email}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.83rem' }}>{m.phone || '—'}</td>
                    <td>
                      <span className={`badge ${m.membershipType === 'Premium' ? 'badge-gold' : 'badge-muted'}`}>
                        {m.membershipType}
                      </span>
                    </td>
                    <td style={{ color: m.booksIssued > 0 ? 'var(--gold-light)' : 'var(--text-muted)', fontWeight: m.booksIssued > 0 ? 600 : 400 }}>
                      {m.booksIssued}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>{m.joinDate}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(m)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      {(modal === 'add' || modal === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'add' ? 'Add Member' : 'Edit Member'}</h2>
              <button className="btn-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" value={form.name} onChange={f('name')} placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-control" type="email" value={form.email} onChange={f('email')} placeholder="email@example.com" />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={form.phone} onChange={f('phone')} placeholder="+91 …" />
                </div>
                <div className="form-group">
                  <label className="form-label">Membership Type</label>
                  <select className="form-control" value={form.membershipType} onChange={f('membershipType')}>
                    <option>Standard</option>
                    <option>Premium</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-control" value={form.address} onChange={f('address')} placeholder="City, State" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving…' : modal === 'add' ? 'Add Member' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
