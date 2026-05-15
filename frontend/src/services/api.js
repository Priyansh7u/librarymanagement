import axios from 'axios';

const api = axios.create({
  baseURL: 'https://librarymanagement-2-w0mv.onrender.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// ── Books ──────────────────────────────────────────────────────────────────────
export const getBooks = (params) => api.get('/books', { params });
export const getBook = (id) => api.get(`/books/${id}`);
export const addBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// ── Members ────────────────────────────────────────────────────────────────────
export const getMembers = (params) => api.get('/members', { params });
export const getMember = (id) => api.get(`/members/${id}`);
export const addMember = (data) => api.post('/members', data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data);
export const deleteMember = (id) => api.delete(`/members/${id}`);

// ── Transactions ───────────────────────────────────────────────────────────────
export const getTransactions = (params) => api.get('/transactions', { params });
export const issueBook = (data) => api.post('/transactions/issue', data);
export const returnBook = (id) => api.post(`/transactions/return/${id}`);

// ── Dashboard / Misc ───────────────────────────────────────────────────────────
export const getDashboard = () => api.get('/dashboard');
export const getGenres = () => api.get('/genres');

export default api;
