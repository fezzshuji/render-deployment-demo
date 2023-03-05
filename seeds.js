const { Pool } = require('pg');
const pool = require('./dbConn');

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
                console.log(data.rows[0]['count']);
            }
        });
    }
})



// close connection
pool.end();

