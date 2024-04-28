import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.copyHighlight",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      // Copy to clipboard
      await vscode.env.clipboard.writeText(text);

      // Apply decoration
      const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: "rgba(230, 97, 89, 0.7)",
      });

      editor.setDecorations(decorationType, [selection]);

      // Remove decoration after 500 milliseconds
      setTimeout(() => {
        decorationType.dispose();
      }, 200);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
