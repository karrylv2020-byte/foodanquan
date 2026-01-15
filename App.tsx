import React, { useState, useEffect } from 'react';
import { Home, Book, User, Plus, AlertTriangle } from 'lucide-react';
import HomeView from './components/HomeView';
import Scanner from './components/Scanner';
import ResultView from './components/ResultView';
import LibraryView from './components/LibraryView';
import ProfileView from './components/ProfileView';
import { ProductAnalysis, ViewState, UserProfile } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [scanData, setScanData] = useState<ProductAnalysis | null>(null);
  const [recentScans, setRecentScans] = useState<ProductAnalysis[]>([]);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    conditions: [],
    allergens: []
  });

  // Check for API Key on mount
  useEffect(() => {
    // This check mirrors the logic in geminiService to fail fast if key is missing
    const key = process.env.API_KEY;
    if (!key || key === 'undefined') {
      setIsApiKeyMissing(true);
    }
  }, []);

  // Navigation Logic
  const handleAnalyzeComplete = (data: ProductAnalysis) => {
    setScanData(data);
    setRecentScans(prev => [data, ...prev]);
    setCurrentView('RESULT');
  };

  if (isApiKeyMissing) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">未配置 API 密钥</h1>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            检测到应用缺少 <code>API_KEY</code> 环境变量。
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-xs text-gray-500 mb-6 font-mono border border-gray-100">
             Vercel Settings {'>'} Environment Variables
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-brand-dark text-white rounded-xl font-semibold hover:bg-black transition-colors"
          >
            刷新重试
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'SCANNER':
        return (
          <Scanner 
            onAnalyzeComplete={handleAnalyzeComplete} 
            onClose={() => setCurrentView('HOME')} 
            userProfile={userProfile}
          />
        );
      case 'RESULT':
        return scanData ? (
          <ResultView 
            data={scanData} 
            onBack={() => setCurrentView('HOME')} 
          />
        ) : (
          <div className="flex items-center justify-center h-screen">错误：暂无数据</div>
        );
      case 'LIBRARY':
        return <LibraryView />;
      case 'PROFILE':
        return (
          <ProfileView 
            profile={userProfile} 
            onSave={(newProfile) => {
              setUserProfile(newProfile);
              setCurrentView('HOME');
            }} 
          />
        );
      case 'HOME':
      default:
        return (
          <HomeView 
            onScanClick={() => setCurrentView('SCANNER')} 
            recentScans={recentScans}
            onViewResult={(data) => {
              setScanData(data);
              setCurrentView('RESULT');
            }}
          />
        );
    }
  };

  return (
    <div className="bg-brand-light min-h-screen text-brand-dark font-sans overflow-hidden">
      
      {/* Main Content Area */}
      <main className="w-full h-full">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Hidden in Scanner and Result) */}
      {(currentView === 'HOME' || currentView === 'LIBRARY' || currentView === 'PROFILE') && (
        <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-200 pb-safe pt-2 px-6 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-40">
          <div className="flex justify-between items-center h-16 max-w-md mx-auto">
            
            <button 
              onClick={() => setCurrentView('HOME')}
              className={`flex flex-col items-center gap-1 ${currentView === 'HOME' ? 'text-brand-green' : 'text-gray-400'}`}
            >
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">首页</span>
            </button>

            {/* Floating Action Button for Scan */}
            <div className="relative -top-6">
               <button 
                 onClick={() => setCurrentView('SCANNER')}
                 className="w-16 h-16 bg-brand-dark rounded-full shadow-lg shadow-brand-dark/30 flex items-center justify-center text-white active:scale-95 transition-transform"
               >
                 <Plus className="w-8 h-8" />
               </button>
            </div>

            <div className="flex gap-8">
              <button 
                onClick={() => setCurrentView('LIBRARY')}
                className={`flex flex-col items-center gap-1 ${currentView === 'LIBRARY' ? 'text-brand-green' : 'text-gray-400'}`}
              >
                <Book className="w-6 h-6" />
                <span className="text-[10px] font-medium">百科</span>
              </button>

              <button 
                onClick={() => setCurrentView('PROFILE')}
                className={`flex flex-col items-center gap-1 ${currentView === 'PROFILE' ? 'text-brand-green' : 'text-gray-400'}`}
              >
                <User className="w-6 h-6" />
                <span className="text-[10px] font-medium">我的</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default App;