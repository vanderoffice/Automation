import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AgreementPage from './pages/AgreementPage'
import WorkflowPage from './pages/WorkflowPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/agreement" replace />} />
        <Route path="agreement" element={<AgreementPage />} />
        <Route path="workflow" element={<WorkflowPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/agreement" replace />} />
      </Route>
    </Routes>
  )
}
