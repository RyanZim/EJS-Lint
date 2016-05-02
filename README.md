# EJS-Lint

Linter/Syntax Checker for EJS Templates.

This was born out of [mde/ejs #119](https://github.com/mde/ejs/issues/119) and the frustration of the unhelpful errors thrown if you make a simple syntax error inside a scriptlet tag.

**This project is in development, and has not reached the MVP stage yet. Stay tuned; in the meantime, PR's are welcome!**

**Note:** This linter does not attempt to check for unclosed EJS tags, so if you get an error `Unexpected token` with a line number that doesn't contain any scriptlets, you most likely forgot to close a tag earlier.

## Features

At this early stage, EJS-Lint only supports parsing scriptlet tags (`<%` and `%>`). It ignores all other tags (including `<%_`, `-%>`, etc.).

It also is set up to handle old-style `include`s (`<% include filename %>`) by ignoring them. It does not lint included files regardless of the method of inclusion.

More features coming soon.

## Installation

We're not on npm yet, so I recommend manually cloning the repository. Then do `npm i` to load dependencies.

## How it Works

EJS-Lint replaces everything outside a scriptlet tag with whitespace (to retain line & column numbers) and then runs the resulting (hopefully) valid JS through [node-syntax-error](https://github.com/substack/node-syntax-error) to check for errors.

## Development Notes

For development testing, you can place your EJS in try.ejs and run `npm run try`. If there is an error, it will `console.log()` the it like this: `ErrorMessage(line:col)`.

There are two lines in the source code that you may want to uncomment during development for verbose output. If you are getting the wrong line or column number, uncomment the second one. This will print the output of `parse()` so you can see the JS that EJS-Lint is sending to node-syntax-error.

**Note:** The files in `vendor/` are **NOT** regular versions of mde/ejs! `lib/ejs.js` has the following line added:
```js
exports.Template = function(t,o){return new Template(t,o)};
```

This allows us to access `Template.parseTemplateText()`, a "plumbing" function that parses the string and splits it into an array.

## CLI

```
Usage:
 ejslint <file>

 If no file is specified, reads from stdin

Options:
  -p, --parse  Run parse() instead of lint()                           [boolean]
  --help       Show help                                               [boolean]
```

## API

Require:
```js
var ejsLint=require('./path/to/index.js');
```
Then do `ejsLint.lint(text, options)`; where `text` is the EJS template and `options` are the EJS options. This returns a [node-syntax-error object](https://github.com/substack/node-syntax-error#attributes) that you can parse. See an example in test.js.

`ejsLint.parse(text, options)` is a "plumbing" function that strips away all non-js text and replaces it with whitespace. This may be useful if you wish to use an alternate syntax checker.
