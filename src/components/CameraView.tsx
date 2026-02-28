"use client";

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RotateCcw, CheckCircle, Sparkles } from 'lucide-react';
import BrutalistButton from './BrutalistButton';
import AlertPopup from './AlertPopup';

interface CameraViewProps {
    onCapture: (images: string[]) => void;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Daftar Filter ────────────────────────────────────────────────────────────
const FILTERS = [
    { id: 'normal', label: 'Normal', css: 'none' },
    { id: 'beauty', label: 'Beauty', css: 'brightness(1.08) contrast(0.88) saturate(1.1) blur(0.5px)' },
    { id: 'vivid', label: 'Vivid', css: 'saturate(1.9) contrast(1.1) brightness(1.05)' },
    { id: 'sepia', label: 'Sepia', css: 'sepia(0.75) contrast(1.05)' },
    { id: 'vintage', label: 'Vintage', css: 'sepia(0.4) contrast(0.9) brightness(1.1) saturate(0.9)' },
    { id: 'bw', label: 'B&W', css: 'grayscale(1) contrast(1.15)' },
    { id: 'cool', label: 'Cool', css: 'hue-rotate(25deg) saturate(1.2) brightness(1.05)' },
    { id: 'warm', label: 'Warm', css: 'hue-rotate(-20deg) saturate(1.4) brightness(1.05)' },
    { id: 'fade', label: 'Fade', css: 'brightness(1.15) contrast(0.85) saturate(0.75)' },
    { id: 'dreamy', label: 'Dreamy', css: 'brightness(1.1) contrast(0.9) saturate(1.3) hue-rotate(10deg)' },
] as const;

type FilterId = typeof FILTERS[number]['id'];

export default function CameraView({ onCapture }: CameraViewProps) {
    const webcamRef = useRef<Webcam>(null);

    const [tempImages, setTempImages] = useState<string[]>([]);
    const [isCounting, setIsCounting] = useState(false);
    const [count, setCount] = useState(0);
    const [showFlash, setShowFlash] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [selectedFilterId, setSelectedFilterId] = useState<FilterId>('normal');

    const videoConstraints = { width: 1280, height: 960, facingMode: "user" };

    const currentFilter = FILTERS.find(f => f.id === selectedFilterId)!;

    // Capture foto ke canvas dengan filter terbake
    const captureWithFilter = (): string | null => {
        const video = webcamRef.current?.video;
        if (!video) return null;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 960;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Balik horizontal (mirror) dulu karena webcam mirrored
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        // Terapkan filter CSS ke canvas
        if (currentFilter.css !== 'none') {
            ctx.filter = currentFilter.css;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.92);
    };

    const takeSinglePhoto = async () => {
        setIsCounting(true);

        for (let c = 3; c > 0; c--) {
            setCount(c);
            await sleep(1000);
        }

        setCount(0);

        const img = captureWithFilter();
        if (img) {
            setTempImages(prev => [...prev, img]);
        }

        setShowFlash(true);
        await sleep(150);
        setShowFlash(false);

        setIsCounting(false);
    };

    const handleRetakeLast = () => {
        setTempImages(prev => prev.slice(0, -1));
    };

    const handleResetAll = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        setTempImages([]);
        setShowResetConfirm(false);
    };

    const handleFinish = () => {
        onCapture(tempImages);
    };

    return (
        <div className="relative w-full max-w-sm sm:max-w-lg md:max-w-2xl border-4 border-black shadow-[12px_12px_0px_0px_#000000] rounded-2xl bg-[var(--neo-navy)] flex flex-col items-center group overflow-hidden">

            {/* Efek Kilatan Flash */}
            {showFlash && <div className="absolute inset-0 z-50 bg-white" />}

            {/* Overlay Hitung Mundur */}
            {isCounting && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-[var(--neo-yellow)] px-4 py-2 border-4 border-black font-bold uppercase text-2xl mb-8 transform -rotate-2">
                        Mengambil Foto {tempImages.length + 1}
                    </div>
                    <span className="text-[120px] md:text-[150px] font-black text-white drop-shadow-[8px_8px_0px_#000000] animate-bounce flex items-center justify-center mt-4">
                        {count > 0 ? count : <Camera size={120} strokeWidth={3} className="text-white" />}
                    </span>
                </div>
            )}

