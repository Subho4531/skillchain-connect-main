import { GoogleGenerativeAI } from "@google/generative-ai";
import { ALUMNI_DATA } from "../data/alumni";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function matchResumeToAlumni(resumeText: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API Key is not configured.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert career and mentorship matching AI. 
    I will provide you with the text extracted from a student's resume, and a JSON list of available alumni mentors.
    
    Your task is to analyze the student's skills, experience, and interests from their resume, and match them with the top 3 most suitable alumni from the list.
    
    Alumni List:
    ${JSON.stringify(ALUMNI_DATA, null, 2)}
    
    Student Resume:
    ${resumeText}
    
    Return your response as a JSON array of objects, where each object has:
    - "alumnusId": The integer ID of the matched alumnus.
    - "matchPercentage": An integer between 0 and 100 representing how closely the student's background matches this alumnus.
    - "reason": A brief, compelling 1-2 sentence explanation of why this alumnus is a great match for the student based specifically on their resume and the alumnus's expertise.
    
    DO NOT wrap the response in markdown blocks like \`\`\`json. Just return the raw JSON array string.
  `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    try {
        // Strip markdown formatting if the model still returns it
        const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Failed to parse Gemini response:", responseText);
        throw new Error("Failed to parse AI matching response.");
    }
}
