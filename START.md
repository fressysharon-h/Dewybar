# 🌿 Dewy Bar — Cara Menjalankan

## Cara Cepat (2 langkah)

### 1. Install dependencies
```bash
cd backend
pip install flask flask-cors
```

### 2. Jalankan server
```bash
python3 server.py
```

Buka browser: **http://localhost:8080**

---

## Akun Demo
Buat akun baru via halaman Daftar, atau gunakan akun Firebase yang sudah ada.

## Struktur Folder
```
frontend/
  pages/     → semua halaman HTML + app.js
  css/       → style.css
  images/    → gambar logo dll
backend/
  server.py  → Flask server (jalankan ini)
```

## Fitur Lengkap
- ✅ Login & Daftar via Firebase Auth
- ✅ 16 produk buah segar + olahan
- ✅ Keranjang belanja
- ✅ Checkout + pilih tanggal pengiriman
- ✅ Pembayaran (QRIS / Transfer / E-Wallet)
- ✅ Riwayat pesanan di profil
- ✅ Smart Pre-Order
- ✅ Jejak Petani
