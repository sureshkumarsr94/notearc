// Migration script to add image column and update girl-stop-apologizing post
// Run with: npx ts-node scripts/add-image-column.ts

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'notearc',
    });

    try {
        // Check if image column exists
        const [columns] = await connection.query(
            "SHOW COLUMNS FROM posts LIKE 'image'"
        );

        if ((columns as any[]).length === 0) {
            console.log('Adding image column to posts table...');
            await connection.query(
                'ALTER TABLE posts ADD COLUMN image VARCHAR(500) NULL AFTER content'
            );
            console.log('✅ Image column added successfully!');
        } else {
            console.log('Image column already exists.');
        }

        // Update the girl-stop-apologizing post with the S3 image URL
        const imageUrl = 'https://notearc.s3.ap-south-1.amazonaws.com/blog/images/girl-stop-apologizing.png';
        console.log(`Updating girl-stop-apologizing post with image URL...`);

        const [result] = await connection.query(
            'UPDATE posts SET image = ? WHERE slug = ?',
            [imageUrl, 'girl-stop-apologizing']
        );

        console.log('✅ Post updated with image URL!');
        console.log(`Image URL: ${imageUrl}`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrate();
