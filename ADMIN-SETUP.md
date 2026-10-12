# Mengaktifkan panel admin Dahola di Netlify

Panel admin berada di `/admin/`. Setelah aktif, editor dapat memperbarui menu dan konten halaman utama tanpa mengedit HTML. Perubahan disimpan sebagai commit ke repository website, lalu Netlify menerbitkan website yang diperbarui.

## Persiapan satu kali

1. Simpan folder website ini ke repository **GitHub.com atau GitLab.com**. Git Gateway yang dikonfigurasi di panel ini tidak mendukung repository Bitbucket.
2. Hubungkan repository tersebut ke Netlify dan pastikan Netlify menerbitkan branch `main`. Jika branch utama bernama lain, ubah `backend.branch` di `admin/config.yml` agar sesuai.
3. Di pengaturan situs Netlify, aktifkan **Identity**.
4. Di **Identity > Registration**, pilih **Invite only** agar pengunjung umum tidak dapat membuat akun admin.
5. Di **Identity > Services**, aktifkan **Git Gateway** dan izinkan repository website yang terhubung.
6. Di **Identity > Invite users**, undang alamat email editor yang dipercaya.
7. Pastikan deployment terbaru sukses, lalu buka tautan undangan dari email. Halaman utama memuat widget Netlify Identity untuk memproses token undangan; ikuti dialog yang muncul untuk membuat password dan mengonfirmasi akun.
8. Setelah undangan diterima, buka `https://alamat-situs-anda/admin/` dan masuk menggunakan akun tersebut.

## Mengedit konten

Pilih **Konten Website > Halaman Utama**, ubah bagian yang diperlukan, lalu simpan sebagai draft atau publikasikan. Menu, teks, tautan, harga, informasi produk, FAQ, serta daftar gambar halaman utama dikelola dari editor tersebut.

Unggah gambar baru ke `assets/uploads` melalui repository bila perlu, lalu masukkan path gambar itu pada kolom gambar. Untuk tautan menu, gunakan anchor section yang tersedia seperti `#fitur`, `#harga`, `#segmen`, atau `#faq`.

## Catatan akses dan penerbitan

- Jangan aktifkan pendaftaran terbuka. Gunakan undangan hanya untuk editor yang berwenang.
- Login dan penyimpanan perubahan memerlukan domain Netlify dengan Identity dan Git Gateway yang sudah aktif; panel tidak berfungsi penuh jika dibuka sebagai file lokal.
- Mode editorial menyediakan draft dan alur publikasi. Jika perubahan harus langsung masuk ke situs tanpa review, hapus `publish_mode: editorial_workflow` dari `admin/config.yml`.
