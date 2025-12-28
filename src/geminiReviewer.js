require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini client
const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function reviewWithGemini(code) {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `You are a helpful code reviewer. Review this JavaScript code and suggest minimal fixes including line numbers.\n\n${code}`,
    });

    return response.text ?? "";
  } catch (err) {
    console.error("Gemini API error:", err);
    return "";
  }
}

module.exports = { reviewWithGemini };
