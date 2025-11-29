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
        const { authorId } = await request.json();
        // @ts-ignore
        const userId = session.user.id;

        console.log('Follow request:', { userId, authorId, session: session.user });

        if (!userId || !authorId) {
            return NextResponse.json({ error: "Missing required fields", userId, authorId }, { status: 400 });
        }

        // Check if already following
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM follows WHERE follower_id = ? AND followed_user_id = ?",
            [userId, authorId]
        );

        if (rows.length > 0) {
            // Unfollow
            await pool.query(
                "DELETE FROM follows WHERE follower_id = ? AND followed_user_id = ?",
                [userId, authorId]
            );
            return NextResponse.json({ following: false });
        } else {
            // Follow
            await pool.query(
                "INSERT INTO follows (follower_id, followed_user_id) VALUES (?, ?)",
                [userId, authorId]
            );
            return NextResponse.json({ following: true });
        }
    } catch (error) {
        console.error("Error toggling follow:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get("authorId");

    if (!session || !session.user || !authorId) {
        return NextResponse.json({ following: false });
    }

    try {
        // @ts-ignore
        const userId = session.user.id;

        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM follows WHERE follower_id = ? AND followed_user_id = ?",
            [userId, authorId]
        );

        return NextResponse.json({ following: rows.length > 0 });
    } catch (error) {
        console.error("Error checking follow status:", error);
        return NextResponse.json({ following: false });
    }
}
