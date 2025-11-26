
import pool from '../lib/db';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.resolve(__dirname, '../database_schema.sql'), 'utf8');
    await client.query(sql);
    console.log('Database schema created successfully!');
  } catch (error) {
    console.error('Error setting up the database:', error);
  } finally {
    client.release();
    pool.end();
  }
}

setupDatabase();
