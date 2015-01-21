/*
use magiccards.info syntax
o:<card text>
*/

var fs = require("fs");
var jison= require("jison");
var bnf = fs.readFileSync("backend/query.jison", "utf8");
var parser = new jison.Parser(bnf);

/*
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
test suite cruft
*/

function expandColors(s){
    var result = Array();
    for(var i = 0; i < s.length; i++){
        switch(s[i]){
            case 'w':
                result.push('White');
                break;
            case 'u':
                result.push('Blue');
                break;
            case 'b':
                result.push('Black');
                break;
            case 'r':
                result.push('Red');
                break;
            case 'g':
                result.push('Green');
                break;
        }
    }
    return result;
}

function cmcoper(s, v){
    var ret = {};
    switch(s){
        case '<':
            ret['$lt'] = v;
            break;
        case '<=':
            ret['$let'] = v;
            break;
        case '=':
            ret = v;
            break;
        case '>=':
            ret['$gte'] = v;
            break;
        case '>':
            ret['$gt'] = v;
            break;
        default:
            throw ('Compiler error, bad cmc operator' + s);
    }
    return ret;
}

function parsenumber(s){
    var n = parseInt(s);
    if(isNaN(n)){
        throw ('Compiler error, not a number');
    }
    return parseInt(s);
}

function compileAST(ast){
    switch(ast[0]){
        case 'AND':
            return {$and: [compileAST(ast[1]), compileAST(ast[2])]};
        case 'OR':
            return {$or: [compileAST(ast[1]), compileAST(ast[2])]};
        case 'NOT':
            return {$not: compileAST(ast[1])}
        case '_CARDNAME:':
            return {name: new RegExp(ast[1], 'i')};
        case '_CARDTEXT:':
            return {text: new RegExp(ast[1], 'i')};
        case '_CARDTYPE:':
            return {type: new RegExp(ast[1], 'i')};
        case '_CARDSET:':
            return {printing: {"$elemMatch": {set: ast[1].toUpperCase()}}};
        case '_CARDRARE:':
            return {printing: {"$elemMatch": {rarity: ast[1]}}};
        case '_COLOR:':
            var cs = expandColors(ast[1]);
            return {colors: {$in: cs}};
        case '_CMC:':
            var ret = {};
            ret[cmcoper(ast[1])] = parsenumber(ast[2]);
            return {cmc: cmcoper(ast[1], parsenumber(ast[2]))};
        case '_BRACKET:':
            return compileBracket(ast[1]);
        default:
            throw ("Compiler error, unrecognized tag: " + ast[0]);
    }
}

function compileBracket(ast){
    var conds = {};
    for(var i = 0; i < ast.length; i++){
        switch(ast[i][0]){
            case '_BRACKSET:':
                conds.set = ast[i][1].toUpperCase();
                continue;
            case '_BRACKRARE:':
                conds.rarity = ast[i][1];
                continue;
        }
    }

    return {printing: {'$elemMatch': conds}};
}

function compile(s){
    return compileAST(parser.parse(s));
}

exports.compile = compile;
exports.parser = parser;
