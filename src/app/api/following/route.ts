import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // @ts-ignore
        const userId = session.user.id;

        if (!userId) {
            return NextResponse.json({ error: "User ID not found" }, { status: 400 });
        }

        const query = `
            SELECT 
                u.id, 
                u.name, 
                u.slug, 
                u.image as avatar, 
                u.role,
                u.bio,
                COUNT(p.id) as postCount
            FROM users u
            JOIN follows f ON u.id = f.followed_user_id
            LEFT JOIN posts p ON u.id = p.author_id
            WHERE f.follower_id = ?
            GROUP BY u.id, u.name, u.slug, u.image, u.role, u.bio
            ORDER BY u.name ASC
        `;

        const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching followed authors:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
