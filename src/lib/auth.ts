import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import pool from "./db";
import { RowDataPacket } from "mysql2";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            console.log('SignIn callback triggered', { provider: account?.provider, userId: user.id, email: user.email });

            if (account?.provider === "google") {
                try {
                    console.log('Checking if user exists in database...');
                    const source = account.provider; // 'google'
                    const sourceId = user.id;

                    // Check if user exists
                    const [rows] = await pool.query<RowDataPacket[]>(
                        "SELECT * FROM users WHERE source = ? AND source_id = ?",
                        [source, sourceId]
                    );

                    if (rows.length === 0) {
                        console.log('User not found, creating new user...');
                        // Create new user
                        await pool.query(
                            "INSERT INTO users (name, email, image, source, source_id) VALUES (?, ?, ?, ?, ?)",
                            [user.name, user.email, user.image, source, sourceId]
                        );
                        console.log('User created successfully!');
                    } else {
                        console.log('User found, updating...');
                        // Update existing user
                        await pool.query(
                            "UPDATE users SET name = ?, image = ? WHERE source = ? AND source_id = ?",
                            [user.name, user.image, source, sourceId]
                        );
                        console.log('User updated successfully!');
                    }
                    return true;
                } catch (error) {
                    console.error("Error saving user to database:", error);
                    // Allow login even if database save fails
                    return true;
                }
            }
            return true;
        },
        async session({ session, token }) {
            console.log('Session callback triggered', { email: session.user?.email });

            if (session.user) {
                try {
                    const [rows] = await pool.query<RowDataPacket[]>(
                        "SELECT id FROM users WHERE email = ?",
                        [session.user.email]
                    );
                    if (rows.length > 0) {
                        // @ts-ignore
                        session.user.id = rows[0].id;
                        console.log('Session user ID set:', rows[0].id);
                    } else {
                        console.log('No user found in database for email:', session.user.email);
                    }
                } catch (error) {
                    console.error("Error fetching user ID for session:", error);
                }
            }
            return session;
        },
    },
};
