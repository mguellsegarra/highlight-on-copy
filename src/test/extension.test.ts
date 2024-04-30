import * as assert from "assert";
import * as vscode from "vscode";
import { paste } from "copy-paste";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Copy and highlight command effectively updates the clipboard for simple line selection", async () => {
    // Open a new text document
    const document = await vscode.workspace.openTextDocument({
      content: "Test text to be copied",
    });

    // Show the text document in the editor
    const editor = await vscode.window.showTextDocument(document);

    // Select the full text in the editor
    const firstLine = editor.document.lineAt(0);
    const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
    const textRange = new vscode.Range(
      firstLine.range.start,
      lastLine.range.end
    );
    editor.selection = new vscode.Selection(textRange.start, textRange.end);

    // Execute the command
    await vscode.commands.executeCommand("highlightOnCopy.run");

    // Get the paste content
    const clipboardContent = await new Promise((resolve, reject) => {
      paste((error, content) => {
        if (error) {
          reject(error);
        } else {
          resolve(content);
        }
      });
    });

    console.log({ clipboardContent });
    assert.strictEqual(
      clipboardContent,
      document.getText(),
      "The clipboard content should match the text in the editor."
    );

    if (vscode.window.activeTextEditor) {
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );
    }
  });
});
