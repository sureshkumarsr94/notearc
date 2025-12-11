// Update post image to use local path
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function updateImage() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'notearc',
    });

    try {
        // Update to use local image path
        const localImagePath = '/images/blog/girl-stop-apologizing.png';
        console.log(`Updating girl-stop-apologizing post with local image path...`);

        const [result] = await connection.query(
            'UPDATE posts SET image = ? WHERE slug = ?',
            [localImagePath, 'girl-stop-apologizing']
        );

        console.log('✅ Post updated with local image path!');
        console.log(`Image path: ${localImagePath}`);

    } catch (error) {
        console.error('❌ Update failed:', error);
    } finally {
        await connection.end();
    }
}

updateImage();
