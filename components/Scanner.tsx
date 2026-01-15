import React, { useRef, useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, X, Zap } from 'lucide-react';
import { analyzeFoodImage } from '../services/geminiService';
import { ProductAnalysis, UserProfile } from '../types';

interface ScannerProps {
  onAnalyzeComplete: (data: ProductAnalysis) => void;
  onClose: () => void;
  userProfile: UserProfile;
}

const Scanner: React.FC<ScannerProps> = ({ onAnalyzeComplete, onClose, userProfile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState("正在初始化AI...");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    const steps = [
      "正在识别OCR文字...",
      "清洗配料关键词...",
      "匹配个人健康档案...",
      "生成专属评估报告..."
    ];
    
    // Simulate steps for UX
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLoadingText(steps[stepIndex]);
        stepIndex++;
      }
    }, 800);

    try {
      const result = await analyzeFoodImage(base64Image, userProfile);
      clearInterval(interval);
      onAnalyzeComplete(result);
    } catch (error) {
      console.error(error);
      alert("分析失败，请重试");
      setIsAnalyzing(false);
      setPreview(null);
      clearInterval(interval);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-12 glass bg-opacity-20 bg-black backdrop-blur-md absolute top-0 w-full z-10 border-b-0 border-white/10">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
          <X className="w-6 h-6 text-white" />
        </button>
        <span className="font-semibold text-lg tracking-wide">AI 配料检测</span>
        <button className="p-2 rounded-full hover:bg-white/10">
          <Zap className="w-6 h-6 text-yellow-400 fill-current" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative flex flex-col justify-center items-center overflow-hidden bg-neutral-900">
        
        {preview ? (
          // Captured Image Preview
          <div className="relative w-full h-full">
            <img src={preview} alt="Scan" className="w-full h-full object-cover opacity-80" />
            
            {/* Scanning Laser Effect */}
            {isAnalyzing && (
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-green shadow-[0_0_15px_rgba(45,139,87,1)] animate-scan-line z-20"></div>
            )}

            {/* Loading Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30">
                <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-brand-green font-mono text-lg animate-pulse">{loadingText}</p>
              </div>
            )}
          </div>
        ) : (
          // Camera Placeholder / Viewfinder
          <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Viewfinder Corners */}
                <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative">
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-brand-green rounded-tl-xl"></div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-brand-green rounded-tr-xl"></div>
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-brand-green rounded-bl-xl"></div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-brand-green rounded-br-xl"></div>
                  
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/50 text-sm font-medium text-center">
                    对准<br/>配料表或营养成分表
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {!isAnalyzing && (
        <div className="bg-black/80 backdrop-blur-xl p-8 pb-12 flex justify-around items-center w-full rounded-t-[30px] border-t border-white/10">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect}
            capture="environment"
          />
          
          <button 
            onClick={triggerFileInput}
            className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="text-xs">相册</span>
          </button>

          <button 
            onClick={triggerFileInput}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group"
          >
            <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform"></div>
          </button>

          <button 
             onClick={() => alert("功能开发中：开启手电筒")}
             className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs">补光</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Scanner;
