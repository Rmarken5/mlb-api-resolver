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

            if (theGoodStuff.innings && theGoodStuff.innings.length) {

                let scores = {};
                theGoodStuff.innings.forEach(inning => {
                    scores[inning.num] = {
                        away: inning.away.runs,
                        home: inning.home.runs,
                    };
                });
                boxData['innings'] = scores;

            }

            if (theGoodStuff.linescore && theGoodStuff.linescore.offense && theGoodStuff.linescore.offense.batter && theGoodStuff.linescore.offense.batter.stats) {
                const stats = theGoodStuff.linescore.offense.batter.stats;
                let currentBatterStats = stats.filter(el => {
                    return el.type.displayName === 'statsSingleSeason' && el.group.displayName === 'hitting';
                });
                currentBatterStats = currentBatterStats.length ? currentBatterStats[0] : undefined;
                if (currentBatterStats) {
                    boxData['currentBatter'] = createCurrentBatter(theGoodStuff, currentBatterStats);
                }
            }

            if (theGoodStuff.linescore && theGoodStuff.linescore.offense) {
                boxData['first'] = theGoodStuff.linescore.offense.first ? true : false;
                boxData['second'] = theGoodStuff.linescore.offense.second ? true : false;
                boxData['third'] = theGoodStuff.linescore.offense.third ? true : false;
            }

        }

        return boxData;

    } catch (err) {
        throw new Error('Something went wrong when pulling data. ' + JSON.stringify(err));
    }
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