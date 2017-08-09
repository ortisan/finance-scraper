//const str = '"CrumbStore":{"crumb":"f49q7\u002FfQF"}';
//var reCrumb = /"CrumbStore":{"crumb":"([a-zA-Z0-9\\]+)"}/gi;

const str = "\";
var reCrumb = /\\/;

var match = reCrumb.exec(str);
console.log("Match", match[1]);