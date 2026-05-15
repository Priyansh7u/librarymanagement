import { useEffect, useState } from 'react';
import { getBooks, addBook, updateBook, deleteBook, getGenres } from '../services/api';
import { useToast, ToastContainer } from '../components/Toast';
import './Books.css';

const COLORS = ['#2D6A4F','#E76F51','#E9C46A','#264653','#8338EC','#FB5607','#3A86FF','#118AB2','#B85C38','#4A7C59'];

const defaultForm = { title: '', author: '', genre: '', isbn: '', year: '', copies: 1, description: '', coverColor: COLORS[0] };

export default function Books() {
  const [books, setBooks]       = useState([]);
  const [genres, setGenres]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [modal, setModal]       = useState(null); // null | 'add' | 'edit' | 'view'
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const { toasts, addToast }    = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [bRes, gRes] = await Promise.all([
        getBooks({ search: search || undefined, genre: genreFilter }),
        getGenres()
      ]);
      setBooks(bRes.data);
      setGenres(gRes.data);
    } catch { addToast('Failed to load books', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, genreFilter]);

  const openAdd = () => { setForm(defaultForm); setModal('add'); };
  const openEdit = (b) => { setSelected(b); setForm({ ...b }); setModal('edit'); };
  const openView = (b) => { setSelected(b); setModal('view'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSubmit = async () => {
    if (!form.title || !form.author || !form.isbn) return addToast('Title, author and ISBN are required', 'error');
    setSubmitting(true);
    try {
      if (modal === 'add') {
        await addBook(form);
        addToast('Book added successfully', 'success');
      } else {
        await updateBook(selected.id, form);
        addToast('Book updated', 'success');
      }
      closeModal(); load();
    } catch (e) {
      addToast(e.response?.data?.error || 'Failed to save', 'error');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this book?')) return;
    try { await deleteBook(id); addToast('Book deleted', 'success'); load(); }
    catch { addToast('Failed to delete', 'error'); }
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="page-body">
      <div className="flex-between page-header">
        <div>
          <h1>Books</h1>
          <p>Manage your library catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>＋ Add Book</button>
      </div>

      {/* Search & Filter */}
      <div className="search-row">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="form-control"
            placeholder="Search by title, author, ISBN…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="form-control" style={{ maxWidth: 180 }} value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
          <option value="all">All Genres</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Books Grid */}
      {loading
        ? <div className="loading-spinner"><div className="spinner" />Loading books…</div>
        : books.length === 0
          ? <div className="empty-state"><span className="empty-icon">📚</span><h3>No books found</h3><p>Try a different search or add a new book</p></div>
          : (
          <div className="books-grid">
            {books.map(b => (
              <div className="book-card" key={b.id}>
                <div className="book-cover" style={{ background: b.coverColor }}>
                  <div className="book-cover-title">{b.title}</div>
                  <div className="book-cover-author">{b.author}</div>
                </div>
                <div className="book-info">
                  <div className="book-title" title={b.title}>{b.title}</div>
                  <div className="book-author">{b.author}</div>
                  <div className="book-meta">
                    <span className="badge badge-muted">{b.genre}</span>
                    <span className={`badge ${b.available > 0 ? 'badge-green' : 'badge-red'}`}>
                      {b.available}/{b.copies} avail.
                    </span>
                  </div>
                  <div className="book-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openView(b)}>View</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {/* Add/Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'add' ? 'Add New Book' : 'Edit Book'}</h2>
              <button className="btn-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-control" value={form.title} onChange={f('title')} placeholder="Book title" />
                </div>
                <div className="form-group">
                  <label className="form-label">Author *</label>
                  <input className="form-control" value={form.author} onChange={f('author')} placeholder="Author name" />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">ISBN *</label>
                  <input className="form-control" value={form.isbn} onChange={f('isbn')} placeholder="978-..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Genre</label>
                  <input className="form-control" value={form.genre} onChange={f('genre')} placeholder="e.g. Fiction" list="genres-list" />
                  <datalist id="genres-list">{genres.map(g => <option key={g} value={g} />)}</datalist>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input className="form-control" type="number" value={form.year} onChange={f('year')} placeholder="Publication year" />
                </div>
                <div className="form-group">
                  <label className="form-label">Copies</label>
                  <input className="form-control" type="number" min="1" value={form.copies} onChange={f('copies')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" value={form.description} onChange={f('description')} placeholder="Short description…" />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Color</label>
                <div className="color-picker">
                  {COLORS.map(c => (
                    <button key={c} className={`color-dot ${form.coverColor === c ? 'selected' : ''}`}
                      style={{ background: c }} onClick={() => setForm(p => ({ ...p, coverColor: c }))} />
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving…' : modal === 'add' ? 'Add Book' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Details</h2>
              <button className="btn-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="book-detail-cover" style={{ background: selected.coverColor }}>
                <div>{selected.title}</div>
                <div style={{ opacity: .8, fontSize: '.85rem', marginTop: 4 }}>{selected.author}</div>
              </div>
              <div className="detail-grid mt-16">
                <DetailRow label="ISBN" value={selected.isbn} />
                <DetailRow label="Genre" value={selected.genre} />
                <DetailRow label="Year" value={selected.year} />
                <DetailRow label="Copies" value={`${selected.available} available / ${selected.copies} total`} />
              </div>
              {selected.description && <p style={{ color: 'var(--text-secondary)', fontSize: '.87rem', marginTop: 16, lineHeight: 1.7 }}>{selected.description}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Close</button>
              <button className="btn btn-primary" onClick={() => { closeModal(); openEdit(selected); }}>Edit Book</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}
