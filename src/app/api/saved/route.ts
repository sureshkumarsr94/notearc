import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { postSlug } = await request.json();
        // @ts-ignore
        const userId = session.user.id;

        if (!userId || !postSlug) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if already saved
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM saved_posts WHERE user_id = ? AND post_slug = ?",
            [userId, postSlug]
        );

        if (rows.length > 0) {
            // Unsave
            await pool.query(
                "DELETE FROM saved_posts WHERE user_id = ? AND post_slug = ?",
                [userId, postSlug]
            );
            return NextResponse.json({ saved: false });
        } else {
            // Save
            await pool.query(
                "INSERT INTO saved_posts (user_id, post_slug) VALUES (?, ?)",
                [userId, postSlug]
            );
            return NextResponse.json({ saved: true });
        }
    } catch (error) {
        console.error("Error toggling save:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get("postSlug");

    if (!session || !session.user) {
        if (postSlug) {
            return NextResponse.json({ saved: false });
        }
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // @ts-ignore
        const userId = session.user.id;

        // Check if specific post is saved
        if (postSlug) {
            const [rows] = await pool.query<RowDataPacket[]>(
                "SELECT * FROM saved_posts WHERE user_id = ? AND post_slug = ?",
                [userId, postSlug]
            );
            return NextResponse.json({ saved: rows.length > 0 });
        }

        // Get all saved posts
        const query = `
            SELECT 
                p.slug, 
                p.title, 
                p.excerpt, 
                p.date, 
                p.readTime,
                p.category,
                p.views,
                a.id as author_id,
                a.name as author_name,
                a.slug as author_slug,
                a.image as author_avatar,
                a.role as author_role,
                sp.created_at as saved_at
            FROM saved_posts sp
            JOIN posts p ON sp.post_slug = p.slug
            LEFT JOIN users a ON p.author_id = a.id
            WHERE sp.user_id = ?
            ORDER BY sp.created_at DESC
        `;

        const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);

        const posts = rows.map((row: any) => ({
            slug: row.slug,
            title: row.title,
            excerpt: row.excerpt,
            date: row.date,
            readTime: row.readTime,
            category: row.category,
            views: row.views,
            author: {
                id: row.author_id,
                name: row.author_name,
                slug: row.author_slug,
                avatar: row.author_avatar,
                role: row.author_role,
            },
            savedAt: row.saved_at,
        }));

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching saved posts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
