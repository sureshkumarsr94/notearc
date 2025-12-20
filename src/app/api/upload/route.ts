import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'notearc';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { filename, contentType } = await request.json();

        if (!filename || !contentType) {
            return NextResponse.json(
                { error: 'filename and contentType are required' },
                { status: 400 }
            );
        }

        // Validate content type
        if (!contentType.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Only image files are allowed' },
                { status: 400 }
            );
        }

        // Generate unique key
        const timestamp = Date.now();
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '-');
        const key = `blog/images/user-${session.user.id}/${timestamp}-${sanitizedFilename}`;

        // Generate pre-signed upload URL
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uploadUrl = await getSignedUrl(s3Client as any, command as any, { expiresIn: 300 }); // 5 minutes

        // Construct public URL
        const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`;

        return NextResponse.json({ uploadUrl, publicUrl, key });
    } catch (error) {
        console.error('Error in POST /api/upload:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
