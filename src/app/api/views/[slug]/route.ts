import { incrementViewCount } from '@/lib/posts';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    await incrementViewCount(slug);
    return NextResponse.json({ success: true });
}
