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
    console.log('===================');
    console.log('test: ' + tests[i])
    var parsed = parser.parse(tests[i]);
    console.log(parsed);
    console.log(compile(parsed));
}

function compile(ast){
    switch(ast[0]){
        case 'AND':
            return {$and: [compile(ast[1]), compile(ast[2])]};
        case 'OR':
            return {$or: [compile(ast[1]), compile(ast[2])]};
        case 'NOT':
            return {$not: compile(ast[1])}
        case '_CARDNAME:':
            return {name: new RegExp(ast[1], 'i')};
        case '_CARDTEXT:':
            return {name: new RegExp(ast[1], 'i')};
        default:
            throw ("Compiler error, unrecognized tag: " + ast[0]);
    }
}
