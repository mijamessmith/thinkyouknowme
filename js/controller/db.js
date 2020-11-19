//holds all the database connections, including an instance of knex and mssql

const mysql = require("mysql");
const settings = require("../config/settings");
var pool = mysql.createPool(settings.mysqlPoolConfig);

pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('1 + 1 is: ', results[0].solution + ' we are connected with mySQL pool');
});

var knex = require('knex')({
    client: 'mysql',
    connection: settings.mysqlConfig 
});

exports.knex = knex;
exports.pool = pool
