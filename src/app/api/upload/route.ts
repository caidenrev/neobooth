import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { image } = body;

        if (!image) {
            return NextResponse.json({ error: 'Image data is missing' }, { status: 400 });
        }

        // 1. Bersihkan string Base64 (ImgBB hanya butuh data mentahnya tanpa prefix)
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

        // 2. Siapkan form data untuk dikirim ke ImgBB
        const formData = new FormData();
        formData.append('image', base64Data);

        // 3. Ambil API Key dari .env.local
        const API_KEY = process.env.IMGBB_API_KEY;

        if (!API_KEY) {
            console.error("API Key ImgBB belum dipasang di .env.local!");
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 4. Kirim request POST ke ImgBB
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            // 5. ImgBB mengembalikan banyak data, kita ambil URL gambarnya saja
            // URL ini sudah online dan bisa diakses dari mana saja!
            return NextResponse.json({ url: data.data.url });
        } else {
            throw new Error(data.error?.message || 'Gagal upload ke ImgBB');
        }

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}