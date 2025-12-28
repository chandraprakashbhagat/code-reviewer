const fs = require("fs");
const path = require("path");
const { reviewFile } = require("./aiReviewer");

async function scanFolder(folderPath) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);

    if (file === "node_modules") continue;

    if (fs.statSync(fullPath).isDirectory()) {
      await scanFolder(fullPath);
    } else if (file.endsWith(".js")) {
      await reviewFile(fullPath);
    }
  }
}

module.exports = { scanFolder };
