import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
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
import { RequireRole } from './components/auth/RequireRole';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-canvas text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Member 1: Landing Experience & Reporting Journey */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/report" element={<RequireRole roles={['CITIZEN']}><ReportIssuePage /></RequireRole>} />
                <Route path="/my-reports" element={<RequireRole roles={['CITIZEN']}><MyReportsPage /></RequireRole>} />

                {/* Member 2: Public Issues Discovery & Upvoting Feed */}
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="/issues/:id" element={<IssueDetailPage />} />

                {/* Authentication & Role Portals */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Member 3: Admin Triage & Priority Engine */}
                <Route path="/admin" element={<RequireRole roles={['ADMIN']}><AdminPage /></RequireRole>} />

                {/* Officer Portal — Issue Management for Municipal Officers */}
                <Route path="/officer" element={<RequireRole roles={['OFFICER']}><OfficerPage /></RequireRole>} />

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
