import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

// Menggunakan font Space Grotesk yang sangat cocok untuk UI Neobrutalism
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neo Photobooth",
  description: "Web App Photobooth bergaya Neobrutalism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`
          ${spaceGrotesk.className} antialiased 
          /* Warna highlight saat teks di-block (kuning dengan teks hitam) */
          selection:bg-[var(--neo-yellow)] selection:text-black
        `}
      >
        {children}
      </body>
    </html>
  );
}