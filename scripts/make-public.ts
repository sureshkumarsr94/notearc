// Script to make S3 object public
import { S3Client, PutObjectAclCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

async function makePublic() {
    const key = 'blog/images/girl-stop-apologizing.png';

    try {
        const command = new PutObjectAclCommand({
            Bucket: 'notearc',
            Key: key,
            ACL: 'public-read',
        });

        await s3Client.send(command);
        console.log('✅ Object is now public!');
        console.log(`URL: https://notearc.s3.ap-south-1.amazonaws.com/${key}`);
    } catch (error: any) {
        console.error('❌ Error making object public:', error.message);
        console.log('\nThis error usually means:');
        console.log('1. The bucket has "Block Public Access" enabled');
        console.log('2. You need to disable it in AWS S3 Console -> Bucket -> Permissions');
        console.log('\nAlternatively, we can use CloudFront or a signed URL approach.');
    }
}

makePublic();
