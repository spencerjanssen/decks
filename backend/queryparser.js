/*
use magiccards.info syntax
o:<card text>
*/

var fs = require("fs");
var jison= require("jison");
var bnf = fs.readFileSync("backend\\query.jison", "utf8");
var parser = new jison.Parser(bnf);

var tests = [ '("123")'
            , '"123" "123"'
            , '( "123" )'
            , '"123" AND "123"'
            , '"123" OR "123"'
            , 'NOT "123" "345"'
            , 'lightning'
            , 'o:cascade'
            ]

for(var i = 0; i < tests.length; i++){
    console.log(parser.parse(tests[i]));
}
