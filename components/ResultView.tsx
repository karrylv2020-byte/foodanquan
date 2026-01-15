
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Activity, Info, AlertOctagon, CheckCircle, ThumbsUp, ThumbsDown, UserCheck } from 'lucide-react';
import { ProductAnalysis, RiskLevel } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ResultViewProps {
  data: ProductAnalysis;
  onBack: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-brand-green';
  if (score >= 50) return 'text-risk-medium';
  return 'text-risk-high';
};

const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-brand-green';
  if (score >= 50) return 'bg-risk-medium';
  return 'bg-risk-high';
};

const ResultView: React.FC<ResultViewProps> = ({ data, onBack }) => {
  const [expandedAdditive, setExpandedAdditive] = useState<string | null>(null);
  const [isHealthExpanded, setIsHealthExpanded] = useState(false);

  const riskAdditives = data.additives.filter(a => a.riskLevel !== RiskLevel.LOW);
  const safeAdditives = data.additives.filter(a => a.riskLevel === RiskLevel.LOW);

  const toggleAdditive = (name: string) => {
    setExpandedAdditive(expandedAdditive === name ? null : name);
  };

  useEffect(() => {
    if (riskAdditives.length > 0) {
      setExpandedAdditive(riskAdditives[0].name);
    }
  }, [data]);

  const nutrientData = [
    { name: '脂肪', value: data.nutrition.fat, color: '#FF9500' },
    { name: '糖', value: data.nutrition.sugar, color: '#FF3B30' },
    { name: '蛋白质', value: Math.max(0, 100 - data.nutrition.fat - data.nutrition.sugar - 10), color: '#34C759' }, 
  ];

  return (
    <div className="min-h-screen bg-brand-light pb-24 overflow-y-auto">
      {/* Header with Score */}
      <div className="relative bg-white pb-8 rounded-b-[40px] shadow-sm border-b border-gray-100">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-light to-white opacity-50 z-0 rounded-b-[40px]"></div>
        
        <div className="relative z-10 pt-12 px-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm">
              <ArrowLeft className="w-5 h-5 text-brand-dark" />
            </button>
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">分析报告</span>
            <div className="w-9"></div> 
          </div>

          <div className="flex flex-col items-center">
            
            {/* PERSONALIZED HEALTH SUGGESTIONS */}
            {data.profileBasedSuggestions && data.profileBasedSuggestions.length > 0 && (
              <div className="w-full mb-6 space-y-3">
                 <div className="flex items-center gap-2 mb-1 justify-center">
                    <UserCheck className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-wide">您的专属健康建议</span>
                 </div>
                 {data.profileBasedSuggestions.map((suggestion, idx) => (
                   <div 
                    key={idx} 
                    className={`rounded-xl p-4 border flex gap-3 shadow-sm ${
                      suggestion.verdict === 'AVOID' 
                        ? 'bg-red-50 border-red-100 text-red-900' 
                        : suggestion.verdict === 'CAUTION'
                        ? 'bg-amber-50 border-amber-100 text-amber-900'
                        : 'bg-green-50 border-green-100 text-green-900'
                    }`}
                   >
                      <div className="flex-shrink-0 mt-0.5">
                        {suggestion.verdict === 'AVOID' && <ThumbsDown className="w-5 h-5 text-risk-high" />}
                        {suggestion.verdict === 'CAUTION' && <AlertTriangle className="w-5 h-5 text-risk-medium" />}
                        {suggestion.verdict === 'SAFE' && <ThumbsUp className="w-5 h-5 text-brand-green" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm bg-white/60 px-2 py-0.5 rounded shadow-sm">
                            {suggestion.condition}
                          </span>
                          <span className={`text-xs font-bold ${
                             suggestion.verdict === 'AVOID' ? 'text-risk-high' : suggestion.verdict === 'CAUTION' ? 'text-risk-medium' : 'text-brand-green'
                          }`}>
                            {suggestion.verdict === 'AVOID' ? '不建议食用' : suggestion.verdict === 'CAUTION' ? '需注意' : '可以食用'}
                          </span>
                        </div>
                        <p className="text-sm leading-snug opacity-90">{suggestion.reason}</p>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            <div className={`w-32 h-32 rounded-full border-[6px] ${getScoreColor(data.score)} border-opacity-20 flex items-center justify-center mb-4 relative`}>
              <div className={`absolute inset-0 rounded-full border-[6px] ${getScoreColor(data.score)} border-t-transparent border-l-transparent rotate-45`}></div>
              <div className="text-center">
                <span className={`text-5xl font-bold ${getScoreColor(data.score)}`}>{data.score}</span>
                <p className="text-xs text-gray-400 mt-1">健康得分</p>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-brand-dark text-center mb-2">{data.productName}</h1>
            
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold text-white mb-6 ${getScoreBg(data.score)} shadow-lg shadow-${getScoreBg(data.score).replace('bg-', '')}/30`}>
              {data.score >= 80 ? '建议购买' : data.score >= 50 ? '偶尔食用' : '不推荐 / 少吃'}
            </div>

            <p className="text-center text-brand-gray px-6 leading-relaxed">
              {data.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-6">
        
        {/* Risk Additives Section */}
        {riskAdditives.length > 0 && (
          <div className="glass-card p-5 border-l-4 border-risk-high">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-risk-high" />
              <h3 className="font-bold text-brand-dark text-lg">⚠️ 重点关注：风险成分 ({riskAdditives.length})</h3>
            </div>
            <div className="space-y-3">
              {riskAdditives.map((additive, idx) => (
                <div key={idx} className="bg-red-50 rounded-xl overflow-hidden transition-all duration-300 border border-red-100">
                  <div 
                    onClick={() => toggleAdditive(additive.name)}
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${additive.riskLevel === RiskLevel.HIGH ? 'bg-risk-high' : 'bg-risk-medium'}`}></span>
                      <span className="font-bold text-brand-dark">{additive.name}</span>
                      {additive.code && <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">{additive.code}</span>}
                    </div>
                    {expandedAdditive === additive.name ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </div>
                  
                  {expandedAdditive === additive.name && (
                    <div className="px-4 pb-4 text-sm text-gray-700 bg-red-100/30 border-t border-red-100/50 pt-3">
                       <p className="mb-2 flex gap-2">
                         <Info className="w-4 h-4 text-risk-medium mt-0.5 flex-shrink-0" />
                         <span><span className="font-semibold text-brand-dark">通俗解释：</span>{additive.description}</span>
                       </p>
                       <p className="flex gap-2">
                         <AlertTriangle className="w-4 h-4 text-risk-high mt-0.5 flex-shrink-0" />
                         <span><span className="font-semibold text-risk-high">潜在危害：</span>{additive.healthImpact}</span>
                       </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safe Additives Section */}
        {safeAdditives.length > 0 && (
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-brand-green" />
              <h3 className="font-bold text-brand-dark text-lg">其他检出成分 ({safeAdditives.length})</h3>
            </div>
            <div className="space-y-2">
              {safeAdditives.map((additive, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 bg-green-50/50 rounded-xl border border-green-100/50">
                    <div className="flex items-center gap-3">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                       <span className="font-medium text-brand-dark">{additive.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 max-w-[50%] text-right truncate">{additive.description}</span>
                 </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition Dashboard */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
             <Activity className="w-5 h-5 text-brand-blue" />
             <h3 className="font-bold text-brand-dark text-lg">营养分布</h3>
          </div>
          <div className="flex items-center">
             <div className="w-1/2 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={nutrientData}
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {nutrientData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="w-1/2 space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-high"></span>糖</span>
                  <span className="font-bold">{data.nutrition.sugar}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-medium"></span>脂肪</span>
                  <span className="font-bold">{data.nutrition.fat}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400"></span>钠</span>
                  <span className="font-bold">{data.nutrition.sodium}mg</span>
                </div>
                 <div className="flex justify-between items-center border-t pt-1 mt-1">
                  <span className="text-gray-500">热量</span>
                  <span className="font-bold text-brand-dark">{data.nutrition.calories} kcal</span>
                </div>
             </div>
          </div>
        </div>

        {/* Long Term Risks */}
        <div className="glass-card p-5 bg-gradient-to-br from-white to-gray-50">
           <div 
             onClick={() => setIsHealthExpanded(!isHealthExpanded)}
             className="flex items-center justify-between cursor-pointer"
           >
             <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-gray-500" />
                <h3 className="font-bold text-brand-dark text-lg">长期健康预警</h3>
             </div>
             {isHealthExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
           </div>
           
           {isHealthExpanded && (
             <div className="mt-4 space-y-2">
                {data.longTermWarnings.map((warning, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-risk-high mt-1">•</span>
                    <p>{warning}</p>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Alternatives */}
        {data.alternatives && data.alternatives.length > 0 && (
           <div className="glass-card p-5 border-l-4 border-l-brand-green">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-brand-green" />
                <h3 className="font-bold text-brand-dark text-lg">更优替代方案</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.alternatives.map((alt, i) => (
                  <span key={i} className="px-3 py-1.5 bg-brand-green/10 text-brand-green rounded-lg text-sm font-medium">
                    {alt}
                  </span>
                ))}
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default ResultView;
