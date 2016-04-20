var ejsLint=require('./index.js'),
    fs=require('fs');
var text=fs.readFileSync('test.ejs').toString();
var opts={};
var err=ejsLint.lint(text, opts)
console.log(err.message+'('+err.line+':'+err.column+')');