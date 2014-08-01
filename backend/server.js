var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');

function makeImageName(card){
    if(card.imageName){
        card.imageName = "http://mtgimage.com/card/"
                       + card.imageName + ".jpg";
    }
}

MongoClient.connect('mongodb://127.0.0.1:27017/cards', function(err, db) {
if(err) throw err;

var app = express();
var cards = db.collection('cards');
var sets = db.collection('sets');

app.get('/api/sets.json', function(req, res){
    var query = {};
    var fields = {name: 1, code: 1, releaseDate: 1, _id:0};
    sets.find(query, fields).toArray(function(err, docs){
        res.json(docs);
    });
});
app.get('/api/set/:set.json', function(req, res){
    var query = {printing: {"$elemMatch": {set: req.params.set}}};
    var fields = {name: 1, imageName: 1, _id: 0};
    cards.find(query, fields).toArray(function(err, docs){
        if(err) throw err;
        for(var i = 0; i < docs.length; i++){
            makeImageName(docs[i]);
        }
        res.json(docs);
    });
});

app.use('/', express.static(__dirname + '/../app/'));

app.listen(3000);

});
