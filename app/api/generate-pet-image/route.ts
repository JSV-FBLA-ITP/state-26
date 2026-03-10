import { NextRequest, NextResponse } from 'next/server';

// ✅ ERROR CHECK 1: The Edge Runtime is REQUIRED for public hosting
// Image generation often exceeds the 10s timeout of standard serverless functions.
export const maxDuration = 60;
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
        return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
        return NextResponse.json({ error: 'HuggingFace token not configured' }, { status: 500 });
    }

    const model = 'black-forest-labs/FLUX.1-schnell';
    const url = `https://router.huggingface.co/hf-inference/models/${model}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // ✅ ERROR CHECK 2: .trim() prevents hidden spaces from causing 401s
                Authorization: `Bearer ${hfToken.trim()}`,
                'Content-Type': 'application/json',
                // ✅ ERROR CHECK 3: Tell the router exactly what you expect back
                'Accept': 'image/png',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    // ✅ ERROR CHECK 4: Vital for preventing "Model Loading" 503 errors
                    wait_for_model: true
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('HuggingFace API error:', response.status, errorText);

            // If status is 401 here, the Token Checkboxes in your screenshot were missed!
            return NextResponse.json(
                { error: `Hugging Face returned ${response.status}. Check token permissions.` },
                { status: 502 }
            );
        }

        const imageBuffer = await response.arrayBuffer();

        // ✅ ERROR CHECK 5: Node's 'Buffer' doesn't exist in Edge Runtime. 
        // We use the browser-compatible btoa method to create the base64 string.
        const base64 = btoa(
            new Uint8Array(imageBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        const dataUrl = `data:image/png;base64,${base64}`;

        return NextResponse.json({ imageUrl: dataUrl });

    } catch (err) {
        console.error('Image generation failed:', err);
        return NextResponse.json({ error: 'Internal Server Error. Please try again.' }, { status: 500 });
    }
}