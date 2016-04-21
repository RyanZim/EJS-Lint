var ejs=require('./vendor/ejs/lib/ejs.js'),
    check = require('syntax-error');
exports.parse = function(text, opts){
  var temp=ejs.Template(text, opts);
  var arr=temp.parseTemplateText();
  // console.log(arr);
  // ^^^^ enable this for development purposes
  // This allows you to see the values you will be working with below
  // Initialize var to hold the JS-Parseable String
  var scr='';
  // Initialize mode var
  // This is used to indicate the status:
  // Inside Scriptlet, mode=1
  // Outside Scriptlet, mode=0
  var mode;
  arr.forEach(function(str, i, arr){
    switch(str){
      case '<%':
        mode=1;
        scr+='  ';
        break;
      case '%>':
        mode=0;
        scr+='  ';
        break;
      case (str.match(/^\s*include\s+(\S+)/) || {}).input:
        // if old-style include, replace with whitespace
        for(x=0;x<str.length;x++){
          scr+=' ';
        }
        break;
      default:
        // If inside Scriptlet, add to scr
        if (mode === 1){
          scr+=str;
        } else {
          // Otherwise, pad with whitespace
          // if newline
          if(str.indexOf("\n") !== -1){
            // a crude way of counting newlines
            str.split("\n").forEach(function(s, n){
              if(n !== 0){
                // Add newline
                scr+="\n";
              }
              // Pad with Whitespace between each newline
              for(x=0;x<s.length;x++){
                scr+=' ';
              }
            });
          } else {
            // Pad with Whitespace if no newline
            for(x=0;x<str.length;x++){
              scr+=' ';
            }
          }
        }
    } // end of switch
  }); // endo of loop
  // console.log(scr);
  // ^^^^ enable this to debug wrong line or col numbers
  return scr;
}
exports.lint = function(text, opts){
  // parse
  var scr=exports.parse(text, opts);
  // check for errors
  var err=check(scr);
  return err; // if no errors, returns undefined
};
