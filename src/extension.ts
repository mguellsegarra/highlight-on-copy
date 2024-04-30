import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Set the init flag in the context
  vscode.commands.executeCommand("setContext", "highlightOnCopy.init", true);

  let disposable = vscode.commands.registerCommand(
    "highlightOnCopy.run",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }

      const config = vscode.workspace.getConfiguration("highlightOnCopy");

      // Retrieve settings with automatic fallback to defaults defined in package.json
      const foregroundColor = config.get("foregroundColor");
      const backgroundColor = config.get("backgroundColor"); // Default is used if not set by user
      const timeout = config.get("timeout"); // Default is used if not set by user

      // Apply decoration
      const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: backgroundColor as string,
        color: foregroundColor || undefined,
      });

      // Copy to clipboard
      await vscode.commands.executeCommand("editor.action.clipboardCopyAction");

      // Apply decoration
      editor.setDecorations(decorationType, [...editor.selections]);

      // Remove decoration after specified timeout
      setTimeout(() => {
        decorationType.dispose();
      }, timeout as number);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  vscode.commands.executeCommand("setContext", "highlightOnCopy.init", false);
}
