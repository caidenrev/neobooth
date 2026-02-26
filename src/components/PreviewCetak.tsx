"use client";

import { useEffect, useState } from 'react';
import { mergeImageWithFrame } from '@/src/utils/canvasHelper';
import BrutalistButton from './BrutalistButton';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Mail, Printer, QrCode, Loader2, RotateCcw } from 'lucide-react';
import AlertPopup from './AlertPopup';

interface PreviewCetakProps {
    capturedImages: string[];
    onRetake: () => void;
}

export default function PreviewCetak({ capturedImages, onRetake }: PreviewCetakProps) {
    const [finalImage, setFinalImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);

    // STATE UNTUK EMAIL
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    // STATE UNTUK ALERT POPUP
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info' as 'info' | 'success' | 'warning' | 'error'
    });

    const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));
    const showAlert = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        setAlertConfig({ isOpen: true, title, message, type });
    };

    useEffect(() => {
        const processImage = async () => {
            try {
                const merged = await mergeImageWithFrame(capturedImages, '/frames/frame-custom.png');
                setFinalImage(merged);
            } catch (error) {
                showAlert("Oops!", "Gagal memproses gambar!", "error");
            } finally {
                setIsProcessing(false);
            }
        };
        if (capturedImages?.length > 0) processImage();
    }, [capturedImages]);

    const handlePrint = () => window.print();

    // FUNGSI UPLOAD KE VERCEL BLOB
    const uploadToCloud = async (): Promise<string> => {
        if (qrUrl) return qrUrl; // Kalau sudah pernah upload, pakai URL yang ada

        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: finalImage }),
        });
        if (!response.ok) throw new Error('Upload gagal');

        const data = await response.json();
        setQrUrl(data.url);
        return data.url;
    };

    const handleGenerateQR = async () => {
        setIsUploading(true);
        try {
            await uploadToCloud();
            setShowQrModal(true);
        } catch (error) {
            showAlert("Error", "Gagal membuat QR Code.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    // FUNGSI MENGIRIM EMAIL
    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailAddress) return;
        setIsSendingEmail(true);

        try {
            // 1. Pastikan gambar di-upload dulu ke cloud untuk dapat URL-nya
            const uploadedUrl = await uploadToCloud();

            // 2. Kirim URL tersebut ke API Email Resend
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailAddress, imageUrl: uploadedUrl }),
            });

            if (!response.ok) throw new Error('Gagal kirim');

            showAlert("Berhasil!", "Email berhasil meluncur!", "success");
            setShowEmailModal(false);
            setEmailAddress(''); // Reset input
        } catch (error) {
            showAlert("Oops!", "Waduh, gagal kirim email nih. Coba lagi!", "error");
        } finally {
            setIsSendingEmail(false);
        }
    };

    return (
        <>
            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300 relative z-10">
                <h2 className="text-3xl md:text-5xl font-black uppercase mb-8 bg-[var(--neo-yellow)] px-4 md:px-6 py-2 md:py-3 border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-xl transform -rotate-2 no-print text-center">
                    {isProcessing ? 'Memproses...' : 'Hasil Keren Kamu!'}
                </h2>

                <div className="relative border-8 border-black shadow-[8px_8px_0px_0px_#000000] md:shadow-[16px_16px_0px_0px_#000000] mb-8 bg-gray-200 rounded-2xl overflow-hidden print-only-container w-full max-w-[260px] sm:max-w-[320px] md:max-w-[400px]">
                    {isProcessing ? (
                        <div className="w-full aspect-[1/2.8] bg-white flex items-center justify-center">
                            <Loader2 size={64} className="animate-spin text-black" strokeWidth={3} />
                        </div>
                    ) : (
                        <img src={finalImage!} alt="Final Photobooth" className="w-full h-auto object-contain print:w-full print:h-screen print:object-contain" />
                    )}
                </div>

                {!isProcessing && (
                    <div className="flex gap-4 flex-wrap justify-center w-full max-w-2xl no-print p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-2xl relative group overflow-hidden">
                        {/* Latar Belakang Polkadot Halus */}
                        <div className="absolute inset-0 bg-polkadot opacity-10 pointer-events-none z-0"></div>

                        <div className="flex gap-3 md:gap-4 flex-wrap justify-center relative z-10">
                            <BrutalistButton variant="red" onClick={onRetake} className="flex items-center gap-2">
                                <RotateCcw size={20} /> Ulangi
                            </BrutalistButton>
                            <BrutalistButton variant="green" onClick={handlePrint} className="flex items-center gap-2">
                                <Printer size={20} /> Cetak
                            </BrutalistButton>
                            <BrutalistButton variant="navy" onClick={handleGenerateQR} disabled={isUploading || isSendingEmail} className="flex items-center gap-2">
                                {isUploading && !showEmailModal ? <><Loader2 size={20} className="animate-spin" /> Loading</> : <><QrCode size={20} /> QR Code</>}
                            </BrutalistButton>

                            {/* TOMBOL EMAIL SEKARANG MEMBUKA MODAL */}
                            <BrutalistButton variant="yellow" onClick={() => setShowEmailModal(true)} disabled={isUploading || isSendingEmail} className="flex items-center gap-2">
                                <Mail size={20} /> Email
                            </BrutalistButton>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL QR CODE */}
            {showQrModal && qrUrl && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
                    <div className="relative bg-white border-4 border-black shadow-[12px_12px_0px_0px_var(--neo-yellow)] rounded-2xl p-8 max-w-sm w-full text-center transform rotate-2">
                        <button onClick={() => setShowQrModal(false)} className="absolute top-2 right-2 bg-[var(--neo-red)] text-white border-2 border-black p-1 rounded-full hover:scale-110 shadow-[4px_4px_0px_0px_#000000]">
                            <X size={24} strokeWidth={3} />
                        </button>
                        <h3 className="text-xl md:text-2xl font-black uppercase mb-6 bg-[var(--neo-yellow)] inline-block px-2 border-2 border-black rounded-lg -rotate-1">Scan Untuk Unduh!</h3>
                        <div className="bg-white p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000] md:shadow-[6px_6px_0px_0px_#000000] inline-flex justify-center w-full">
                            <QRCodeCanvas value={qrUrl} size={200} bgColor={"#ffffff"} fgColor={"#000000"} level={"H"} includeMargin={true} style={{ width: '100%', height: 'auto', maxWidth: '200px' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EMAIL NEOBRUTALISM */}
            {showEmailModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
                    <div className="relative bg-white border-4 border-black shadow-[12px_12px_0px_0px_var(--neo-green)] rounded-2xl p-8 max-w-md w-full transform -rotate-1">
                        <button onClick={() => setShowEmailModal(false)} className="absolute top-2 right-2 bg-[var(--neo-red)] text-white border-2 border-black p-1 rounded-full hover:scale-110 shadow-[4px_4px_0px_0px_#000000]">
                            <X size={24} strokeWidth={3} />
                        </button>

                        <h3 className="text-xl md:text-2xl font-black uppercase mb-2 bg-[var(--neo-green)] inline-block px-2 border-2 border-black rounded-lg rotate-1">
                            Kirim ke Email
                        </h3>
                        <p className="font-bold text-xs md:text-sm mb-6 uppercase">Masukkan emailmu untuk menyimpan kenangan ini!</p>

                        <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
                            <input
                                type="email"
                                required
                                placeholder="contoh@email.com"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                className="w-full p-4 text-lg font-bold border-4 border-black rounded-xl outline-none focus:bg-[var(--neo-yellow)] transition-colors shadow-[6px_6px_0px_0px_#000000]"
                            />
                            <button
                                type="submit"
                                disabled={isSendingEmail}
                                className="w-full bg-[var(--neo-navy)] text-white font-black text-xl p-4 border-4 border-black rounded-xl uppercase hover:translate-x-[2px] hover:translate-y-[2px] shadow-[6px_6px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-polkadot-thick opacity-50 pointer-events-none z-0 mix-blend-multiply"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    {isSendingEmail ? <><Loader2 size={24} className="animate-spin" /> Mengirim...</> : <><Mail size={24} strokeWidth={3} /> Kirim Sekarang</>}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <AlertPopup
                isOpen={alertConfig.isOpen}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                confirmText="OK"
                onConfirm={closeAlert}
            />
        </>
    );
}