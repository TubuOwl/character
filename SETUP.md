# Setup: NEWS & BOTS LIST pakai Postgres di Vercel (tanpa admin panel)

## 1. Database
Vercel Dashboard → project ini → tab **Storage** → **Create Database** → **Postgres** (Neon) → **Connect**
ke project ini. Vercel otomatis isi env var `DATABASE_URL`.

## 2. Buat tabel + (opsional) data awal
Buka SQL editor database tersebut, jalankan:
- `sql/schema.sql` — bikin tabel `bots` dan `news`.
- `sql/seed.sql` — opsional, contoh data awal.

## 3. Set secret
Settings → Environment Variables:
```
ADMIN_SECRET = <bebas, hanya kamu yang tahu>
```
Redeploy setelah menambah env var.

## 4. Deploy
Push ke Git → import ke Vercel (folder `api/` otomatis jadi serverless functions).

## 5. Cara pakai — TIDAK ADA ADMIN PANEL, cukup buka link

### Tambah NEWS
```
https://situskamu.vercel.app/api/news?text=hallo&time=2026.09.29&secret=RAHASIAMU
```
Parameter:
- `text` (wajib) — isi berita.
- `time` — tanggal/label bebas (default: hari ini).
- `title` — judul (default: diambil dari awal `text`).
- `tag`, `link` — opsional.
- `secret` (wajib) — harus sama persis dengan `ADMIN_SECRET`.

Hapus news:
```
/api/news?delete=ID_NEWS&secret=RAHASIAMU
```

### Tambah / update BOT
```
https://situskamu.vercel.app/api/bots?name=mybot&owner=aku&language=javascript&home=roomku&tag=english,utility&usage=!&secret=RAHASIAMU
```
Parameter lain yang didukung: `description`, `help`, `library_name`, `library_public`, `active` (`1`/`0`), `uptime` (angka).
Kirim `name` yang sama lagi untuk update data bot tersebut (upsert).

Hapus bot:
```
/api/bots?delete=namabot&secret=RAHASIAMU
```

### Lihat data (publik, tanpa secret)
```
/api/news
/api/bots
```
Ini yang otomatis dipakai halaman NEWS dan BOTS LIST di situs (`assets/js/news.js` dan `assets/js/bots-list.js`).

## Catatan keamanan
- Tanpa `secret` yang cocok, endpoint hanya bisa dibaca (list) — tidak bisa tambah/hapus.
- Kalau `ADMIN_SECRET` belum di-set di Vercel, semua percobaan tambah/hapus otomatis ditolak (401).
- Karena ini pakai GET (biar tinggal buka link), jaga link secret-mu supaya tidak ke-share/ke-cache di tempat publik.
