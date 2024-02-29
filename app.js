// Declarations
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { Pool } = require('pg'); // Import the Pool class from the pg module


const pool = new Pool({
  user: 'postgres',
  host: 'nodejs-postgres2.postgres.database.azure.com', // Instead of 'localhost'
  database: 'todo',
  password: 'Reborn1987',
  port: 5432,
});

// Initialization of express
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  var title = 'TODO List';
  
  // Query tasks from PostgreSQL
  pool.query('SELECT * FROM tasks ORDER BY id DESC', (err, result) => {
    if (err) {
      return res.send(err);
    }

    res.render('index', {
      title: title,
      tasks: result.rows,
      counter: result.rowCount
    });
  });
});

// Add task to PostgreSQL only
app.post('/todo/add', (req, res) => {
  var task = req.body.task;
  
  pool.query('INSERT INTO tasks (task) VALUES ($1)', [task], (err, result) => {
    if (err) {
      return res.send(err);
    }
    res.redirect('/');
  });
});




app.post('/todo/delete', async (req, res) => {
  console.log(req.body['todo[]']); // Check what you're receiving.
  let delTasks = req.body['todo[]'];

  if (typeof delTasks === 'string') {
    delTasks = [delTasks];
  }


  try {
    await Promise.all(delTasks.map(taskId => {
      return pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    }));
    console.log(`Deleted tasks: ${delTasks}`); // Log the tasks being deleted.
  } catch (err) {
    console.error('Error deleting tasks:', err);
    return res.status(500).send('An error occurred while deleting tasks.');
  }

  res.redirect('/');
});



// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000...');
});

module.exports = app;
