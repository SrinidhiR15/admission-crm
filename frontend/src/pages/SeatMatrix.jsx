import { useEffect, useState } from 'react';
import { getPrograms, getSeatMatrices, createSeatMatrix } from '../api';
import Notice from '../components/Notice';

const INIT = { programId: '', totalIntake: '', kcet: '', comedk: '', management: '' };

export default function SeatMatrix() {
  const [matrices, setMatrices] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(INIT);
  const [notice, setNotice] = useState({ message: '', type: 'info' });

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [p, m] = await Promise.all([getPrograms(), getSeatMatrices()]);
      setPrograms(p);
      setMatrices(m);
    } catch (e) {
      setNotice({ message: e.message, type: 'error' });
    }
  }

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  const total = Number(form.kcet || 0) + Number(form.comedk || 0) + Number(form.management || 0);
  const formTotalIntake = Number(form.totalIntake || 0);
  const intakeMismatch = form.totalIntake && total !== formTotalIntake;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.programId) return setNotice({ message: 'Please select a program.', type: 'error' });
    if (intakeMismatch)
      return setNotice({ message: 'KCET + COMEDK + Management must equal Total Intake.', type: 'error' });
    try {
      await createSeatMatrix({
        programId: Number(form.programId),
        totalIntake: Number(form.totalIntake),
        KCET: Number(form.kcet),
        COMEDK: Number(form.comedk),
        Management: Number(form.management),
      });
      setForm(INIT);
      await load();
      setNotice({ message: 'Seat matrix saved successfully.', type: 'success' });
    } catch (e) {
      setNotice({ message: e.message, type: 'error' });
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Seat Matrix</h2>
        <p>Configure total intake and quota distribution for each program.</p>
      </div>

      <Notice message={notice.message} type={notice.type} />

      <div className="card section-gap">
        <div className="card-title">Define Seat Matrix</div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Program *</label>
              <select value={form.programId} onChange={(e) => set('programId', e.target.value)} required>
                <option value="">Select program</option>
                {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Total Intake *</label>
              <input type="number" value={form.totalIntake} onChange={(e) => set('totalIntake', e.target.value)} placeholder="e.g. 60" min="1" required />
            </div>
            <div className="form-group">
              <label>KCET Seats *</label>
              <input type="number" value={form.kcet} onChange={(e) => set('kcet', e.target.value)} placeholder="e.g. 30" min="0" required />
            </div>
            <div className="form-group">
              <label>COMEDK Seats *</label>
              <input type="number" value={form.comedk} onChange={(e) => set('comedk', e.target.value)} placeholder="e.g. 20" min="0" required />
            </div>
            <div className="form-group">
              <label>Management Seats *</label>
              <input type="number" value={form.management} onChange={(e) => set('management', e.target.value)} placeholder="e.g. 10" min="0" required />
            </div>
          </div>

          {/* Quota sum preview */}
          <div style={{
            background: intakeMismatch ? 'var(--color-danger-muted)' : 'var(--color-success-muted)',
            border: `1px solid ${intakeMismatch ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
            borderRadius: 'var(--radius-md)', padding: '10px 14px',
            fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-5)',
            color: intakeMismatch ? 'var(--color-danger)' : 'var(--color-success)',
          }}>
            {form.totalIntake
              ? `Quota sum: ${total} / ${form.totalIntake} total`
              : `Quota sum: ${total}`}
            {form.totalIntake
              ? intakeMismatch
                ? ' — ⚠ Mismatch! KCET + COMEDK + Management must equal Total Intake.'
                : ' ✓'
              : ''}
          </div>

          <button type="submit" className="btn-primary" disabled={!!intakeMismatch}>
            Save Matrix
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">Seat Matrices ({matrices.length})</div>
        {matrices.length === 0 ? (
          <div className="empty-state">No seat matrix defined yet.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Program</th><th>Total Intake</th><th>KCET</th><th>COMEDK</th><th>Management</th></tr>
              </thead>
              <tbody>
                {matrices.map((m) => (
                  <tr key={m.id}>
                    <td className="font-semibold">{m.programName}</td>
                    <td>{m.totalIntake}</td>
                    <td>{m.kcet}</td>
                    <td>{m.comedk}</td>
                    <td>{m.management}</td>
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
