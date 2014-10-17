var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var bodyParser = require('body-parser');
var querycompiler = require('./querycompiler');

function withDB(cb){
    var dbstring = process.env.OPENSHIFT_MONGODB_DB_URL
                 || 'mongodb://127.0.0.1:27017';
    dbstring = dbstring + '/cards';

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
    var setcode = req.params.set;
    var setquery = {code: setcode}
    var setfields = {name: 1, code: 1, releaseDate: 1, _id:0};
    sets.findOne(setquery, setfields, function(err, set){
        if(err) throw err;

        var cardquery = {printing: {"$elemMatch": {set: setcode}}};
        var cardfields = {_id: 0};
        cards.find(cardquery, cardfields, {sort: 'name'}).toArray(function(err, docs){
            if(err) throw err;
            set.cards = docs;
            res.json(set);
        });
    });
});

app.get('/api/card/:card.json', function(req, res){
    var query = {name: req.params.card};
    var fields = {_id: 0};
    cards.findOne(query, fields, function(err, doc){
        if(err) throw err;
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
    cards.find(query, fields, {sort: 'name'}).toArray(function(err, docs){
        if(err) throw err;
        res.json(docs);
    });
});

app.get('/api/querysearch/:query.json', function(req, res){
    var query;
    try {
        query = querycompiler.compile(req.params.query);
    } catch (e){
        res.json(e);
        return;
    }
    var fields = {_id: 0};
    cards.find(query, fields).toArray(function(err, docs){
        if(err) throw err;
        res.json(docs);
    });
});

app.use('/', express.static(__dirname + '/../app/'));

if(process.env.OPENSHIFT_NODEJS_IP){
    console.log(process.env.OPENSHIFT_NODEJS_IP);
    console.log(process.env.OPENSHIFT_NODEJS_PORT);
    app.listen(parseInt(process.env.OPENSHIFT_NODEJS_PORT)
             , process.env.OPENSHIFT_NODEJS_IP);
} else {
    app.listen(3000);
}

});
