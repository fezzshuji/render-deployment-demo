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
app.get('/api/ships', (req, res, next) => {
    // Get all the rows in ships table
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
app.get('/api/ships/:id', (req, res, next) => {
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
app.post('/api/ships', (req, res, next) => {
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

// DELETE to /ships/:id - Delete a ship
app.delete("/api/ships/:id", (req, res, next) => {
  const id = Number.parseInt(req.params.id);
  if (!Number.isInteger(id)){
    return res.status(400).send("No ship found with that ID");
  }

  pool.query('DELETE FROM ships WHERE id = $1 RETURNING *', [id], (err, data) => {
    if (err){
      return next(err);
    }
    const deletedShip = data.rows[0];
    console.log(deletedShip);
    if (deletedShip){
      // respond with deleted row
      res.send(deletedShip);
    } else {
      res.status(404).send("No ship found with that ID");
    }
  });
});

// PATCH to /ships/:id - Update ship
app.patch('/ships/:id', (req, res, next) => {
  // parse id from URL
  const id = Number.parseInt(req.params.id);
  // get data from request body
  //const year = Number.parseInt(req.body.age);
  const {name, kind, manufacturer} = req.body;
  // if id input is ok, make DB call to get existing values
  if (!Number.isInteger(id)){
    res.status(400).send("No ship found with that ID");
  }
  console.log("ShipID: ", id);
  // get current values of the pet with that id from our DB
  pool.query('SELECT * FROM ships WHERE id = $1', [id], (err, result) => {
    if (err){
      return next(err);
    }
    console.log("request body name, manufacturer, kind: ", name, manufacturer, kind);
    const spaceship = result.rows[0];
    console.log("Single spaceship ID from DB", id, "values:", spaceship);
    if (!spaceship){
      return res.status(404).send("No ship found with that ID");
    } else {
      // check which values are in the request body, otherwise use the previous pet values
      // let updatedName = null; 
      const updatedName = name || spaceship.name; 
      // if (name){
      //   updatedName = name;
      // } else {
      //   updatedName = pets.name;
      // }
      const updatedType = kind || spaceship.kind;
      const updatedManufacturer = manufacturer || spaceship.manufacturer;

      pool.query('UPDATE ships SET name=$2, kind=$3, manufacturer=$4 WHERE id = $1 RETURNING *', 
          [updatedName, updatedType, updatedManufacturer, id], (err, data) => {
        
        if (err){
          return next(err);
        }
        const updatedShip = data.rows[0];
        console.log("updated row:", updatedShip);
        return res.send(updatedShip);
      });
    }    
  });
});

app.use((_req, res) => {
  res.sendStatus(404);
});

// eslint-disable-next-line max-params
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
    console.log("Connecting to postgres pool: ", pool);
});
  