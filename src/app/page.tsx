"use client";

import { useState } from "react";
import CameraView from "@/src/components/CameraView";
import PreviewCetak from "@/src/components/PreviewCetak";
import { Star, Zap, Sparkles, Hexagon, Asterisk } from 'lucide-react';

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

      {/* Dekorasi Background Neobrutalism dengan Ikon Acak */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-[var(--neo-yellow)] border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-full flex items-center justify-center -z-10 no-print animate-pulse">
        <Star size={48} className="text-black fill-black" strokeWidth={2} />
      </div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[var(--neo-green)] border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-2xl flex items-center justify-center -z-10 no-print transform rotate-12">
        <Hexagon size={64} className="text-black" strokeWidth={3} />
      </div>
      <div className="absolute top-1/2 left-4 w-16 h-16 bg-[var(--neo-red)] border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-xl flex items-center justify-center -z-10 no-print transform -rotate-12">
        <Zap size={32} className="text-white fill-white" strokeWidth={2} />
      </div>
      <div className="absolute top-20 right-20 w-20 h-20 bg-[var(--neo-navy)] border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-xl flex items-center justify-center -z-10 no-print transform rotate-45">
        <Sparkles size={40} className="text-white" strokeWidth={2} />
      </div>
      <div className="absolute bottom-20 left-32 w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-full flex items-center justify-center -z-10 no-print transform -rotate-45">
        <Asterisk size={24} className="text-black" strokeWidth={3} />
      </div>

      {/* Header Aplikasi */}
      <div className="bg-[var(--neo-navy)] text-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-2xl p-4 mb-8 transform -rotate-2 no-print hover:rotate-0 transition-transform cursor-default">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-center">
          Neo Booth.
        </h1>
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