import sqlite3 from 'sqlite3';

const DB_PATH = 'notifications.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) console.error('Database connection failed:', err);
    else console.log('Database connected successfully.');
});

export default db;