// Update post image to use S3 URL
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
        // Update to use S3 URL
        const s3ImageUrl = 'https://notearc.s3.ap-south-1.amazonaws.com/blog/images/girl-stop-apologizing.png';
        console.log(`Updating girl-stop-apologizing post with S3 URL...`);

        const [result] = await connection.query(
            'UPDATE posts SET image = ? WHERE slug = ?',
            [s3ImageUrl, 'girl-stop-apologizing']
        );

        console.log('✅ Post updated with S3 URL!');
        console.log(`Image URL: ${s3ImageUrl}`);

    } catch (error) {
        console.error('❌ Update failed:', error);
    } finally {
        await connection.end();
    }
}

updateImage();
