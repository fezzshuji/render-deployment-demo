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


// GET request to all /ships - Read all data 
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

// GET request to /ships/:id - Read one data
app.get('/ships/:id', (req, res, next) => {
  // Get a single ship from the table
  let id = Number.parseInt(req.params.id);
  if (!Number.isInteger(id)){
    res.status(404).send("No ship found with that ID");
  }
  console.log("ships ID: ", id);
  
  pool.query('SELECT * FROM ships WHERE id = $1', [id], (err, result) => {
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

//post new ships
app.post('/ships', (req, res, next) => {
  //const age = Number.parseInt(req.body.age);
  const {name, kind, manufacturer} = req.body;
  console.log("Request body name, kind, age", name, kind, manufacturer);
  // check request data - if everything exists and id is a number
  if (name && kind && manufacturer){
    pool.query('INSERT INTO ships (name, kind, manufacturer) VALUES ($1, $2, $3) RETURNING *', [name, kind, manufacturer], (err, data) => {
      const spaceship = data.rows[0];
      console.log("Created Ship: ", spaceship);
      if (spaceship){
        return res.send(spaceship);
      } else {
        return next(err);
      }
    });

  } else {
    return res.status(400).send("Unable to create ship from request body");
  }

});


app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
    console.log("Connecting to postgres pool: ", pool);
});
  