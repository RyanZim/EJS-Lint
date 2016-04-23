// This script is for development testing purposes
// It also serves as an example of how to use the API
var ejsLint=require('./index.js'),
    fs=require('fs');
var text=fs.readFileSync('try.ejs').toString();
var opts={};
var err=ejsLint.lint(text, opts);
if (err){
  console.log(err.message+'('+err.line+':'+err.column+')');
}