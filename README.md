# EJS-Lint

Linter/Syntax Checker for EJS Templates.

This was born out of [mde/ejs #119](https://github.com/mde/ejs/issues/119) and the frustration of the unhelpful errors thrown if you make a simple syntax error inside a scriptlet tag.

**During this pre-v1.0.0 stage, we promise not to break backwards-compatibility in a PATCH version bump.**

## Features

EJS-Lint parses scriptlet tags (`<%`, `%>`, `<%_`, `_%>`, and `-%>`) and expression tags (`<%=` and `<%-`).

**Note:** This linter does not attempt to check for unclosed EJS tags, so if you get an error `Unexpected token` with a line number that doesn't contain any scriptlets, you most likely forgot to close a tag earlier.

It also is set up to handle old-style `include`s (`<% include filename %>`) by ignoring them. It does not lint included files regardless of the method of inclusion.

It can work with custom delimiters, just pass it in the options (if using the API) or pass the `--delimiter` (`-d`) flag on the CLI.

## Installation

```bash
npm install ejs-lint
```

## How it Works

EJS-Lint replaces everything outside a scriptlet tag with whitespace (to retain line & column numbers) and then runs the resulting (hopefully) valid JS through [node-syntax-error](https://github.com/substack/node-syntax-error) to check for errors.

We use [rewire](https://github.com/jhnns/rewire) to load [EJS](https://github.com/mde/ejs). This allows us to access `Template.parseTemplateText()`, an internal function that parses the string and splits it into an array.

**Why can't EJS do this?** At EJS, we try to keep the library lightweight. EJS-Lint uses [acorn](https://github.com/ternjs/acorn) which is too large a dependency for EJS.

## CLI

```
Usage:
 ejslint <file> [-d=?]

  If no file is specified, reads from stdin

  Options:
    --help           Show help                                           [boolean]
    --version        Show version number                                 [boolean]
    -d, --delimiter  Specify a custom delimiter ( i.e. <? instead of <% ) [string]
```

## API

Require:

```js
const ejsLint = require('ejs-lint');
```

Then do `ejsLint(text, options)`; where `text` is the EJS template and `options` are the EJS options. This returns a [node-syntax-error object](https://github.com/substack/node-syntax-error#attributes) that you can parse.

`ejsLint.lint()` is an alias for backwards-compatibility; it will be removed in a future release.

## License

MIT
