import { useEffect, useState } from 'react';
import { getPrograms, createProgram } from '../api';
import Notice from '../components/Notice';

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [name, setName] = useState('');
  const [notice, setNotice] = useState({ message: '', type: 'info' });

  useEffect(() => { load(); }, []);

  async function load() {
    try { setPrograms(await getPrograms()); }
    catch (e) { setNotice({ message: e.message, type: 'error' }); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return setNotice({ message: 'Program name is required.', type: 'error' });
    try {
      await createProgram({ name: name.trim() });
      setName('');
      await load();
      setNotice({ message: 'Program created successfully.', type: 'success' });
    } catch (e) {
      setNotice({ message: e.message, type: 'error' });
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Programs</h2>
        <p>Manage academic programs available for admission.</p>
      </div>

      <Notice message={notice.message} type={notice.type} />

      <div className="card section-gap">
        <div className="card-title">Add New Program</div>
        <form onSubmit={handleSubmit} className="form-row">
          <div className="form-group">
            <label htmlFor="prog-name">Program Name</label>
            <input
              id="prog-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Computer Science Engineering"
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>
            Add Program
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">All Programs ({programs.length})</div>
        {programs.length === 0 ? (
          <div className="empty-state">No programs added yet.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Program Name</th></tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id}>
                    <td className="text-muted">{p.id}</td>
                    <td className="font-semibold">{p.name}</td>
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
