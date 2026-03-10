import { NextRequest, NextResponse } from 'next/server';

// ✅ CHECK 1: The Edge Runtime is mandatory for public hosting to avoid 10s timeouts.
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
        return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    // ✅ CHECK 2: .trim() ensures no hidden spaces in your Vercel Dashboard break the key.
    const hfToken = process.env.HF_TOKEN?.trim();
    if (!hfToken) {
        return NextResponse.json({ error: 'HuggingFace token not configured' }, { status: 500 });
    }

    const model = 'black-forest-labs/FLUX.1-schnell';
    const url = `https://router.huggingface.co/hf-inference/models/${model}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': 'application/json',
                // ✅ CHECK 3: Explicitly ask for an image to prevent the 401/Router error.
                'Accept': 'image/png',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    // ✅ CHECK 4: Vital to prevent "Model is loading" errors.
                    wait_for_model: true
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('HF Error:', response.status, errorText);
            return NextResponse.json(
                { error: `Image generation failed (${response.status}). Check Token permissions.` },
                { status: response.status }
            );
        }

        const imageBuffer = await response.arrayBuffer();

        /** * ✅ CHECK 5: THE BIG FIX
         * In Vercel's Edge Runtime, 'Buffer.from' does NOT exist. 
         * Your original code would crash here. This version works everywhere:
         */
        const base64 = btoa(
            new Uint8Array(imageBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        const dataUrl = `data:image/png;base64,${base64}`;

        return NextResponse.json({ imageUrl: dataUrl });

    } catch (err) {
        console.error('System Error:', err);
        return NextResponse.json({ error: 'Image generation failed.' }, { status: 500 });
    }
}