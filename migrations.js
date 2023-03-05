const { Pool } = require('pg');
const dbConn = require('./dbConn');
const pool = dbConn.getPool();

// establish a connection we can close with a callback
function runMigrations(pool, callback){
    // connect to DB
    pool.connect((err, client, done) => {
        if (err) {
            console.log("Failed to connect to the database");
            console.error(err);
            return done();
        }
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
                // tell pg we are done with this connection, then execute callback to close it
                done();
                callback();
            }
        );
    });
}

runMigrations(pool, () => {
    // migrations are complete, we can close the pool
    pool.end();
})


