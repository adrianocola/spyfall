
//**********
// APP
//**********
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var _ = require('lodash');
var async = require('async');
var request = require('request');
var secret = require('./secret.json');
var redis = require("redis").createClient();

var languagesMap = {
    'af': 'af-ZA',
    'ar': 'ar-SA',
    'ca': 'ca-ES',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    'cs': 'cs-CZ',
    'da': 'da-DK',
    'nl': 'nl-NL',
    'en': 'en-US',
    'en-GB': 'en-GB',
    'fi': 'fi-FI',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'el': 'el-GR',
    'he': 'he-IL',
    'hu': 'hu-HU',
    'id': 'id-ID',
    'it': 'it-IT',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'no': 'no-NO',
    'fa': 'fa-IR',
    'pl': 'pl-PL',
    'pt-PT': 'pt-PT',
    'pt-BR': 'pt-BR',
    'ro': 'ro-RO',
    'ru': 'ru-RU',
    'sr': 'sr-SP',
    'sr-CS': 'sr-CS',
    'es-ES': 'es-ES',
    'sv-SE': 'sv-SE',
    'th': 'th-TH',
    'tr': 'tr-TR',
    'uk': 'uk-UA',
    'vi': 'vi-VN',
};

redis.on("error", function (err) {
    console.log("Redis Error " + err);
});

redis.on("connect", function () {
    console.log("Connected to Redis!");
});

function makeid(size){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < size; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function genRoom(){
    while(true){
        var room = makeid(4);
        if(!rooms[room]) return room;
    }
}

function updateLocalizationStatus(){
    const status = {};

    request('https://api.crowdin.com/api/project/adrianocola-spyfall/status?key=' + secret.CROWDIN_API + '&json\n', function (error, response, body) {
        if(error) return console.log(error);
        const translations = JSON.parse(body);
        _.each(translations, function(translation) {
            const code = languagesMap[translation.code];
            status[code] = Math.round(100 * translation.approved / translation.phrases);
        });
        fs.writeFileSync('./public/status.json', JSON.stringify(status, null, 2));
    });
}
setInterval(updateLocalizationStatus, 1000 * 60 * 60 * 6); //every 6 hours
updateLocalizationStatus();

//**********
//  EXPRESS
//**********

//express middlewares
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var favicon = require('serve-favicon');

app.use(favicon('./public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(serveStatic('./public'));

//**********
// ROUTES
//**********

var custom_locations = {};

app.post('/export_custom_locations',function(req,res){

    var id = makeid(4);
    var locations = {
        custom_locations: req.param("custom_locations") || {},
        selected_locations: req.param("selected_locations") || {}
    };

    var multi = redis.multi();
    multi.set(id, JSON.stringify(locations));
    multi.expire(id, 24*60*60*7); //7 days

    multi.exec(function (err, replies) {

        if(err) return res.status(400).json(false);

        res.json({id: id});
    });

});

app.get('/import_custom_locations',function(req,res){

    redis.get(req.param("id"), function(err,value){

        if(err || !value) return res.status(400).json(false);

        var locations = JSON.parse(value);

        res.json({
            custom_locations: locations.custom_locations,
            selected_locations: locations.selected_locations,
        });

    });

});

//**********
// SOCKET.io
//**********

var sockets = {};
var rooms = {};


var io = app.io = require('socket.io')(server);

io.on('connection', function (socket) {

    var room;
    var player;

    socket.on('create_room',function(_room){

        if(!_room || sockets[_room]){
            room = genRoom();
        }else{
            room = _room;
        }

        sockets[room] = socket;

        rooms[room] = {};

        socket.emit('created_room',room);

    });

    socket.on('join_room',function(_room,_player){

        room = _room;
        player = _player;

        if(!rooms[room]) return socket.emit("invalid_room");

        rooms[room][player] = socket;

        socket.emit('joined_room', room, player);

    });

    socket.on('data',function(to,data){

        data = data?data:to;

        if(sockets[room]){

            if(player){
                return sockets[room].emit('data',data);
            }

            if(rooms[room][to]){
                return rooms[room][to].emit('data',data);
            }
        }

        socket.emit('invalid_socket');

    });

    socket.on('broadcast',function(data){

        if(player) return;

        if(!rooms[room]) return;

        for(var p in rooms[room]){
            rooms[room][p].emit('data',data);
        }


    });

    socket.on('disconnect',function(){

        if(player){
            if(sockets[room]){
                sockets[room].emit('data',{type: "PLAYER_LEFT", name: player});
            }

            if(rooms[room]){
                delete rooms[room][player];
            }

        }else{
            if(!rooms[room]) return;

            for(var p in rooms[room]){
                rooms[room][p].emit('data',{type: "DISCONNECTED"});
            }

            delete sockets[room];
            delete rooms[room];
        }

    });


});

//**********
//  START!
//**********

server.listen(4000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Spyfall listening at http://%s:%s', host, port);

});
