import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function GET() {
    const session = await getServerSession(authOptions);

    try {
        let userId = null;
        if (session && session.user) {
            // @ts-ignore
            userId = session.user.id;
        }

        let query = `
            SELECT 
                u.id, 
                u.name, 
                u.slug, 
                u.image as avatar, 
                u.role,
                u.bio,
                SUM(p.views) as totalViews,
                COUNT(p.id) as postCount
            FROM users u
            JOIN posts p ON u.id = p.author_id
            WHERE u.slug IS NOT NULL
        `;

        const params: any[] = [];

        // Exclude already followed authors if user is logged in
        if (userId) {
            query += ` AND u.id NOT IN (SELECT followed_user_id FROM follows WHERE follower_id = ?)`;
            params.push(userId);
        }

        query += `
            GROUP BY u.id, u.name, u.slug, u.image, u.role, u.bio
            ORDER BY totalViews DESC
            LIMIT 10
        `;

        const [rows] = await pool.query<RowDataPacket[]>(query, params);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching suggested authors:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
