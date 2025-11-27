
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file in the root directory
dotenv.config();

async function updateAuthor() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'notearc',
    });

    try {
        console.log('Connected to database.');

        const authorName = 'Sureshkumar Selvaraj';
        const authorSlug = 'sureshkumar-selvaraj';

        // Check if author exists
        const [authors] = await connection.query<mysql.RowDataPacket[]>('SELECT * FROM authors WHERE slug = ?', [authorSlug]);

        let authorId;

        if (authors.length === 0) {
            console.log(`Author ${authorName} not found. Creating...`);
            const [result] = await connection.query<mysql.ResultSetHeader>(`
        INSERT INTO authors (name, slug, bio, avatar, role)
        VALUES (?, ?, ?, ?, ?)
      `, [
                authorName,
                authorSlug,
                'Passionate about technology, coding, and sharing knowledge.',
                '/images/authors/suresh.jpg',
                'Author'
            ]);
            authorId = result.insertId;
            console.log(`Created author: ${authorName} (ID: ${authorId})`);
        } else {
            authorId = authors[0].id;
            console.log(`Author ${authorName} already exists (ID: ${authorId}).`);
        }

        // Update all posts to this author
        // The user said "old blog", which usually implies all existing content.
        const [updateResult] = await connection.query<mysql.ResultSetHeader>('UPDATE posts SET author_id = ?', [authorId]);
        console.log(`Updated ${updateResult.affectedRows} posts to be authored by ${authorName}.`);

    } catch (error) {
        console.error('Error updating author:', error);
    } finally {
        await connection.end();
    }
}

updateAuthor();
