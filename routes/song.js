var express = require('express');
var router = express.Router();
var config = require('../connections/ConnectDB')

/* GET users listing. */
router.get('/', function (req, res, next) {
    const query = 'select * from song'
    config.query(query, (err, result) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(result.rows)
    })
});

module.exports = router;