const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { reviewWithGemini } = require("./geminiReviewer");

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
      let fixCount = 0;

      async function scanDir(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            await scanDir(fullPath);
          } else if (file.endsWith(".js")) {
            const fixes = await reviewWithGemini(fullPath);

            fixes.forEach(fix => {
              const uri = vscode.Uri.file(fullPath);
              const range = new vscode.Range(
                new vscode.Position(fix.line - 1, 0),
                new vscode.Position(fix.line - 1, fix.original.length)
              );

              edits.replace(uri, range, fix.replacement);
              fixCount++;
            });
          }
        }
      }

      await scanDir(rootPath);

      if (fixCount > 0) {
        await vscode.workspace.applyEdit(edits);
      }

      vscode.window.showInformationMessage(
        `🤖 Gemini review complete. Fixed ${fixCount} issues.`
      );
    }
  );

  context.subscriptions.push(disposable);
}

module.exports = { activate };
