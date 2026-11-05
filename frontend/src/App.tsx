import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { AiStudyPage } from './pages/AiStudyPage';
import { DocumentsRagPage } from './pages/DocumentsRagPage';
import { DiscussionsPage } from './pages/DiscussionsPage';
import { CareerPage } from './pages/CareerPage';
import { CommunityPage } from './pages/CommunityPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { PlacementIntelligencePage } from './pages/PlacementIntelligencePage';
import { AcademicRiskAdvisorPage } from './pages/AcademicRiskAdvisorPage';
import { ModelTelemetryPage } from './pages/ModelTelemetryPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Start & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Application Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/academics" element={<AcademicsPage />} />
                <Route path="/ai-study" element={<AiStudyPage />} />
                <Route path="/documents-rag" element={<DocumentsRagPage />} />
                <Route path="/discussions" element={<DiscussionsPage />} />
                <Route path="/career" element={<CareerPage />} />
                <Route path="/placement-ai" element={<PlacementIntelligencePage />} />
                <Route path="/academic-risk" element={<AcademicRiskAdvisorPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/model-telemetry" element={<ModelTelemetryPage />} />
                <Route path="/audit-logs" element={<AuditLogPage />} />
              </Route>
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
