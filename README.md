# Drapox-novix - Website Undangan Pernikahan

Website undangan pernikahan **full-stack Node.js** dengan:
- Halaman undangan publik (front-end view)
- Dashboard admin untuk mengatur konten, tema, galeri, dan RSVP
- Penyimpanan konfigurasi sederhana berbasis file JSON

## Fitur Utama

- Landing page undangan modern dan responsif
- Informasi mempelai, acara, cerita cinta, galeri, dan tombol RSVP WhatsApp
- Panel admin di `/admin` untuk mengubah konten tanpa edit kode
- Ganti warna tema dan font langsung dari dashboard

## Teknologi

- Node.js + Express
- EJS Template Engine
- CSS murni
- JSON file storage (`data/settings.json`)

## Cara Menjalankan (Node.js runtime)

```bash
npm install
npm start
```

Buka:
- `http://localhost:3000` (halaman undangan)
- `http://localhost:3000/admin` (dashboard admin)

## Deploy ke GitHub Pages (mode statis)

Repo ini sekarang punya workflow GitHub Pages (`.github/workflows/deploy-pages.yml`) yang membangun versi statis dari halaman undangan.

Jalankan build statis lokal:

```bash
npm install
npm run build:static
```

Output akan dibuat di folder `dist/` dan bisa di-deploy ke GitHub Pages.


### Setting wajib di GitHub

Buka `Settings -> Pages`, lalu pada **Build and deployment** pilih **Source: GitHub Actions**.

Workflow deploy akan jalan saat ada push ke branch `main` **atau** `work`.

### Keterbatasan mode GitHub Pages

Karena GitHub Pages hanya melayani file statis, maka fitur berikut **tidak tersedia** di Pages:
- route server Express (`/admin`, `/admin/save`)
- autentikasi Basic Auth di backend
- penyimpanan perubahan ke `data/settings.json` dari browser

Jika membutuhkan dashboard admin yang benar-benar aktif di production, deploy versi Node.js ke platform runtime (mis. Render/Railway/Fly.io/VPS).

## Struktur Singkat

- `server.js` → API route + render view (runtime Node.js)
- `views/invitation.ejs` → halaman undangan publik
- `views/admin.ejs` → dashboard admin
- `scripts/build-static.js` → generator HTML statis untuk GitHub Pages
- `public/css/style.css` → styling front-end & admin
- `data/settings.json` → data konfigurasi undangan
