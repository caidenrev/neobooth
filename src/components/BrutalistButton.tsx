import React from 'react';

// Mendefinisikan props agar tombol ini reusable dan mendukung standar HTML button
interface BrutalistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'yellow' | 'navy' | 'red' | 'green';
    children: React.ReactNode;
}

export default function BrutalistButton({
    variant = 'yellow',
    children,
    className = '',
    ...props
}: BrutalistButtonProps) {

    // Mapping warna sesuai dengan variabel CSS yang sudah kita buat di globals.css
    const variantStyles = {
        yellow: 'bg-[var(--neo-yellow)] text-black',
        navy: 'bg-[var(--neo-navy)] text-white',
        red: 'bg-[var(--neo-red)] text-white',
        green: 'bg-[var(--neo-green)] text-black',
    };

    return (
        <button
            className={`
        /* Base styles: Border tebal, font bold, uppercase */
        font-bold py-3 px-8 border-4 border-black uppercase tracking-wider text-lg
        
        /* Transisi agar animasi klik terasa mulus tapi tetap kaku (snappy) */
        transition-all duration-150 ease-in-out
        
        /* Hard shadow default */
        shadow-[6px_6px_0px_0px_#000000]
        
        /* Efek Hover: Tombol sedikit turun, shadow mengecil */
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000000]
        
        /* Efek Active (Diklik): Tombol sepenuhnya turun menempel background, shadow hilang */
        active:translate-x-[6px] active:translate-y-[6px] active:shadow-none
        
        /* State Disabled: Transparan dan tidak bisa diklik */
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[6px_6px_0px_0px_#000000]
        
        /* Menggabungkan warna variant dengan class tambahan (jika ada) */
        ${variantStyles[variant]}
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
}