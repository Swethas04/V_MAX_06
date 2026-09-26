import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { Overview } from './pages/Overview';
import { Heatmap } from './pages/Heatmap';
import { Analytics } from './pages/Analytics';
import { Leaderboard } from './pages/Leaderboard';
import { ProblemsTable } from './pages/ProblemsTable';
import { PublicSubmit } from './pages/PublicSubmit';
import { getStoredUser, logoutUser, type UserProfile } from './api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const existing = getStoredUser();
    if (existing) {
      setCurrentUser(existing);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'heatmap':
        return {
          title: 'Jharkhand GIS Problem Heatmap',
          subtitle: 'Geographic clustering and district challenge concentration',
        };
      case 'analytics':
        return {
          title: 'Innovation Velocity & 7-Stage Pipeline',
          subtitle: 'Visualizing civic intake, institutional signal breakdown, and community impact',
        };
      case 'leaderboard':
        return {
          title: 'Academic Institution Rankings',
          subtitle: 'Evaluating university R&D output, prototypes, and CSR adoption',
        };
      case 'registry':
        return {
          title: 'Jharkhand Civic Problem Registry',
          subtitle: 'Live management of societal challenges and institutional assignments',
        };
      case 'public-submit':
        return {
          title: 'Public Civic Problem Intake Portal',
          subtitle: 'Direct community submission channel with AI deduplication & institutional attribution',
        };
      case 'overview':
      default:
        return {
          title: 'SANKALP — Command Center',
          subtitle: 'Dept. of Higher & Technical Education, Government of Jharkhand',
        };
    }
  };

  const headerInfo = getHeaderInfo();

  // If user is not authenticated, render LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'overview' && <Overview onNavigate={setActiveTab} />}
          {activeTab === 'heatmap' && <Heatmap />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'leaderboard' && <Leaderboard />}
          {activeTab === 'registry' && <ProblemsTable />}
          {activeTab === 'public-submit' && <PublicSubmit onNavigate={setActiveTab} />}
        </main>
      </div>
    </div>
  );
}

export default App;
