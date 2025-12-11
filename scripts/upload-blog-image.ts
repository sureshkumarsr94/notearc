// Script to upload blog images to S3
// Run with: npx ts-node --esm scripts/upload-blog-image.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = 'notearc';

async function uploadImage() {
    const imagePath = process.argv[2];
    const s3Key = process.argv[3] || 'blog/images/girl-stop-apologizing.png';

    if (!imagePath) {
        console.error('Usage: npx ts-node scripts/upload-blog-image.ts <imagePath> [s3Key]');
        process.exit(1);
    }

    console.log(`Uploading ${imagePath} to s3://${BUCKET_NAME}/${s3Key}...`);

    const fileContent = readFileSync(imagePath);

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ContentType: 'image/png',
    });

    try {
        await s3Client.send(command);
        const url = `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${s3Key}`;
        console.log('✅ Upload successful!');
        console.log(`Public URL: ${url}`);
    } catch (error) {
        console.error('❌ Upload failed:', error);
    }
}

uploadImage();
