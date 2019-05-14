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
