const { Pool } = require('pg');

// Configure the PostgreSQL connection
const pool = new Pool({
    user: 'your_username',   // Replace with your PostgreSQL username
    host: 'localhost',
    database: 'employee_tracker',
    password: 'your_password', // Replace with your PostgreSQL password
    port: 5432,               // Default PostgreSQL port
});

module.exports = pool;




