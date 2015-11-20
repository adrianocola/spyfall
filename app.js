
//**********
// APP
//**********
var express = require('express');
var app = express();
var server = require('http').Server(app);
var _ = require('lodash');

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

    custom_locations[id] = req.param("custom_locations") || {};

    //save for 1 day
    setTimeout(function(){
        delete custom_locations[id];
    },24*60*60*1000); //1 day

    res.json({id: id});

});

app.get('/import_custom_locations',function(req,res){

    var custom_loc = custom_locations[req.param("id")];

    if(!custom_loc){
        return res.status(400).json(false);
    }

    res.json({custom_locations: custom_loc});

});

//**********
// SOCKET.io
//**********

var rooms = {};


var io = app.io = require('socket.io')(server);

io.on('connection', function (socket) {

    var room;
    var player;

    var original_on = socket.on;

    socket.on = function(event,callback){
        original_on.call(socket,event,function(){
            if(arguments.length && typeof arguments[arguments.length-1] === 'string' && arguments[arguments.length-1].indexOf('cb_') === 0){
                var cb_number = arguments[arguments.length-1];
                arguments[arguments.length-1] = function(err,data){
                    socket.emit(cb_number,err,data);
                };
            }
            callback.apply(socket,arguments);
        });
    };

    var broadcast = function(){
        console.log('BROADCAST ' + arguments[0]);
        for(var p in rooms[room].players){
            if(p !== player){
                var socket = rooms[room].players[p];
                socket.emit.apply(socket,arguments);
            }
        }
    };

    socket.on('join_room',function(_room,_player,cb){

        if(!_room){
            room = genRoom();
        }else{
            room = _room;
        }

        if(!rooms[room]){
            rooms[room] = {
                players: {},
                data: {
                    manager: _player,
                    state: 'STOPPED',
                    createdAt: new Date()
                }
            };
        }

        player = _player;

        rooms[room].players[player] = socket;

        cb(null,{
            room: room,
            player: player,
            data: rooms[room].data
        });

    });

    socket.on('update',function(data){

        if(!player) return;

        if(!rooms[room]) return;

        rooms[room].data = _.merge(rooms[room].data,data || {});

        broadcast('update',data);

    });

    socket.on('event',function(event,data){

        if(!player) return;

        if(!rooms[room]) return;

        broadcast('event',event,data);

    });

    socket.on('disconnect',function(){

        if(player){

            if(rooms[room]){
                delete rooms[room][player];
            }

        }else{
            if(!rooms[room]) return;

            for(var p in rooms[room]){
                rooms[room][p].emit('data',{type: "DISCONNECTED"});
            }
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
