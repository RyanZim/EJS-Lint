var ejs=require('./vendor/ejs/lib/ejs.js'),
    check = require('syntax-error');
exports.parse = function(text, opts){
  var temp=ejs.Template(text, opts);
  var arr=temp.parseTemplateText();
  var scr='';
  var mode;
  // console.log(arr);
  // ^^^^ enable this for development purposes
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
        if (mode === 1){
          scr+=str;
        } else {
          
          // if newline
          if(str.indexOf("\n") !== -1){
            // a crude way of counting newlines
            str.split("\n").forEach(function(s, n){
              if(n !== 0){
                scr+="\n";
              }
              // Pad with Whitespace
              for(x=0;x<s.length;x++){
                scr+=' ';
              }
            });
          } else {
            // Pad with Whitespace
            for(x=0;x<str.length;x++){
              scr+=' ';
            }
          }
          
        }
    }
  });
  // console.log(scr);
  // ^^^^ enable this to debug wrong line or col numbers
  return scr;
}
exports.lint = function(text, opts){
  var scr=exports.parse(text, opts);
  var err=check(scr);
  return err;
};
