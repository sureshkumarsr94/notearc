import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 Client Configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'notearc';

/**
 * Generate a pre-signed URL for an S3 object
 * @param key - S3 object key (path in bucket, e.g., 'blog/images/girl-stop-apologizing.png')
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Pre-signed URL that allows temporary access to the object
 */
export async function getSignedImageUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    try {
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
        return signedUrl;
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
}

/**
 * Convert a full S3 URL to a pre-signed URL
 * @param s3Url - Full S3 URL (e.g., 'https://notearc.s3.ap-south-1.amazonaws.com/blog/images/file.png')
 * @param expiresIn - URL expiration time in seconds
 * @returns Pre-signed URL
 */
export async function getSignedUrlFromS3Url(s3Url: string, expiresIn: number = 3600): Promise<string> {
    // Extract the key from the S3 URL
    // URL format: https://bucket.s3.region.amazonaws.com/key
    const url = new URL(s3Url);
    const key = url.pathname.substring(1); // Remove leading '/'

    return getSignedImageUrl(key, expiresIn);
}

export { s3Client, BUCKET_NAME };
