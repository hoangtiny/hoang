
export enum Mood {
  HAPPY = "Vui vẻ",
  STRESSED = "Stress",
  CHILL = "Chill",
  HEARTBROKEN = "Thất tình",
  EXCITED = "Hào hứng",
  TIRED = "Mệt mỏi"
}

export enum Ingredient {
  HOTPOT = "Lẩu",
  GRILL = "Nướng",
  SASHIMI = "Sashimi",
  SUSHI = "Sushi"
}

export interface RealMenuItem {
  id: string;
  name: string;
  description: string;
}

export interface MixResult {
  drinkName: string; // Tên biến giữ nguyên để tránh breaking logic nhưng nội dung sẽ là tên món ăn
  description: string;
  visualPrompt: string;
  realMenuMatch: string;
  voucherCode: string;
  imageUrl?: string;
}

export type Step = "HOME" | "INPUT_METHOD" | "KEYWORD_SELECT" | "SELFIE_CAPTURE" | "PROCESSING" | "RESULT";
