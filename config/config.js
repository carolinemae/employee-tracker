const mysql = require('mysql2');
require('dotenv').config();

config = {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_db',
    multipleStatements: true
}

const connection = mysql.createConnection(config);

connection.connect();

module.exports = {
     connection : mysql.createConnection(config) 
} 