            {/* Area Kamera Web — filter live preview */}
            <div className="w-full relative aspect-[4/3] bg-black border-b-4 border-black overflow-hidden">
                <div
                    className="w-full h-full"
                    style={{ filter: currentFilter.css === 'none' ? undefined : currentFilter.css }}
                >
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        mirrored={true}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Badge filter aktif */}
                {selectedFilterId !== 'normal' && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 backdrop-blur-sm">
                        <Sparkles size={12} />
                        {currentFilter.label}
                    </div>
                )}
            </div>

            {/* Panel Kontrol Bawah */}
            <div className="w-full p-3 sm:p-4 md:p-6 flex flex-col items-center bg-[var(--neo-bg)] gap-3 sm:gap-4 md:gap-6">

                {/* ── Filter Picker ── */}
                <div className="w-full">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1">
                        <Sparkles size={12} /> Filter
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
                        {FILTERS.map((filter) => {
                            const isActive = selectedFilterId === filter.id;
                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilterId(filter.id)}
                                    className={`shrink-0 snap-start flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-4 font-black text-xs uppercase transition-all
                                        ${isActive
                                            ? 'border-black bg-neo-yellow shadow-neo-sm scale-105'
                                            : 'border-gray-300 bg-white hover:border-black hover:shadow-[2px_2px_0px_0px_#000000]'
                                        }`}
                                >
                                    <span className="leading-none whitespace-nowrap">{filter.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Indikator 3 Kotak Foto */}
                <div className="flex gap-2 sm:gap-3 md:gap-4 w-full justify-center">
                    {[0, 1, 2].map((idx) => (
                        <div key={idx} className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 border-4 border-black rounded-xl bg-gray-300 flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px_#000000]">
                            {tempImages[idx] ? (
                                <img src={tempImages[idx]} className="w-full h-full object-cover" alt={`shot-${idx}`} />
                            ) : (
                                <span className="text-gray-500 font-bold text-lg md:text-xl">{idx + 1}</span>
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
                        <>
                            <BrutalistButton variant="red" onClick={handleRetakeLast} className="flex items-center gap-2">
                                <RotateCcw size={24} /> ULANGI FOTO 3
                            </BrutalistButton>
                            <BrutalistButton variant="green" onClick={handleFinish} className="flex items-center gap-2">
                                <CheckCircle size={24} /> PROSES HASIL
                            </BrutalistButton>
                        </>
                    ) : tempImages.length > 0 ? (
                        <>
                            <BrutalistButton variant="red" onClick={handleRetakeLast} className="flex items-center gap-2 text-sm md:text-base px-4">
                                <RotateCcw size={20} /> ULANGI FOTO {tempImages.length}
                            </BrutalistButton>
                            <BrutalistButton variant="yellow" onClick={takeSinglePhoto} className="flex items-center gap-2 text-sm md:text-base px-4">
                                <Camera size={20} /> LANJUT FOTO {tempImages.length + 1}
                            </BrutalistButton>
                        </>
                    ) : (
                        <BrutalistButton variant="yellow" onClick={takeSinglePhoto} className="flex items-center gap-3 text-lg md:text-2xl px-6 md:px-12 py-3 md:py-4">
                            <Camera size={24} className="md:w-8 md:h-8" /> MULAI FOTO 1
                        </BrutalistButton>
                    )}
                </div>

                {/* Tombol Ulangi Semua */}
                {!isCounting && tempImages.length > 0 && tempImages.length < 3 && (
                    <button onClick={handleResetAll} className="text-sm font-bold uppercase underline hover:text-neo-red mt-2">
                        Ulangi Semua Dari Awal
                    </button>
                )}

            </div>

            {/* Popup Konfirmasi Reset */}
            <AlertPopup
                isOpen={showResetConfirm}
                title="Yakin Ulangi?"
                message="Semua foto yang udah kamu ambil bakal hilang lho. Beneran mau ulang dari awal?"
                type="warning"
                confirmText="Ya, Ulangi!"
                cancelText="Mending Lanjut"
                onConfirm={confirmReset}
                onCancel={() => setShowResetConfirm(false)}
            />
        </div>
    );
}