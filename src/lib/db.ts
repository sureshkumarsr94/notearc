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
    console.log('DB Connection Config:', {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        database: process.env.DB_NAME || 'notearc',
        hasPassword: !!process.env.DB_PASSWORD
    });

    global.mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'notearc',
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
        connectTimeout: 10000,
        ssl: process.env.DB_HOST?.includes('amazonaws.com') ? { rejectUnauthorized: false } : undefined
    });
    console.log('Created new MySQL connection pool');
}

pool = global.mysqlPool;

export default pool;
