var fs = require('fs');
var file = 'AllSets.json';
var MongoClient = require('mongodb').MongoClient;

// properties of a card object that are specific to a printing
var printingprops = ['rarity', 'flavor', 'artist', 'number', 'multiverseid'
                    ,'variations', 'watermark', 'border'];

function munge(obj){
    var allcards = [];
    var sets = [];
    for(var set in obj){
        sets.push(obj[set]);
        var setcards = obj[set].cards
        delete obj[set].cards;
        for(var i = 0; i < setcards.length; i++){
            var pps = {'set': set};
            for(var j = 0; j < printingprops.length; j++){
                var prop = printingprops[j];
                var propval = setcards[i][prop];
                if(propval){
                    pps[prop] = propval;
                    delete setcards[i][prop];
                }
            }
            setcards[i]['printing'] = [pps];
        }
        allcards = allcards.concat(setcards);
    }

    return {'sets': sets, 'cards': uniqcardlist(allcards)}
}

function sortbyname(a, b){
    if(a.name == b.name){
        return 0;
    } else if(a.name < b.name){
        return -1;
    } else {
        return 1;
    }
}

//modifies the first matching card in place.  super ugly. bleh.
function uniqcardlist(cards){
    var uniq = []
    var i;
    var j;
    cards.sort(sortbyname);
    for(var i = 0; i < cards.length; i = j){
        for(j = i+1; j < cards.length && cards[i].name == cards[j].name; j++){
            cards[i].printing.push(cards[j].printing[0]);
        }
        uniq.push(cards[i]);
    }
    return uniq;
}

function withDB(cb){
    var dbstring = process.env.OPENSHIFT_MONGODB_DB_URL
                 || 'mongodb://127.0.0.1:27017';
    dbstring = dbstring + '/cards';

    MongoClient.connect(dbstring, function(err, db){
        if(err) throw err;
        cb(err, db);
    });
}

fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }

    data = JSON.parse(data);
    
    var munged = munge(data);
    withDB(function(err, db) {
        if(err) throw err;
        var sets = db.collection('sets');
            cards = db.collection('cards');
        sets.insert(munged.sets, function(err2, objs){
            if(err2) throw err;
            console.log('sets done');
        });
        cards.insert(munged.cards, function(err2, objs){
            if(err2) throw err;
            console.log('cards done');
        });
    });
});
