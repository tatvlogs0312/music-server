const { Client } = require('pg')

const db = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: '03122002',
    database: 'music'
})

db.connect((err, client) => {
    if (err) {
        console.log('Loi connect to database');
    } else {
        console.log('Da ket noi database !')
    }
});

module.exports = db