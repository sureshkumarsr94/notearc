import { searchPosts } from '@/lib/posts';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ posts: [] });
    }

    const posts = await searchPosts(query);
    return NextResponse.json({ posts });
}
