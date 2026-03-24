import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ── In-memory rate limiter ──────────────────────────────────────────────────
// Stores { count, windowStart } per user ID. Resets every WINDOW_MS.
const RATE_LIMIT = 5;           // max requests per window
const WINDOW_MS = 60_000;       // 1 minute

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(userId: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(userId);

    if (!entry || now - entry.windowStart >= WINDOW_MS) {
        // New window
        rateLimitMap.set(userId, { count: 1, windowStart: now });
        return false;
    }

    if (entry.count >= RATE_LIMIT) {
        return true;
    }

    entry.count++;
    return false;
}

// Periodically clean up stale entries to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now - entry.windowStart >= WINDOW_MS) {
            rateLimitMap.delete(key);
        }
    }
}, WINDOW_MS);
// ────────────────────────────────────────────────────────────────────────────

const MAX_PROMPT_LENGTH = 500;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { prompt } = body;

    // ── Prompt validation ──────────────────────────────────────────────────
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return NextResponse.json({ error: 'Missing or empty prompt.' }, { status: 400 });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
        return NextResponse.json(
            { error: `Prompt is too long. Please keep it under ${MAX_PROMPT_LENGTH} characters.` },
            { status: 400 }
        );
    }
    // ──────────────────────────────────────────────────────────────────────

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
        return NextResponse.json({ error: 'HuggingFace token not configured' }, { status: 500 });
    }

    // HF migrated image models to the new provider-based router.
    // Using FLUX.1-schnell — HF's recommended fast text-to-image model.
    const model = 'black-forest-labs/FLUX.1-schnell';
    const url = `https://router.huggingface.co/hf-inference/models/${model}`;

    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized. You must be logged in to generate images.' }, { status: 401 });
        }

        // ── Rate limiting ──────────────────────────────────────────────────
        if (isRateLimited(user.id)) {
            return NextResponse.json(
                { error: `Too many requests. You can generate up to ${RATE_LIMIT} images per minute.` },
                { status: 429 }
            );
        }
        // ──────────────────────────────────────────────────────────────────

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${hfToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt.trim(),
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('HuggingFace API error:', response.status, errorText);
            return NextResponse.json(
                { error: `Image generation failed (${response.status}). The model may be loading — please try again in a moment.` },
                { status: 502 }
            );
        }

        // HF returns raw image bytes (PNG)
        const imageBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(imageBuffer).toString('base64');
        const dataUrl = `data:image/png;base64,${base64}`;

        return NextResponse.json({ imageUrl: dataUrl });
    } catch (err) {
        console.error('Image generation failed:', err);
        return NextResponse.json({ error: 'Image generation failed. Please try again.' }, { status: 500 });
    }
}