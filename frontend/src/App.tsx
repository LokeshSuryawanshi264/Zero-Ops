import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import EmptyPage from './pages/EmptyPage';
import UploadPage from './pages/UploadPage';
import GraphPage from './pages/GraphPage';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/reports" element={<EmptyPage title="Reports" />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
