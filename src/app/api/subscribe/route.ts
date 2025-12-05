import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check if already subscribed
        const [existing] = await pool.query<RowDataPacket[]>(
            "SELECT id, status FROM subscribers WHERE email = ?",
            [normalizedEmail]
        );

        if (existing.length > 0) {
            const subscriber = existing[0];

            if (subscriber.status === 'active') {
                return NextResponse.json(
                    { message: "You're already subscribed!", alreadySubscribed: true },
                    { status: 200 }
                );
            } else {
                // Reactivate subscription
                await pool.query(
                    "UPDATE subscribers SET status = 'active', subscribed_at = NOW(), unsubscribed_at = NULL WHERE id = ?",
                    [subscriber.id]
                );
                return NextResponse.json(
                    { message: "Welcome back! You've been resubscribed.", resubscribed: true },
                    { status: 200 }
                );
            }
        }

        // Create new subscriber
        await pool.query<ResultSetHeader>(
            "INSERT INTO subscribers (email) VALUES (?)",
            [normalizedEmail]
        );

        return NextResponse.json(
            { message: "Thanks for subscribing!", success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error subscribing:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Get subscriber count (for display purposes)
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT COUNT(*) as count FROM subscribers WHERE status = 'active'"
        );

        return NextResponse.json({ count: rows[0].count });
    } catch (error) {
        console.error("Error fetching subscriber count:", error);
        return NextResponse.json({ count: 0 });
    }
}
