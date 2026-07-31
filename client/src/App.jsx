import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Success = lazy(() => import('./pages/Success.jsx'));
const CheckoutCancel = lazy(() => import('./pages/CheckoutCancel.jsx'));
const BoardsPage = lazy(() => import('./pages/WorkspacePages.jsx').then((module) => ({ default: module.BoardsPage })));
const CalendarPage = lazy(() => import('./pages/WorkspacePages.jsx').then((module) => ({ default: module.CalendarPage })));
const FilesPage = lazy(() => import('./pages/WorkspacePages.jsx').then((module) => ({ default: module.FilesPage })));
const MessagesPage = lazy(() => import('./pages/WorkspacePages.jsx').then((module) => ({ default: module.MessagesPage })));
const NotificationsPage = lazy(() => import('./pages/WorkspacePages.jsx').then((module) => ({ default: module.NotificationsPage })));
const ProjectsPage = lazy(() => import('./pages/WorkspacePages.jsx').then((module) => ({ default: module.ProjectsPage })));
const ReportsPage = lazy(() => import('./pages/WorkspacePages.jsx').then((module) => ({ default: module.ReportsPage })));
const SearchPage = lazy(() => import('./pages/WorkspacePages.jsx').then((module) => ({ default: module.SearchPage })));
const SettingsPage = lazy(() => import('./pages/WorkspacePages.jsx').then((module) => ({ default: module.SettingsPage })));
const TasksPage = lazy(() => import('./pages/WorkspacePages.jsx').then((module) => ({ default: module.TasksPage })));
const TeamPage = lazy(() => import('./pages/WorkspacePages.jsx').then((module) => ({ default: module.TeamPage })));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading page..." />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/boards" element={<ProtectedRoute><BoardsPage /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/files" element={<ProtectedRoute><FilesPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout-cancel"
          element={
            <ProtectedRoute>
              <CheckoutCancel />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
