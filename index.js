'use strict';
const rewire = require('rewire');
const ejs = rewire('ejs');
const EJS_INCLUDE_REGEX = require('ejs-include-regex');
const check = require('syntax-error');

function lint (text, opts) {
  opts = opts || {};
  // Use rewire to access the ejs internal function "Template"
  const Template = ejs.__get__('Template');
  const arr = new Template(text, opts).parseTemplateText();
  // Initialize mode var
  // This is used to indicate the status:
  // Inside Scriptlet, mode=1
  // Outside Scriptlet, mode=0
  let mode;
  // Initialize delimiter variable
  const d = opts.delimiter || '%';
  const js = arr.map(str => {
    switch (str) {
    case '<' + d:
    case '<' + d + '_':
      mode = 1;
      return padWhitespace(str);
    case d + '>':
    case '-' + d + '>':
    case '_' + d + '>':
      mode = 0;
      return padWhitespace(str);
    case (str.match(EJS_INCLUDE_REGEX) || {}).input:
      // if old-style include, replace with whitespace
      return padWhitespace(str);
    default:
      // If inside Scriptlet, pass through
      if (mode === 1) return  str;
      // else, pad with whitespace
      return padWhitespace(str);
    }
  }).join('');
  return check(js);
}

module.exports = lint;
// Backwards compat:
module.exports.lint = lint;

function padWhitespace(text) {
  let res = '';
  text.split('\n').forEach((line, i) => {
    // Add newline
    if (i !== 0) res += '\n';
    // Pad with whitespace between each newline
    for (let x = 0; x < line.length; x++) res += ' ';
  });
  return res;
}
