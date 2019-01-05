/*global$*/
function setUpApp() {

    //Log to console function
    function print(data) {
        console.log(data);
    }

    var apiLinks = ["https://api.football-data.org/v2/competitions/PL/matches?matchday=", "https://api.football-data.org/v2/competitions/PL/matches"];

    var apiAuthorization = { 'X-Auth-Token': '5d791d1818c3415d9b1a4b323c899bf4' };
    var dayInput;


    $.ajax({
        headers: apiAuthorization,
        url: apiLinks[0],
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {

        // do something with the response, e.g. isolate the id of a linked resource   
        var data = response.matches;

        // empty arrays
        var awayScore = [];
        var homeScore = [];
        var awayTeam = [];
        var homeTeam = [];
        var matchDay = [];
        var status = [];
        var toPlay = " - ";
        var teams = [];

        //Loop through object arrays and filter data using push to empty arrays
        Object.keys(data).forEach(function(key) {

            matchDay.push(data[key].matchday);

            homeTeam.push(data[key].homeTeam.name);
            teams.push(data[key].homeTeam.name);

            awayTeam.push(data[key].awayTeam.name);
            teams.push(data[key].awayTeam.name);

            status.push(data[key].status);


            //Populate home and away score arrays
            if (data[key].status !== "SCHEDULED") {
                awayScore.push(data[key].score.fullTime.awayTeam);
                homeScore.push(data[key].score.fullTime.homeTeam);
            }
            else {}
            if (data[key].status == "SCHEDULED") {
                homeScore.push(toPlay);
                awayScore.push(toPlay);
            }
            else {}

        });

        // Filter teams array and remove dublicates
        function removeDuplicates(teams) {
            var uniqueTeams = [];
            for (let i = 0; i < teams.length; i++) {
                if (uniqueTeams.indexOf(teams[i]) == -1) {
                    uniqueTeams.push(teams[i])
                }
            }
            return uniqueTeams;
        }

        teams = removeDuplicates(teams);

        print(data[0]);

        // Fill option seletor with teams
        var select = document.createElement("select"),
            option;

        select.id = "teamList";
        select.name = "teams";

        for (var i = 0; i < teams.length; i++) {

            option = document.createElement("option");
            option.value = "Select Team";
            option.id = "team" + (i + 1);

            teams.sort();
            select.appendChild(option);
            option.innerHTML = teams[i];
            select.appendChild(option);

        }
        document.getElementById("formSelect").appendChild(select);

        //Create table tags
        for (var col = 0; col < matchDay.length; col++) {

            var tr = document.createElement('tr'),
                th, tr, td, result, state, hTeam, aTeam, score, spanWin, spanLoss;

            th = document.createElement('th');
            th.scope = "row";
            th.className = "matchDay";
            state = document.createElement('td');
            state.className = "matchState";
            hTeam = document.createElement('td');
            hTeam.className = "homeTeam";
            aTeam = document.createElement('td');
            aTeam.className = "awayTeam";
            score = document.createElement('td');
            score.className = "score";
            spanWin = document.createElement("span");
            spanWin.className = "win glyphicon glyphicon-flag";
            spanLoss = document.createElement("span");
            spanLoss.className = "loss glyphicon glyphicon-flag";

            // Append new elements and pust to document
            for (result = 0; result < matchDay.length; result++) {
                tr.appendChild(th);
                tr.appendChild(hTeam);
                tr.appendChild(aTeam);
                tr.appendChild(state);
                tr.appendChild(score);


                th.innerHTML = matchDay[col];
                hTeam.innerHTML = homeTeam[col];
                aTeam.innerHTML = awayTeam[col];
                state.innerHTML = status[col];


                //show results
                if (homeScore[col] > awayScore[col]) {
                    showWin();
                    showResult();
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }
                else if (homeScore[col] < awayScore[col]) {
                    showLosser();
                    showResult();
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }
                else if (homeScore[col] == awayScore[col]) {
                    showDraw();
                    showResult();
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }
                else {
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }
            }
            document.getElementById('tableStriped').appendChild(tr);

        }


        //Apply css to winner colomn 
        // show green flag if win
        function showWin() {
            aTeam.appendChild(spanLoss);
            hTeam.appendChild(spanWin);
            spanWin.style.color = "green";
            spanLoss.style.color = "red";
            spanLoss.style.fontSize = "8px";
            spanWin.style.fontSize = "15px";

        }

        // show red flag loss
        function showLosser() {
            aTeam.appendChild(spanWin);
            hTeam.appendChild(spanLoss);
            spanLoss.style.color = "red";
            spanWin.style.color = "green";
            spanLoss.style.fontSize = "8px";
            spanWin.style.fontSize = "15px";


        }

        function showDraw() {
            aTeam.appendChild(spanWin);
            hTeam.appendChild(spanLoss);
            spanLoss.style.color = "blue";
            spanWin.style.color = "blue";
            spanLoss.style.fontSize = "8px";
            spanWin.style.fontSize = "8px";


        }

        function showResult() {
            score.style.textAlign = "center";
            score.style.fontSize = "1.5em";
            state.style.textAlign = "center"
            th.style.textAlign = "center"
            hTeam.style.textAlign = "center";
            aTeam.style.textAlign = "center";
        }


        //

        var gamesPlayed = [];
        var toPlayHome = 0;
        var toPlayAway = 0;
        
        var homeGames = 0;
        var awayGames = 0;
        
        var homeWin = 0;
        var homeLoss = 0;
        
        var awayWin = 0;
        var awayLoss = 0;
        
        var homeDraw = 0;
        var awayDraw = 0;

        // Get number of games played per team home and away
        function playedGames(team) {
            var checkTeam = team;
            
            // get team wins, losses, draws - home and
            for (var i = 0; i < data.length; i++) {
                
                if ( homeTeam[i] == checkTeam &&  homeScore[i] > awayScore[i] ){
                    homeWin ++;
                    //print(matchDay[i] +  '  '+homeTeam[i] +'  '+ homeScore[i] + " " + awayTeam [i] + ' '+ awayScore[i] );
                }else if ( homeTeam[i] == checkTeam && awayScore[i] > homeScore[i] ){
                    print("away win")
                    awayWin ++
                }else if( homeTeam[i] == checkTeam && homeScore[i] == awayScore[i] ){
                      if (status[i] != "SCHEDULED") {
                    homeDraw ++;
                }
                }else if ( awayTeam[i] == checkTeam && homeScore[i] < awayScore[i] ){
                    homeLoss ++;
                }else if ( awayTeam[i] == checkTeam && awayScore[i] < homeScore[i] ){
                    awayLoss ++;
                }else if ( awayTeam[i] == checkTeam && awayScore[i] == homeScore[i] ){
                    if (status[i] != "SCHEDULED") {
                    awayDraw ++;
                }
                    
                }
                
                // Check if team played on a particullar day and get home or away
                if (status[i] == "FINISHED" && homeTeam[i].includes(checkTeam)) {
                    homeGames++;
                    //print(true)
                }
                else if (status[i] == "SCHEDULED" && homeTeam[i].includes(checkTeam)) {
                    //print(false)
                    toPlayHome++;
                }
                else if (status[i] == "FINISHED" && awayTeam[i].includes(checkTeam)) {
                    awayGames++;
                }
                else if (status[i] == "SCHEDULED" && awayTeam[i].includes(checkTeam)) {
                    toPlayAway++;
                }else {}
            }
            
            document.getElementById("played").innerHTML = "Home : " + homeGames + " -  Away: " + awayGames;
            document.getElementById("wins").innerHTML = "Home : " + homeWin + " -  Away: " + awayWin; 
            document.getElementById("toPlay").innerHTML = "Home : " + toPlayHome + " -  Away: " + toPlayAway; 
            document.getElementById("loss").innerHTML = "Home : " + homeLoss + " -  Away: " + awayLoss;  
            document.getElementById("draw").innerHTML = "Home : " + homeDraw + " -  Away : " + awayDraw;
            
            document.getElementById("goalPerMatch").innerHTML = awayGames;
            document.getElementById("totalGoal").innerHTML = awayGames;
            document.getElementById("cleanSheets").innerHTML = awayGames;
            document.getElementById("avgGoalsConc").innerHTML = awayGames;
            
            print("Home " + homeGames);
            print("Away " + awayGames);
            print(teams[2]);
        };
        playedGames(teams[2]);

    });

}



window.onload = function() {
    setUpApp();
}
