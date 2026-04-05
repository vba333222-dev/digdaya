import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ContentProvider } from './admin/ContentContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Projects } from './pages/Projects';
import { ServicesPage } from './pages/ServicesPage';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfUse } from './pages/TermsOfUse';
import { Licenses } from './pages/Licenses';
import { NotFound } from './pages/NotFound';

// ── Admin CMS ──
import { AdminLayout } from './admin/AdminLayout';
import { DashboardOverview } from './admin/DashboardOverview';
import { ServicesManager } from './admin/ServicesManager';
import { ProjectsManager } from './admin/ProjectsManager';
import { MessagesManager } from './admin/MessagesManager';
import { AnalyticsView } from './admin/AnalyticsView';
import { SettingsPage } from './admin/SettingsPage';

function App() {
  return (
    <HelmetProvider>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public Routes ── */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="projects" element={<Projects />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-of-use" element={<TermsOfUse />} />
              <Route path="licenses" element={<Licenses />} />
            </Route>

            {/* ── Admin CMS Routes ── */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="messages" element={<MessagesManager />} />
              <Route path="analytics" element={<AnalyticsView />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* ── 404 ── */}
            <Route path="*" element={<Layout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </HelmetProvider>
  );
}

export default App;
