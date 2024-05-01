import * as assert from "assert";
import * as vscode from "vscode";
import { getSelections } from "../extension";

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
    const clipboardContent = await vscode.env.clipboard.readText();

    assert.strictEqual(
      clipboardContent,
      document.getText(),
      "The clipboard content should match the text in the editor."
    );
  });

  test("Copy and highlight command effectively updates the clipboard for an empty selection", async () => {
    const document = await vscode.workspace.openTextDocument({
      content: "Test text to be copied",
    });

    // Show the text document in the editor
    const editor = await vscode.window.showTextDocument(document);

    // Select the full text in the editor
    const firstLine = editor.document.lineAt(0);
    editor.selection = new vscode.Selection(
      firstLine.range.start,
      firstLine.range.end
    );

    // Execute the command
    await vscode.commands.executeCommand("highlightOnCopy.run");

    // Get the paste content
    const clipboardContent = await vscode.env.clipboard.readText();

    assert.strictEqual(
      clipboardContent,
      document.getText(),
      "The clipboard content should match the text in the editor."
    );
  });

  test("Multi-cursor copy command effectively updates the clipboard", async () => {
    // Create a new text document with multiple lines
    const document = await vscode.workspace.openTextDocument({
      content: "First line to copy\nSecond line to copy\nThird line to copy",
    });
    const editor = await vscode.window.showTextDocument(document);

    // Set multi-cursor selection
    // Here, we're simulating selections on the first and third line
    const firstLine = editor.document.lineAt(0); // First line
    const thirdLine = editor.document.lineAt(2); // Third line

    // Create two Selection objects, one for each line we want to select with the cursor
    editor.selections = [
      new vscode.Selection(firstLine.range.start, firstLine.range.end),
      new vscode.Selection(thirdLine.range.start, thirdLine.range.end),
    ];

    // Execute your command to copy text with multi-cursor
    await vscode.commands.executeCommand("highlightOnCopy.run");

    // Check clipboard content to verify if the multi-cursor copy worked
    const expectedClipboardContent = firstLine.text + "\n" + thirdLine.text; // Assuming your extension joins lines with a newline character

    const clipboardContent = await vscode.env.clipboard.readText();

    assert.strictEqual(
      clipboardContent,
      expectedClipboardContent,
      "The clipboard content should match the combined text of the selected lines."
    );
  });

  test("Expand selections correctly for multiline selections", async () => {
    // Create a new text document with multiple lines
    const document = await vscode.workspace.openTextDocument({
      content: "First line to copy\nSecond line to copy\nThird line to copy",
    });
    const editor = await vscode.window.showTextDocument(document);

    // Create two Selection objects, one for each line we want to select with the cursor
    // Selection looks like this, with 'First' selected: |First| |line to copy
    editor.selections = [
      new vscode.Selection(
        new vscode.Position(0, 0),
        new vscode.Position(0, 5)
      ),
      new vscode.Selection(
        new vscode.Position(0, 6),
        new vscode.Position(0, 6)
      ),
    ];

    // 2nd selection should be ignored as it is an empty selection preceeded by another selection on the same line
    assert.strictEqual(getSelections(editor).length, 1);

    // Selection looks like this, with 'line' selected: |First |line| to copy
    editor.selections = [
      new vscode.Selection(
        new vscode.Position(0, 0),
        new vscode.Position(0, 0)
      ),
      new vscode.Selection(
        new vscode.Position(0, 6),
        new vscode.Position(0, 10)
      ),
    ];

    const expandedSelectionsLeadingEmpty = getSelections(editor);
    // 2nd selection should be ignored as it is an empty selection preceeded by another selection on the same line
    assert.strictEqual(expandedSelectionsLeadingEmpty.length, 2);
    assert.strictEqual(
      expandedSelectionsLeadingEmpty[0].contains(
        editor.document.lineAt(0).range
      ),
      true
    );
  });
});
