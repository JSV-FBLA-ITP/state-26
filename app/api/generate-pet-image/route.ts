import { NextRequest, NextResponse } from 'next/server';

/**
 * ✅ CHECK 1: VERCEL TIMEOUT FIX
 * Standard functions time out at 10s on the Hobby plan. 
 * Edge runtime is required to allow the 15-30s needed for image generation.
 */
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        // Basic validation
        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
        }

        /**
         * ✅ CHECK 2: TOKEN SANITIZATION
         * .trim() removes hidden spaces that often get pasted into Vercel Env Vars.
         */
        const hfToken = process.env.HF_TOKEN?.trim();

        if (!hfToken) {
            console.error("HF_TOKEN is missing from Environment Variables");
            return NextResponse.json({ error: 'HuggingFace token not configured' }, { status: 500 });
        }

        /**
         * ✅ CHECK 3: ROUTER CONFIGURATION
         * Using the new router for FLUX.1-schnell ensures better reliability.
         */
        const model = 'black-forest-labs/FLUX.1-schnell';
        const url = `https://router.huggingface.co/hf-inference/models/${model}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': 'application/json',
                // ✅ CHECK 4: HANDSHAKE
                // Tells the HF Router to return raw image data immediately.
                'Accept': 'image/png',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    // ✅ CHECK 5: COLD START HANDLING
                    // Prevents the "Model is loading" 503 error.
                    wait_for_model: true
                }
            }),
        });

        // Handle specific Hugging Face errors
        if (!response.ok) {
            const errorText = await response.text();
            console.error('HuggingFace API error:', response.status, errorText);

            // A 401 here means the "Fine-grained" token needs the "Inference Providers" permission.
            return NextResponse.json(
                { error: `Generation failed (${response.status}). Check token permissions.` },
                { status: 502 }
            );
        }

        /**
         * ✅ CHECK 6: EDGE-SAFE BINARY CONVERSION
         * Node.js 'Buffer' is NOT available in the Edge Runtime.
         * Using Uint8Array + btoa is the correct way to handle this on Vercel.
         */
        const imageBuffer = await response.arrayBuffer();
        const base64 = btoa(
            new Uint8Array(imageBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        const dataUrl = `data:image/png;base64,${base64}`;

        return NextResponse.json({ imageUrl: dataUrl });

    } catch (err: any) {
        console.error('Image generation route error:', err.message);
        return NextResponse.json(
            { error: 'Internal Server Error. Please try again.' },
            { status: 500 }
        );
    }
}