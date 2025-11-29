import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Declare a global variable to hold the pool instance
declare global {
    // eslint-disable-next-line no-var
    var mysqlPool: mysql.Pool | undefined;
}

// Use a singleton pattern to prevent multiple pool instances
let pool: mysql.Pool;

if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'notearc',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
    console.log('Created new MySQL connection pool');
}

pool = global.mysqlPool;

export default pool;
