# Penjelasan Proyek UTS Pemrograman Web 1 — Buku Kita

## Ringkasan

Proyek ini adalah prototipe front-end toko buku **Buku Kita** sesuai soal UTS. Aplikasi memiliki halaman login, dashboard, katalog/stok, checkout, dan tracking. Seluruhnya berjalan di browser dengan HTML, CSS, dan JavaScript tanpa server atau database. Data pengguna, katalog, dan tracking berasal dari file yang diberikan dan disimpan sebagai Array/Object di `js/data.js`; gambar sampul berada di folder `img/`. Keranjang, buku tambahan, dan pesanan checkout disimpan di `localStorage` browser.

Untuk mencoba, buka `index.html` di browser. Akun yang tersedia: `rina@gmail.com` / `rina123` (User), `agus@gmail.com` / `agus123` (Admin), atau `siti@gmail.com` / `siti123` (User). Tambahkan buku dari katalog, buka checkout, isi data pemesan, lalu buat pesanan. Nomor delivery order untuk pesanan baru tampil sebagai notifikasi dan dapat dicari di halaman tracking. Nomor demo dari data yang diberikan: `2025-20230012` dan `2025-20230013`.

## Struktur folder

```text
toko-buku-uts/
├── index.html
├── dashboard.html
├── stok.html
├── checkout.html
├── tracking.html
├── PENJELASAN.md
├── img/
│   ├── pengantar_komunikasi.jpg
│   ├── manajemen_keuangan.jpg
│   ├── kepemimpinan.jpg
│   ├── mikrobiologi.jpg
│   └── paud_perkembangan.jpeg
├── css/
│   └── style.css
└── js/
    ├── data.js
    └── script.js
```

## Penjelasan setiap file

### `index.html` - halaman login

File ini menjadi halaman awal aplikasi dan mengikuti struktur pada soal (`index.html` sebagai halaman login). `main`, `section`, `header`, `figure`, `figcaption`, `form`, `label`, `input`, `nav`, dan `dialog` menyusun konten tanpa class CSS di markup. ID dan nama elemen pada halaman login memakai Bahasa Indonesia. Atribut form dibatasi pada id, name, type, placeholder, dan required yang sudah ada di materi. Area kiri memakai sampul buku sebagai ilustrasi, sedangkan form login ada di kanan. Tombol mata mengubah input password menjadi teks dan kembali, lalu mengganti sumber ikon SVG Bootstrap Icons pada elemen `img`. Dialog bawaan HTML dipakai untuk lupa password dan pendaftaran demo; metode `showModal()` dan `close()` adalah tambahan kecil di luar latihan utama. File memanggil `css/style.css` untuk tampilan dan `js/data.js` lalu `js/script.js` untuk data dan interaksi. Login mencocokkan data demo dari `dataPengguna`; ini simulasi browser, bukan sistem akun sungguhan.

### `dashboard.html` - ringkasan dan navigasi

Halaman ini memakai `<aside>`, `<nav>`, `<main>`, `<header>`, `<section>`, dan `<article>` untuk memisahkan menu samping dari isi dashboard. Markup tidak memakai class selain class menu yang ditambahkan JavaScript di ponsel; ID berbahasa Indonesia dipakai untuk gaya dan pengambilan elemen. Di layar lebar, sidebar berada di samping konten dengan posisi absolute. Di ponsel, tombol membuka dan menutup sidebar. Dashboard menampilkan sapaan menurut waktu lokal beserta nama akun yang berhasil login. Jumlah judul dan total stok membaca katalog yang sama dengan halaman stok, termasuk buku tambahan yang tersimpan di browser. Jumlah pesanan, laporan, dan histori menggabungkan dua pesanan contoh dari `dataTracking` dengan pesanan checkout lokal. Laporan berisi ringkasan stok serta daftar nomor DO, pemesan, status, dan total. Laporan dan histori dibuka sebagai elemen `<dialog>`. Daftar stok menipis menandai buku dengan stok 200 atau kurang.

### `stok.html` - informasi stok/katalog

