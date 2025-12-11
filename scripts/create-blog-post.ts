import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';
import pool from '../src/lib/db';

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'notearc';

async function createBlogPost() {
    try {
        // 0. Ensure status column exists
        console.log('Ensuring status column exists...');
        try {
            await pool.query(`ALTER TABLE posts ADD COLUMN status ENUM('draft', 'published') DEFAULT 'published'`);
            console.log('Status column added.');
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('Status column already exists.');
            } else {
                console.log('Column check result:', e.message);
            }
        }

        // 1. Upload cover image to S3
        console.log('Uploading cover image to S3...');
        const imagePath = '/Users/sureshkumarselvaraj/.gemini/antigravity/brain/84f522f8-8e92-4ea8-b92b-1eb4912b8ce9/do_hard_things_cover_1765434078994.png';
        const imageBuffer = readFileSync(imagePath);
        const imageKey = 'blog/images/do-hard-things-cover.png';

        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: imageKey,
            Body: imageBuffer,
            ContentType: 'image/png',
        }));

        const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${imageKey}`;
        console.log('Image uploaded:', imageUrl);

        // 2. Calculate read time
        const content = `<p>In a world that constantly seeks convenience, the counterintuitive truth remains: those who actively pursue difficulty end up living the easiest lives.</p>

<h2>The Comfort Trap</h2>

<p>We're wired to avoid discomfort. Our brains are designed to conserve energy and seek pleasure. But this ancient programming works against us in the modern world. When we consistently choose the easy path, we atrophy—mentally, physically, and emotionally.</p>

<h2>The Paradox of Growth</h2>

<p>Consider this: The person who forces themselves to wake up early to exercise doesn't just become fit. They develop discipline that transfers to every area of life. The entrepreneur who risks failure doesn't just build a business—they build resilience. The student who takes the hardest classes doesn't just learn more—they expand their capacity for learning itself.</p>

<h2>Start Small, Think Big</h2>

<p>You don't need to climb Everest tomorrow. Start with small acts of purposeful discomfort:</p>
<ul>
<li>Take cold showers</li>
<li>Have that difficult conversation you've been avoiding</li>
<li>Learn a skill that intimidates you</li>
<li>Set goals that make you nervous</li>
</ul>

<h2>The Easy Life Awaits</h2>

<p>The irony is beautiful: by consistently doing hard things, life becomes easier. Not because the challenges disappear, but because you become stronger. Problems that once seemed insurmountable become routine. Fears that once paralyzed become passing thoughts.</p>

<p><strong>Remember: Easy choices, hard life. Hard choices, easy life.</strong></p>

<p>The question isn't whether you'll face difficulty—it's whether you'll choose it on your terms or have it thrust upon you unprepared.</p>

<p><em>Choose hard. Choose growth. Choose the life you truly want.</em></p>`;

        const textContent = content.replace(/<[^>]*>/g, '');
        const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
        const minutes = Math.ceil(wordCount / 200);
        const readTime = minutes <= 1 ? '1 min read' : `${minutes} min read`;

        // 3. Get author ID (first user with posts or any user)
        const [users] = await pool.query('SELECT id FROM users LIMIT 1') as any[];
        if (!users || users.length === 0) {
            console.log('No users found. Please sign in first.');
            process.exit(1);
        }
        const authorId = users[0].id;
        console.log('Using author ID:', authorId);

        // 4. Generate slug
        let slug = 'do-hard-things-easy-life';
        let counter = 1;
        while (true) {
            const [existing] = await pool.query('SELECT id FROM posts WHERE slug = ?', [slug]) as any[];
            if (existing.length === 0) break;
            slug = `do-hard-things-easy-life-${counter}`;
            counter++;
        }

        // 5. Insert post (without status column if it doesn't exist)
        const date = new Date().toISOString().split('T')[0];

        try {
            await pool.query(
                `INSERT INTO posts (slug, title, excerpt, date, readTime, category, content, views, image, author_id, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 'published')`,
                [
                    slug,
                    'Do Hard Things if You Want an Easy Life',
                    'Discover why embracing challenges today leads to a more comfortable tomorrow. The paradox of growth reveals that difficulty is the doorway to mastery.',
                    date,
                    readTime,
                    'Personal Development',
                    content,
                    imageUrl,
                    authorId
                ]
            );
        } catch (e: any) {
            // Try without status column
            await pool.query(
                `INSERT INTO posts (slug, title, excerpt, date, readTime, category, content, views, image, author_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
                [
                    slug,
                    'Do Hard Things if You Want an Easy Life',
                    'Discover why embracing challenges today leads to a more comfortable tomorrow. The paradox of growth reveals that difficulty is the doorway to mastery.',
                    date,
                    readTime,
                    'Personal Development',
                    content,
                    imageUrl,
                    authorId
                ]
            );
        }

        console.log('✅ Blog post created successfully!');
        console.log(`   Slug: ${slug}`);
        console.log(`   URL: http://localhost:3000/blog/${slug}`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating blog post:', error);
        process.exit(1);
    }
}

createBlogPost();
