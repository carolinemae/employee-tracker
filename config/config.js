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

// Connect to mysql and use credentials above (.env used to save my password)
connection.connect();

// Export connection to be used in index.js file
module.exports = {
     connection : mysql.createConnection(config) 
} 