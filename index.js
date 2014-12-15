$(function(){

    var locations  = {
        "1": "airplane",
        "2": "bank",
        "3": "beach",
        "4": "broadway_theater",
        "5": "casino",
        "6": "cathedral",
        "7": "circus_tent",
        "8": "corporate_party",
        "9": "crusader_army",
        "10": "day_spa",
        "11": "embassy",
        "12": "hospital",
        "13": "hotel",
        "14": "military_base",
        "15": "movie_studio",
        "16": "ocean_liner",
        "17": "passenger_train",
        "18": "pirate_ship",
        "19": "polar_station",
        "20": "police_station",
        "21": "restaurant",
        "22": "school",
        "23": "service_station",
        "24": "space_station",
        "25": "submarine",
        "26": "supermarket",
        "27": "university"
    }

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

    $("#container").show();

    function updateInterface(){

        $('*[data-i18n]').each(function(){
            var element = $(this);
            element.html(i18n["interface." + element.attr("data-i18n")]);
        });

    }

    function updateLocations(){
        //update locations
        var locationsSize = _.size(locations);
        $("#locations_left").html("");
        $("#locations_right").html("");
        for(var i=1; i <= locationsSize; i++){
            var location = i18n["location." + locations[i]];
            if(i < (locationsSize/2+1)){
                $("#locations_left").append('<div>' + location + '</div>');
            }else{
                $("#locations_right").append('<div>' + location + '</div>');
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
            '<h2> ' + playerName + '</h2>' +
            '<h4><strong><span data-i18n="location"></span>: </strong><span class="player_location">' + playerNum + '</span></h4>'+
            '<h4><strong><span data-i18n="role"></span>: </strong><span class="player_role">' + playerNum + '</span></h4>'+
            '<a class="close-reveal-modal">&#215;</a>' +
            '<a class="button alert close-modal" data-i18n="close">Close</a>' +
            '</div>' +
            '</div>');


        var input = $("#p" + playerNum + " .player_input");
        var button = $("#p" + playerNum + " .player_button");
        var close = $("#p" + playerNum + " .close-modal");
        var closeTrigger = $("#p" + playerNum + " .close-reveal-modal");


        //changed name
        input.change(function(){
            var newValue = input.val();
            button.html(newValue);
        });

        //want to view role
        button.click(function(evt){

            //if already saw role, don't show again (prevent cheating)
            if(button.hasClass('disabled')) return false;

            button.addClass('disabled secondary');
            button.removeClass('success');
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

        var location = locations[_.random(_.size(locations)-1)];
        var playersCount = $("#players .player_data").length;

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
        $("#game_result").hide();

        updateInterface();

    }

    function endGame(){

        $("#players .player_button").hide();
        $("#players .player_input").show();

        $("#languages").removeAttr("disabled","disabled");
        $("#players_controls").show();
        $("#start_game").show();
        $("#end_game").hide();
        $("#game_result").show();

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