const fetch = require('node-fetch');
const analyzeData = require('../logic/analyzeData');


exports.listTodaysGameFetch = function (req, res) {
    let date = new Date();
    let team;
    console.log(req.query);
    if (req.query) {
        if (req.query['date']) {
            date = new Date(req.query['date']);
            console.log(date);
        }
        if (req.query['teamName']) {
            teamName = req.query['teamName'];
        }
    }
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1,51&date=${year}-${month}-${day}&gameTypes=E,S,R,A,F,D,L,W&hydrate=team(leaders(showOnPreview(leaderCategories=[homeRuns,runsBattedIn,battingAverage],statGroup=[pitching,hitting]))),linescore(matchup,runners),flags,liveLookin,review,broadcasts(all),decisions,person,probablePitcher,stats,homeRuns,previousPlay,game(content(media(featured,epg),summary),tickets),seriesStatus(useOverride=true)&useLatestGames=false&language=en&leagueId=103,104,420`;
    fetch(url)
        .then(result => result.json())
        .then(json => {
            if (teamName) {
                console.log(json);
                analyzeData.searchForGameForTeam(json.dates[0], teamName, (game) => {
                    res.send(game)
                });
            } else {
                res.json(json);
            }
        });

}

exports.getAllTeamsOnDate = function (req, res) {
    ;
    let date = new Date();
    if (req.query &&
        req.query['date'] &&
        req.query['date'].match('\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*')) {
        date = new Date(req.query['date']);
    }
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1,51&date=${year}-${month}-${day}&gameTypes=E,S,R,A,F,D,L,W&hydrate=team(leaders(showOnPreview(leaderCategories=[homeRuns,runsBattedIn,battingAverage],statGroup=[pitching,hitting]))),linescore(matchup,runners),flags,liveLookin,review,broadcasts(all),decisions,person,probablePitcher,stats,homeRuns,previousPlay,game(content(media(featured,epg),summary),tickets),seriesStatus(useOverride=true)&useLatestGames=false&language=en&leagueId=103,104,420`;
    fetch(url).then(result => result.json()).then(json => {
        res.json(analyzeData.searchForTeams(json.dates[0]));
    });

}