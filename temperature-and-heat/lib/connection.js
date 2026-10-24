import { Pool } from 'pg'; //npm install pg

const pool = new Pool({
  user: 'your_username', // Replace with your PostgreSQL information
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

export default pool;
