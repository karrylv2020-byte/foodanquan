
import React, { useState, useMemo } from 'react';
import { Search, BookOpen, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { ADDITIVES_DATABASE } from '../data/additives';
import { RiskLevel } from '../types';

const LibraryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('全部');

  const filters = ['全部', '防腐剂', '甜味剂', '着色剂', '增稠剂', '抗氧化剂'];

  const filteredData = useMemo(() => {
    return ADDITIVES_DATABASE.filter(item => {
      const matchesSearch = 
        item.name.includes(searchTerm) || 
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        activeFilter === '全部' || 
        item.type.includes(activeFilter) ||
        (activeFilter === '着色剂' && (item.type.includes('色素') || item.type.includes('着色')));

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="min-h-screen bg-brand-light pb-24 px-6 pt-16">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-brand-blue" />
          成分百科
        </h1>
        <p className="text-brand-gray mt-1">收录 {ADDITIVES_DATABASE.length} 种常见添加剂</p>
      </div>

      <div className="relative mb-6">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="输入 E编码 或 成分名称" 
          className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue bg-white shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {/* Quick Filters */}
      <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
        {filters.map((filter, i) => (
          <button 
            key={i} 
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-sm border transition-colors ${
              activeFilter === filter 
                ? 'bg-brand-dark text-white border-brand-dark' 
                : 'bg-white text-brand-gray border-gray-100 hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Info className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>未找到相关添加剂</p>
          </div>
        ) : (
          filteredData.map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 flex flex-col gap-2 transition-transform active:scale-[0.99]">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-brand-dark text-lg">{item.name}</h3>
                    {item.code !== '-' && <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded font-mono">{item.code}</span>}
                  </div>
                  <span className="text-xs text-brand-blue bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">{item.type}</span>
                </div>
                {item.risk === RiskLevel.HIGH ? (
                  <div className="flex flex-col items-center">
                    <AlertCircle className="w-6 h-6 text-risk-high" />
                    <span className="text-[10px] text-risk-high font-bold mt-1">慎用</span>
                  </div>
                ) : item.risk === RiskLevel.MEDIUM ? (
                  <div className="flex flex-col items-center">
                    <AlertCircle className="w-6 h-6 text-risk-medium" />
                    <span className="text-[10px] text-risk-medium font-bold mt-1">少吃</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="w-6 h-6 text-brand-green" />
                    <span className="text-[10px] text-brand-green font-bold mt-1">安全</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                {item.desc}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LibraryView;
