import { NextResponse } from 'next/server';
import { getUnpostedLinkedInPosts, markPostedInLinkedIn } from '@/lib/posts';

export async function GET() {
    try {
        const posts = await getUnpostedLinkedInPosts(10);
        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Error fetching LinkedIn posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { slug } = await request.json();

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const result = await markPostedInLinkedIn(slug);

        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error('Error marking post as posted:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}
