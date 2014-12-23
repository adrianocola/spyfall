$(function(){

    var countdown = 480; //8 minutes
    var socket;
    var players = {};
    var game_info = {
        state: 'stopped',
        spy: -1,
        location: 'none'
    };

    var locations  = [
        "airplane",
        "bank",
        "beach",
        "broadway_theater",
        "casino",
        "cathedral",
        "circus_tent",
        "corporate_party",
        "crusader_army",
        "day_spa",
        "embassy",
        "hospital",
        "hotel",
        "military_base",
        "movie_studio",
        "ocean_liner",
        "passenger_train",
        "pirate_ship",
        "polar_station",
        "police_station",
        "restaurant",
        "school",
        "service_station",
        "space_station",
        "submarine",
        "supermarket",
        "university"
    ];

    var custom_locations = store.get('custom_locations') || {};

    var selected_locations = store.get('selected_locations') || locations.slice(0);

    var i18n = {};

    function getLocation(location){

        if(custom_locations[location]){
            return custom_locations[location].name;
        }else{
            return i18n['location.' + location];
        }

    }

    function getLocationRole(location,roleNum){

        if(custom_locations[location]){
            return custom_locations[location]["role" + roleNum];
        }else{
            return i18n['location.' + location + '.role' + roleNum];
        }

    }

    function makeid(size){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < size; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function changeLanguage(lang){
        $.getJSON('i18n/' + lang + '.json',function(data){
            $.cookie("locale",lang);
            i18n = data;
            updateInterface();
            updateLocations();
            $("#languages").val(lang);
            if(!$("#locations_config").is(":visible")){
                $("#container").fadeIn();
            }
        }).fail(function(){
            changeLanguage('en');
        });
    }

    function updateInterface(){

        $('*[data-i18n]').each(function(){
            var element = $(this);
            element.html(i18n["interface." + element.attr("data-i18n")]);
        });

        $('*[data-i18n-ph]').each(function(){
            var element = $(this);
            element.attr("placeholder",i18n["interface." + element.attr("data-i18n-ph")]);
        });

    }

    function updateLocations(){

        //update locations
        $(".locations_left").html("");
        $(".locations_right").html("");
        $(".locations_list").html("");

        var all_locations = [];

        for(var i=0; i < selected_locations.length; i++){
            var location = getLocation(selected_locations[i]);
            all_locations.push(location);

        }
        all_locations.sort();

        for(var i=0; i < selected_locations.length; i++){
            if(i < (selected_locations.length/2)){
                $(".locations_left").append('<div class="location_item">' + all_locations[i] + '</div>');
            }else{
                $(".locations_right").append('<div class="location_item">' + all_locations[i] + '</div>');
            }
        }

        all_locations = [];

        for(var i=0; i < locations.length; i++){
            all_locations.push(locations[i]);
        }

        for(var i=0; i < all_locations.length; i++){
            addConfigLocation(all_locations[i]);
        }
    }

    function addConfigLocation(location, custom){

        location = location?location:"";

        if(location){
            var location_name = getLocation(location);
        }else{
            var location_name = i18n["interface.location"];
        }

        var config = $(
            '<div class="location_config_item">' +
                '<input class="location_config_check" type="checkbox">' +
                '<span class="location_config_title">' + location_name + '</span>' +
                '<a class="location_config_details" href="#">' +
                    '<img src="../cog.png" width="20">' +
                '</a>' +
                '<a href=""></a>' +

                '<div class="location_config_setup">' +
                    '<div class="location_config_roles">' +
                        '<div class="location_config_name">' +
                            '<span class="location_config_name_label">location:</span>' +
                            '<input class="location_config_name_input" placeholder="location" value="' + location_name + '">' +
                            '<input class="location_config_id" type="hidden">' +
                        '</div>' +

                    '</div>' +
                    '<a href="#" class="location_config_save">Save</a>' +
                    '<a href="#" class="location_config_delete">Delete</a>' +
                '</div>' +

            '</div>'
        );

        var setup = config.find('.location_config_setup');
        var roles_list = config.find('.location_config_roles');
        var check = config.find('.location_config_check');

        for(var i=1; i<=7; i++){

            var role = getLocationRole(location,i);

            roles_list.append(
                '<div class="location_config_role">' +
                    '<span class="location_config_role_label">role ' + i +':</span>' +
                    '<input class="location_config_role_input" placeholder="role ' + i + '" value="' + role + '">' +
                '</div>'
            );

        }

        config.find('.location_config_details').click(function(){
            if(setup.is(":visible")){
                setup.slideUp();
            }else{
                setup.slideDown();
            }

            return false;
        });

        config.find('.location_config_save').click(function(){

            var name = config.find('.location_config_name_input').val();
            var id = config.find('.location_config_id').val();

            var location = custom_locations[id];

            config.find('.location_config_title').html(name);

            location.name = name;
            config.find('.location_config_role_input').each(function(i){
                location["role" + (i+1)] = $(this).val();
            });

            store.set('custom_locations', custom_locations);

            return false;
        });

        check.change(function(){

            if(check.is(":checked")){
                selected_locations.push(location);
            }else{
                selected_locations = _.without(selected_locations,location);
            }

            store.set('selected_locations',selected_locations);

            updateSelectedLocations();

        });

        if(_.contains(selected_locations,location)){
            check.attr("checked","checked");
        }


        //if a default location, prevent editing
        if(_.contains(locations,location)){
            config.find('.location_config_save').hide();
            config.find('.location_config_delete').hide();
            config.find('.location_config_name_input, .location_config_role_input').attr('disabled','disabled');
        }

        //creating new location
        if(!location){
            var id = makeid(10);
            config.find('.location_config_id').val(id);

            custom_locations[id] = {
                name: "",
                role1: "",
                role2: "",
                role3: "",
                role4: "",
                role5: "",
                role6: "",
                role7: ""
            }

            config.addClass('custom');

        }

        if(custom){
            $(".custom_locations_list").append(config);
            config.addClass('custom');
            config.find('.location_config_id').val(location);
        }else{
            $(".locations_list").append(config);
        }

        updateSelectedLocations();

    }

    function configureCustomLocations(){

        var size = _.size(custom_locations);

        for(var id in custom_locations){

            var location = custom_locations[id];

            addConfigLocation(id,true);

        }

    }

    function updateSelectedLocations(){

        var total = locations.length + _.size(custom_locations);
        var selected = selected_locations.length;

        $("#locations_selected").html(selected);
        $("#locations_total").html(total);

    }

    configureCustomLocations();

    function checkAddRem(){
        if($("#players .player_data").length >= 8){
            $("#add_player").addClass("disabled secondary");
        }else if($("#players .player_data").length <= 1){
            $("#rem_player").removeClass("alert");
            $("#rem_player").addClass("disabled secondary");
        }else{
            $("#add_player").removeClass("disabled secondary");
            $("#rem_player").removeClass("disabled secondary");
            $("#rem_player").addClass("alert");
        }
    }


    function addPlayer(name){

        if($("#add_player").hasClass("disabled")) return false;

        name = (typeof name === "string")?name:undefined;

        var playerNum = $("#players .player_data").length+1;
        var playerName = name?name:"p" + playerNum;

        playerName = playerName.toUpperCase();

        $("#players").append(
            '<div id="p' + playerNum + '" class="player_data ' + playerName + '">' +
                '<input class="player_input uppercase" data-i18n-ph="player_name" value=' + playerName + '>' +
                '<a class="button success expand player_button" href="#" data-reveal-id="modal' + playerNum + '">' + playerName + '</a>' +
                '<div class="player_remote">*</div>' +
                '<div id="modal' + playerNum + '" class="reveal-modal small text-center" data-reveal>' +
                    '<h2 class="player_title"> ' + playerName + '</h2>' +
                    '<h4><strong><span data-i18n="location"></span>: </strong><span class="player_location">' + playerNum + '</span></h4>'+
                    '<h4><strong><span data-i18n="role"></span>: </strong><span class="player_role">' + playerNum + '</span></h4>'+
                    '<a class="close-reveal-modal">&#215;</a>' +
                    '<a class="button alert close-modal" data-i18n="close"></a>' +
                '</div>' +
            '</div>');


        var player = $("#p" + playerNum);
        var input = $("#p" + playerNum + " .player_input");
        var button = $("#p" + playerNum + " .player_button");
        var title = $("#p" + playerNum + " .player_title");
        var close = $("#p" + playerNum + " .close-modal");
        var closeTrigger = $("#p" + playerNum + " .close-reveal-modal");

        //changed name
        input.change(function(){

            player.removeClass(playerName);

            playerName = input.val().toUpperCase();
            button.html(playerName);
            title.html(playerName);

            player.addClass(playerName);
        });

        //want to view role
        button.click(function(evt){

            //if already saw role, don't show again (prevent cheating)
            if(button.hasClass('disabled')){
                return false;
            }

            //if the current player is the only local player, don't prevent him from seeing his role again
            if($(".player_remote:not(:visible)").length !== 1){

                button.addClass('disabled secondary');
                button.removeClass('success');

            }

            ga('send', 'event', 'Game', 'ViewPlayerRole', playerNum);
        });

        close.click(function(){
            closeTrigger.trigger('click');
        });


        $("#players .player_button").hide();

        $("#players").foundation();

        checkAddRem();
    }

    function remPlayer(){

        if($("#rem_player").hasClass("disabled")) return false;
        $("#players .player_data:last-child").remove();

        checkAddRem();
    }

    function configurePlayer(playerNum, location, role){
        var playerName = $("#p" + playerNum + " .player_input").val().toUpperCase();
        var playerLocation = $("#p" + playerNum + " .player_location");
        var playerRole = $("#p" + playerNum + " .player_role");

        if(socket){

            if(players[playerName]){
                socket.emit('data',playerName,{type: "GAME_START", role: role, location: location});

                //if is a remote player, prevent manager looking at his role
                var button = $("#p" + playerNum + " .player_button");
                button.removeClass('success');
                button.addClass('disabled secondary');
            }
        }

        //is spy?
        if(role===0){
            game_info.spy = playerName;
            playerLocation.html("???");
            playerRole.html('<img src="../spy.png" width=20>' + i18n["spy"]);
            $("#game_result_text").html("");
            $("#game_result_text").append('<div><span data-i18n="location"></span>: ' + getLocation(location) + '</div>');
            $("#game_result_text").append('<div>' + playerName + ' <span data-i18n="is_the_spy"></span></div>');
        }else{
            playerLocation.html(getLocation(location));
            playerRole.html(getLocationRole(location,role));
        }


    }

    window.spyfallTest = function(){

        var tests = 1000; //per player count

        //for each range of player count
        for(var p = 3; p<=8; p++){

            var spyDist = {};

            for(var i=0; i< tests; i++){
                var allRoles = getAllRoles();
                var playerCount = p;
                var availableRoles = getAvailableRoles(playerCount,allRoles);

                if(!_.contains(availableRoles,0)){
                    return "Missing spy in available roles with " + playerCount + " players! Available roles: " +  availableRoles;
                }
                if(_.uniq(availableRoles).length != availableRoles.length){
                    return "Available roles array have duplicates: " + availableRoles;
                }
                if(availableRoles.length != playerCount){
                    return "Didn't generated the number os roles for the total number of players! Players: " + playerCount + ", Roles: " + availableRoles.length;
                }

                var assignedPlayersRoles = assignPlayersRoles(playerCount,availableRoles);

                if(assignedPlayersRoles.length != playerCount){
                    return "Didn't assigned the number os roles for the total number of players! Players: " + playerCount + ", Assigned Roles: " + assignedPlayersRoles.length;
                }
                if(_.uniq(assignedPlayersRoles).length != assignedPlayersRoles.length){
                    return "Assigned players roles array have duplicates: " + assignedPlayersRoles;
                }

                var pos = _.indexOf(assignedPlayersRoles,0);
                spyDist[pos] = (spyDist[pos] || 0) +1;

            }

            console.log(playerCount + " players:");
            console.log(spyDist);

        }

        return "OK!"


    }

    function getAllRoles(){

        //all remaining roles (1 to 7, because 0 is the spy)
        var allRoles = [];
        for(var i=1;i<=7;i++){
            allRoles.push(i);
        }

        return allRoles;

    }

    function getAvailableRoles(playersCount, allRoles){
        //populate a array of with random roles
        // make sure there is always a spy (role 0)
        var availableRoles = [];
        for(var i=0;i<playersCount;i++){
            //always have a spy
            if(i===0){
                availableRoles.push(0);
                //get a random role from the roles available
            }else{
                var rolePos = _.random(0,allRoles.length-1);
                var role = allRoles[rolePos];
                allRoles.splice(rolePos,1);
                availableRoles.push(role);
            }
        }

        return availableRoles;
    }

    function assignPlayersRoles(playersCount, availableRoles){

        var players = [];

        //assign to each player a random role from the available roles
        for(var i=0;i<playersCount;i++){
            var playerRolePos = _.random(availableRoles.length-1);
            var playerRole = availableRoles[playerRolePos];
            availableRoles.splice(playerRolePos,1);

            players.push(playerRole);

        }

        return players;

    }

    function startGame(){


        var location = selected_locations[_.random(selected_locations.length-1)];
        var playersCount = $("#players .player_data").length;

        ga('send', 'event', 'Game', 'Start', location);

        var allRoles = getAllRoles();
        var availableRoles = getAvailableRoles(playersCount,allRoles);
        var assignedPlayersRoles = assignPlayersRoles(playersCount,availableRoles);

        $("#players .player_input").hide();
        $("#players .player_button").show();

        $("#players .player_button").removeClass('disabled secondary');
        $("#players .player_button").addClass('success');

        //assign to each player a random role from the available roles
        for(var i=0;i<playersCount;i++){
            configurePlayer(i+1,location,assignedPlayersRoles[i]);
        }

        game_info.state = "running";
        game_info.location = location;

        $("#languages").attr("disabled","disabled");
        $("#game_result").hide();
        $("#start_game").fadeOut();
        $("#room_controls").fadeOut();
        $("#room_create").fadeOut();
        $("#header_locations").fadeOut();

        $("#players_controls").fadeOut(function(){
            $("#end_game").fadeIn();
            $("#timer_container").fadeIn();
            $("#game_locations").fadeIn();
        });

        $("#timer_control").addClass('success');
        $("#timer_control").html(i18n["interface.start_timer"]);

        $("#timer").countdown({until: countdown, compact: true, description: '', format: 'M:S',onExpiry: function(){ beep(3); }});
        $('#timer').countdown('pause');

        updateInterface();
    }

    function endGame(){

        $("#players .player_button").hide();
        $("#players .player_input").show();

        ga('send', 'event', 'Game', 'End');

        $("#languages").removeAttr("disabled","disabled");
        $("#players_controls").show();
        $("#start_game").show();
        $("#end_game").hide();
        $("#timer_container").hide();
        $("#game_result").show();
        $("#game_locations").hide();
        $("#header_locations").show();


        $('#timer').countdown('destroy');

        if(!game_info.room){
            $("#room_controls").show();
        }else{
            $("#room_create").show();
        }


        game_info.state = "stopped";

        if(socket){
            socket.emit('broadcast',{type: "GAME_END", location: game_info.location, spy: game_info.spy});
        }

    }

    function beep(times){
        for(var i=0; i< times; i++){
            setTimeout(function(){
                new Beep(22050).play(1000, 0.5, [Beep.utils.amplify(8000)]);
            },i*1000);
        }
    }

    $("#add_player").click(addPlayer);

    $("#rem_player").click(remPlayer);

    $("#start_game").click(startGame);

    $("#end_game").click(endGame);

    $("#languages").change(function(){
        changeLanguage($("#languages").val());
    });

    $("#me").click(function(){
        document.location.href = atob("bWFpbHRvOmFkcmlhbm9jb2xhQGdtYWlsLmNvbQ==");
    });

    //**************************************************************************
    //******************************* TIMER SETUP ******************************
    //**************************************************************************

    $("#timer_control").click(function(){
        $('#timer').countdown('toggle');

        if($("#timer_control").hasClass("success")){
            $("#timer_control").removeClass('success');
            $("#timer_control").html(i18n["interface.pause_timer"]);
            socket.emit('broadcast',{type: "TIMER_START", time: new Date()});
        }else{
            $("#timer_control").addClass('success');
            $("#timer_control").html(i18n["interface.start_timer"]);
            if(socket){
                var until = $.countdown.periodsToSeconds($('#timer').countdown("getTimes"))
                socket.emit('broadcast',{type: "TIMER_STOP", until: until});
            }
        }

    });


    //**************************************************************************
    //**************************** LOCATIONS CONFIG ****************************
    //**************************************************************************

    $("#config_locations").click(function(){

        $("#container").fadeOut(function(){
            $("#locations_config").fadeIn();
        });

    });

    $("#add_location").click(function(){
        addConfigLocation();
    });

    $("#locations_filter").keyup(function(){

        var search = $("#locations_filter").val().toLowerCase();

        $(".location_config_item").each(function(){
            var config = $(this);
            var name = config.find(".location_config_title").html().toLowerCase();

           if(name.indexOf(search)===-1){
               config.hide();
           }else{
               config.show();
           }

        });




    });


    //**************************************************************************
    //******************************* ROOMS SETUP ******************************
    //**************************************************************************

    $("#create_room").click(function(){

        var ladda = $("#create_room").ladda();
        ladda.ladda( 'start' );

        socket = io();

        socket.on('connect', function () {
            socket.emit('create_room', game_info.room);

            $('.player_remote').fadeOut();
            players = {};
        });

        socket.on('created_room',function(room){
            game_info.room = room;

            $("#room_id").html(game_info.room);

            ga('send', 'event', 'Room', 'Created');

            $("#room_controls").fadeOut(function(){
                $("#room_create").fadeIn();
                ladda.ladda( 'stop' );
            });
        })

        socket.on('data',function(data){

            if(data.type === "PLAYER_JOIN"){

                //check if exists player with this name
                if($('.player_data.' + data.name).length===0){
                    socket.emit('data',data.name,{type: "INVALID_PLAYER"});
                }else{
                    players[data.name] = true;

                    $('.player_data.' + data.name + ' .player_remote').fadeIn();

                    socket.emit('data',data.name,{type: "CONNECTED"});
                }

            }else if(data.type === "PLAYER_LEFT"){

                delete players[data.name];

                $('.player_data.' + data.name + ' .player_remote').fadeOut();

            }

        });

    });

    $("#enter_room").click(function(){

        if($.cookie("room")){
            $("#room_join_id").val($.cookie("room"));
        }
        if($.cookie("player")){
            $("#room_join_name").val($.cookie("player"));
        }

        $("#header_locations").fadeOut();
        $("#players_container").fadeOut();
        $("#game_controls").fadeOut();

        $("#timer_control_container").remove();
        $("#timer_watch_container").removeClass('medium-3 medium-pull-3');
        $("#timer_watch_container").addClass('medium-offset-3');

        $("#room_controls").fadeOut(function(){
            $("#room_join").fadeIn();
        });

    });

    $("#room_join_button").click(function(){

        var room_id = $("#room_join_id").val().toUpperCase();
        var player_name = $("#room_join_name").val().toUpperCase();

        var ladda = $("#room_join_button").ladda();

        ladda.ladda( 'start' );

        $("#room_game").fadeOut();

        socket = io();

        socket.on('connect', function () {
            socket.emit('join_room',room_id,player_name);
        });

        socket.on('joined_room', function () {

            game_info.room = room_id;

            socket.emit('data',{type: "PLAYER_JOIN", name: player_name});

            $.cookie("player",player_name);
            $.cookie("room",room_id);

        });

        socket.on('data',function(data){

            if(data.type === "INVALID_PLAYER"){
                onError(i18n["interface.error_room_invalid_player"]);
            }else if(data.type === "CONNECTED"){

                $("#room_game_data").html(i18n["interface.game_connected"]);
                $("#room_game_data").removeClass('alert');
                $("#room_game_data").addClass('disabled secondary');

                $("#room_info_id").html(room_id);
                $("#room_info_name").html(player_name);

                $("#timer").countdown({until: countdown, compact: true, description: '', format: 'M:S',onExpiry: function(){ beep(3); }});
                $('#timer').countdown('pause');

                $("#room_join").fadeOut(function(){
                    $("#room_info").fadeIn();
                    $("#game_locations").fadeIn();
                    $("#room_game").fadeIn();
                    $("#timer_container").fadeIn();
                });
                $("#header_locations").fadeOut();

                ga('send', 'event', 'Room', 'Joined');

            }else if(data.type === "GAME_START"){
                $("#room_game_data").html(i18n["interface.show_my_role"]);
                $("#room_game_data").removeClass('disabled secondary');
                $("#room_game_data").addClass('success');
                $("#room_game_data").attr("data-reveal-id","room_game_me");

                $("#room_game_name").html(player_name);

                $('#timer').countdown('destroy');
                $("#timer").countdown({until: countdown, compact: true, description: '', format: 'M:S',onExpiry: function(){ beep(3); }});
                $('#timer').countdown('pause');

                if(data.role===0){
                    $("#room_game_location").html("???");
                    $("#room_game_role").html('<img src="../spy.png" width=20>' + i18n["spy"]);
                }else{
                    $("#room_game_location").html(i18n["location." + data.location]);
                    $("#room_game_role").html(i18n["location." + data.location + ".role" + data.role]);
                }
                $("#room_game_role").html();
            }else if(data.type === "GAME_END"){
                $("#room_game_data").html(i18n["interface.game_stopped"]);
                $("#room_game_data").removeClass('success');
                $("#room_game_data").addClass('disabled secondary');
                $("#room_game_data").attr("data-reveal-id","game_result");

            }else if(data.type === "TIMER_START"){

                var diff = new Date().getTime() - new Date(data.time).getTime();

                var until = $.countdown.periodsToSeconds($('#timer').countdown("getTimes")) - (diff/1000);

                $('#timer').countdown('resume');
                $('#timer').countdown("option","until",until);

            }else if(data.type === "TIMER_STOP"){

                $('#timer').countdown("option","until",data.until);
                $('#timer').countdown('pause');


            }else if(data.type === "DISCONNECTED"){
                onError(i18n["interface.error_room_connection"]);

                socket.disconnect();
                socket = null;
            }

        });

        socket.on('invalid_socket',function(data){
            onError(i18n["interface.error_room_connection"]);
        });

        socket.on('invalid_room',function(data){
            onError(i18n["interface.error_room_connection"]);
        });

        socket.on('disconnected',function(){
            onError(i18n["interface.error_room_connection"]);
        });

        socket.on('disconnect',function(){
            onError(i18n["interface.error_room_connection"]);
        });

        socket.on('error',function(){
            onError(i18n["interface.error_room_connection"]);
        });

        function onError(msg){
            if($("#room_game_data").hasClass('alert')) return;
            ladda.ladda('stop');
            $("#room_game").fadeIn();
            $("#room_game_data").html(msg);
            $("#room_game_data").removeClass('disabled secondary success');
            $("#room_game_data").addClass('alert');
        }
    });

    //start with one player
    addPlayer("p1");

    //set game initial state/layout
    endGame();

    //load the english language
    changeLanguage($.cookie("locale") || "en");

    $(document).foundation();

});