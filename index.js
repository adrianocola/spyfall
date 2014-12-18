$(function(){

    $("#container").show();

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
    ]

    var i18n = {};

    function changeLanguage(lang){
        $.getJSON('i18n/' + lang + '.json',function(data){
            $.cookie("locale",lang);
            i18n = data;
            updateInterface();
            updateLocations();
            $("#languages").val(lang);
            $("#container").show();
        }).fail(function(){
            changeLanguage('en');
        });
    }

    function updateInterface(){

        $('*[data-i18n]').each(function(){
            var element = $(this);
            element.html(i18n["interface." + element.attr("data-i18n")]);
        });

    }

    function updateLocations(){
        //update locations
        $("#locations_left").html("");
        $("#locations_right").html("");

        var all_locations = [];
        for(var i=0; i < locations.length; i++){
            all_locations.push(i18n["location." + locations[i]]);
        }
        all_locations.sort();

        for(var i=0; i < locations.length; i++){
            if(i < (locations.length/2)){
                $("#locations_left").append('<div>' + all_locations[i] + '</div>');
            }else{
                $("#locations_right").append('<div>' + all_locations[i] + '</div>');
            }
        }
    }

    //load the english language
    changeLanguage($.cookie("locale") || "en");

    function checkAddRem(){
        if($("#players .player_data").length >= 8){
            $("#add_player").addClass("disabled secondary");
        }else if($("#players .player_data").length <= 3){
            $("#rem_player").removeClass("alert");
            $("#rem_player").addClass("disabled secondary");
        }else{
            $("#add_player").removeClass("disabled secondary");
            $("#rem_player").removeClass("disabled secondary");
            $("#rem_player").addClass("alert");
        }
    }


    function addPlayer(name){
        var playerNum = $("#players .player_data").length+1;
        var playerName = name?name:"player" + playerNum;
        $("#players").append(
            '<div id="p' + playerNum + '" class="player_data">' +
                '<input class="player_input" value=' + playerName + '>' +
                '<a class="button success expand player_button" href="#" data-reveal-id="modal' + playerNum + '">' + playerName + '</a>' +
                '<div id="modal' + playerNum + '" class="reveal-modal small text-center" data-reveal>' +
                    '<h2 class="player_title"> ' + playerName + '</h2>' +
                    '<h4><strong><span data-i18n="location"></span>: </strong><span class="player_location">' + playerNum + '</span></h4>'+
                    '<h4><strong><span data-i18n="role"></span>: </strong><span class="player_role">' + playerNum + '</span></h4>'+
                    '<a class="close-reveal-modal">&#215;</a>' +
                    '<a class="button alert close-modal" data-i18n="close">Close</a>' +
                '</div>' +
            '</div>');


        var input = $("#p" + playerNum + " .player_input");
        var button = $("#p" + playerNum + " .player_button");
        var title = $("#p" + playerNum + " .player_title");
        var close = $("#p" + playerNum + " .close-modal");
        var closeTrigger = $("#p" + playerNum + " .close-reveal-modal");

        //changed name
        input.change(function(){
            var newName = input.val();
            button.html(newName);
            title.html(newName);
        });

        //want to view role
        button.click(function(evt){

            //if already saw role, don't show again (prevent cheating)
            if(button.hasClass('disabled')) return false;

            button.addClass('disabled secondary');
            button.removeClass('success');

            ga('send', 'event', 'Game', 'ViewPlayerRole', playerNum);
        });

        close.click(function(){
            closeTrigger.trigger('click');
        });


        $("#players .player_button").hide();

        $("#players").foundation();
    }

    function configurePlayer(playerNum, location, role){
        var playerName = $("#p" + playerNum + " .player_input").val();
        var playerLocation = $("#p" + playerNum + " .player_location");
        var playerRole = $("#p" + playerNum + " .player_role");

        //is spy?
        if(role===0){
            playerLocation.html("???");
            playerRole.html('<img src="spy.png" width=20>' + i18n["spy"]);
            $("#game_result_text").html("");
            $("#game_result_text").append('<div><span data-i18n="location"></span>: ' + i18n["location." + location] + '</div>');
            $("#game_result_text").append('<div>' + playerName + ' <span data-i18n="is_the_spy"></span></div>');
        }else{
            playerLocation.html(i18n["location." + location]);
            playerRole.html(i18n["location." + location + ".role" + role]);
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

        var location = locations[_.random(locations.length-1)];
        var playersCount = $("#players .player_data").length;

        ga('send', 'event', 'Game', 'Start', location);

        var allRoles = getAllRoles();
        var availableRoles = getAvailableRoles(playersCount,allRoles);
        var assignedPlayersRoles = assignPlayersRoles(playersCount,availableRoles);

        //assign to each player a random role from the available roles
        for(var i=0;i<playersCount;i++){
            configurePlayer(i+1,location,assignedPlayersRoles[i]);
        }

        $("#players .player_input").hide();
        $("#players .player_button").show();

        $("#players .player_button").removeClass('disabled secondary');
        $("#players .player_button").addClass('success');

        $("#languages").attr("disabled","disabled");
        $("#players_controls").hide();
        $("#start_game").hide();
        $("#end_game").show();
        $("#timer_container").show();
        $("#game_result").hide();

        updateInterface();

        $("#timer").countdown({until: +480, compact: true, description: '', format: 'M:S',onExpiry: function(){ beep(3); }});
        $('#timer').countdown('pause');
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

        $('#timer').countdown('destroy');

    }

    function beep(times){
        for(var i=0; i< times; i++){
            setTimeout(function(){
                new Beep(22050).play(1000, 0.5, [Beep.utils.amplify(8000)]);
            },i*1000);
        }
    }

    $("#add_player").click(function(){
        if($("#add_player").hasClass("disabled")) return false;
        addPlayer();
        checkAddRem();
    });

    $("#rem_player").click(function(){
        if($("#rem_player").hasClass("disabled")) return false;
        $("#players .player_data:last-child").remove();
        checkAddRem();
    });

    $("#start_game").click(startGame);

    $("#end_game").click(endGame);

    $("#languages").change(function(){
        changeLanguage($("#languages").val());
    });

    $("#me").click(function(){
        document.location.href = atob("bWFpbHRvOmFkcmlhbm9jb2xhQGdtYWlsLmNvbQ==");
    });

    $("#timer_control").click(function(){
        $('#timer').countdown('toggle');

        if($("#timer_control").hasClass("success")){
            $("#timer_control").removeClass('success');
            $("#timer_control").addClass('alert');
            $("#timer_control").html(i18n["interface.pause_timer"]);
        }else{
            $("#timer_control").removeClass('alert');
            $("#timer_control").addClass('success');
            $("#timer_control").html(i18n["interface.start_timer"]);
        }

    });

    //set add/rem buttons initial state
    checkAddRem();

    //start with 3 players
    addPlayer("player1");
    addPlayer("player2");
    addPlayer("player3");

    //set game initial state
    endGame();


    $(document).foundation();

});