Halaman memakai `aside`, `nav`, `main`, `header`, dan `section`. Setiap kartu menampilkan sampul, judul, kode, jenis, edisi, stok, dan harga dari `dataKatalogBuku`. Pencarian memeriksa judul atau kode. Buku dengan stok 200 atau kurang diberi penanda warna. Tombol Tambah ke Pesanan memasukkan satu buku ke keranjang dan tombolnya tidak aktif jika stok nol. Form tambah buku meminta kode, judul, jenis, edisi, stok, dan harga. Kode buku yang sama ditolak. Buku tambahan disimpan di `localStorage` pada browser yang sama; browser tidak mengubah file `data.js` secara langsung.

### `checkout.html` - halaman pemesanan

Halaman memakai elemen semantik dengan ID berbahasa Indonesia. Sidebar berada di sisi konten pada layar lebar dan dapat dibuka lewat tombol di ponsel. Ringkasan keranjang menampilkan judul, harga, jumlah, subtotal, dan total. Tombol tambah, kurangi, dan hapus memperbarui isi keranjang. Form meminta nama, email, telepon, alamat, serta metode pembayaran; atribut HTML `required` dan `type="email"` membantu validasi. Setelah checkout, riwayat pesanan disimpan lokal, keranjang dikosongkan, dan toast sementara menampilkan nomor DO untuk digunakan pada halaman tracking.

### `tracking.html` - informasi pengiriman

Halaman memakai elemen semantik untuk form pencarian dan hasil. Sidebar berada di sisi konten pada layar lebar dan dapat dibuka lewat tombol di ponsel. Dua tombol contoh mengisi nomor DO dari `data.js`. Pencarian menampilkan pemesan, status, tiga tahap progres, ekspedisi, tanggal, jenis paket, isi paket, total, dan riwayat perjalanan. Pesanan dari checkout juga dapat ditemukan selama tersimpan di browser yang sama. Jika nomor tidak cocok, pesan muncul di dekat area hasil.

### `css/style.css` - gaya visual dan responsif

File CSS eksternal ini berisi token warna, tipografi, tombol, sidebar, kartu, form, modal, tabel, notifikasi, progres tracking, dan tata letak checkout. Bagian akhir berisi gaya gelap untuk login, dashboard, katalog, checkout, dan tracking yang ditargetkan dengan ID halaman masing-masing. Halaman yang sudah diperbarui memakai Flexbox, warna biru malam, dan media query untuk layar ponsel. Media query lain menyesuaikan halaman aplikasi ke tablet dan ponsel. Font Google digunakan sebagai peningkatan visual; jika koneksi internet tidak tersedia, browser memakai font cadangan.

### `js/data.js` - sumber data contoh

File ini berisi tiga variabel data dari bahan yang diberikan: `dataPengguna` untuk akun demo, `dataKatalogBuku` untuk lima buku ajar, dan `dataTracking` untuk dua nomor delivery order beserta riwayat perjalanannya. Katalog memakai kode barang, nama barang, jenis, edisi, stok, harga berformat Rupiah, dan path gambar sampul. `script.js` membaca struktur tersebut dan memetakannya untuk tampilan katalog serta tracking. `PUSTAKA_KEYS` di bagian bawah memusatkan nama kunci penyimpanan lokal proyek.

### `js/script.js` - logika dan manipulasi DOM

File JavaScript ini menghubungkan data dengan antarmuka. Pada login dan dashboard, nama fungsi, ID, dan variabel baru memakai Bahasa Indonesia. Fungsi `siapkanMenuNavigasi()` memakai event klik dan `classList` untuk membuka atau menutup sidebar di ponsel. Logika dashboard membaca waktu lokal dan nama akun dari `sessionStorage`, lalu menghitung katalog serta transaksi yang sama dengan halaman stok, checkout, dan tracking. Laporan dan histori dibuat dari data pesanan contoh dan pesanan lokal. Daftar stok menipis menandai buku dengan stok paling banyak 200. Penyimpanan `sessionStorage` adalah tambahan kecil di luar materi untuk membawa nama akun setelah login. Pada login, lupa password, dan pendaftaran, kode menggunakan pemilihan elemen berdasarkan ID, event `click`/`submit`, perulangan, kondisi, array `dataPengguna`, dan notifikasi sementara melalui `tampilkanNotifikasi()`. Notifikasi hilang setelah sekitar 3,6 detik. Saat mendaftar, email diperiksa tanpa membedakan huruf besar-kecil; jika email belum dipakai, objek akun ditambahkan ke array di memori halaman.

