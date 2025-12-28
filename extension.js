const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    "aiReviewer.reviewWorkspace",
    async () => {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders) {
        vscode.window.showErrorMessage("No workspace opened");
        return;
      }

      const rootPath = folders[0].uri.fsPath;
      const edits = new vscode.WorkspaceEdit();
      let issueCount = 0;

      function scanDir(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else if (file.endsWith(".js")) {
            fixFile(fullPath);
          }
        }
      }

      function fixFile(filePath) {
        const uri = vscode.Uri.file(filePath);
        const code = fs.readFileSync(filePath, "utf8");
        const lines = code.split("\n");

        lines.forEach((line, index) => {
          const range = new vscode.Range(
            new vscode.Position(index, 0),
            new vscode.Position(index, line.length)
          );

          if (line.includes("var ")) {
            const fixed = line.replace("var ", "let ");
            edits.replace(uri, range, fixed);
            issueCount++;
          }

          if (line.includes("console.log")) {
            edits.replace(uri, range, "");
            issueCount++;
          }
        });
      }

      scanDir(rootPath);

      if (issueCount > 0) {
        await vscode.workspace.applyEdit(edits);
      }

      vscode.window.showInformationMessage(
        `Auto-fix complete. Fixed ${issueCount} issues.`
      );
    }
  );

  context.subscriptions.push(disposable);
}

module.exports = { activate };
