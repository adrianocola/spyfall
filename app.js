
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

    custom_locations[id] = req.param("custom_locations");

    console.log(custom_locations[id]);

    //save for 1 day
    setTimeout(function(){
        delete custom_locations[id];
    },24*60*60*1000); //1 day

    res.json({id: id});

});

app.get('/import_custom_locations',function(req,res){

    var custom_loc = custom_locations[req.param("id")];

    if(!custom_loc){
        return res.status(400).json(false);;
    }

    res.json({custom_locations: custom_loc});

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

        socket.emit('joined_room');

    });

    socket.on('data',function(to,data){

        data = data?data:to;

        if(player){
            sockets[room].emit('data',data);
        }else{

            if(rooms[room] && rooms[room][to]){
                rooms[room][to].emit('data',data);
            }else{
                socket.emit('invalid_socket');
            }
        }

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

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port);

});
