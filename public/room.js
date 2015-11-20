var Room = function(){
    this._data = {
        attributes: {},
        changes: {}
    };
};

//room._debug - enable or disable debug
//room._online - if room is online
//room._room - room code
//room._player - current player name
//room._data - some room data (players, meta, etc)

//event emitter ( https://github.com/jeromeetienne/microevent.js )
Room.prototype.on = Room.prototype.addListener = function (event, fct) {
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fct);
};

Room.prototype.off = Room.prototype.removeListener = function (event, fct) {
    this._events = this._events || {};
    if (event in this._events === false)    return;
    this._events[event].splice(this._events[event].indexOf(fct), 1);
};

Room.prototype.emit = function (event /* , args... */) {
    this._events = this._events || {};
    if (event in this._events === false)    return;
    for (var i = 0; i < this._events[event].length; i++) {
        this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
};


//data manipulation
Room.prototype._extend = function(target, source) {
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            if (target[prop] && typeof source[prop] === 'object') {
                this._extend(target[prop], source[prop]);
            }
            else {
                target[prop] = source[prop];
            }
        }
    }
    return target;
};

Room.prototype._set = function(prop,value,options){
    options = options || {};

    if(typeof prop === 'string'){
        var path = prop.split('\.');
        var attributes_head = this._data.attributes;
        var changes_head = this._data.changes;
        for(var i=0; i<path.length; i++){
            var p = path[i];
            if(i>=path.length-1){
                attributes_head[p] = value;
                if(!options.update){
                    changes_head[p] = value;
                    this._update();
                }
            }else{
                attributes_head[p] = attributes_head[p] || {};
                attributes_head = attributes_head[p];
                if(!options.update){
                    changes_head[p] = changes_head[p] || {};
                    changes_head = changes_head[p];
                }
            }
        }

        var changes = {};
        changes[prop] = value;
        this.emit('change:'+prop,value);
        this.emit('change',changes);

    }else{

        var changes = prop || {};

        for(var attr in changes){
            if(attr === 'players'){
                for(var player in changes.players){
                    if(player === this._player){
                        this.emit('change:player',changes.players[player]);
                    }else{
                        this.emit('change:player:' + player,changes.players[player]);
                    }
                }
            }
            this.emit('change:'+attr,changes[attr]);
        }
        this.emit('change',changes);

        if(typeof value === 'object'){
            options = value;
        }

        this._data.attributes = this._extend(this._data.attributes,changes || {});
        if(!options.update){
            this._data.changes = this._extend(this._data.changes,changes || {});
            this._update();
        }


    }
};

Room.prototype._get = function(prop){
    var path = prop.split('\.');
    var attributes_head = this._data.attributes || {};
    for(var i=0; i<path.length; i++){
        var p = path[i];
        try{
            if(i>=path.length-1){
                return attributes_head[p];
            }else{
                attributes_head = attributes_head[p];
            }
        }catch(e){
            return undefined;
        }
    }
};

//socket manipulation
Room.prototype._newSocket = function(){
    var socket = io();

    if(this._debug){
        var debug_original_on = socket.on;
        var debug_original_emit = socket.emit;

        socket.on = function(){
            var that = this;
            var event = arguments[0];
            var original_cb = arguments[arguments.length-1];
            arguments[arguments.length-1] = function(){
                console.log('RECEIVED: ' + event + (arguments.length?' WITH: ' + Array.prototype.join.call(arguments,','):''));
                original_cb.apply(that,arguments);
            };
            debug_original_on.apply(socket,arguments);
        };

        socket.emit = function(){
            console.log('SENT: ' + arguments[0]);
            debug_original_emit.apply(socket,arguments);
        };
    }

    var original_emit = socket.emit;

    socket.emit = function(){

        if(arguments.length && typeof arguments[arguments.length-1] === 'function'){
            var cb = arguments[arguments.length-1];
            var cb_number = 'cb_' + new Date().getTime();
            arguments[arguments.length-1] = cb_number;
            socket.once(cb_number,cb);
        }
        original_emit.apply(socket,arguments);
    };

    return socket;
};

Room.prototype._live = function(){

    var that = this;

    this._online = true;

    this._socket.on('data',function(data){
        that.emit(data.type,data.value);
    });

    this._socket.on('update',function(data){
        that._set(data,{update: true});
    });

    this._socket.on('event',function(event,data){
        console.log("EVENT");
        that.emit(event,data);
    });

    this._socket.on('disconnect',function(data){
        //onDisconnect
        console.log('disconnect');
        that._online = false;
    });

    this._socket.on('error',function(){
        //onError
        console.log('error');
        that._online = false;
    });

};

Room.prototype._event = function(event,data){
    if(this._online){
        this._socket.emit('event',event,data);
    }
};

Room.prototype._update = function(){
    if(this._online){
        this._socket.emit('update',this._data.changes);
        this._data.changes = {};
    }
};

Room.prototype.join = function(player,room,cb){
    if(typeof room === 'function'){
        cb = room;
        room = undefined;
    }
    cb = cb || function(){};

    var that = this;
    this._socket = this._newSocket();

    this._socket.on('connect', function () {
        that._socket.emit('join_room',room,player,function(err,response){
            that._set(response.data,{update: true});
            that._player = response.player;
            that._room = response.room;
            that._live();
            that.addPlayer(response.player);
            cb();
        });
    });

};

Room.prototype.addPlayer = function(player_name){
    this._set('players.'+player_name,{
        name: player_name,
        createdAt: new Date()
    });
    this._event('player_add',player_name);
};

Room.prototype.remPlayer = function(player_name){
    this._set('players.'+player_name,undefined);
    this._event('player_rem',player_name);
};