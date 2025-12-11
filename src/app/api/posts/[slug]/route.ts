import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPostForEdit } from '@/lib/posts';
import pool from '@/lib/db';

// GET - Get a specific post for editing (only if user owns it)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await params;
        const post = await getPostForEdit(slug, session.user.id);

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found or you do not have permission to edit it' },
                { status: 404 }
            );
        }

        return NextResponse.json({ post });
    } catch (error) {
        console.error('Error in GET /api/posts/[slug]:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete a post (only if user owns it)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await params;

        // Verify ownership and delete
        const [result] = await pool.query(
            'DELETE FROM posts WHERE slug = ? AND author_id = ?',
            [slug, session.user.id]
        ) as any;

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Post not found or you do not have permission to delete it' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in DELETE /api/posts/[slug]:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
