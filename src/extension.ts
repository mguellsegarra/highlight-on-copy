import * as vscode from "vscode";

const DEFAULT_COLOR = "rgba(230, 97, 89, 0.7)";
const DEFAULT_TIMEOUT = 500;

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "highlightOnCopy.run",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      // Read configuration values
      const config = vscode.workspace.getConfiguration("highlight-on-copy");
      const backgroundColor = config.get("backgroundColor", DEFAULT_COLOR);
      const timeout = config.get("timeout", DEFAULT_TIMEOUT);

      // Copy to clipboard
      await vscode.env.clipboard.writeText(text);

      // Apply decoration
      const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor,
      });

      editor.setDecorations(decorationType, [selection]);

      // Remove decoration after specified timeout
      setTimeout(() => {
        decorationType.dispose();
      }, timeout);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
