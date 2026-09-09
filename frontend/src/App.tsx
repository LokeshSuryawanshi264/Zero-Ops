import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import EmptyPage from './pages/EmptyPage';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<EmptyPage title="Upload & Ingestion" />} />
          <Route path="/graph" element={<EmptyPage title="Graph View" />} />
          <Route path="/reports" element={<EmptyPage title="Reports" />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
