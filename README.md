# EJS-Lint

Linter/Syntax Checker for EJS Templates.

This was born out of [mde/ejs #119](https://github.com/mde/ejs/issues/119) and the frustration of the unhelpful errors thrown if you make a simple syntax error inside a scriptlet tag.

**This project is in development, and has not reached the MVP stage yet. Stay tuned; in the meantime, PR's are welcome!**

## Features

At this early stage, EJS-Lint only supports parsing scriptlet tags (`<%`, `%>`, `<%_`, `_%>`, and `-%>`). It ignores all other tags.

It also is set up to handle old-style `include`s (`<% include filename %>`) by ignoring them. It does not lint included files regardless of the method of inclusion.

**Note:** This linter does not attempt to check for unclosed EJS tags, so if you get an error `Unexpected token` with a line number that doesn't contain any scriptlets, you most likely forgot to close a tag earlier.

More features coming soon.

## Installation

```bash
npm install ejs-lint
```

## How it Works

EJS-Lint replaces everything outside a scriptlet tag with whitespace (to retain line & column numbers) and then runs the resulting (hopefully) valid JS through [node-syntax-error](https://github.com/substack/node-syntax-error) to check for errors. See the Development Notes below for more details.

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
Then do `ejsLint.lint(text, options)`; where `text` is the EJS template and `options` are the EJS options. This returns a [node-syntax-error object](https://github.com/substack/node-syntax-error#attributes) that you can parse.

`ejsLint.parse(text, options)` is a "plumbing" function that strips away all non-js text and replaces it with whitespace. This may be useful if you wish to use an alternate syntax checker.

## Development Notes

Clone the repo; then do `npm i` to load dependencies.

For development testing, you can place your EJS in try.ejs and run `npm run try`. If there is an error, it will `console.log()` the it like this: `ErrorMessage(line:col)`.

There are two lines in the source code that you may want to uncomment during development for verbose output. If you are getting the wrong line or column number, uncomment the second one. This will print the output of `parse()` so you can see the JS that EJS-Lint is sending to node-syntax-error.

**Note:** The files in `vendor/` are **NOT** regular versions of mde/ejs! `lib/ejs.js` has the following line added:
```js
exports.Template = function(t,o){return new Template(t,o)};
```

This allows us to access `Template.parseTemplateText()`, a "plumbing" function that parses the string and splits it into an array.

Please read the [Contributing Guidelines](CONTRIBUTING.md) for more info.

## License

Copyright (c) 2016 Ryan Zimmerman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
