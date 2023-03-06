'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8001; // port that Express will listen to for requests

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());

// const DATABASE_URL = process.env.DATABASE_URL;
const dbConn = require('./dbConn');
const pool = dbConn.getPool();


  
app.get('/ships', (req, res, next) => {
    // Get allllll the rows in pets table
    pool.query('SELECT * FROM ships', (err, result) => {
      if (err){
        return next(err);
      }
      
      const rows = result.rows;
    //   console.log(rows);
      return res.send(rows);
    });
});


app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
    console.log("Connecting to postgres pool: ", pool);
});
  