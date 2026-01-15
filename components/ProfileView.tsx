import React, { useState } from 'react';
import { User, Heart, AlertOctagon, Save, Check, Plus } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const CONDITIONS = [
  { id: 'diabetes', label: '糖尿病 / 高血糖', icon: '🩸' },
  { id: 'pregnancy', label: '孕妇 / 哺乳期', icon: '🤰' },
  { id: 'hypertension', label: '高血压', icon: '❤️' },
  { id: 'child', label: '婴幼儿 / 儿童', icon: '👶' },
  { id: 'lactose', label: '乳糖不耐受', icon: '🥛' },
];

const COMMON_ALLERGENS = ['花生', '坚果', '海鲜', '麸质 (Gluten)', '鸡蛋', '大豆'];

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onSave }) => {
  const [conditions, setConditions] = useState<string[]>(profile.conditions || []);
  const [allergens, setAllergens] = useState<string[]>(profile.allergens || []);
  const [customAllergen, setCustomAllergen] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const toggleCondition = (id: string) => {
    setConditions(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const removeCondition = (cond: string) => {
    setConditions(prev => prev.filter(c => c !== cond));
  };

  const addCustomCondition = () => {
    if (customCondition.trim() && !conditions.includes(customCondition.trim())) {
      setConditions([...conditions, customCondition.trim()]);
      setCustomCondition('');
    }
  };

  const toggleAllergen = (item: string) => {
    setAllergens(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const addCustomAllergen = () => {
    if (customAllergen.trim() && !allergens.includes(customAllergen.trim())) {
      setAllergens([...allergens, customAllergen.trim()]);
      setCustomAllergen('');
    }
  };

  const handleSave = () => {
    if (isSaved) return; // Prevent double clicks
    
    setIsSaved(true);
    // Provide a small delay so the user sees the "Success" state before navigating away
    setTimeout(() => {
      onSave({ conditions, allergens });
    }, 800);
  };

  // Filter out predefined conditions to identify custom ones for display
  const customConditionsList = conditions.filter(c => !CONDITIONS.some(pc => pc.id === c));

  return (
    <div className="min-h-screen bg-brand-light pb-24 px-6 pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-3">
          <User className="w-8 h-8 text-brand-blue" />
          健康档案
        </h1>
        <p className="text-brand-gray mt-1">定制您的专属避雷预警</p>
      </div>

      <div className="space-y-6">
        
        {/* Conditions Section */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-risk-high" />
            <h3 className="font-bold text-brand-dark text-lg">特殊人群 / 慢性病</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 mb-6">
            {CONDITIONS.map((cond) => (
              <button
                key={cond.id}
                onClick={() => toggleCondition(cond.id)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  conditions.includes(cond.id)
                    ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                    : 'bg-white border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cond.icon}</span>
                  <span className="font-medium">{cond.label}</span>
                </div>
                {conditions.includes(cond.id) && <Check className="w-5 h-5" />}
              </button>
            ))}
          </div>

          {/* Custom Conditions Input */}
          <div className="pt-4 border-t border-gray-100">
             <label className="text-sm text-gray-500 mb-2 block font-medium">自定义健康标签</label>
             <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  placeholder="如: 胃不好, 低GI, 少油..."
                  className="flex-1 px-4 py-2 rounded-xl border-none bg-gray-100 outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
                <button 
                  onClick={addCustomCondition}
                  className="bg-brand-dark text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
             </div>
             
             {/* Display Custom Chips */}
             {customConditionsList.length > 0 && (
               <div className="flex flex-wrap gap-2">
                  {customConditionsList.map(c => (
                       <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-brand-blue rounded-lg text-sm border border-blue-100">
                         {c}
                         <button onClick={() => removeCondition(c)} className="ml-1 text-blue-400 hover:text-blue-800">×</button>
                       </span>
                  ))}
               </div>
             )}
          </div>
        </div>

        {/* Allergens Section */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertOctagon className="w-5 h-5 text-risk-medium" />
            <h3 className="font-bold text-brand-dark text-lg">过敏源 / 忌口</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {COMMON_ALLERGENS.map((allergen) => (
              <button
                key={allergen}
                onClick={() => toggleAllergen(allergen)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  allergens.includes(allergen)
                    ? 'bg-risk-medium text-white'
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {allergen}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customAllergen}
              onChange={(e) => setCustomAllergen(e.target.value)}
              placeholder="输入其他过敏源 (如: 芒果)"
              className="flex-1 px-4 py-2 rounded-xl border-none bg-gray-100 outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
            <button 
              onClick={addCustomAllergen}
              className="bg-brand-dark text-white px-4 py-2 rounded-xl font-medium"
            >
              添加
            </button>
          </div>

          {allergens.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-gray-100">
               {allergens.map(a => (
                 <span key={a} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 text-white rounded-lg text-sm">
                   {a}
                   <button onClick={() => toggleAllergen(a)} className="ml-1 hover:text-red-300">×</button>
                 </span>
               ))}
            </div>
          )}
        </div>

        {/* Save Button with Feedback */}
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 ${
            isSaved 
              ? 'bg-brand-green text-white shadow-brand-green/30 cursor-default scale-100' 
              : 'bg-brand-dark text-white shadow-brand-dark/30 hover:bg-black'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-6 h-6 animate-[bounce_0.5s_infinite]" />
              <span>保存成功</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>保存设置</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default ProfileView;