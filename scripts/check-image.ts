// Script to check post image in database
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkImage() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'notearc',
    });

    try {
        const [rows] = await connection.query(
            "SELECT slug, image FROM posts WHERE slug = 'girl-stop-apologizing'"
        );
        console.log('Database result:', rows);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

checkImage();
