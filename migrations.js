const { Pool } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
const pool = require('./dbConn');

// run migration SQL
pool.query(`CREATE TABLE IF NOT EXISTS pets (
    id SERIAL PRIMARY KEY,
    kind text,
    name text,
    age INTEGER)`, (err, data) => {
        if (err){
            console.log("CREATE TABLE pets failed");
        } else {
            console.log("pets table created sucessfully");
        }
    }
);

// close connection
pool.end();