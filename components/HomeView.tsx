import React from 'react';
import { Search, ScanLine, ArrowRight } from 'lucide-react';
import { ProductAnalysis } from '../types';

interface HomeViewProps {
  onScanClick: () => void;
  recentScans: ProductAnalysis[];
  onViewResult: (data: ProductAnalysis) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onScanClick, recentScans, onViewResult }) => {
  return (
    <div className="min-h-screen bg-brand-light pb-24 px-6 pt-16">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">食安卫士</h1>
        <p className="text-brand-gray mt-1">守护您的每一口健康</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 shadow-sm">
        <input 
          type="text" 
          placeholder="搜索食品名称或添加剂 (如: E202)" 
          className="w-full h-12 pl-12 pr-4 rounded-2xl border-none outline-none text-brand-dark bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus:ring-2 focus:ring-brand-green/20"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {/* Scan CTA */}
      <div className="flex justify-center mb-10">
        <button 
          onClick={onScanClick}
          className="relative group"
        >
          <div className="w-24 h-24 rounded-full bg-brand-green shadow-xl shadow-brand-green/40 flex items-center justify-center text-white transition-transform transform group-active:scale-95">
             <ScanLine className="w-10 h-10" />
          </div>
          <div className="absolute -inset-2 rounded-full border border-brand-green/20 animate-ping"></div>
          <p className="text-center mt-3 text-brand-dark font-semibold">点击扫码</p>
        </button>
      </div>

      {/* Recent Scans */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-dark">最近扫描</h2>
        <span className="text-xs text-gray-400">查看全部</span>
      </div>

      <div className="space-y-4">
        {recentScans.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            <p>暂无记录，快去扫个零食试试！</p>
          </div>
        ) : (
          recentScans.map((scan, idx) => (
            <div 
              key={idx} 
              onClick={() => onViewResult(scan)}
              className="glass-card p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
            >
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                   scan.score >= 80 ? 'bg-brand-green' : scan.score >= 50 ? 'bg-risk-medium' : 'bg-risk-high'
                 }`}>
                   {scan.score}
                 </div>
                 <div>
                   <h3 className="font-bold text-brand-dark line-clamp-1">{scan.productName}</h3>
                   <p className="text-xs text-gray-500 line-clamp-1">{scan.summary}</p>
                 </div>
               </div>
               <ArrowRight className="w-5 h-5 text-gray-300" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeView;