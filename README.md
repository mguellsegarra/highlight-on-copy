<h2 align="center"><img src="./images/icon.png" height="128" /><br />Highlight on Copy</h2>
<p align="center"><strong>⚡️📋 Briefly flash and highlight the selected text that has been copied

</strong></p>

<!-- <p align=center>
<a href="https://marketplace.visualstudio.com/items?itemName=asvetliakov.vscode-neovim"><img src="https://img.shields.io/visual-studio-marketplace/v/asvetliakov.vscode-neovim?color=%234c1&label=Visual%20Studio%20Marketplace"></a>
</p> -->

<p align=center>
<img src="./images/demo.gif" />
</p>



This is a **VSCode extension** inspired by the [Vim](https://www.vim.org/) plugin **[vim-highlightedyank](https://github.com/machakann/vim-highlightedyank)**
 and the
**[Neovim](https://github.com/neovim/neovim) built-in [highlight yanked region feature](https://github.com/neovim/neovim/pull/12279)**.

## Configuration 🛠️

Add this command to your keymappings:

```json
  {
    "key": "cmd+c", // or Ctrl-C or other keymap that you find useful
    "command": "highlightOnCopy.run",
    "when": "editorTextFocus && highlightOnCopy.init"
  }
```

You can customize the color and the duration of the highlight with these entries in your `settings.json`:

```json
{
    "highlightOnCopy.backgroundColor": "rgba(230, 97, 89, 0.7)",
    // by default the foreground text color it's undefined, meaning the actual color won't be modified
    "highlightOnCopy.foregroundColor": undefined, // set it to #fff if you want to
    "highlightOnCopy.timeout": 500
}
```

##  License 📄

This project is licensed under the **MIT License** - see the LICENSE file for details.

##  Author 🙋🏽‍♂️

I'm Marc Güell Segarra, a freelance software developer at [Ondori.dev](https://ondori.dev).

##  Buy Me a Coffee ☕

If you found this extension useful, consider **[buying me a coffee](https://buymeacoffee.com/mguellsegarra)!**
