
import { GoogleGenAI, Type } from "@google/genai";
import { Mood, Ingredient, MixResult } from "../types";
import { REAL_MENU } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateMix(params: {
  mood?: Mood;
  ingredients?: Ingredient[];
  imagePart?: { inlineData: { data: string; mimeType: string } };
}): Promise<MixResult> {
  const { mood, ingredients, imagePart } = params;

  const menuListStr = REAL_MENU.map(m => `- ${m.name} (ID: ${m.id}): ${m.description}`).join('\n');

  const systemInstruction = `Bạn là một "Siêu đầu bếp Nhật Bản" tại nhà hàng Miresto.
Nhiệm vụ: Sáng tạo ra một món ăn Nhật Bản độc bản dựa trên cảm xúc và sở thích.
Món ăn phải có tên tiếng Việt mỹ miều, đậm chất Nhật Bản và mô tả hương vị đầy cảm hứng. 
Trả về kết quả dưới dạng JSON theo schema.

Menu thật của Miresto để tham chiếu:
${menuListStr}`;

  const promptParts = [];
  if (imagePart) promptParts.push("Dựa trên thần thái của người trong ảnh này");
  if (mood) promptParts.push(`với tâm trạng chủ đạo là "${mood}"`);
  if (ingredients?.length) promptParts.push(`và phong cách ẩm thực: ${ingredients.join(', ')}`);
  
  const finalPrompt = promptParts.length > 0 
    ? `${promptParts.join(' ')}, hãy sáng tạo ra một tuyệt tác ẩm thực Nhật Bản.`
    : "Hãy sáng tạo cho tôi một món ăn Nhật Bản ngẫu nhiên bùng nổ cảm xúc.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        ...(imagePart ? [imagePart] : []),
        { text: finalPrompt }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          drinkName: { type: Type.STRING },
          description: { type: Type.STRING },
          visualPrompt: { type: Type.STRING },
          realMenuMatch: { type: Type.STRING },
          voucherCode: { type: Type.STRING }
        },
        required: ["drinkName", "description", "visualPrompt", "realMenuMatch", "voucherCode"]
      }
    }
  });

  const mixData: MixResult = JSON.parse(response.text);

  const imageGenerationParts = [];
  let finalImagePrompt = "";

  if (imagePart) {
    imageGenerationParts.push(imagePart);
    finalImagePrompt = `A high-quality portrait of the person transformed into a Japanese Master Chef presenting: "${mixData.drinkName}". Style: ${mixData.visualPrompt}. Cinematic, high-end Japanese restaurant setting, 8k resolution.`;
  } else {
    finalImagePrompt = `Professional food photography of a unique Japanese dish "${mixData.drinkName}". Style: ${mixData.visualPrompt}. High resolution, bokeh effect, elegant presentation.`;
  }

  imageGenerationParts.push({ text: finalImagePrompt });

  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: imageGenerationParts },
    config: { imageConfig: { aspectRatio: "3:4" } }
  });

  let imageUrl = "";
  for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  return { ...mixData, imageUrl };
}
