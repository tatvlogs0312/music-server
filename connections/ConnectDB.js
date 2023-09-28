const { Client } = require('pg')

const config = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: '03122002',
    database: 'music'
})

config.connect(() => console.log('Da ket noi database !'));

module.exports = config