"use client";

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCcw, CheckCircle } from 'lucide-react';
import BrutalistButton from './BrutalistButton';

interface CameraViewProps {
    onCapture: (images: string[]) => void;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function CameraView({ onCapture }: CameraViewProps) {
    const webcamRef = useRef<Webcam>(null);

    // State untuk mengontrol sesi foto manual
    const [tempImages, setTempImages] = useState<string[]>([]);
    const [isCounting, setIsCounting] = useState(false);
    const [count, setCount] = useState(0);
    const [showFlash, setShowFlash] = useState(false);

    const videoConstraints = { width: 1280, height: 960, facingMode: "user" };

    // Fungsi untuk mengambil 1 foto saja setiap kali dipanggil
    const takeSinglePhoto = async () => {
        setIsCounting(true);

        // Hitung mundur 3, 2, 1
        for (let c = 3; c > 0; c--) {
            setCount(c);
            await sleep(1000);
        }

        setCount(0);

        // Jepret!
        const img = webcamRef.current?.getScreenshot();
        if (img) {
            setTempImages(prev => [...prev, img]);
        }

        // Efek Flash
        setShowFlash(true);
        await sleep(150);
        setShowFlash(false);

        setIsCounting(false);
    };

    // Fungsi untuk menghapus foto terakhir (Retake)
    const handleRetakeLast = () => {
        setTempImages(prev => prev.slice(0, -1));
    };

    // Fungsi untuk mereset semua foto dari awal
    const handleResetAll = () => {
        if (confirm("Yakin mau ulang semua dari awal?")) {
            setTempImages([]);
        }
    };

    // Fungsi untuk lanjut ke tahap penggabungan dengan frame
    const handleFinish = () => {
        onCapture(tempImages);
    };

    return (
        <div className="relative w-full max-w-2xl border-4 border-black shadow-[12px_12px_0px_0px_#000000] bg-[var(--neo-navy)] flex flex-col items-center group">

            {/* Efek Kilatan Flash */}
            {showFlash && <div className="absolute inset-0 z-50 bg-white" />}

            {/* Overlay Hitung Mundur */}
            {isCounting && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-[var(--neo-yellow)] px-4 py-2 border-4 border-black font-bold uppercase text-2xl mb-8 transform -rotate-2">
                        Mengambil Foto {tempImages.length + 1}
                    </div>
                    <span className="text-[150px] font-black text-white drop-shadow-[8px_8px_0px_#000000] animate-bounce">
                        {count > 0 ? count : '📸'}
                    </span>
                </div>
            )}

            {/* Area Kamera Web */}
            <div className="w-full relative aspect-[4/3] bg-black border-b-4 border-black">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    mirrored={true}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Panel Kontrol Bawah */}
            <div className="w-full p-6 flex flex-col items-center bg-[var(--neo-bg)] gap-6">

                {/* Indikator 3 Kotak Foto */}
                <div className="flex gap-4 h-20 w-full justify-center">
                    {[0, 1, 2].map((idx) => (
                        <div key={idx} className="w-20 h-20 border-4 border-black bg-gray-300 flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px_#000000]">
                            {tempImages[idx] ? (
                                <img src={tempImages[idx]} className="w-full h-full object-cover" alt={`shot-${idx}`} />
                            ) : (
                                <span className="text-gray-500 font-bold text-xl">{idx + 1}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Logika Tombol Dinamis */}
                <div className="flex gap-4 flex-wrap justify-center w-full">
                    {isCounting ? (
                        <BrutalistButton variant="yellow" disabled className="opacity-50">
                            SEDANG FOTO...
                        </BrutalistButton>
                    ) : tempImages.length === 3 ? (
                        // STATE JIKA 3 FOTO SUDAH PENUH
                        <>
                            <BrutalistButton variant="red" onClick={handleRetakeLast} className="flex items-center gap-2">
                                <RotateCcw size={24} /> ULANGI FOTO 3
                            </BrutalistButton>
                            <BrutalistButton variant="green" onClick={handleFinish} className="flex items-center gap-2">
                                <CheckCircle size={24} /> PROSES HASIL
                            </BrutalistButton>
                        </>
                    ) : tempImages.length > 0 ? (
                        // STATE JIKA SEDANG DI PERTENGAHAN (Foto 1 atau 2)
                        <>
                            <BrutalistButton variant="red" onClick={handleRetakeLast} className="flex items-center gap-2 text-sm md:text-base px-4">
                                <RotateCcw size={20} /> ULANGI FOTO {tempImages.length}
                            </BrutalistButton>
                            <BrutalistButton variant="yellow" onClick={takeSinglePhoto} className="flex items-center gap-2 text-sm md:text-base px-4">
                                <Camera size={20} /> LANJUT FOTO {tempImages.length + 1}
                            </BrutalistButton>
                        </>
                    ) : (
                        // STATE AWAL (Belum ada foto)
                        <BrutalistButton variant="yellow" onClick={takeSinglePhoto} className="flex items-center gap-3 text-2xl px-12 py-4">
                            <Camera size={32} /> MULAI FOTO 1
                        </BrutalistButton>
                    )}
                </div>

                {/* Tombol Ulangi Semua (Hanya muncul jika ada minimal 1 foto dan belum selesai) */}
                {!isCounting && tempImages.length > 0 && tempImages.length < 3 && (
                    <button onClick={handleResetAll} className="text-sm font-bold uppercase underline hover:text-[var(--neo-red)] mt-2">
                        Ulangi Semua Dari Awal
                    </button>
                )}

            </div>
        </div>
    );
}