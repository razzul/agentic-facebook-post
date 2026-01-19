
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

/**
 * Generates a high-quality trivia post using advanced prompt engineering.
 * Employs a specific persona and structural requirements for maximum engagement.
 */
export async function generateTrivia(topic: string = "Bicycles and Cycling"): Promise<GeminiResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate an elite daily trivia post for a cycling community focused on ${topic}. 
      
      CRITICAL REQUIREMENTS:
      1. DIFFICULTY: Aim for 'medium-hard'. It should surprise even long-time enthusiasts.
      2. ACCURACY: Ensure the fact is historically or technically verifiable. Avoid common myths.
      3. ENGAGEMENT: Frame the question to provoke thought. The "funFact" should add a "wow" factor.
      4. VISUALIZATION: The "imageDescription" must be a cinematic, high-detail prompt for an AI image generator (modern, professional photography style).
      
      TOPIC FOCUS: ${topic}`,
      config: {
        systemInstruction: "You are VeloBot, a world-class cycling historian and mechanical engineer. Your tone is enthusiastic, authoritative, and slightly witty. You specialize in the Tour de France, cycling technology evolution, and legendary riders.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { 
              type: Type.STRING, 
              description: "A compelling trivia question that challenges the reader's knowledge." 
            },
            answer: { 
              type: Type.STRING, 
              description: "The direct and accurate answer to the question." 
            },
            funFact: { 
              type: Type.STRING, 
              description: "An extra layer of context or a secondary surprising fact related to the topic." 
            },
            imageDescription: { 
              type: Type.STRING, 
              description: "A professional photography prompt describing a scene related to the trivia (e.g., 'A vintage 1920s steel frame bicycle leaning against a stone wall in the French Alps, golden hour lighting, 8k resolution')." 
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4-6 highly relevant and trending cycling hashtags."
            }
          },
          required: ["question", "answer", "funFact", "imageDescription", "hashtags"]
        },
        temperature: 0.8,
      }
    });

    const result = JSON.parse(response.text.trim());
    return result as GeminiResponse;
  } catch (error) {
    console.error("Error generating high-quality trivia:", error);
    throw error;
  }
}

/**
 * Generates an image based on the descriptive prompt provided by the trivia generator.
 * Enhanced with stylistic wrappers to ensure professional editorial quality and strictly no text.
 */
export async function generateImageFromDescription(description: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `PRO PHOTOGRAPHY TASK: 
            Convert the following description into a stunning, cinematic editorial photograph for a high-end cycling magazine.
            
            SCENE: ${description}
            
            AESTHETIC GUIDELINES:
            - Professional cycling photography style (comparable to Rouleur or Peloton Magazine).
            - Atmospheric lighting: Use golden hour, misty mornings, or dramatic high-contrast studio lighting as appropriate.
            - Material fidelity: Emphasize textures like carbon fiber weave, brushed steel, weathered leather, and glistening asphalt.
            - Composition: Dynamic angles, shallow depth of field (bokeh), and professional framing.
            
            NEGATIVE CONSTRAINTS (CRITICAL):
            - ABSOLUTELY NO TEXT, letters, numbers, or characters.
            - No watermarks, logos, or corporate branding.
            - No captions or UI overlays.
            - No illustrations, sketches, or cartoonish elements.
            
            Final output: A photorealistic, high-fidelity 8k editorial image.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        },
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content || !candidate.content.parts) {
      throw new Error("Empty response from image generation model.");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data returned from model (possible safety filter trigger).");
  } catch (error) {
    console.error("Error in generateImageFromDescription:", error);
    throw error;
  }
}
