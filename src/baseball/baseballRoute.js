module.exports = function (app) {
    var baseballController = require('../controllers/baseballController');

    app.get('/baseball', baseballController.listTodaysGameFetch);

}