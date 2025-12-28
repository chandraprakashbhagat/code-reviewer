const vscode = require("vscode");
const { scanFolder } = require("./scanner");

async function reviewWorkspace() {
  const folders = vscode.workspace.workspaceFolders;

  if (!folders) {
    vscode.window.showErrorMessage("No workspace folder open");
    return;
  }

  const rootPath = folders[0].uri.fsPath;

  await scanFolder(rootPath);

  vscode.window.showInformationMessage("AI Code Review Completed");
}

module.exports = { reviewWorkspace };
