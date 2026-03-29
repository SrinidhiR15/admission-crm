import { useEffect, useState } from 'react';
import { getAdmissions, markFeePaid, confirmAdmission } from '../api';
import Notice from '../components/Notice';
import Badge from '../components/Badge';

export default function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [notice, setNotice] = useState({ message: '', type: 'info' });

  useEffect(() => { load(); }, []);

  async function load() {
    try { setAdmissions(await getAdmissions()); }
    catch (e) { setNotice({ message: e.message, type: 'error' }); }
  }

  async function handleMarkPaid(id) {
    try {
      await markFeePaid(id);
      await load();
      setNotice({ message: 'Fee marked as paid.', type: 'success' });
    } catch (e) {
      setNotice({ message: e.message, type: 'error' });
    }
  }

  async function handleConfirm(id) {
    try {
      await confirmAdmission(id);
      await load();
      setNotice({ message: 'Admission confirmed successfully.', type: 'success' });
    } catch (e) {
      setNotice({ message: e.message, type: 'error' });
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Admissions</h2>
        <p>Track all seat allocations, manage fee status and confirm admissions.</p>
      </div>

      <Notice message={notice.message} type={notice.type} />

      <div className="card">
        <div className="card-title">All Admissions ({admissions.length})</div>
        {admissions.length === 0 ? (
          <div className="empty-state">No admissions allocated yet.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Admission No.</th>
                  <th>Applicant</th>
                  <th>Program</th>
                  <th>Quota</th>
                  <th>Fee Status</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((a) => (
                  <tr key={a.id}>
                    <td className="text-muted">{a.id}</td>
                    <td>
                      <code style={{
                        fontSize: 'var(--font-size-xs)',
                        background: 'var(--color-bg-elevated)',
                        padding: '2px 6px', borderRadius: 4,
                        color: 'var(--color-primary)',
                      }}>{a.admissionNumber}</code>
                    </td>
                    <td className="font-semibold">{a.applicantName}</td>
                    <td>{a.programName}</td>
                    <td><Badge variant="primary">{a.quotaType}</Badge></td>
                    <td>
                      <Badge variant={a.feeStatus === 'Paid' ? 'success' : 'warning'}>
                        {a.feeStatus}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={a.isConfirmed ? 'success' : 'neutral'}>
                        {a.isConfirmed ? 'Confirmed' : 'Pending'}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {!a.isConfirmed && a.feeStatus !== 'Paid' && (
                          <button className="btn btn-warning btn-sm" onClick={() => handleMarkPaid(a.id)}>
                            Mark Paid
                          </button>
                        )}
                        {!a.isConfirmed && a.feeStatus === 'Paid' && (
                          <button className="btn btn-success btn-sm" onClick={() => handleConfirm(a.id)}>
                            Confirm
                          </button>
                        )}
                        {a.isConfirmed && (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </div>
                    </td>
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
