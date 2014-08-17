var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var bodyParser = require('body-parser');

function addImage(card){
    if(card.imageName){
        card.imageName = "http://mtgimage.com/card/"
                          + card.imageName + ".jpg";
    }
}
function addImages(cards){
    for(var i = 0; i < cards.length; i++){
        addImage(cards[i]);
    }
}

function withDB(cb){
    var dbstring = process.env.OPENSHIFT_MONGODB_DB_URL
                 || 'mongodb://127.0.0.1:27017';
    dbstring = dbstring + '/cards';
    console.log(dbstring);

    MongoClient.connect(dbstring, function(err, db){
        if(err) throw err;
        cb(err, db);
    });
}

withDB(function(err, db) {
if(err) throw err;

var app = express();
var cards = db.collection('cards');
var sets = db.collection('sets');

app.use(bodyParser.json());

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
        addImages(docs);
        res.json(docs);
    });
});

app.get('/api/card/:card.json', function(req, res){
    var query = {name: req.params.card};
    var fields = {_id: 0};
    cards.findOne(query, fields, function(err, doc){
        if(err) throw err;
        addImage(doc);
        res.json(doc);
    });
});

app.put('/api/search', function(req, res){
    var query = {};
    var fields = {_id: 0};
    if(req.body.name) {
        query.name = new RegExp(req.body.name, "i");
    }
    if(req.body.text) {
        query.text = new RegExp(req.body.text, "i");
    }
    if(req.body.type) {
        query.type = new RegExp(req.body.type, "i");
    }
    cards.find(query, fields).toArray(function(err, docs){
        if(err) throw err;
        addImages(docs);
        res.json(docs);
    });
});

app.use('/', express.static(__dirname + '/../app/'));

var port = parseInt(process.env.OPENSHIFT_NODEJS_PORT) | 3000;
app.listen(port);

});
