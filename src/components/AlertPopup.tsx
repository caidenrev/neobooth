import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import BrutalistButton from './BrutalistButton';

interface AlertPopupProps {
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    type?: 'info' | 'success' | 'warning' | 'error';
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export default function AlertPopup({
    isOpen,
    title,
    message,
    type = 'info',
    confirmText = 'OK',
    cancelText,
    onConfirm,
    onCancel
}: AlertPopupProps) {
    if (!isOpen) return null;

    // Menentukan warna dan ikon berdasarkan tipe
    let bgColor = 'bg-[var(--neo-yellow)]';
    let Icon = Info;
    let cardWrapperClass = 'rotate-0 md:rotate-1';

    if (type === 'success') {
        bgColor = 'bg-[var(--neo-green)]';
        Icon = CheckCircle2;
        cardWrapperClass = 'rotate-0 md:-rotate-1';
    } else if (type === 'error') {
        bgColor = 'bg-[var(--neo-red)]';
        Icon = AlertCircle;
        cardWrapperClass = 'rotate-0 md:rotate-2';
    } else if (type === 'warning') {
        bgColor = 'bg-[var(--neo-yellow)]';
        Icon = AlertCircle;
        cardWrapperClass = 'rotate-0 md:-rotate-2';
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className={`relative w-full max-w-md bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000000] rounded-2xl p-6 ${cardWrapperClass} transition-transform`}>

                {/* Close Button X (Opsional untuk cancel cepat) */}
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="absolute -top-4 -right-4 bg-white border-4 border-black rounded-full p-2 shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                )}

                {/* Header dengan Icon */}
                <div className="flex items-center gap-4 border-b-4 border-black pb-4 mb-4">
                    <div className={`${bgColor} text-black border-4 border-black rounded-full p-3 shadow-[4px_4px_0px_0px_#000000] ${type === 'error' ? 'text-white' : ''}`}>
                        <Icon size={32} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-wide flex-1">
                        {title}
                    </h3>
                </div>

                {/* Pesan Konten */}
                <div className="text-lg font-bold mb-8 bg-white p-4 border-4 border-black rounded-xl shadow-inner">
                    {message}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 flex-wrap">
                    {onCancel && (
                        <BrutalistButton variant="red" onClick={onCancel}>
                            {cancelText || 'Batal'}
                        </BrutalistButton>
                    )}
                    <BrutalistButton variant="green" onClick={onConfirm}>
                        {confirmText}
                    </BrutalistButton>
                </div>
            </div>
        </div>
    );
}
