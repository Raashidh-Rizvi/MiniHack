import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { IssuesPage } from './pages/IssuesPage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { MyReportsPage } from './pages/MyReportsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';
import { OfficerPage } from './pages/OfficerPage';
import { CitizenDashboardPage } from './pages/CitizenDashboardPage';

// Root route handler that automatically directs Admin and Officer to their dashboards
const RootRoute: React.FC = () => {
  const { role } = useAuth();
  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  if (role === 'OFFICER') {
    return <Navigate to="/officer" replace />;
  }
  return <LandingPage />;
};

// Route only for citizens (redirects admin & officer to their dashboards)
const CitizenRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { role } = useAuth();
  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  if (role === 'OFFICER') {
    return <Navigate to="/officer" replace />;
  }
  return children;
};

// Route only for admin
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { role } = useAuth();
  if (role === 'OFFICER') {
    return <Navigate to="/officer" replace />;
  }
  if (role === 'CITIZEN' || role === 'RESIDENT') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Route only for officer
const OfficerRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { role } = useAuth();
  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  if (role === 'CITIZEN' || role === 'RESIDENT') {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-canvas text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Landing & Citizen Routes */}
                <Route path="/" element={<RootRoute />} />
                <Route
                  path="/citizen"
                  element={
                    <CitizenRoute>
                      <CitizenDashboardPage />
                    </CitizenRoute>
                  }
                />
                <Route
                  path="/report"
                  element={
                    <CitizenRoute>
                      <ReportIssuePage />
                    </CitizenRoute>
                  }
                />
                <Route
                  path="/my-reports"
                  element={
                    <CitizenRoute>
                      <MyReportsPage />
                    </CitizenRoute>
                  }
                />

                {/* Member 2: Public Issues Discovery & Upvoting Feed */}
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="/issues/:id" element={<IssueDetailPage />} />

                {/* Authentication & Role Portals */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Member 3: Admin Triage & Priority Engine */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />

                {/* Officer Portal — Issue Management for Municipal Officers */}
                <Route
                  path="/officer"
                  element={
                    <OfficerRoute>
                      <OfficerPage />
                    </OfficerRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <BottomNav />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
