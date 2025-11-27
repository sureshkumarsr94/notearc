
import pool from './src/lib/db';

async function checkTables() {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        console.log('Tables:', rows);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkTables();
