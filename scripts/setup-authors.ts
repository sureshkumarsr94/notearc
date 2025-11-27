
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file in the root directory
dotenv.config();

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'notearc',
    });

    try {
        console.log('Connected to database.');

        // Create authors table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS authors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        bio TEXT,
        avatar VARCHAR(255),
        role VARCHAR(255),
        social_twitter VARCHAR(255),
        social_linkedin VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Authors table created or already exists.');

        // Check if author_id column exists in posts table
        const [columns] = await connection.query<mysql.RowDataPacket[]>('SHOW COLUMNS FROM posts LIKE "author_id"');
        if (columns.length === 0) {
            await connection.query('ALTER TABLE posts ADD COLUMN author_id INT');
            await connection.query('ALTER TABLE posts ADD CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES authors(id)');
            console.log('Added author_id column to posts table.');
        } else {
            console.log('author_id column already exists in posts table.');
        }

        // Insert a default author if none exists
        const [authors] = await connection.query<mysql.RowDataPacket[]>('SELECT * FROM authors WHERE slug = "notearc-team"');
        let authorId;
        if (authors.length === 0) {
            const [result] = await connection.query<mysql.ResultSetHeader>(`
        INSERT INTO authors (name, slug, bio, avatar, role)
        VALUES ('NoteArc Team', 'notearc-team', 'The team behind NoteArc, dedicated to bringing you the best content.', '/images/authors/team.jpg', 'Editor')
      `);
            authorId = result.insertId;
            console.log('Inserted default author: NoteArc Team');
        } else {
            authorId = authors[0].id;
            console.log('Default author already exists.');
        }

        // Update existing posts to have the default author
        await connection.query('UPDATE posts SET author_id = ? WHERE author_id IS NULL', [authorId]);
        console.log('Updated existing posts with default author.');

    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await connection.end();
    }
}

setupDatabase();
