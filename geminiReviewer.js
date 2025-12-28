const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildPrompt, parseGeminiResponse } = require("./promptUtils");

console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function reviewWithGemini(filePath) {
  const code = fs.readFileSync(filePath, "utf8");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = buildPrompt(code);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return parseGeminiResponse(text);
}

module.exports = { reviewWithGemini };
