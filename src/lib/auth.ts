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
            console.log('SignIn callback triggered', {
                provider: account?.provider,
                userId: account?.providerAccountId,
                email: user.email,
            });

            if (!user.email) {
                console.log('No email provided, skipping DB save');
                return true;
            }

            try {
                console.log('Checking if user exists in database...');
                const [existingUsers] = await pool.query<RowDataPacket[]>(
                    "SELECT * FROM users WHERE source = ? AND source_id = ?",
                    [account?.provider, account?.providerAccountId]
                );

                if (existingUsers.length === 0) {
                    console.log('User not found, creating new user...');

                    // Generate slug from name
                    const baseName = user.name || user.email?.split('@')[0] || 'user';
                    let slug = baseName
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');

                    // Check for slug uniqueness and add number if needed
                    let finalSlug = slug;
                    let counter = 1;
                    while (true) {
                        const [slugCheck] = await pool.query<RowDataPacket[]>(
                            "SELECT id FROM users WHERE slug = ?",
                            [finalSlug]
                        );
                        if (slugCheck.length === 0) break;
                        finalSlug = `${slug}-${counter}`;
                        counter++;
                    }

                    await pool.query(
                        "INSERT INTO users (email, name, image, source, source_id, slug, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [user.email, user.name, user.image, account?.provider, account?.providerAccountId, finalSlug, 'Author']
                    );
                    console.log('User created successfully with slug:', finalSlug);
                } else {
                    console.log('User already exists, updating...');
                    const existingUser = existingUsers[0];

                    // If user doesn't have a slug, generate one
                    if (!existingUser.slug) {
                        console.log('Generating slug for existing user...');
                        const baseName = user.name || user.email?.split('@')[0] || 'user';
                        let slug = baseName
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '');

                        let finalSlug = slug;
                        let counter = 1;
                        while (true) {
                            const [slugCheck] = await pool.query<RowDataPacket[]>(
                                "SELECT id FROM users WHERE slug = ?",
                                [finalSlug]
                            );
                            if (slugCheck.length === 0) break;
                            finalSlug = `${slug}-${counter}`;
                            counter++;
                        }

                        await pool.query(
                            "UPDATE users SET name = ?, image = ?, slug = ? WHERE id = ?",
                            [user.name, user.image, finalSlug, existingUser.id]
                        );
                        console.log('User updated with slug:', finalSlug);
                    } else {
                        await pool.query(
                            "UPDATE users SET name = ?, image = ? WHERE id = ?",
                            [user.name, user.image, existingUser.id]
                        );
                        console.log('User updated');
                    }
                }

                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return true;
            }
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
