const fs = require("fs");
const fetch = require("node-fetch");
const { isValidJavaScript } = require("./astUtils");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function reviewFile(filePath) {
  const originalCode = fs.readFileSync(filePath, "utf8");

  const aiResult = await callAI(originalCode);

  if (!aiResult || !isValidJavaScript(aiResult.fixedCode)) return;

  if (aiResult.fixedCode !== originalCode) {
    fs.writeFileSync(filePath, aiResult.fixedCode, "utf8");
  }
}

async function callAI(code) {
  const prompt = buildPrompt(code);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1
    })
  });

  const data = await response.json();

  return JSON.parse(data.choices[0].message.content);
}

function buildPrompt(code) {
  return `
You are an expert JavaScript code reviewer.

TASK:
- Fix bugs
- Optimize logic
- Improve readability
- Preserve functionality

OUTPUT STRICT JSON:
{
  "fixedCode": "FULL corrected code"
}

CODE:
${code}
`;
}

module.exports = { reviewFile };
