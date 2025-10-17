import { GoogleGenAI } from "@google/genai";
import type { Summary } from "../types";

let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!ai) {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
}

interface SummarizeResult {
  summaries: Summary[];
}

const parseApiResponse = (responseText: string | undefined): Summary[] => {
  if (!responseText) {
    throw new Error(
      "The API did not return a summary. The content might be empty or invalid."
    );
  }

  let cleanJson = responseText.trim();
  if (cleanJson.startsWith("```json")) {
    cleanJson = cleanJson.substring(7);
    if (cleanJson.endsWith("```")) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }
  }

  const parsedResponse = JSON.parse(cleanJson);

  if (!parsedResponse.summaries || !Array.isArray(parsedResponse.summaries)) {
    throw new Error(
      "The API response did not contain the expected 'summaries' array."
    );
  }

  const summaries: Summary[] = parsedResponse.summaries.map((s: any) => ({
    subjectExplanation: s.subjectExplanation,
    detailedSummary: s.detailedSummary,
    citationWorthinessScore: s.citationWorthinessScore,
    scoreJustification: s.scoreJustification,
  }));

  return summaries;
};

export const summarizeText = async (
  text: string,
  language: string
): Promise<SummarizeResult> => {
  try {
    const geminiClient = getAiClient();

    const prompt = `Your task is to provide a detailed summary of the following text.

Analyze the text and provide a response in ${language} formatted as a single JSON object. This object must contain one key: "summaries". The value for "summaries" must be an array of exactly 3 distinct summary objects.

Each summary object in the array must have the following structure:
{
  "subjectExplanation": "Identify the main subject of the text (e.g., a person, concept, or event). Then, provide a single, concise sentence that defines or describes this subject. For example, if the text is about 'Schwannomatosis', start with 'Schwannomatosis is...'. Do NOT start with 'This text is about...'.",
  "detailedSummary": "A detailed summary of the text's content, with a strict maximum of 100 words. This summary should be written in a direct, encyclopedic style. Explain the key points as facts about the subject. Do NOT use phrases like 'The text states that...' or 'According to the text...'. Each of the 3 summaries should offer a slightly different perspective or focus on different key points from the text.",
  "citationWorthinessScore": "An integer score from 0 to 100 representing the summary's quality for citation. A high score (80+) means it is fact-dense, neutral, and encyclopedic. A low score (< 50) indicates it is vague, contains conversational phrases, or is poorly structured.",
  "scoreJustification": "A brief, one-sentence explanation for the assigned score."
}

The final output must be only the valid JSON object. Do not include any other text or markdown formatting (like \`\`\`json).

Here is the text to summarize:
---
${text}
---
`;

    const response = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const summaries = parseApiResponse(response.text);

    return {
      summaries,
    };
  } catch (error) {
    console.error("Error calling Gemini API for text:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
      throw new Error(
        "The provided API key is invalid. Please check your configuration."
      );
    }
    // Re-throw the original error to allow for specific handling in the UI.
    throw error;
  }
};
