%lex
%options flex
%%
\s+             { return 'AND'; }
\s*AND\s*       { return 'AND'; }
\s*OR\s*        { return 'OR'; }
\s*NOT\s*       { return 'NOT'; }
\'[^']*\'       { yytext = yytext.substr(1, yyleng-2); return 'TEXT'; }
\"[^"]*\"       { yytext = yytext.substr(1, yyleng-2); return 'TEXT'; }
\(\s*           { return '('; }
\s*\)           { return ')'; }
\[\s*           { return '['; }
\s*\]           { return ']'; }
[^\s\:\"\'\(\)\=<>]+ { return 'TEXT'; }
\s*<<EOF>>      { return 'EOF'; }
[oO]\:          { return 'OPERTXT'; }
[tT]\:          { return 'OPERTYP'}
[eE]\:          { return 'OPERSET'}
[rR]\:          { return 'OPERRAR'}
[cC]\:[wubrg]+  { yytext = yytext.substr(2, yyleng); return 'COLOR'}
[cC][mM][cC](\=|([<>]\=?)) { yytext = yytext.substr(3, yyleng); return 'CMC'}

/lex

%left 'AND'
%left 'OR'
%left 'NOT'
%left 'OPERTXT'
%left 'OPERTYP'
%left 'OPERSET'
%left 'OPERRAR'
%left 'CMC'

%%

S
    : e EOF
        {return $1;}
    ;
e
    : e AND e           {$$ = ['AND', $1, $3];}
    | e OR  e           {$$ = ['OR', $1, $3];}
    | NOT e             {$$ = ['NOT', $2];}
    | '(' e ')'         {$$ = $2;}
    | '[' b ']'         {$$ = ["_BRACKET:", $2];}
    | TEXT              {$$ = ["_CARDNAME:", yytext]; }
    | OPERTXT TEXT      {$$ = ["_CARDTEXT:", $2]; }
    | OPERTYP TEXT      {$$ = ["_CARDTYPE:", $2]; }
    | OPERSET TEXT      {$$ = ["_CARDSET:", $2]; }
    | OPERRAR TEXT      {$$ = ["_CARDRARE:", $2]; }
    | CMC TEXT          {$$ = ["_CMC:", $1, $2]; }
    | COLOR             {$$ = ["_COLOR:", yytext]; }
    ;

b
    : b AND b           {$$ = $1.concat($3); }
    | OPERSET TEXT      {$$ = [["_BRACKSET:", $2]]; }
    | OPERRAR TEXT      {$$ = [["_BRACKRARE:", $2]]; }
    ;

/*

cases where whitespace is bad:
*before end of document
*after open paren
*before close paren
*before and after OR
*before and after AND
after OPER: stuff-- nah, no WS allowed here

*/
