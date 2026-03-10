import { NextRequest, NextResponse } from 'next/server';

/**
 * ✅ CHECK 1: VERCEL TIMEOUT FIX
 * Standard functions time out at 10s. Image generation takes longer.
 * Edge runtime is required for AI routes on public hosting.
 */
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
        }

        /**
         * ✅ CHECK 2: TOKEN SANITIZATION
         * .trim() prevents 401 errors caused by accidental spaces in Vercel Env Vars.
         */
        const hfToken = process.env.HF_TOKEN?.trim();
        if (!hfToken) {
            return NextResponse.json({ error: 'HF_TOKEN is not defined in Environment Variables' }, { status: 500 });
        }

        const model = 'black-forest-labs/FLUX.1-schnell';
        const url = `https://router.huggingface.co/hf-inference/models/${model}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': 'application/json',
                /**
                 * ✅ CHECK 3: ROUTER HANDSHAKE
                 * Tells the HF Router you specifically want the image bytes.
                 */
                'Accept': 'image/png',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    // ✅ CHECK 4: COLD START PROTECTION
                    wait_for_model: true
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('HF API Error:', response.status, errorText);

            // If this triggers, re-check the "Inference Providers" box in your HF settings.
            return NextResponse.json(
                { error: `Hugging Face Error (${response.status}). Check Token permissions.` },
                { status: response.status }
            );
        }

        /**
         * ✅ CHECK 5: EDGE COMPATIBILITY
         * Node's 'Buffer' is NOT available in the Edge Runtime.
         * Using Uint8Array + btoa ensures this works on Vercel/Netlify.
         */
        const imageBuffer = await response.arrayBuffer();
        const base64 = btoa(
            new Uint8Array(imageBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        const dataUrl = `data:image/png;base64,${base64}`;

        return NextResponse.json({ imageUrl: dataUrl });

    } catch (err: any) {
        console.error('Route Runtime Error:', err.message);
        return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }
}