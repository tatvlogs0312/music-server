const { Client } = require('pg')

const db = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: '03122002',
    database: 'music'
})

db.connect(() => console.log('Da ket noi database !'));

module.exports = db