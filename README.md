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

## Cara Menjalankan

```bash
npm install
npm start
```

Buka:
- `http://localhost:3000` (halaman undangan)
- `http://localhost:3000/admin` (dashboard admin)

## Struktur Singkat

- `server.js` → API route + render view
- `views/invitation.ejs` → halaman undangan publik
- `views/admin.ejs` → dashboard admin
- `public/css/style.css` → styling front-end & admin
- `data/settings.json` → data konfigurasi undangan


## Publish Release

Workflow GitHub Actions telah disiapkan untuk membuat **GitHub Release** otomatis saat tag baru dengan format `v*` di-push (contoh: `v1.0.1`).

```bash
git tag v1.0.1
git push origin v1.0.1
```

Setelah itu, release akan dipublikasikan otomatis di tab **Releases** dengan catatan rilis yang digenerate otomatis.
