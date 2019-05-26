$(function(){
    const MIN_PLAYERS = 3;
    const MAX_PLAYERS = 12;
    var countdown = store.get('duration') || 8*60; //8 minutes
    var spies = store.get('number_of_spies') || 1;
    var socket;
    var i18n = {};
    var i18n_en = {};
    var players = {};
    //variable used to make less likelly a player be spy twice in a row
    var last_spy;
    //variable used to prevent selecting the same location twice in a row
    var last_location;
    var game_info = {
        state: 'stopped',
        timer: 'stopped',
        spy: undefined,
        spy2: undefined,
        location: 'none'
    };

    var locations  = {
        //spyfall 1
        "airplane":1,
        "bank":1,
        "beach":1,
        "broadway_theater":1,
        "casino":1,
        "cathedral":1,
        "circus_tent":1,
        "corporate_party":1,
        "crusader_army":1,
        "day_spa":1,
        "embassy":1,
        "hospital":1,
        "hotel":1,
        "military_base":1,
        "movie_studio":1,
        "ocean_liner":1,
        "passenger_train":1,
        "pirate_ship":1,
        "polar_station":1,
        "police_station":1,
        "restaurant":1,
        "school":1,
        "service_station":1,
        "space_station":1,
        "submarine":1,
        "supermarket":1,
        "university":1,
        //spyfall 2
        "amusement_park":2,
        "art_museum":2,
        "candy_factory":2,
        "cat_show":2,
        "cemetery":2,
        "coal_mine":2,
        "construction_site":2,
        "gaming_convention":2,
        "gas_station":2,
        "harbor_docks":2,
        "ice_hockey_stadium":2,
        "jail":2,
        "jazz_club":2,
        "library":2,
        "night_club":2,
        "race_track":2,
        "retirement_home":2,
        "rock_concert":2,
        "sightseeing_bus":2,
        "stadium":2,
        "subway":2,
        "the_un":2,
        "vineyard":2,
        "wedding":2,
        "zoo":2
    };

    var locations_keys = _.keys(locations);

    var custom_locations = store.get('custom_locations') || {};

    var selected_locations = store.get('selected_locations') || _.compact(_.map(locations, function(ver,loc){ return ver===1?loc:null }));

    // force the removal of deleted locations
    selected_locations = _.without(selected_locations, 'carnival', 'theater');

    function getSelectedCustomLocations(){
        var selected_custom_locations = {};

        for(var i=0;i<selected_locations.length;i++){
            var loc = custom_locations[selected_locations[i]];
            if(loc){
                selected_custom_locations[selected_locations[i]] = loc;
            }
        }

        return selected_custom_locations;
    }

    function getLocation(location){
        if(custom_locations[location]){
            return custom_locations[location].name;
        }else{
            return tt('location.' + location);
        }

    }

    function getLocationRole(location,roleNum){

        if(custom_locations[location]){
            return custom_locations[location]["role" + roleNum];
        }else{
            return tt('location.' + location + '.role' + roleNum);
        }

    }

    function makeid(size){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < size; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function tt(exp){
        return i18n[exp] || i18n_en[exp];
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
            changeLanguage("en-US");
        });
    }

    function updateInterface(){

        $('*[data-i18n]').each(function(){
            var element = $(this);
            element.html(tt("interface." + element.attr("data-i18n")));
        });

        $('*[data-i18n-ph]').each(function(){
            var element = $(this);
            element.attr("placeholder",tt("interface." + element.attr("data-i18n-ph")));
        });

    }

    function updateLocations(last_location){

        //update locations
        $(".locations_left").html("");
        $(".locations_right").html("");
        $(".locations_list").html("");

        var all_locations = [];
        var map = {};

        for(var i=0; i < selected_locations.length; i++){
            var rawLoc = selected_locations[i];
            var location = getLocation(rawLoc);
            map[location] = rawLoc;
            all_locations.push(location);
        }

        all_locations.sort();

        for(var i=0; i < selected_locations.length; i++){
            var loc = all_locations[i];
            if(i < (selected_locations.length/2)){
                $(".locations_left").append('<div class="location_item loc_' + map[loc] + '">' + loc + '</div>');
            }else{
                $(".locations_right").append('<div class="location_item loc_' + map[loc] + '">' + loc + '</div>');
            }
        }

        all_locations = [];

        for(var i=0; i < locations_keys.length; i++){
            all_locations.push(locations_keys[i]);
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
            var location_name = tt("interface.location");
        }

        var config = $(
            '<div class="location_config_item text-left">' +
                '<input id="checkbox_' + location + '" class="location_config_check" type="checkbox"><label class="location_config_title" for="checkbox_' + location + '">' + location_name + '</label>' +
                '<a class="location_config_details float-right" href="#">' +
                    '<img src="../cog.png" width="20">' +
                '</a>' +
                '<a href=""></a>' +

                '<div class="location_config_setup">' +
                    '<div class="location_config_roles">' +
                        '<div class="location_config_name">' +
                            '<span class="location_config_name_label"><span data-i18n="location"></span>:</span>' +
                            '<input class="location_config_name_input" value="' + location_name + '">' +
                            '<input class="location_config_id" type="hidden">' +
                        '</div>' +

                    '</div>' +
                    '<a href="#" class="location_config_save" data-i18n="save"></a>' +
                    '<a href="#" class="location_config_delete" data-i18n="delete"></a>' +
                '</div>' +

            '</div>'
        );

        var setup = config.find('.location_config_setup');
        var roles_list = config.find('.location_config_roles');
        var check = config.find('.location_config_check');

        for(var i=1; i<=10; i++){

            var role = getLocationRole(location,i) || "";

            roles_list.append(
                '<div class="location_config_role">' +
                    '<div class="location_config_role_label"><span data-i18n="role"></span><span> ' + i + '</span>:</div>' +
                    '<input class="location_config_role_input" value="' + role + '">' +
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

            if(!id){
                id = makeid(10);
                location = id;

                config.find('.location_config_id').val(id);

                custom_locations[id] = {
                    name: "",
                    role1: "",
                    role2: "",
                    role3: "",
                    role4: "",
                    role5: "",
                    role6: "",
                    role7: "",
                    role9: "",
                    role9: "",
                    role10: ""
                }

            }

            var loc = custom_locations[id];

            config.find('.location_config_title').html(name);

            loc.name = name;
            config.find('.location_config_role_input').each(function(i){
                loc["role" + (i+1)] = $(this).val();
            });

            store.set('custom_locations', custom_locations);

            setup.slideUp();

            ga('send', 'event', 'Custom', 'Save');

            return false;
        });

        config.find('.location_config_delete').click(function(){

            var id = config.find('.location_config_id').val();

            delete custom_locations[id];

            store.set('custom_locations', custom_locations);

            if(check.is(":checked")){
                selected_locations = _.without(selected_locations,location);
                selected_locations = _.compact(selected_locations);

                store.set('selected_locations',selected_locations);

                updateSelectedLocations();
            }

            ga('send', 'event', 'Custom', 'Delete');

            config.fadeOut(function(){
                config.remove();
            });

            return false;
        });

        check.change(function(){

            if(check.is(":checked")){
                if(_.contains(selected_locations,location)){
                    return;
                }
                selected_locations.push(location);
            }else{
                selected_locations = _.without(selected_locations,location);
            }

            selected_locations = _.compact(selected_locations);

            store.set('selected_locations',selected_locations);

            ga('send', 'event', 'Custom', 'Check');

            updateSelectedLocations();

        });

        if(_.contains(selected_locations,location)){
            check.attr("checked","checked");
        }

        //if a default location, prevent editing
        if(_.contains(locations_keys,location)){
            config.find('.location_config_save').hide();
            config.find('.location_config_delete').hide();
            config.find('.location_config_name_input, .location_config_role_input').attr('disabled','disabled');
        }

        //creating new location
        if(!location){
            config.addClass('custom');

            setup.show();

        }

        if(custom){
            $(".custom_locations_list").append(config);
            config.addClass('custom');
            config.find('.location_config_id').val(location);
        }else if(locations[location] === 1){
            $(".locations_list_one").append(config);
        }else if(locations[location] === 2){
            $(".locations_list_two").append(config);
        }

        updateSelectedLocations();
        updateInterface();

    }

    function sanitizePlayerName(playerName){
        var p = playerName.toUpperCase();
        p = p.replace(' ','_');
        return p;
    }


    function configureCustomLocations(){

        $(".custom_locations_list").html("");

        var size = _.size(custom_locations);

        for(var id in custom_locations){

            var location = custom_locations[id];

            addConfigLocation(id,true);

        }

    }

    function updateSelectedLocations(){

        var total = locations_keys.length + _.size(custom_locations);
        var selected = selected_locations.length;

        $(".locations_selected").html(selected);
        $(".locations_total").html(total);

    }

    configureCustomLocations();

    function checkAddRem(){
        if($("#players .player_data").length >= MAX_PLAYERS){
            $("#add_player").addClass("disabled secondary hollow");
        }else if($("#players .player_data").length <= MIN_PLAYERS){
            $("#rem_player").removeClass("alert");
            $("#rem_player").addClass("disabled secondary hollow");
        }else{
            $("#add_player").removeClass("disabled secondary hollow");
            $("#rem_player").removeClass("disabled secondary hollow");
            $("#rem_player").addClass("alert");
        }
    }


    function addPlayer(name){

        if($("#add_player").hasClass("disabled")) return false;

        name = (typeof name === "string")?name:undefined;

        var playerNum = $("#players .player_data").length+1;
        var playerName = name?name:"p" + playerNum;
        var sanitizedPlayerName = sanitizePlayerName(playerName);

        playerName = playerName.toUpperCase();

        $("#players").append(
            '<div id="p' + playerNum + '" class="player_data ' + sanitizedPlayerName + '">' +
                '<input class="player_input uppercase" data-i18n-ph="player_name" value=' + playerName + '>' +
                '<a class="button success expand player_button" href="#" data-open="modal' + playerNum + '">' + playerName + '</a>' +
                '<div class="player_remote">*</div>' +
                '<div id="modal' + playerNum + '" class="reveal small text-center" data-animation-in="slide-in-down" data-animation-out="slide-out-up" data-reset-on-close="true" data-reveal>' +
                    '<h2 class="player_title"> ' + playerName + '</h2>' +
                    '<h4><strong><span data-i18n="location"></span>: </strong><span class="player_location">' + playerNum + '</span></h4>'+
                    '<h4 class="role_container"><strong><span data-i18n="role"></span>: </strong><span class="player_role">' + playerNum + '</span></h4>'+
                    '<a class="button alert close-modal" data-close data-i18n="close"></a>' +
                    '<button class="close-button" data-close aria-label="Close modal" type="button">' +
                        '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
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

            player.removeClass(sanitizedPlayerName);

            playerName = input.val().toUpperCase();
            sanitizedPlayerName = sanitizePlayerName(playerName);
            button.html(playerName);
            title.html(playerName);

            player.addClass(sanitizedPlayerName);
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

    function selectedTwoSpies(){

        spies = 2;
        store.set('number_of_spies',spies);
        $("#spy_count").html("");
        $("#spy_count").append('<img src="../spy.png" width="20"/>');
        $("#spy_count").append(' ');
        $("#spy_count").append('<img src="../spy.png" width="20"/>');
    }

    function selectedOneSpy(){

        spies = 1;
        store.set('number_of_spies',spies);
        $("#spy_count").html("");
        $("#spy_count").append('<img src="../spy.png" width="20"/>');

    }

    function changedDuration(){

        countdown = 60 * $(this).val();
        store.set('duration',countdown);

    }

    function configurePlayer(playerNum, location, role, selected_custom_locations){
        var player = $("#p" + playerNum);
        var playerName = $("#p" + playerNum + " .player_input").val().toUpperCase();
        var playerLocation = $("#modal" + playerNum + " .player_location");
        var playerRoleContainer = $("#modal" + playerNum + " .role_container");
        var playerRole = $("#modal" + playerNum + " .player_role");

        console.log('last_location', last_location);

        if(socket){

            if(players[playerName]){
                socket.emit('data',playerName,{
                    type: "GAME_START",
                    role: role,
                    location: location,
                    selected_locations: selected_locations,
                    custom_locations: selected_custom_locations,
                    last_location: last_location,
                    spies: spies,
                    countdown: countdown
                });

                //if is a remote player, prevent manager looking at his role
                var button = $("#p" + playerNum + " .player_button");
                button.removeClass('success');
                button.addClass('disabled secondary');
            }
        }

        player.data("role",role);
        player.data("location",location);

        //is spy?
        if(role===0){
            if(!game_info.spy){
                game_info.spy = playerName;
            }else{
                game_info.spy2 = playerName;
            }
            playerLocation.html("???");
            playerRole.html('<img src="../spy.png" width=20>');
        }else{
            var role = getLocationRole(location,role);
            playerLocation.html(getLocation(location));
            if(role){
                playerRole.html(role);
                playerRoleContainer.show();
            }else{
                playerRoleContainer.hide();
            }
        }

        return playerName;

    }

    window.spyfallTest = function(count){

        var tests = count || 10000; //per player count

        //for each range of player count
        for(var p = MIN_PLAYERS; p<=MAX_PLAYERS; p++){

            var spyDist = {};

            for(var i=0; i< tests; i++){
                var playerCount = p;
                var location = locations_keys[_.random(locations_keys.length-1)];
                var isSpyfall2 = locations[location] === 2;
                var availableRoles = getAvailableRoles(playerCount,location);

                if(!_.contains(availableRoles,0)){
                    return "Missing spy in available roles with " + playerCount + " players! Available roles: " +  availableRoles;
                }
                if(_.uniq(availableRoles).length != availableRoles.length && playerCount<=8 && !isSpyfall2){
                    return "Available roles array have duplicates: " + availableRoles;
                }
                if(availableRoles.length != playerCount){
                    return "Didn't generated the number os roles for the total number of players! Players: " + playerCount + ", Roles: " + availableRoles.length;
                }

                var assignedPlayersRoles = assignPlayersRoles(playerCount,availableRoles);

                if(assignedPlayersRoles.length != playerCount){
                    return "Didn't assigned the number os roles for the total number of players! Players: " + playerCount + ", Assigned Roles: " + assignedPlayersRoles.length;
                }
                if(_.uniq(assignedPlayersRoles).length != assignedPlayersRoles.length && playerCount<=8 && !isSpyfall2){
                    return "Assigned players roles array have duplicates: " + assignedPlayersRoles;
                }

                var pos = _.indexOf(assignedPlayersRoles,0);
                spyDist[pos] = (spyDist[pos] || 0) +1;

            }

            console.log(playerCount + " players:");
            console.log(spyDist);
            console.log("Std: " + Math.round(math.std(_.values(spyDist))));

        }

        var locationsDist = {};

        for(var i=0; i< tests; i++){
            var location = locations_keys[_.random(locations_keys.length-1)];
            locationsDist[location] = (locationsDist[location] || 0) +1;
        }

        console.log('');
        console.log(_.size(locationsDist) + " locations!");
        console.log(locationsDist);
        console.log("Std: " + Math.round(math.std(_.values(locationsDist))));

        return "OK!";

    };

    function getLocationRolesAvailable(location){

        var roles_numbers = [];

        for(var i=1; i<=MAX_PLAYERS;i++){
            if(getLocationRole(location,i)){
                roles_numbers.push(i);
            }
        }

        return roles_numbers;

    };

    //populate a array with random roles
    // make sure there is always a spy (role 0)
    function getAvailableRoles(playersCount, location){

        var originalAllRoles = getLocationRolesAvailable(location);
        var allRoles = originalAllRoles.slice(0);

        var availableRoles = [];
        for(var i=0;i<playersCount;i++){
            //always have a spy
            if(i===0){
                availableRoles.push(0);
            //if playing with two spies add another one
            }else if(i===1 && spies===2){
                availableRoles.push(0);
            //get a random role from the roles available
            }else{
                // if there are no more roles, reset the roles list, to pick roles again
                if(allRoles.length===0){
                    allRoles = originalAllRoles.slice(0);
                }

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

    function randomLocation(){

        if(selected_locations.length === 0){
            return "";
        }

        if(selected_locations.length === 1){
            return selected_locations[0];
        }

        var location;
        do{
            location = selected_locations[_.random(selected_locations.length-1)];
        }
        while(location === last_location);

        return location;

    }

    function startGame(){

        game_info.spy = undefined;
        game_info.spy2 = undefined;

        var location = randomLocation();
        var playersCount = $("#players .player_data").length;
        var selected_custom_locations = getSelectedCustomLocations();

        ga('send', 'event', 'Game', 'Start');

        var availableRoles = getAvailableRoles(playersCount,location);
        var assignedPlayersRoles = assignPlayersRoles(playersCount,availableRoles);

        //diminish the chances of the same spy twice in a row (if playing with 1 spy)
        if(spies === 1 && assignedPlayersRoles[last_spy] === 0){
            availableRoles = getAvailableRoles(playersCount,location);
            assignedPlayersRoles = assignPlayersRoles(playersCount,availableRoles);
        }

        $("#players .player_input").hide();
        $("#players .player_button").show();

        $("#players .player_button").removeClass('disabled secondary');
        $("#players .player_button").addClass('success');

        //assign to each player a random role from the available roles
        $("#game_result_text").html("");
        $("#game_result_text").append('<div><span data-i18n="location"></span>: ' + getLocation(location) + '</div>');

        for(var i=0;i<playersCount;i++){
            var name = configurePlayer(i+1,location,assignedPlayersRoles[i],selected_custom_locations);
            if(assignedPlayersRoles[i] === 0 ){
                last_spy = i;
                $("#game_result_text").append('<div> <img src="../spy.png" width="20"/></span>: ' + name + '</div>');
            }
        }

        var players = [];

        $(".player_input").each(function(){
            players.push($(this).val());
        });

        store.set('players',players);

        game_info.state = "running";
        game_info.location = location;

        $(".location_item").removeClass('cross');
        if(last_location){
            $(".location_item.loc_" + last_location).addClass('cross');
        }

        last_location = location;

        $("#languages").attr("disabled","disabled");
        $("#game_result").hide();
        $("#start_game").fadeOut();
        $("#room_controls").fadeOut();
        $("#room_create").fadeOut();
        $("#header_locations").fadeOut();
        $("#game_options").fadeOut();

        $("#players_controls").fadeOut(function(){
            $("#end_game").fadeIn();
            $("#timer_container").fadeIn();
            $("#game_locations").fadeIn();
        });

        $("#timer_control").addClass('success');
        $("#timer_control").html(tt("interface.start_timer"));

        $("#timer").countdown({until: countdown, compact: true, description: '', format: 'M:S',onExpiry: function(){ beep(3); }});
        $('#timer').countdown('pause');
        game_info.timer = "stopped";

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
        $("#room_create").hide();
        $("#room_join").hide();
        $("#locations_exported_container").hide();
        $("#locations_importing").hide();
        $("#locations_config").hide();
        $("#timer_container").hide();
        $("#game_options").show();
        $("#game_result").show();
        $("#game_locations").hide();
        $("#room_info").hide();
        $("#header_locations").show();


        $('#timer').countdown('destroy');

        if(!game_info.room){
            $("#room_controls").show();
        }else{
            $("#room_create").show();
        }


        game_info.state = "stopped";

        if(socket){
            socket.emit('broadcast',{type: "GAME_END", location: game_info.location, spy: game_info.spy, spy2: game_info.spy2});
        }

    }

    function beep(times){
        for(var i=0; i< times; i++){
            setTimeout(function(){
                new Beep(22050).play(1000, 0.5, [Beep.utils.amplify(8000)]);
            },i*1000);
        }
    }

    //**************************************************************************
    //******************************** GAME SETUP ******************************
    //**************************************************************************

    $("#add_player").click(addPlayer);

    $("#rem_player").click(remPlayer);

    $("#one_spy").change(selectedOneSpy);

    $("#two_spies").change(selectedTwoSpies);

    $("#selected_duration").change(changedDuration);

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
            $("#timer_control").html(tt("interface.pause_timer"));

            var until = $.countdown.periodsToSeconds($('#timer').countdown("getTimes"));

            if(socket){
                socket.emit('broadcast',{type: "TIMER_START", time: new Date(), until: until});
            }
            game_info.timer = "running";
        }else{
            $("#timer_control").addClass('success');
            $("#timer_control").html(tt("interface.start_timer"));
            if(socket){
                var until = $.countdown.periodsToSeconds($('#timer').countdown("getTimes"));
                socket.emit('broadcast',{type: "TIMER_STOP", until: until});
                game_info.timer = "stopped";
            }
        }

    });


    //**************************************************************************
    //**************************** LOCATIONS CONFIG ****************************
    //**************************************************************************

    $("#config_locations").click(function(){

        $("#container").fadeOut(function(){
            $("#locations_config").fadeIn();
            $("#locations_share").show();
            $("#locations_exported_container").hide();
            $("#locations_importing").hide();
        });

    });

    $(".location_select_all").click(function(){
        $(this).closest(".locations_container").find(".location_config_check").prop('checked', true).change();
    });

    $(".location_deselect_all").click(function(){
        $(this).closest(".locations_container").find(".location_config_check").prop('checked', false).change();
    });

    $("#add_location").click(function(){
        addConfigLocation(undefined,true);
    });

    $("#locations_back").click(function(){

        var ladda = $("#locations_back").ladda();
        ladda.ladda( 'start' );

        updateLocations();

        $("#locations_config").fadeOut(function(){
            $("#container").fadeIn();
            ladda.ladda( 'stop' );
        });

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

    $("#locations_export").click(function(){

        var ladda = $("#locations_export").ladda();
        ladda.ladda( 'start' );

        $.ajax({
            url: "/export_custom_locations",
            type: "POST",
            data: {
                custom_locations: custom_locations || {},
                selected_locations: selected_locations || {},
            },
            success: function(data){

                $("#locations_share").fadeOut(function(){
                    $("#locations_exported_container").fadeIn();
                });


                $("#locations_exported_id").html(data.id);
                ladda.ladda( 'stop' );
            }
        });

    });

    $("#locations_import").click(function(){

        $("#locations_share").fadeOut(function(){
            $("#locations_importing").fadeIn();
        });

    });

    $("#locations_download").click(function(){

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({custom_locations: custom_locations || {}, selected_locations: selected_locations || {}}, null, 2));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "spyfall.json");
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

    });

    $("#locations_upload").click(function(e){

        $("#upload_error").hide();
        e.preventDefault();
        $("#upload_input").trigger('click');

    });

    $("#upload_input").change(function() {
        var input = this;
        var reader = new FileReader();

        var onError = function(err){
            $("#upload_error").html();
            $("#upload_error").show();
        };

        reader.onload = function (e) {
            try{
                var data = JSON.parse(e.target.result);
                if(!data || !data.custom_locations || !data.selected_locations){
                    return onError();
                }
                custom_locations = data.custom_locations;
                selected_locations = data.selected_locations;

                store.set('custom_locations', custom_locations);

                configureCustomLocations();
                updateLocations();
            }catch(e){
                onError();
            }
        };
        reader.readAsText(input.files[0]);
    });

    $("#locations_import_button").click(function(){

        var ladda = $("#locations_import_button").ladda();
        ladda.ladda( 'start' );

        $.ajax({
            url: "/import_custom_locations",
            type: "GET",
            data: {
                id: $("#locations_import_id").val().toUpperCase()
            },
            success: function(data){

                ladda.ladda( 'stop' );

                custom_locations = _.extend(custom_locations, data.custom_locations || {});
                selected_locations = data.selected_locations || selected_locations || {};

                store.set('custom_locations', custom_locations);

                configureCustomLocations();
                updateLocations();

                $("#locations_import_button").html(tt('interface.done'));

                setTimeout(function(){
                    $("#locations_import_button").html(tt('interface.import'));
                },5000);

            },error: function(){

                ladda.ladda( 'stop' );


                $("#locations_import_button").html(tt('interface.error'));
                $("#locations_import_button").removeClass('success');
                $("#locations_import_button").addClass('alert');

                setTimeout(function(){
                    $("#locations_import_button").html(tt('interface.import'));
                    $("#locations_import_button").removeClass('alert');
                    $("#locations_import_button").addClass('success');
                },5000);



            }
        });

    });








    //**************************************************************************
    //******************************* ROOMS SETUP ******************************
    //**************************************************************************

    function configureRemotePlayer(data){
        console.log('configureRemotePlayer', data.last_location, data);

        selected_locations = data.selected_locations;
        custom_locations = data.custom_locations;

        $('#timer').countdown('destroy');
        $("#timer").countdown({until: data.countdown || countdown, compact: true, description: '', format: 'M:S',onExpiry: function(){ beep(3); }});
        $('#timer').countdown('pause');

        if(data.role===0){
            $("#room_game_location").html("???");
            $("#room_game_role").html('<img src="../spy.png" width=20>');
        }else{
            $("#room_game_location").html(getLocation(data.location));
            $("#room_game_role").html(getLocationRole(data.location,data.role));
        }

        if(data.spies === 1){
            $("#one_spy").prop("checked",true).change();
        }else{
            $("#two_spies").prop("checked",true).change();
        }

        updateLocations();

        if(data.last_location){
            $(".location_item").removeClass('cross');
            $(".location_item.loc_" + data.last_location).addClass('cross');
            last_location = data.last_location;
        }

    }

    function startRemoteTimer(time, until){

        var diff = new Date().getTime() - new Date(time).getTime();

        until = until - Math.round(diff/1000);

        $('#timer').countdown('resume');
        $('#timer').countdown("option","until",until);

    }

    //room host communication
    $("#create_room").click(function(){

        var ladda = $("#create_room").ladda();
        ladda.ladda( 'start' );

        socket = io();

        socket.on('connect', function () {
            socket.emit('create_room', game_info.room || $.cookie("created_room"));

            $('.player_remote').fadeOut();
            players = {};
        });

        socket.on('created_room',function(room){
            $.cookie("created_room",room);
            game_info.room = room;

            $("#room_id").html(game_info.room);

            ga('send', 'event', 'Room', 'Created');

            $("#room_controls").fadeOut(function(){
                $("#room_create").fadeIn();
                ladda.ladda( 'stop' );
            });
        });

        socket.on('data',function(data){

            var playerName = data.name;
            var sanitizedPlayer = sanitizePlayerName(playerName);

            if(data.type === "PLAYER_JOIN"){

                var player = $('.player_data.' + sanitizedPlayer);

                //check if exists player with this name
                if($('.player_data.' + sanitizedPlayer).length===0){
                    socket.emit('data',playerName,{type: "INVALID_PLAYER"});
                }else{
                    players[playerName] = true;

                    $('.player_data.' + sanitizedPlayer + ' .player_remote').fadeIn();

                    socket.emit('data',playerName,{type: "CONNECTED", selected_locations: selected_locations, custom_locations: getSelectedCustomLocations()});

                    if(game_info.state === "running"){

                        if(game_info.timer==="running"){
                            var until = $.countdown.periodsToSeconds($('#timer').countdown("getTimes"));
                            var time = new Date();
                        }

                        socket.emit('data',playerName,{
                            type: "GAME_START",
                            role: player.data("role"),
                            location: player.data("location"),
                            selected_locations: selected_locations,
                            custom_locations: getSelectedCustomLocations(),
                            time: time,
                            until: until,
                            last_location: last_location,
                            spies: spies,
                            countdown: countdown
                        });
                    }
                }

            }else if(data.type === "PLAYER_LEFT"){

                delete players[playerName];

                $('.player_data.' + sanitizedPlayer + ' .player_remote').fadeOut();

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
        $("#players_controls").fadeOut();
        $("#game_controls").fadeOut();
        $("#game_options").fadeOut();

        $("#timer_control_container").remove();
        $("#timer_watch_container").removeClass('small-6');
        $("#timer_watch_container").addClass('small-12');

        $("#room_controls").fadeOut(function(){
            $("#room_join").fadeIn();
        });

    });

    //room guest communication
    $("#room_join_button").click(function(){

        var room_id, player_name;

        var ladda = $("#room_join_button").ladda();

        ladda.ladda( 'start' );

        $("#room_game").fadeOut();

        if(!socket){
            socket = io();

            socket.on('connect', function () {
                socket.emit('join_room', $("#room_join_id").val().toUpperCase(), $("#room_join_name").val().toUpperCase());
            });
        }else{
            return socket.emit('join_room', $("#room_join_id").val().toUpperCase(), $("#room_join_name").val().toUpperCase());
        }

        socket.on('joined_room', function (_room, _player) {

            room_id = _room;
            player_name = _player;
            console.log(_player);

            game_info.room = room_id;

            socket.emit('data',{type: "PLAYER_JOIN", name: player_name});

            $.cookie("player",player_name);
            $.cookie("room",room_id);

        });

        socket.on('data',function(data){

            if(data.type === "INVALID_PLAYER"){
                onError(tt("interface.error_room_invalid_player"));
            }else if(data.type === "CONNECTED"){

                $("#room_game_data").html(tt("interface.game_connected"));
                $("#room_game_data").removeClass('alert');
                $("#room_game_data").addClass('disabled secondary');

                $("#room_info_id").html(room_id);
                $("#room_info_name").html(player_name);
                $("#room_game_name").html(player_name);

                configureRemotePlayer(data);

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

                $("#room_game_data").html(tt("interface.show_my_role"));
                $("#room_game_data").removeClass('disabled secondary');
                $("#room_game_data").addClass('success');

                $("#room_game_data").off("click");
                $("#room_game_data").click(function(){
                    $("#room_game_me").foundation('open');
                });

                configureRemotePlayer(data);

                if(data.time && data.until){
                    startRemoteTimer(data.time, data.until);
                }

            }else if(data.type === "GAME_END"){

                $("#game_result_text").html("");
                $("#game_result_text").append('<div></span>' + getLocation(data.location) + '</div>');

                $("#game_result_text").append('<div> <img src="../spy.png" width="20"/></span>: ' + data.spy + '</div>');
                if(data.spy2){
                    $("#game_result_text").append('<div> <img src="../spy.png" width="20"/></span>: ' + data.spy2 + '</div>');
                }

                $("#room_game_data").html(tt("interface.game_stopped"));
                $("#room_game_data").removeClass('success');
                $("#room_game_data").addClass('warning');
                $("#room_game_data").removeAttr("data-open");

                $("#room_game_data").off("click");
                $("#room_game_data").click(function(){
                    $("#game_result").foundation('open');
                });

            }else if(data.type === "TIMER_START"){

                startRemoteTimer(data.time, data.until);

            }else if(data.type === "TIMER_STOP"){

                $('#timer').countdown("option","until",data.until);
                $('#timer').countdown('pause');


            }else if(data.type === "DISCONNECTED"){
                onError(tt("interface.error_room_connection"), true);
            }

        });

        socket.on('invalid_socket',function(data){
            onError(tt("interface.error_room_connection"), true);
        });

        socket.on('invalid_room',function(data){
            if(room_id){
                onError(tt("interface.error_room_connection"),true);
            }else{
                onError(tt("interface.error_room_connection"));
            }
        });

        socket.on('disconnected',function(){
            onError(tt("interface.error_room_connection"), true);
        });

        socket.on('disconnect',function(){
            onError(tt("interface.error_room_connection"), true);
        });

        socket.on('error',function(){
            onError(tt("interface.error_room_connection"), true);
        });

        function onError(msg, retry){

            if(retry && socket.connected){
                setTimeout(function(){
                    socket.emit('join_room',room_id,player_name);
                },3000);
            }

            ladda.ladda('stop');
            $("#room_game").fadeIn();
            $("#room_game_data").html(msg);
            $("#room_game_data").removeClass('disabled secondary success');
            $("#room_game_data").addClass('alert');


        }
    });

    var starting_players = store.get('players') || [];

    if(starting_players.length){
        for(var i=0; i<starting_players.length; i++){
            addPlayer(starting_players[i]);
        }
    }else{
        //start with the minimal number of players
        for(var i=1;i<=MIN_PLAYERS;i++){
            addPlayer("p"+ i);
        }
    }

    //set initial configuration for number of spies
    if(spies === 1){
        $("#one_spy").prop("checked",true).change();
    }else{
        $("#two_spies").prop("checked",true).change();
    }


    //set initial configuration for game duration
    $("#selected_duration").val(countdown/60);

    //set game initial state/layout
    endGame();

    //load the english language
    $.getJSON('i18n/en-US.json',function(data){
        i18n_en = data;
        //load user language
        changeLanguage($.cookie("locale") || "en-US");
    });

    //load localization status
    $.getJSON('status.json',function(data){
        $('#languages option').each(function(){
            $(this).html($(this).html() + ' - ' + data[this.value] + '%');
        });
    });

    $(document).foundation();

});
