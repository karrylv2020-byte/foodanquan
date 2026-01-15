
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Additive {
  name: string;
  code?: string; // e.g., E202
  riskLevel: RiskLevel;
  description: string; // "通俗解释"
  healthImpact?: string; // Long term risk
}

export interface NutritionInfo {
  calories: number; // per 100g/ml
  sugar: number;
  sodium: number;
  fat: number;
  score: number; // 0-100 Nutri-Score equivalent
}

export interface UserProfile {
  conditions: string[]; // e.g., 'diabetes', 'pregnancy'
  allergens: string[];  // e.g., 'Peanuts'
}

export interface ProfileSuggestion {
  condition: string; // e.g. "糖尿病"
  verdict: 'SAFE' | 'CAUTION' | 'AVOID'; // 建议等级
  reason: string; // "含有阿斯巴甜，虽然无糖但可能引起..." or "高糖分不适合..."
}

export interface ProductAnalysis {
  productName: string;
  score: number; // 0-100 Health Score
  summary: string; // One sentence summary
  additives: Additive[];
  nutrition: NutritionInfo;
  longTermWarnings: string[]; // Specific warnings
  personalizedAlerts?: string[]; // Legacy simple alerts
  profileBasedSuggestions?: ProfileSuggestion[]; // NEW: Detailed advice per condition
  alternatives?: string[]; // Suggested healthier alternatives
  novaGroup?: number; // 1-4
}

export type ViewState = 'HOME' | 'SCANNER' | 'RESULT' | 'LIBRARY' | 'PROFILE';