Browser tidak boleh menulis perubahan ke file `js/data.js` di disk. Karena itu akun yang dibuat dengan form hanya ada di array selama halaman masih terbuka dan akan hilang setelah dimuat ulang. Supaya akun tersimpan permanen, proyek kelak perlu penyimpanan lokal browser atau server.

## Penjelasan video proyek

Video pendamping proyek dibuat dalam format review website dengan voice-over, demonstrasi halaman, dan beberapa cuplikan source code. Video mengikuti alur pengguna dari login, dashboard, katalog, checkout, sampai tracking. Cuplikan kode dipakai untuk menjelaskan alasan pembagian HTML semantik, aturan CSS responsif, validasi form, manipulasi DOM, dan pembacaan data.

Urutan kerja yang dijelaskan dalam video adalah: menyusun halaman dan elemen sesuai fungsinya, menerapkan tampilan dengan CSS, lalu menghubungkan data dan interaksi menggunakan JavaScript. Pendekatan ini memudahkan pemisahan tanggung jawab antarfail dan menjaga alur antarmuka tetap mengikuti kebutuhan pengguna. Video juga menerangkan batas prototipe: data transaksi dan akun demo berjalan lokal di browser, bukan melalui server atau database.

Video final berdurasi sekitar **6 menit 2 detik**, sehingga masih di bawah batas maksimal 15 menit pada petunjuk tugas. Suara penjelasan berupa voice-over TTS hasil clone suara yang disiapkan untuk proyek ini. Subtitle tersedia sebagai berkas SRT terpisah dan opsional; video final tidak menanam subtitle ke dalam gambar. Thumbnail juga disediakan untuk unggahan video.

File hasil video berada di folder `../video-review-buku-kita/`:

- `Buku-Kita-Review.mp4` — video review final tanpa subtitle tertanam.
- `Subtitle-Buku-Kita.srt` — subtitle eksternal opsional yang waktunya disesuaikan dengan jeda voice-over.
- `Voiceover-Buku-Kita.mp3` — berkas suara voice-over.
- `Thumbnail-Buku-Kita.png` — thumbnail video.
- `Preview-*.png` — beberapa gambar pratinjau bagian video.

Naskah voice-over dan arahan visual ada di `../../NASKAH_REVIEW_BUKU_KITA_TTS.md`. Naskah tersebut merinci urutan pembahasan, teks narasi, dan bagian layar atau source code yang ditampilkan.

## Kesesuaian dengan kriteria penilaian

| Kriteria pada petunjuk tugas                                    | Bagian proyek dan video yang menjelaskannya                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Struktur HTML semantik, valid, dan lengkap                      | Elemen semantik dan struktur halaman dijelaskan pada bagian penjelasan tiap HTML. Video membahas struktur semantik dan pentingnya memeriksa dokumen dengan Nu Html Checker. Status validitas perlu merujuk pada hasil checker aktual; dokumen ini tidak menyatakan semua halaman valid tanpa bukti pemeriksaan. |
| Desain CSS                                                      | `css/style.css` menjelaskan tema visual gelap, komponen antarmuka, dan tata letak responsif; video menampilkan halaman lebar dan menu pada layar ponsel.                                                                                                                                                        |
| JavaScript DOM dan manipulasi data                              | `js/script.js` membaca `js/data.js`, merender katalog, memperbarui ringkasan dashboard, mengelola keranjang, dan menampilkan tracking. Video menunjukkan contoh fungsi dan perubahan tampilan dari data.                                                                                                        |
| Validasi form dan feedback saat error                           | Validasi login, pendaftaran, pencarian tracking, checkout, serta toast dijelaskan pada bagian HTML/JavaScript terkait dan didemonstrasikan dalam video.                                                                                                                                                         |
| Modularitas file dan struktur file                              | Struktur folder dan tanggung jawab setiap HTML, CSS, JavaScript, data, serta gambar dijelaskan di atas; video juga menunjukkan susunan file proyek.                                                                                                                                                             |
| Kreativitas tambahan: tema, fitur, dan UI                       | Tema gelap, ilustrasi sampul di halaman login, menu responsif, toggle password, toast, ringkasan dinamis, penanda stok rendah, dialog laporan/histori, dan progres tracking.                                                                                                                                    |
| Penjelasan sistematika, alur pikir, dan argumentasi dalam video | Video menjelaskan alasan mengurutkan pekerjaan dari struktur, tampilan, hingga interaksi, lalu meninjau fitur melalui alur pengguna. Naskah lengkap dan arahan visual tersedia dalam berkas naskah video.                                                                                                       |

