
import { GoogleGenAI } from "@google/genai";

export const enhanceAndProcessImage = async (
  base64Image: string,
  bgColor: string,
  enhance: boolean,
  smoothness: number,
  sharpness: number
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mimeType = base64Image.split(';')[0].split(':')[1];
  const data = base64Image.split(',')[1];

  const prompt = `
    Act as a professional high-end photo studio editor.
    
    Task: Convert the provided image into a professional passport standard photo with specific retouching.
    1. Retouching Profile:
       - Smoothness Level: ${smoothness}/100. (Apply skin smoothing, remove blemishes, and soften skin texture accordingly).
       - Sharpness Level: ${sharpness}/100. (Sharpen facial features, eyes, and hair details to make it HD).
       ${enhance ? '- Automatically balance lighting, contrast, and color for a studio look.' : ''}
    2. Face Detection: Automatically detect the person's face. Ensure the head is upright and looking directly at the camera.
    3. Background: Cleanly remove the entire background. Replace it with a solid, professional flat color: ${bgColor}.
    4. Composition: Position the head and shoulders in the center. Ensure the crop is standard for passport photos.
    5. Style: High-definition studio quality. Smooth but realistic skin. Sharp but not grainy.
    6. Output: Provide ONLY the final processed image in PNG format.
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: prompt }
        ]
      }
    });

    let imageUrl = "";
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("Failed to generate processed image. Try adjusting parameters.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
