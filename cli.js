#!/usr/bin/env node
var argv=require('yargs')
  .usage('Usage:\n $0 <file>\n\n If no file is specified, reads from stdin')
  .option('p', {
    alias: 'parse',
    describe: 'Run parse() instead of lint()',
    type: 'boolean'
  })
  .help()
  .argv;
var ejsLint=require('./index.js');
// INTERNAL FUNCTIONS
// Read from file & return contents
function getFile(filename){
  var fs=require('fs');
  return fs.readFileSync(filename, 'utf8');
}
// Lint or parse
function lint(text){
  var err;
  if(argv.parse){
    console.log(ejsLint.parse(text, {}));
  } else {
    err=ejsLint.lint(text, {});
  }
  if(err){
    // if errors, log them
    console.log(err.message+'('+err.line+':'+err.column+')');
  }
  // exit
  process.exit();
}
// *********************** //
if (argv._[0]){
  // if filename, get file and lint
  lint(getFile(argv._[0]));
} else {
  // else, read from stdin and lint
  var text='';
  process.stdin.setEncoding('utf-8');
  process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      text+=chunk;
    }
  });
  lint(text);
}