**Catatan pemeriksaan HTML:** tampilan yang berjalan tidak otomatis membuktikan HTML valid. Jalankan kelima halaman melalui Nu Html Checker dan simpan atau tampilkan hasilnya saat video jika dosen meminta bukti validitas. Jika ada error, perbaiki lalu periksa ulang sebelum menyebut halaman valid.

Tanggung jawab fitur JavaScript lainnya:

- memvalidasi login demo, mengganti visibilitas password, dan menangani dialog;
- membuka/menutup modal dengan tombol, klik backdrop, atau tombol Escape;
- merender kartu katalog dan melakukan pencarian;
- mengelola kuantitas keranjang serta menghitung subtotal dan total melalui `tampilkanKeranjang()` dan `ubahJumlahPesanan()`;
- menerima form checkout melalui `ikatFormCheckout()` dan menyimpan pesanan demo;
- mencari nomor DO dan menampilkan detail melalui `cariPesanan()` dan `tampilkanTracking()`;
- menghitung statistik dashboard, laporan, dan histori transaksi;
- menampilkan notifikasi status menggunakan elemen DOM.

Fungsi `safeRead` dan `safeWrite` menangani akses `localStorage`; `escapeHTML` mengamankan nilai teks yang ditampilkan kembali ke markup. Kode dibungkus dalam fungsi mandiri agar variabel bantu tidak memenuhi global scope.

## Pemetaan kebutuhan soal

| Kebutuhan                               | Implementasi                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| Lima halaman utama                      | `index.html`, `dashboard.html`, `stok.html`, `checkout.html`, `tracking.html` |
| Struktur HTML semantik                  | `main`, `nav`, `header`, `section`, `form`, `label`, tabel untuk histori      |
| CSS eksternal                           | `css/style.css`                                                               |
| Data dummy Array JSON                   | `dataKatalogBuku` dan `dataTracking` dalam `js/data.js`                       |
| Login, validasi, modal                  | Form login serta modal lupa password/daftar                                   |
| Sapaan waktu lokal                      | `siapkanDashboard()` membaca jam lokal browser                                |
| Render katalog dan tambah stok          | `tampilkanKatalog()` dan form `formTambahBuku`                                |
| Pemesanan serta data pemesan            | `checkout.html` dan `ikatFormCheckout()`                                      |
| Tracking delivery order                 | `tracking.html`, `dataTracking`, `cariPesanan()`, dan `tampilkanTracking()`   |
| Laporan dan histori pada menu dashboard | Modal laporan stok dan transaksi lokal                                        |

## Batasan prototipe

Proyek ini sengaja hanya sisi front-end. Login mencocokkan akun contoh di file JavaScript sehingga bukan autentikasi aman. Pendaftaran dan pemulihan password hanya memberi notifikasi, pesanan tidak memproses pembayaran atau menghubungi ekspedisi. Penyimpanan lokal hanya berlaku di browser/perangkat yang sama. Untuk demo tugas, fungsi UI dan manipulasi DOM bisa diperlihatkan tanpa backend.
