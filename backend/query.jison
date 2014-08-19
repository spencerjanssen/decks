%lex
%options flex
%%
\s+             { return 'AND'; }
\s*AND\s*       { return 'AND'; }
\s*OR\s*        { return 'OR'; }
\s*NOT\s*       { return 'NOT'; }
\'[^']*\'       { return 'TEXT'; }
\"[^"]*\"       { return 'TEXT'; }
\(\s*           { return '('; }
\s*\)           { return ')'; }
[^\s\:\"\'\(\)]+ { return 'TEXT'; }
\s*<<EOF>>      { return 'EOF'; }
[oO]\:          { return 'OPERTXT'; }
[tT]\:          { return 'OPERTYP'}

/lex

%left 'AND'
%left 'OR'
%left 'NOT'
%left 'OPERTXT'
%left 'OPERTYP'

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
    | TEXT              {$$ = ["_CARDNAME:", yytext]; }
    | OPERTXT TEXT      {$$ = ["_CARDTEXT:", $2]; }
    | OPERTYP TEXT      {$$ = ["_CARDTYPE:", $2]; }
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
