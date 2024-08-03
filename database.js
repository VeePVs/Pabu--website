const mysql = require("promise-mysql");

const connection = mysql.createConnection({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

const getConnection = async () => await connection;

module.exports = {
    getConnection
}