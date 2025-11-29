import pool from '../lib/db';

async function addUserManually() {
    try {
        // Replace these with your actual Google account details
        const email = 'YOUR_EMAIL@gmail.com';  // Change this to your email
        const name = 'Your Name';              // Change this to your name
        const googleId = 'YOUR_GOOGLE_ID';     // Change this to your Google ID
        const image = 'YOUR_PROFILE_IMAGE_URL'; // Optional

        // Check if user already exists
        const [existing] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if ((existing as any[]).length > 0) {
            console.log('User already exists:', existing);
        } else {
            // Insert user
            await pool.query(
                'INSERT INTO users (email, name, google_id, image) VALUES (?, ?, ?, ?)',
                [email, name, googleId, image]
            );
            console.log('User added successfully!');
        }

        // Show the user
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log('User in database:', users);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

addUserManually();
