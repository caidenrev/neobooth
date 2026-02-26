import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, imageUrl } = body;

        if (!email || !imageUrl) {
            return NextResponse.json({ error: 'Email dan URL gambar wajib diisi' }, { status: 400 });
        }

        // Mengambil data dan error langsung dari respon Resend
        const { data, error } = await resend.emails.send({
            from: 'Neo Booth <onboarding@resend.dev>',
            to: email, // ⚠️ SAAT TESTING: Pastikan ini adalah email yang kamu pakai untuk login Resend!
            subject: '📸 Hasil Foto Keren Kamu dari Neo Booth!',
            html: `
        <div style="font-family: system-ui, sans-serif; padding: 30px; background-color: #F4F4F0; color: #000; border: 4px solid #000;">
          <h1 style="background-color: #FFD700; display: inline-block; padding: 10px 20px; border: 4px solid #000; text-transform: uppercase; box-shadow: 6px 6px 0px #000;">
            Ini Dia Hasil Fotomu!
          </h1>
          <p style="font-size: 18px; font-weight: bold; margin-top: 20px;">
            Terima kasih sudah seru-seruan berfoto di Neo Booth.
          </p>
          <div style="margin: 30px 0;">
            <img src="${imageUrl}" alt="Photobooth" style="max-width: 100%; width: 400px; border: 6px solid #000; box-shadow: 12px 12px 0px #000;" />
          </div>
          <a href="${imageUrl}" target="_blank" style="background-color: #00FF00; color: #000; padding: 15px 25px; text-decoration: none; font-weight: bold; font-size: 16px; border: 4px solid #000; box-shadow: 6px 6px 0px #000; display: inline-block; text-transform: uppercase;">
            ⬇️ Unduh Gambar
          </a>
        </div>
      `,
        });

        // JIKA RESEND MENOLAK (Misal: Email tujuan salah atau API Key belum terbaca)
        if (error) {
            console.error("Resend API Error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Jika benar-benar sukses
        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
    }
}