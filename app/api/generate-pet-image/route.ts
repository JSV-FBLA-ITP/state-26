import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
        return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
        return NextResponse.json({ error: 'HuggingFace token not configured' }, { status: 500 });
    }

    // HF migrated image models to the new provider-based router.
    // Using FLUX.1-schnell — HF's recommended fast text-to-image model.
    const model = 'black-forest-labs/FLUX.1-schnell';
    const url = `https://router.huggingface.co/hf-inference/models/${model}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${hfToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: prompt }),
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
