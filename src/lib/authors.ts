import pool from './db';
import { RowDataPacket } from 'mysql2';

export interface Author {
    id: number;
    name: string;
    alias_name?: string;
    display_name: string; // alias_name if set, otherwise name
    slug: string;
    bio: string;
    avatar: string;
    role: string;
    social_twitter?: string;
    social_linkedin?: string;
    postCount: number;
    totalViews: number;
}

export async function getAllAuthors(): Promise<Author[]> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                u.id, 
                u.name, 
                u.alias_name,
                COALESCE(u.alias_name, u.name) as display_name,
                u.slug, 
                u.bio, 
                u.image as avatar, 
                u.role, 
                u.social_twitter, 
                u.social_linkedin,
                COUNT(p.id) as postCount,
                COALESCE(SUM(p.views), 0) as totalViews
            FROM users u
            LEFT JOIN posts p ON u.id = p.author_id
            WHERE u.slug IS NOT NULL
            GROUP BY u.id
            HAVING COUNT(p.id) >= 1`
        );
        return rows as unknown as Author[];
    } catch (error) {
        console.error('Error fetching authors:', error);
        return [];
    }
}

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                u.id, 
                u.name, 
                u.alias_name,
                COALESCE(u.alias_name, u.name) as display_name,
                u.slug, 
                u.bio, 
                u.image as avatar, 
                u.role, 
                u.social_twitter, 
                u.social_linkedin,
                (SELECT COUNT(*) FROM posts p WHERE p.author_id = u.id) as postCount,
                (SELECT COALESCE(SUM(views), 0) FROM posts p WHERE p.author_id = u.id) as totalViews
            FROM users u 
            WHERE u.slug = ?`,
            [slug]
        );
        if (rows.length === 0) return undefined;
        return rows[0] as unknown as Author;
    } catch (error) {
        console.error(`Error fetching author with slug ${slug}:`, error);
        return undefined;
    }
}

