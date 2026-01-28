const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root@123',
    database: 'blogappapi'
});

module.exports = pool;