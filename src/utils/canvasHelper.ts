const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
};

// Sekarang menerima array string (3 foto)
export const mergeImageWithFrame = async (photosBase64: string[], framePath: string): Promise<string> => {
    try {
        // Load semua foto dan frame secara paralel
        const photoPromises = photosBase64.map(photo => loadImage(photo));
        const photos = await Promise.all(photoPromises);
        const frame = await loadImage(framePath);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context tidak didukung');

        // Resolusi Target (Kira-kira 10.5 x 29.7 cm di 300 DPI)
        const CANVAS_WIDTH = 1240;
        const CANVAS_HEIGHT = 3508;
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // BACKGROUND: Isi dengan warna putih (jaga-jaga kalau pinggiran foto kurang pas)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // KOORDINAT KOTAK (X, Y, Width, Height)
        // Angka ini adalah perkiraan dari desain frame kamu. Nanti kamu bisa ubah-ubah angkanya
        // kalau posisi fotonya kurang pas (kurang atas/bawah/lebar).
        const slots = [
            // Kita perlebar kotak (w & h) dan geser agak ke atas (y) dan kiri (x)
            // agar area foto "tumpah" (bleed) ke belakang frame dan tidak menyisakan ruang putih.
            // Frame PNG akan menutupi pinggirannya sehingga terlihat pas!
            { x: 90, y: 160, w: 1060, h: 1000 },   // Kotak Atas
            { x: 90, y: 1190, w: 1060, h: 1000 },  // Kotak Tengah
            { x: 90, y: 2220, w: 1060, h: 1000 },  // Kotak Bawah
        ];

        // Gambar ketiga foto ke masing-masing kotak
        photos.forEach((photo, index) => {
            if (!slots[index]) return; // Jaga-jaga kalau foto lebih dari slot
            const slot = slots[index];

            // Logika Crop-to-Cover khusus untuk masing-masing slot
            const scale = Math.max(slot.w / photo.width, slot.h / photo.height);
            const scaledWidth = photo.width * scale;
            const scaledHeight = photo.height * scale;
            const offsetX = slot.x + (slot.w - scaledWidth) / 2;
            const offsetY = slot.y + (slot.h - scaledHeight) / 2;

            // Supaya foto tidak keluar dari batas slot, kita gunakan clipping (memotong rapi)
            ctx.save();
            ctx.beginPath();
            // Tambahkan efek rounded corner (lengkungan) kalau mau, tapi kotak biasa juga aman
            ctx.rect(slot.x, slot.y, slot.w, slot.h);
            ctx.clip();

            // Gambar foto di dalam area yang sudah di-clip
            ctx.drawImage(photo, offsetX, offsetY, scaledWidth, scaledHeight);
            ctx.restore();
        });

        // TERAKHIR: Gambar Frame PNG transparan di layer paling atas!
        ctx.drawImage(frame, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        return canvas.toDataURL('image/jpeg', 0.95);
    } catch (error) {
        console.error("Gagal menggabungkan gambar:", error);
        throw error;
    }
};