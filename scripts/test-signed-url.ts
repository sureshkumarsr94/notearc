// Test S3 signed URL and show error details
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

async function testSignedUrl() {
    const s3Client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });

    const key = 'blog/images/girl-stop-apologizing.png';

    const command = new GetObjectCommand({
        Bucket: 'notearc',
        Key: key,
    });

    try {
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log('Generated Signed URL:');
        console.log(signedUrl);
        console.log('\nTesting URL accessibility...');

        // Test the URL using fetch
        const response = await fetch(signedUrl);
        console.log('Response status:', response.status);

        if (!response.ok) {
            const body = await response.text();
            console.log('Error response body:');
            console.log(body);
        } else {
            console.log('✅ Image accessible!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testSignedUrl();
