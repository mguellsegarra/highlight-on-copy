import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Set the init flag in the context
  vscode.commands.executeCommand("setContext", "highlightOnCopy.init", true);

  let disposable = vscode.commands.registerCommand(
    "highlightOnCopy.run",
    async () => {
      // Copy to clipboard
      await vscode.commands.executeCommand("editor.action.clipboardCopyAction");

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

      // Apply decoration
      editor.setDecorations(decorationType, getSelections(editor));

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

export function getSelections(
  editor: vscode.TextEditor
): readonly vscode.Selection[] | vscode.Range[] {
  let lastSelectionLine = -1;

  // We need to sort the selections for the case where an additional cursor is inserted
  // before the 'active' cursor of another selection on the same line.
  const sortedSelections = [...editor.selections].sort((a, b) => {
    if (a.active.line === b.active.line) {
      return a.active.character - b.active.character;
    }
    return a.active.line - b.active.line;
  });

  const expandedSelections = sortedSelections.map((selection) => {
    // With multiple cursors on a single line, any empty selection is ignored (after the first selection)
    if (selection.isEmpty && lastSelectionLine === selection.active.line) {
      // We don't worry about setting lastSelectionLine here as this branch is only for the matching line
      return null;
    }

    lastSelectionLine = selection.active.line;

    // Return the range of the line if the selection is empty (default copy behaviour)
    if (selection.isEmpty) {
      return editor.document.lineAt(selection.active).range;
    }

    // For non-empty selections, return the selection
    return selection;
  });

  return expandedSelections.filter(
    (selection) => selection !== null
  ) as vscode.Range[];
}
