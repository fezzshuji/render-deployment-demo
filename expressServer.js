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

// GET request to /pets/:id - Read one pet
app.get('/ship/:id', (req, res, next) => {
  // Get a single ship from the table
  let id = Number.parseInt(req.params.id);
  if (!Number.isInteger(id)){
    res.status(404).send("No ship found with that ID");
  }
  console.log("spaceship ID: ", id);
  
  pool.query('SELECT * FROM spaceship WHERE id = $1', [id], (err, result) => {
    if (err){
      return next(err);
    }
    
    let spaceship = result.rows[0];
    console.log("Single Spaceship ID", id, "values:", spaceship);
    if (spaceship){
      return res.send(spaceship);
    } else {
      return res.status(404).send("No ship found with that ID");
    }
  });
});


app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
    console.log("Connecting to postgres pool: ", pool);
});
  