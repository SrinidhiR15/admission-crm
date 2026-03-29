import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';
import Applicants from './pages/Applicants';
import SeatMatrix from './pages/SeatMatrix';
import Allocation from './pages/Allocation';
import Admissions from './pages/Admissions';

const PAGES = {
  dashboard:  <Dashboard />,
  programs:   <Programs />,
  applicants: <Applicants />,
  seatmatrix: <SeatMatrix />,
  allocation: <Allocation />,
  admissions: <Admissions />,
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="app-main">
        <div className="app-content">
          {PAGES[activePage] ?? <Dashboard />}
        </div>
      </main>
    </div>
  );
}
