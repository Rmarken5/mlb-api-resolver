exports.searchForGameForTeam = function (data, teamName, fn) {
    let game;
    if (data && data.games.length && teamName) {
        game = data.games.filter((value => {
            return value.teams.away.team.teamName.toLowerCase() === teamName.toLowerCase() ||
                value.teams.home.team.teamName.toLowerCase() === teamName.toLowerCase() ?
                true :
                false;
        }))[0];
        fn(game);
    }
}

exports.searchForTeams = function (data) {
    const array = new Array();
    if (data && data.games.length) {
        data.games.forEach(element => {
            array.push(element.teams.away.team.teamName);
            array.push(element.teams.home.team.teamName);
        });
    }
    return array;
}

exports.getBoxSummary = function (data) {
    let boxData = {

    };
    try {
        if (data && data.dates && data.dates.length && data.dates[0] && data.dates[0].games && data.dates[0].games.length) {


            const theGoodStuff = data.dates[0].games[0];
            if (theGoodStuff.status) {
                boxData.gameStatus = theGoodStuff.status.statusCode;
            }

            boxData.homeTeam = theGoodStuff.teams.home.team.abbreviation;
            boxData.awayTeam = theGoodStuff.teams.away.team.abbreviation;

            if (theGoodStuff.linescore && theGoodStuff.linescore.offense && theGoodStuff.linescore.offense.batter && theGoodStuff.linescore.offense.batter.stats) {
                const stats = theGoodStuff.linescore.offense.batter.stats;
                let currentBatterStats = stats.find(el => {
                    return el.type.displayName === 'statsSingleSeason' && el.group.displayName === 'hitting';
                });
               
                if (currentBatterStats) {
                    boxData['currentBatter'] = createCurrentBatter(theGoodStuff, currentBatterStats);
                }
            }

            if (theGoodStuff.linescore) {
                const linescore = theGoodStuff.linescore
                boxData['currentInning'] = linescore.currentInning || 1;
                boxData['inningState'] = linescore.inningState || 'top';
                boxData['balls'] = linescore.balls || 0;
                boxData['strikes'] = linescore.strikes || 0;
                boxData['outs'] = linescore.outs || 0;

                if (linescore.offense) {
                    boxData['first'] = linescore.offense.first ? true : false;
                    boxData['second'] = linescore.offense.second ? true : false;
                    boxData['third'] = linescore.offense.third ? true : false;
                }

                if(linescore.innings){
                    boxData['innings'] = linescore.innings;
                }
            }

        }

        return boxData;

    } catch (err) {
        throw new Error('Something went wrong when pulling data. ' + JSON.stringify(err));
    }
}

exports.getBoxDetails = function (data) {

    let boxDetails = {};
    let teamData = null;

    if (data.teams) {
        teamData = data.teams;
        const home = teamData.home;
        const away = teamData.away;
        if (home.players && home.battingOrder && away.players && away.battingOrder) {
            const homeLineup = parsePlayers(home.players, home.battingOrder);
            const awayLineup = parsePlayers(away.players, away.battingOrder);

            boxDetails['awayLineup'] = awayLineup;
            boxDetails['homeLineup'] = homeLineup;


        }

    }

    return boxDetails;


}

let CurrentBatter = function (name, avg, obp, slg, hr) {
    this.name = name;
    this.avg = avg;
    this.obp = obp;
    this.slg = slg;
    this.hr = hr;
};

function createCurrentBatter(theGoodStuff, currentBatterStats) {
    const name = theGoodStuff.linescore.offense.batter.fullName;
    const avg = currentBatterStats.stats.avg;
    const obp = currentBatterStats.stats.obp;
    const slg = currentBatterStats.stats.slg;
    const hr = currentBatterStats.stats.homeRuns;
    return new CurrentBatter(name, avg, obp, slg, hr);
}

function parsePlayers(teamAsId, lineup) {

    return lineup.map(id => {
        const player = teamAsId['ID' + id];
        return {
            fullName: player.person.fullName,
            position: player.position.abbreviation,
            atBats: player.stats.batting.atBats,
            runs: player.stats.batting.runs,
            hits: player.stats.batting.hits,
            runsBattedIn: player.stats.batting.rbi,
            baseOnBalls: player.stats.batting.baseOnBalls,
            strikeOuts: player.stats.batting.strikeOuts,
            leftOnBase: player.stats.batting.leftOnBase,
            battingAverage: player.seasonStats.batting.avg,
            onBasePlusSlugging: player.seasonStats.batting.ops,


        }
    });
}