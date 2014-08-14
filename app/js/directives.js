'use strict';

/* Directives */
angular.module('myApp.directives', [])
    // href to a cards details page. If inner html is empty, plug the card name
    // in as well
    // <a card-link="scope to retrive card name">INNER HTML</a>
    .directive('cardLink', function() {
        return { restrict: 'A'
               , scope: {card: '=cardLink'}
               , link: function(scope, element, attrs){
                   element.attr('href', '#/card/' + scope.card.name);
                   if(element.html() == ''){
                       element.html(scope.card.name);
                   }
               }}
    })
    .directive('cardSymbols', function() {
        return { restrict: 'A'
               , link: function(scope, element, attrs){
                    var output = '';
                    var lex = (new Lexer())
                        .setInput(attrs.cardSymbols)
                        .addRule(/{([^}]+)}/, function(l, sym) {
                            sym = sym.replace('/', '');
                            output += '<img src="http://mtgimage.com/symbol/mana/' + sym + '/16.png"></img>';
                            return sym ;
                        });
                    while(lex.lex()) {};
                    element.html(output);
               }};
    });;
