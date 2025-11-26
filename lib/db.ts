
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres', // Or your PostgreSQL username
  host: 'localhost',
  database: 'test_generator',
  password: 'root', // Or your PostgreSQL password
  port: 5432,
});

export default pool;
