// This script is for development testing purposes
// It also serves as an example of how to use the API
var ejsLint=require('./index.js'),
    fs=require('fs');
var text=fs.readFileSync('test.ejs').toString();
var opts={};
var err=ejsLint.lint(text, opts)
console.log(err.message+'('+err.line+':'+err.column+')');