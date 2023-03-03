const { Pool } = require('pg');
const pool = require('./dbConn');

// run seed SQL
pool.query(`INSERT INTO pets (name, kind, age) VALUES 
    ('Fido', 'Labradoodle', 5),
    ('Skippy', 'Greyhound', 7),
    ('Rollo', 'Golden Retriever', 5)`, 
    (err, data) => {
        if (err){
            console.log("Insert failed");
        } else {
            console.log(data);
        }
    }
);

// close connection
pool.end();

