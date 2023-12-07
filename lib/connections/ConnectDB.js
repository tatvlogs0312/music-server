const { Client } = require("pg");

const db = new Client({
  host: process.env.D_HOST,
  user: process.env.D_USER,
  port: process.env.D_PORT,
  password: process.env.D_PASSWORD,
  database: process.env.D_DATABASE,
});

db.connect((err, client) => {
  if (err) {
    console.log("Loi connect to database");
  } else {
    console.log("Da ket noi database !");
  }
});

module.exports = db;
