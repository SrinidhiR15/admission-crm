import { useEffect, useState } from 'react';
import { getDashboard } from '../api';
import Notice from '../components/Notice';
import Badge from '../components/Badge';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <Notice message={error} type="error" />;
  if (!data) return <p className="text-muted text-sm">Loading dashboard…</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Real-time overview of admission progress and seat availability.</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid section-gap">
        <div className="stat-card primary">
          <div className="stat-label">Total Seats</div>
          <div className="stat-value">{data.total}</div>
          <div className="stat-sub">Across all programs</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Admitted</div>
          <div className="stat-value">{data.admitted}</div>
          <div className="stat-sub">Seats allocated</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">Remaining</div>
          <div className="stat-value">{data.remaining}</div>
          <div className="stat-sub">Seats available</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-label">Fee Pending</div>
          <div className="stat-value">{data.feePending?.length ?? 0}</div>
          <div className="stat-sub">Awaiting payment</div>
        </div>
      </div>

      {/* Quota Stats */}
      <div className="card section-gap">
        <div className="card-title">Quota-wise Seat Status</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Quota</th>
                <th>Total</th>
                <th>Filled</th>
                <th>Remaining</th>
                <th>Fill Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.quotaStats?.map((q) => {
                const rem = q.total - q.filled;
                const pct = q.total > 0 ? Math.round((q.filled / q.total) * 100) : 0;
                return (
                  <tr key={q.quota}>
                    <td><Badge variant="primary">{q.quota}</Badge></td>
                    <td>{q.total}</td>
                    <td>{q.filled}</td>
                    <td>
                      <Badge variant={rem === 0 ? 'danger' : rem < q.total * 0.2 ? 'warning' : 'success'}>
                        {rem}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          height: 6, width: 100, borderRadius: 999,
                          background: 'var(--color-border)', overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%', width: `${pct}%`,
                            background: pct > 80 ? 'var(--color-danger)' : pct > 50 ? 'var(--color-warning)' : 'var(--color-success)',
                            borderRadius: 999, transition: 'width 0.4s'
                          }} />
                        </div>
                        <span className="text-xs text-muted">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Docs */}
      {data.pendingDocs?.length > 0 && (
        <div className="card section-gap">
          <div className="card-title">Applicants with Pending Documents</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Document Status</th></tr>
              </thead>
              <tbody>
                {data.pendingDocs.map((a) => (
                  <tr key={a.id}>
                    <td className="text-muted">{a.id}</td>
                    <td>{a.name}</td>
                    <td>
                      <Badge variant={a.documentStatus === 'Submitted' ? 'warning' : 'danger'}>
                        {a.documentStatus || 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fee Pending */}
      {data.feePending?.length > 0 && (
        <div className="card">
          <div className="card-title">Fee Pending Admissions</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Applicant</th><th>Program</th><th>Status</th></tr>
              </thead>
              <tbody>
                {data.feePending.map((a) => (
                  <tr key={a.id}>
                    <td className="text-muted">{a.id}</td>
                    <td>{a.applicantName}</td>
                    <td>{a.programName}</td>
                    <td><Badge variant="warning">Fee Pending</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
