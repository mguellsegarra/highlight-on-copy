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

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      const config = vscode.workspace.getConfiguration();

      // Retrieve settings with automatic fallback to defaults defined in package.json
      const foregroundColor = config.get("foregroundColor");
      const backgroundColor = config.get("backgroundColor"); // Default is used if not set by user
      const timeout = config.get("timeout"); // Default is used if not set by user

      // Copy to clipboard
      await vscode.env.clipboard.writeText(text);

      // Apply decoration
      const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: backgroundColor as string,
        color: foregroundColor || undefined,
      });

      editor.setDecorations(decorationType, [selection]);

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
