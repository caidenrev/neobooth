"use client";

import { useEffect, useState } from 'react';
import { mergeImageWithFrame } from '@/src/utils/canvasHelper';
import BrutalistButton from './BrutalistButton';
import { QRCodeCanvas } from 'qrcode.react';
import { X } from 'lucide-react';

interface PreviewCetakProps {
    capturedImages: string[]; // Update interface untuk menerima array
    onRetake: () => void;
}

export default function PreviewCetak({ capturedImages, onRetake }: PreviewCetakProps) {
    const [finalImage, setFinalImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    // State untuk fitur QR Code
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);

    useEffect(() => {
        const processImage = async () => {
            try {
                // Memanggil helper penggabung gambar dengan array berisi 3 foto
                // PERHATIKAN: Ganti path frame di bawah jika nama file PNG-mu berbeda
                const merged = await mergeImageWithFrame(capturedImages, '/frames/frame-custom.png');
                setFinalImage(merged);
            } catch (error) {
                console.error(error);
                alert("Waduh, gagal memproses gambar. Coba lagi ya!");
            } finally {
                setIsProcessing(false);
            }
        };

        if (capturedImages && capturedImages.length > 0) {
            processImage();
        }
    }, [capturedImages]);

    const handlePrint = () => {
        window.print();
    };

    const handleGenerateQR = async () => {
        if (!finalImage || qrUrl) {
            // Jika sudah ada link, langsung buka modal saja
            if (qrUrl) setShowQrModal(true);
            return;
        }

        setIsUploading(true);
        try {
            // Mengirim finalImage (gabungan foto + frame) ke backend API ImgBB kita
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: finalImage }),
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setQrUrl(data.url); // Simpan URL publik dari ImgBB
            setShowQrModal(true); // Tampilkan modal QR
        } catch (error) {
            console.error(error);
            alert('Gagal meng-upload gambar ke cloud. Coba cek API Key atau koneksi internetmu!');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300 relative z-10">

                <h2 className="text-3xl md:text-5xl font-black uppercase mb-8 bg-[var(--neo-yellow)] px-6 py-3 border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform -rotate-2 no-print">
                    {isProcessing ? 'Memproses...' : 'Hasil Keren Kamu!'}
                </h2>

                <div className="relative border-8 border-black shadow-[16px_16px_0px_0px_#000000] mb-8 bg-gray-200 print-only-container">
                    {isProcessing ? (
                        <div className="w-[300px] h-[600px] md:h-[848px] bg-[var(--neo-bg)] flex items-center justify-center animate-pulse">
                            <span className="text-4xl font-bold animate-bounce">⏳</span>
                        </div>
                    ) : (
                        <img
                            src={finalImage!}
                            alt="Final Photobooth"
                            className="w-[300px] h-auto md:w-[400px] object-contain print:w-full print:h-screen print:object-contain"
                        />
                    )}
                </div>

                {!isProcessing && (
                    <div className="flex gap-4 flex-wrap justify-center w-full max-w-2xl no-print p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
                        <BrutalistButton variant="red" onClick={onRetake}>
                            &larr; Ulangi
                        </BrutalistButton>
                        <BrutalistButton variant="green" onClick={handlePrint}>
                            🖨️ Cetak Langsung
                        </BrutalistButton>
                        <BrutalistButton variant="navy" onClick={handleGenerateQR} disabled={isUploading}>
                            {isUploading ? 'Meng-upload...' : '📱 Unduh via QR'}
                        </BrutalistButton>
                        <BrutalistButton variant="yellow" onClick={() => alert("Fitur Email menyusul!")}>
                            ✉️ Kirim Email
                        </BrutalistButton>
                    </div>
                )}
            </div>

            {/* =========================================
        MODAL QR CODE 
    ========================================= */}
            {showQrModal && qrUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative bg-[var(--neo-bg)] border-4 border-black shadow-[12px_12px_0px_0px_var(--neo-yellow)] p-8 max-w-sm w-full text-center transform rotate-2">

                        <button
                            onClick={() => setShowQrModal(false)}
                            className="absolute top-2 right-2 bg-[var(--neo-red)] text-white border-2 border-black p-1 hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_#000000]"
                        >
                            <X size={24} strokeWidth={3} />
                        </button>

                        <h3 className="text-2xl font-black uppercase mb-6 bg-[var(--neo-yellow)] inline-block px-2 border-2 border-black transform -rotate-1">
                            Scan Untuk Unduh!
                        </h3>

                        <div className="bg-white p-4 border-4 border-black inline-block shadow-[6px_6px_0px_0px_#000000]">
                            <QRCodeCanvas
                                value={qrUrl}
                                size={200}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>
                        <p className="mt-6 font-bold text-sm uppercase">
                            Arahkan kamera HP kamu ke QR Code di atas.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}