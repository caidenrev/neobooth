import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'Data gambar kosong' }, { status: 400 });
    }

    // 1. Bersihkan prefix Base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // 2. Bikin nama file unik
    const filename = `neobooth-${Date.now()}.jpg`;

    // 3. Upload ke Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public', // Penting agar bisa dibaca oleh QR Scanner
    });

    // 4. Kembalikan URL dari Vercel Blob ke frontend
    return NextResponse.json({ url: blob.url });

  } catch (error) {
    console.error("Gagal upload ke Blob:", error);
    return NextResponse.json({ error: 'Gagal mengupload gambar' }, { status: 500 });
  }
}