import { GoogleGenAI } from "@google/genai";
import { ContentType, Platform } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to validate API key
export const hasApiKey = () => !!apiKey;

/**
 * Generates a draft article or script based on the topic and type.
 */
export const generateDraft = async (
  topic: string,
  type: ContentType,
  platform: Platform,
  researchNotes: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  const modelId = 'gemini-3-flash-preview';
  
  let prompt = `You are an expert content creator assistant. 
  Task: Create a detailed draft for a ${platform} ${type}.
  Topic: ${topic}
  
  Research Context:
  ${researchNotes}
  
  Guidelines:
  - If it's for YouTube, include timestamps (00:00), visual cues, and a hook.
  - If it's for Substack, use engaging headings, bullet points, and a strong intro/outro.
  - Tone: Professional yet engaging and authentic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Speed over deep reasoning for drafts
      }
    });

    return response.text || "Failed to generate draft.";
  } catch (error) {
    console.error("Gemini Draft Error:", error);
    throw error;
  }
};

/**
 * Generates a thumbnail image prompt and then the image itself.
 */
export const generateThumbnail = async (topic: string, platform: Platform): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  // Step 1: Generate a good prompt for the image model
  const textModelId = 'gemini-3-flash-preview';
  const promptGenResponse = await ai.models.generateContent({
    model: textModelId,
    contents: `Write a high-quality, descriptive image generation prompt for a ${platform} thumbnail about "${topic}". 
    The style should be modern, high-contrast, clickable, and suitable for a content creator. 
    Do not include text in the image description, just the visual elements. 
    Return ONLY the prompt string.`,
  });

  const imagePrompt = promptGenResponse.text || `High quality thumbnail for ${topic}`;

  // Step 2: Generate the image
  // Using gemini-2.5-flash-image for standard generation
  const imageModelId = 'gemini-2.5-flash-image';
  
  try {
    const response = await ai.models.generateContent({
      model: imageModelId,
      contents: {
        parts: [{ text: imagePrompt }],
      },
      config: {
        imageConfig: {
            aspectRatio: "16:9", // Standard for YT and Substack headers
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Gemini Image Error:", error);
    throw error;
  }
};

/**
 * Analyze research notes (NotebookLM output) and suggest a content plan.
 */
export const suggestIdeas = async (notes: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  const modelId = 'gemini-3-flash-preview';
  try {
    const response = await ai.models.generateContent({
        model: modelId,
        contents: `Analyze these notes (possibly from NotebookLM) and suggest 3 unique content angles (1 YouTube Video, 1 Substack Article, 1 Short).
        
        Notes:
        ${notes}`
    });
    return response.text || "";
  } catch (error) {
      console.error(error);
      throw error;
  }
}
