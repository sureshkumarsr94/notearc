import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPost, updatePost, getUserPosts, CreatePostInput } from '@/lib/posts';

// POST - Create a new post
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, excerpt, content, category, image, status } = body;

        // Validate required fields
        if (!title || !excerpt || !content || !category || !image) {
            return NextResponse.json(
                { error: 'Missing required fields: title, excerpt, content, category, and image are required' },
                { status: 400 }
            );
        }

        // Validate status
        if (status && !['draft', 'published'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be "draft" or "published"' },
                { status: 400 }
            );
        }

        const postData: CreatePostInput = {
            title,
            excerpt,
            content,
            category,
            image,
            status: status || 'draft'
        };

        const result = await createPost(postData, session.user.id);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, slug: result.slug }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/posts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update an existing post
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { slug, ...postData } = body;

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Validate status if provided
        if (postData.status && !['draft', 'published'].includes(postData.status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be "draft" or "published"' },
                { status: 400 }
            );
        }

        const result = await updatePost(slug, postData, session.user.id);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in PUT /api/posts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET - Get current user's posts
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const posts = await getUserPosts(session.user.id);
        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Error in GET /api/posts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
