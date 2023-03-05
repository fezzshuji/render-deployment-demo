const { Pool } = require('pg');
const dbConn = require('./dbConn');
const pool = dbConn.getPool();

// establish a connection we can close with a callback
function runSeeder(pool, callback){
    // connect to DB
    pool.connect((err, client, done) => {
        if (err) {
            console.log("Failed to connect to the database");
            console.error(err);
            return done();
        }
        // run seed SQL
        pool.query(`SELECT COUNT(*) FROM pets`, (err, data) => {
            console.log("number of existing rows: ", data.rows[0]['count']);
            // only INSERT new rows if the table is currently empty
            if (data.rows[0]['count'] == 0){
                pool.query(`INSERT INTO pets (name, kind, age) VALUES 
                ('Fido', 'Labradoodle', 5),
                ('Skippy', 'Greyhound', 7),
                ('Rollo', 'Golden Retriever', 5)`, 
                (err, data) => {
                    if (err){
                        console.log("Insert failed");
                    } else {
                        console.log("Seeding complete");
                    }
                });
            } else {
                console.log("Did not seed new data because Table was not empty");
            }
            // tell pg we are done with this connection, then execute callback to close it
            done();
            callback();
        });
    });
};

runSeeder(pool, () => {
    // seeding is done, so we can close the pool
    pool.end();
})




