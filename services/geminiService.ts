import { GoogleGenAI } from "@google/genai";
import { ProductAnalysis, RiskLevel, UserProfile } from "../types";

const MOCK_ANALYSIS: ProductAnalysis = {
  productName: "示例：香辣薯片",
  score: 42,
  summary: "含有3种高风险添加剂，高油高盐，建议少吃。",
  additives: [
    {
      name: "特丁基对苯二酚 (TBHQ)",
      code: "E319",
      riskLevel: RiskLevel.HIGH,
      description: "脂溶性抗氧化剂，防止油脂氧化。",
      healthImpact: "长期过量摄入可能影响淋巴细胞，有潜在致癌争议。"
    },
    {
      name: "谷氨酸钠 (味精)",
      code: "E621",
      riskLevel: RiskLevel.MEDIUM,
      description: "增味剂，提升鲜味。",
      healthImpact: "部分敏感人群可能出现头痛、心跳加速（中餐馆综合征）。"
    },
    {
      name: "阿斯巴甜",
      code: "E951",
      riskLevel: RiskLevel.MEDIUM,
      description: "人工甜味剂。",
      healthImpact: "苯丙酮尿症患者严禁食用。"
    },
    {
      name: "二氧化硅",
      code: "E551",
      riskLevel: RiskLevel.LOW,
      description: "抗结剂，保持粉末松散。",
      healthImpact: "人体不吸收，随粪便排出，基本无害。"
    },
  ],
  nutrition: {
    calories: 530,
    sugar: 2.5,
    sodium: 680,
    fat: 35,
    score: 40
  },
  longTermWarnings: [
    "高钠饮食可能增加高血压风险。",
    "反式脂肪酸摄入过多影响心血管健康。",
    "儿童过量摄入人工色素可能影响注意力。"
  ],
  personalizedAlerts: [],
  profileBasedSuggestions: [
    {
      condition: "高血压",
      verdict: "AVOID",
      reason: "钠含量高达680mg，占每日推荐量的34%，极易导致血压波动。"
    },
    {
      condition: "儿童",
      verdict: "CAUTION",
      reason: "含有TBHQ防腐剂和高盐分，可能影响儿童生长发育和口味偏好。"
    }
  ],
  alternatives: [
    "原味烘焙薯片 (非油炸)",
    "冻干蔬菜脆片",
    "低盐玉米片"
  ],
  novaGroup: 4
};

export const analyzeFoodImage = async (base64Image: string, profile?: UserProfile): Promise<ProductAnalysis> => {
  // Assume API_KEY is pre-configured and accessible via process.env.API_KEY per guidelines
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Use the recommended model for multimodal tasks
    const model = 'gemini-3-flash-preview'; 

    let profilePrompt = "";
    if (profile && (profile.conditions.length > 0 || profile.allergens.length > 0)) {
      profilePrompt = `
      CRITICAL - USER HEALTH PROFILE:
      Conditions: ${profile.conditions.join(', ')}
      Allergens: ${profile.allergens.join(', ')}

      INSTRUCTION: You MUST cross-reference ingredients with the profile above.
      For EACH condition in the profile, provide a structured suggestion in the "profileBasedSuggestions" array.
      - If safe, explain WHY it is safe (e.g., "Sugar free, suitable for diabetes").
      - If unsafe, explain WHY (e.g., "High sodium triggers hypertension").
      `;
    }

    const prompt = `
      You are "FoodGuard", a strict food safety expert. Analyze the provided image of a food package (ingredients list and nutrition table).
      
      ${profilePrompt}

      Return a STRICT JSON object with the following structure (no markdown code blocks, just raw JSON):
      {
        "productName": "Guessed Product Name",
        "score": 0-100 (Integer, 100 is healthiest, <50 is bad),
        "summary": "Short 1-sentence summary in Chinese",
        "additives": [
          {
            "name": "Name in Chinese",
            "code": "E-number if available",
            "riskLevel": "HIGH" | "MEDIUM" | "LOW",
            "description": "Simple explanation in Chinese (e.g. Preservative)",
            "healthImpact": "Long term risk in Chinese (Required for HIGH/MEDIUM, optional for LOW)"
          }
        ],
        "nutrition": {
          "calories": number (per 100g estimate),
          "sugar": number (g/100g),
          "sodium": number (mg/100g),
          "fat": number (g/100g),
          "score": number (0-100 based on Nutri-Score logic)
        },
        "longTermWarnings": ["Warning 1", "Warning 2"],
        "profileBasedSuggestions": [
           {
             "condition": "Condition Name (e.g. Diabetes)",
             "verdict": "SAFE" | "CAUTION" | "AVOID",
             "reason": "Detailed explanation why the user can or cannot eat this based on ingredients/nutrition."
           }
        ],
        "alternatives": ["Healthier Alternative 1", "Alternative 2"],
        "novaGroup": 1-4 (NOVA classification)
      }

      Rules:
      1. OCR and Identify ALL additives found in the image.
      2. Mark TBHQ, Sodium Benzoate, Sodium Dehydroacetate, Artificial Colors as HIGH risk.
      3. Mark safe additives like Citric Acid, Xanthan Gum as LOW risk.
      4. Language: Simplified Chinese.
    `;

    // Strip header if present in base64
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: prompt }
        ]
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    // Clean markdown formatting if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr) as ProductAnalysis;
    
    return data;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Propagate error to let UI handle it
    throw error;
  }
};