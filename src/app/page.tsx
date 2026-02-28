"use client";

import { useState } from "react";
import Image from "next/image";
import CameraView from "@/src/components/CameraView";
import PreviewCetak from "@/src/components/PreviewCetak";

export default function Home() {
  // State sekarang menyimpan ARRAY of strings (karena ada 3 foto)
  const [capturedImages, setCapturedImages] = useState<string[] | null>(null);

  // Fungsi menerima array gambar dari CameraView
  const handleCapture = (images: string[]) => {
    setCapturedImages(images);
  };

  // Reset state ke null untuk mengulang foto
  const handleRetake = () => {
    setCapturedImages(null);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden bg-[var(--neo-pink)] z-0">

      {/* Background Latar Polkadot Tebal */}
      <div className="absolute inset-0 bg-polkadot-thick pointer-events-none opacity-40 z-0"></div>

      {/* Dekorasi PNG - Tersebar di seluruh layar, terlihat di semua ukuran */}

      {/* Kiri Atas */}
      <div className="absolute top-4 left-2 sm:top-8 sm:left-6 md:top-10 md:left-10 pointer-events-none no-print -z-10">
        <Image src="/images/decoration-1.png" alt="" width={100} height={100}
          className="w-[100px] h-[100px] sm:w-[90px] sm:h-[90px] md:w-[120px] md:h-[120px] object-contain" />
      </div>

      {/* Kanan Atas */}
      <div className="absolute top-4 right-2 sm:top-8 sm:right-6 md:top-10 md:right-10 pointer-events-none no-print -z-10 transform rotate-12">
        <Image src="/images/decoration-3.png" alt="" width={110} height={110}
          className="w-[100px] h-[100px] sm:w-[85px] sm:h-[85px] md:w-[110px] md:h-[110px] object-contain" />
      </div>

      {/* Tengah Kiri */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1 sm:left-3 md:left-6 pointer-events-none no-print -z-10 transform -rotate-6">
        <Image src="/images/decoration-2.png" alt="" width={90} height={90}
          className="w-[90px] h-[90px] sm:w-[75px] sm:h-[75px] md:w-[90px] md:h-[90px] object-contain" />
      </div>

      {/* Tengah Kanan */}
      <div className="absolute top-1/2 -translate-y-1/2 right-1 sm:right-3 md:right-6 pointer-events-none no-print -z-10 transform rotate-6">
        <Image src="/images/decoration-4.png" alt="" width={90} height={90}
          className="w-[90px] h-[90px] sm:w-[75px] sm:h-[75px] md:w-[90px] md:h-[90px] object-contain" />
      </div>

      {/* Kiri Bawah */}
      <div className="absolute bottom-4 left-2 sm:bottom-8 sm:left-6 md:bottom-10 md:left-10 pointer-events-none no-print -z-10 transform -rotate-12">
        <Image src="/images/decoration-5.png" alt="" width={100} height={100}
          className="w-[100px] h-[100px] sm:w-[85px] sm:h-[85px] md:w-[100px] md:h-[100px] object-contain" />
      </div>

      {/* Kanan Bawah */}
      <div className="absolute bottom-4 right-2 sm:bottom-8 sm:right-6 md:bottom-10 md:right-10 pointer-events-none no-print -z-10 transform rotate-45">
        <Image src="/images/decoration.png" alt="" width={110} height={110}
          className="w-[100px] h-[100px] sm:w-[90px] sm:h-[90px] md:w-[110px] md:h-[110px] object-contain" />
      </div>

      {/* Header Aplikasi */}
      <div className="relative z-10 mb-1 sm:mb-2 md:mb-3 no-print">
        <Image
          src="/images/logo-neobooth.png"
          alt="Neo Booth Logo"
          width={700}
          height={220}
          className="object-contain w-[380px] sm:w-[520px] md:w-[700px] h-auto"
          priority
        />
      </div>

      {/* Kontainer Utama */}
      <div className="w-full max-w-4xl bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000000] rounded-3xl p-6 md:p-10 flex flex-col items-center no-print-bg relative overflow-hidden group">

        {/* Latar Belakang Polkadot Halus untuk Kontainer Utama */}
        <div className="absolute inset-0 bg-polkadot opacity-10 pointer-events-none z-0"></div>

        <div className="relative w-full z-10 flex flex-col items-center">
          {!capturedImages ? (
            // Kirim fungsi handleCapture ke komponen kamera
            <CameraView onCapture={handleCapture} />
          ) : (
            // Kirim array foto ke komponen preview cetak
            <PreviewCetak
              capturedImages={capturedImages}
              onRetake={handleRetake}
            />
          )}
        </div>
      </div>

      <footer className="mt-12 font-bold uppercase border-t-4 border-black pt-4 w-full max-w-4xl text-center no-print">
        &copy; {new Date().getFullYear()} By Eka Revandi
      </footer>

    </main>
  );
}