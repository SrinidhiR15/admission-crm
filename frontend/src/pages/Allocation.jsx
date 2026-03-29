import { useEffect, useState } from 'react';
import { getPrograms, getApplicants, getSeatMatrices, allocateAdmission } from '../api';
import Notice from '../components/Notice';
import Badge from '../components/Badge';

const QUOTAS = ['KCET', 'COMEDK', 'Management'];
const INIT = { applicantId: '', programId: '', quotaType: 'KCET' };

export default function Allocation() {
  const [programs, setPrograms] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [matrices, setMatrices] = useState([]);
  const [form, setForm] = useState(INIT);
  const [notice, setNotice] = useState({ message: '', type: 'info' });

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [p, a, m] = await Promise.all([getPrograms(), getApplicants(), getSeatMatrices()]);
      setPrograms(p);
      setApplicants(a);
      setMatrices(m);
    } catch (e) {
      setNotice({ message: e.message, type: 'error' });
    }
  }

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  // Find current seat availability for selected program & quota
  const selectedMatrix = matrices.find((m) => m.programId === Number(form.programId));
  const quotaTotal = selectedMatrix
    ? { KCET: selectedMatrix.kcet, COMEDK: selectedMatrix.comedk, Management: selectedMatrix.management }[form.quotaType] ?? 0
    : null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.applicantId) return setNotice({ message: 'Please select an applicant.', type: 'error' });
    if (!form.programId) return setNotice({ message: 'Please select a program.', type: 'error' });
    try {
      await allocateAdmission({
        applicantId: Number(form.applicantId),
        programId: Number(form.programId),
        quotaType: form.quotaType,
      });
      setForm(INIT);
      await load();
      setNotice({ message: 'Seat allocated successfully! Admission number generated.', type: 'success' });
    } catch (e) {
      setNotice({ message: e.message, type: 'error' });
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Seat Allocation</h2>
        <p>Allocate a seat to an applicant under a specific program and quota.</p>
      </div>

      <Notice message={notice.message} type={notice.type} />

      <div className="card">
        <div className="card-title">Allocate Seat</div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Applicant *</label>
              <select value={form.applicantId} onChange={(e) => set('applicantId', e.target.value)} required>
                <option value="">Select applicant</option>
                {applicants.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} — {a.quotaType}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Program *</label>
              <select value={form.programId} onChange={(e) => set('programId', e.target.value)} required>
                <option value="">Select program</option>
                {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Quota *</label>
              <select value={form.quotaType} onChange={(e) => set('quotaType', e.target.value)}>
                {QUOTAS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>

          {/* Seat availability hint */}
          {selectedMatrix && (
            <div style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: 'var(--space-5)',
              display: 'flex', gap: 24, flexWrap: 'wrap',
            }}>
              {QUOTAS.map((q) => {
                const seats = { KCET: selectedMatrix.kcet, COMEDK: selectedMatrix.comedk, Management: selectedMatrix.management }[q];
                return (
                  <div key={q} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="text-xs text-muted">{q}:</span>
                    <Badge variant={form.quotaType === q ? 'primary' : 'neutral'}>{seats} seats</Badge>
                  </div>
                );
              })}
            </div>
          )}

          <button type="submit" className="btn-primary">
            Allocate Seat
          </button>
        </form>
      </div>
    </div>
  );
}
