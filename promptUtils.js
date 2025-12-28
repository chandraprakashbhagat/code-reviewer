function buildPrompt(code) {
  return `
You are a senior JavaScript code reviewer.

RULES:
- Only suggest minimal line-based fixes
- Do NOT rewrite full files
- Output ONLY valid JSON
- No explanations, no markdown

FORMAT:
[
  {
    "line": 1,
    "original": "original line",
    "replacement": "fixed line"
  }
]

Review this code:
${code}
`;
}

function parseGeminiResponse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Gemini JSON parse failed");
    return [];
  }
}

module.exports = {
  buildPrompt,
  parseGeminiResponse
};
