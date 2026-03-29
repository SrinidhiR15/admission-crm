import { useEffect, useState } from 'react';
import { getApplicants, createApplicant } from '../api';
import Notice from '../components/Notice';
import Badge from '../components/Badge';

const CATEGORIES = ['GM', 'SC', 'ST', 'OBC', 'EWS'];
const ENTRY_TYPES = ['Regular', 'Lateral'];
const QUOTA_TYPES = ['KCET', 'COMEDK', 'Management'];
const DOC_STATUSES = ['Pending', 'Submitted', 'Verified'];

const INIT = {
  name: '', email: '', phone: '', category: '', entryType: '',
  quotaType: 'KCET', marks: '', documentStatus: 'Pending',
};

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [form, setForm] = useState(INIT);
  const [notice, setNotice] = useState({ message: '', type: 'info' });

  useEffect(() => { load(); }, []);

  async function load() {
    try { setApplicants(await getApplicants()); }
    catch (e) { setNotice({ message: e.message, type: 'error' }); }
  }

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setNotice({ message: 'Name is required.', type: 'error' });
    if (!form.email.trim()) return setNotice({ message: 'Email is required.', type: 'error' });
    if (!form.category) return setNotice({ message: 'Category is required.', type: 'error' });
    if (!form.entryType) return setNotice({ message: 'Entry type is required.', type: 'error' });
    try {
      await createApplicant({ ...form, marks: parseInt(form.marks) || 0 });
      setForm(INIT);
      await load();
      setNotice({ message: 'Applicant added successfully.', type: 'success' });
    } catch (e) {
      setNotice({ message: e.message, type: 'error' });
    }
  }

  function docBadge(status) {
    if (status === 'Verified') return 'success';
    if (status === 'Submitted') return 'warning';
    return 'danger';
  }

  return (
    <div>
      <div className="page-header">
        <h2>Applicants</h2>
        <p>Register and manage student applicants for admission.</p>
      </div>

      <Notice message={notice.message} type={notice.type} />

      <div className="card section-gap">
        <div className="card-title">Add New Applicant</div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Student name" required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="student@example.com" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} required>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Entry Type *</label>
              <select value={form.entryType} onChange={(e) => set('entryType', e.target.value)} required>
                <option value="">Select entry type</option>
                {ENTRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Quota Type</label>
              <select value={form.quotaType} onChange={(e) => set('quotaType', e.target.value)}>
                {QUOTA_TYPES.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Qualifying Marks</label>
              <input type="number" value={form.marks} onChange={(e) => set('marks', e.target.value)} placeholder="e.g. 95" min="0" max="100" step="1" />
            </div>
            <div className="form-group">
              <label>Document Status</label>
              <select value={form.documentStatus} onChange={(e) => set('documentStatus', e.target.value)}>
                {DOC_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary">Add Applicant</button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">All Applicants ({applicants.length})</div>
        {applicants.length === 0 ? (
          <div className="empty-state">No applicants registered yet.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Email</th><th>Phone</th>
                  <th>Category</th><th>Quota</th><th>Marks</th><th>Documents</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a) => (
                  <tr key={a.id}>
                    <td className="text-muted">{a.id}</td>
                    <td className="font-semibold">{a.name}</td>
                    <td className="text-muted">{a.email}</td>
                    <td className="text-muted">{a.phone || '—'}</td>
                    <td><Badge variant="primary">{a.category}</Badge></td>
                    <td>{a.quotaType}</td>
                    <td>{a.marks}</td>
                    <td><Badge variant={docBadge(a.documentStatus)}>{a.documentStatus || 'Pending'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
