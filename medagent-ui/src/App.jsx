import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Pages
import Dashboard from './pages/Dashboard';
import LabReport from './pages/LabReport';
import Prescription from './pages/Prescription';
import FollowUp from './pages/FollowUp';
import Alerts from './pages/Alerts';
import Recovery from './pages/Recovery';

const AppLayout = () => {
  const [lang, setLang] = useState('en');
  const location = useLocation();

  // Determine active page key from pathname
  const path = location.pathname;
  let activePageKey = 'dashboard';
  if (path === '/lab-report') activePageKey = 'lab';
  else if (path === '/prescription') activePageKey = 'prescription';
  else if (path === '/followup') activePageKey = 'followup';
  else if (path === '/alerts') activePageKey = 'alerts';
  else if (path === '/recovery') activePageKey = 'recovery';

  return (
    <>
      <Sidebar lang={lang} setLang={setLang} />
      <div className="main">
        <Topbar lang={lang} activePageKey={activePageKey} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard lang={lang} />} />
            <Route path="/lab-report" element={<LabReport lang={lang} />} />
            <Route path="/prescription" element={<Prescription lang={lang} />} />
            <Route path="/followup" element={<FollowUp lang={lang} />} />
            <Route path="/alerts" element={<Alerts lang={lang} />} />
            <Route path="/recovery" element={<Recovery lang={lang} />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
