const { query } = require('express');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'BandS!7689',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

app.post('/api/new-employee', ({ body } , res) => {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?)`;
    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        })
    })
});

app.get('/api/employees', (req, res) => {
    const sql = `SELECT id, first_name, last_name, role_id FROM employees`;

    db.query(sql, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message});
          return;
        }
        res.json({
          message: 'success',
          data: rows
        });
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})