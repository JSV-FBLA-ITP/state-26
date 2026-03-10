import { NextRequest, NextResponse } from 'next/server';

/** * 
 * Public hosts (Vercel/Netlify) kill standard functions after 10s.
 * Edge runtime allows longer streaming and is required for AI generation.
 */
export const runtime = 'edge';
export const maxDuration = 60; // Sets max timeout to 60s (if your plan allows)

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
        return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    // 
    // .trim() is vital. Hidden spaces in environment variables cause 401 errors.
    const hfToken = process.env.HF_TOKEN?.trim();

    if (!hfToken) {
        return NextResponse.json({ error: 'HuggingFace token not configured' }, { status: 500 });
    }

    /**
     * 
     * The legacy 'api-inference.huggingface.co' is deprecated and often returns 401/404.
     * Always use the 'router.huggingface.co' for newer models like FLUX.
     */
    const model = 'black-forest-labs/FLUX.1-schnell';
    const url = `https://router.huggingface.co/hf-inference/models/${model}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': 'application/json',
                // 
                // Tells the router to return the actual image, not just metadata.
                'Accept': 'image/png',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    // ✅ CHECK 5: COLD START HANDLING
                    // Prevents the 503 "Model is loading" error.
                    wait_for_model: true
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('HF API Error:', response.status, errorText);

            // This error usually means the Token permissions are still missing.
            return NextResponse.json(
                { error: `Hugging Face Access Denied (${response.status}). Check Token permissions.` },
                { status: 502 }
            );
        }

        // 'Buffer' is a Node.js specific global and doesn't exist in the Edge Runtime.
        // We use Uint8Array + btoa to be safe on all public hosting environments.
        const imageBuffer = await response.arrayBuffer();
        const base64 = btoa(
            new Uint8Array(imageBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        const dataUrl = `data:image/png;base64,${base64}`;

        return NextResponse.json({ imageUrl: dataUrl });

    } catch (err) {
        console.error('Route Crash:', err);
        return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 });
    }
}