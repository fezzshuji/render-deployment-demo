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
        pool.query(`SELECT COUNT(*) FROM ships`, (err, data) => {
            console.log("number of existing rows: ", data.rows[0]['count']);
            // only INSERT new rows if the table is currently empty
            if (data.rows[0]['count'] == 0){
                pool.query(`INSERT INTO ships (name, kind, manufacturer) VALUES 
                ('Gladius', 'Light Fighter', 'Aegis'),
                ('Anvil Arrow', 'Light Fighter', 'Anvil'),
                ('Javelin', 'Destroyer', 'Aegis'),
                ('Hurricane', 'Heavy Fighter', 'Anvil'),
                ('400i', 'Exploration', 'Origin'),
                ('700i', 'Luxury Exploration', 'Origin'),
                ('Avenger', 'Light Frieght', 'Anvil'),
                ('Stalker', 'Interdiction', 'Anvil'),
                ('Mustang Beta', 'Path Finder', 'Anvil'),
                ('Liberator', 'Light Carrier', 'Anvil'),
                ('Hammerhead', 'Gunship', 'Aegis'),
                ('Cutlass Steel', 'Dropship', 'Drake'),`, 
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




