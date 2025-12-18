import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPost, updatePost, getPaginatedUserPosts, CreatePostInput } from '@/lib/posts';

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

// GET - Get current user's posts with pagination
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get pagination parameters from URL
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        // Validate pagination parameters
        const validPage = Math.max(1, page);
        const validLimit = Math.min(50, Math.max(1, limit)); // Cap at 50 items

        const { posts, stats, totalPages } = await getPaginatedUserPosts(
            session.user.id,
            validPage,
            validLimit
        );

        return NextResponse.json({
            posts,
            stats,
            pagination: {
                page: validPage,
                limit: validLimit,
                totalPages,
                total: stats.total
            }
        });
    } catch (error) {
        console.error('Error in GET /api/posts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

