require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Test database connection route
app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      res.status(500).send('Database connection failed');
    } else {
      res.send(`Database connection successful: ${results[0].solution}`);
    }
  });
});
// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    const query = `SELECT patient_id, first_name, last_name, 
                 DATE_FORMAT(date_of_birth, '%Y-%m-%d') as date_of_birth
                 FROM patients`;
    
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving patients');
      } else {
        res.render('data', { title: 'Patients', results, headers: ['Patient ID', 'First Name', 'Last Name', 'Date of Birth'] });
      }
    });
  });
  
  // 2. Retrieve all providers
  app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving providers');
      } else {
        res.render('data', { title: 'Providers', results, headers: ['First Name', 'Last Name', 'Specialty'] });
      }
    });
  });

  //3 Filter patients by first name

  app.get('/patients/:first_name', (req, res) => {
    const { first_name } = req.params;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    
    db.query(query, [first_name], (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving patients by first name');
      } else {
        res.render('data', { title: 'Patients', results, headers: ['Patient ID', 'First Name', 'Last Name', 'Date of Birth'] });
      }
    });
  });
  
  // 4. Retrieve providers by specialty 
  app.get('/providers/specialty/:specialty', (req, res) => {
    const { specialty } = req.params;
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    
    db.query(query, [specialty], (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving providers by specialty');
      } else {
        res.render('data', { title: 'Providers', results, headers: ['First Name', 'Last Name', 'Specialty'] });
      }
    });
  });


  

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
