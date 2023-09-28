var express = require('express');
var router = express.Router();
var config = require('../connections/ConnectDB')

/* GET users listing. */
router.get('/', function (req, res, next) {
    config.query('select * from song', (err, result) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(result.rows)
    })
});

module.exports = router;