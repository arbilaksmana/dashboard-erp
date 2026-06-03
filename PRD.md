\# \*\*PRODUCT REQUIREMENT DOCUMENT (PRD)\*\*



\## \*\*Sistem ERP Usulan Tim PT. Catur Reka Pilarindo\*\*



\## \*\*1. Ringkasan Produk\*\*



Sistem ERP Usulan Tim adalah aplikasi web yang dirancang untuk membantu PT. Catur Reka Pilarindo dalam mengelola proses pencatatan keuangan dan operasional perusahaan secara lebih terstruktur. Sistem ini dibuat untuk menggantikan pencatatan manual yang sebelumnya dilakukan menggunakan Microsoft Excel, sehingga proses input transaksi, pengelompokan akun, pengelolaan kas, penjualan, pembelian, persediaan, produksi, pajak, laporan, dan hak akses pengguna dapat dilakukan dalam satu sistem yang saling terhubung.



Sistem ini tidak dibuat sebagai duplikasi aplikasi ERP tertentu, melainkan sebagai rancangan ERP sederhana berbasis kebutuhan perusahaan. Fokus utama sistem adalah mendukung pencatatan transaksi harian, pengolahan data keuangan, monitoring stok, pengelolaan produksi, dan penyusunan laporan keuangan secara lebih cepat dan rapi.



\---



\## \*\*2. Tujuan Produk\*\*



Tujuan utama pembuatan sistem ERP ini adalah untuk membantu perusahaan mengurangi risiko kesalahan pencatatan yang sering terjadi pada sistem manual. Dengan adanya sistem berbasis web, perusahaan dapat mencatat transaksi secara lebih konsisten, memantau saldo kas dan bank, mengelola piutang dan hutang, mengetahui kondisi persediaan, mencatat proses produksi, serta menghasilkan laporan yang lebih mudah dibaca.



Selain itu, sistem ini juga bertujuan untuk mendukung kebutuhan demo tugas besar. Oleh karena itu, sistem perlu memiliki tampilan yang jelas, modul yang terpisah, alur penggunaan yang mudah dipahami, dan data contoh yang sesuai dengan aktivitas perusahaan.



\---



\## \*\*3. Latar Belakang Masalah\*\*



PT. Catur Reka Pilarindo masih menggunakan sistem pencatatan manual dengan bantuan Microsoft Excel. Kondisi ini menyebabkan beberapa kendala, seperti risiko salah input data, salah memilih akun, data transaksi tersebar dalam beberapa file, proses pencarian data membutuhkan waktu, serta penyusunan laporan keuangan harus dilakukan secara manual.



Selain itu, perusahaan memiliki beberapa jenis transaksi yang cukup beragam, seperti transaksi kas, bank, penjualan, piutang, pembelian, hutang, persediaan, produksi, dan pajak. Jika seluruh data tersebut tidak terhubung dalam satu sistem, proses pengecekan dan penyusunan laporan dapat menjadi kurang efisien.



Oleh karena itu, sistem ERP usulan tim dirancang agar setiap modul dapat saling terhubung. Data yang dimasukkan pada satu modul dapat mendukung proses pada modul lain, sehingga pencatatan menjadi lebih rapi dan mudah ditelusuri.



\---



\## \*\*4. Target Pengguna\*\*



Target pengguna sistem ini terdiri dari beberapa peran utama.



\*\*Admin Sistem\*\* bertugas mengelola akun pengguna, menentukan hak akses, dan memastikan sistem dapat digunakan oleh setiap bagian sesuai tanggung jawabnya.



\*\*Staf Keuangan\*\* bertugas mencatat transaksi jurnal umum, kas dan bank, penjualan, pembelian, pajak, serta menyusun laporan keuangan.



\*\*Staf Gudang atau Produksi\*\* bertugas mengelola data persediaan, barang masuk, barang keluar, bahan baku, dan proses produksi.



\*\*Manajemen\*\* bertugas melihat laporan, dashboard, ringkasan keuangan, kondisi piutang, hutang, persediaan, dan hasil operasional perusahaan.



\---



\## \*\*5. Ruang Lingkup Sistem\*\*



Sistem ERP yang dibuat mencakup 9 modul utama, yaitu:



1\. Modul Akuntansi dan Keuangan

2\. Modul Kas dan Bank

3\. Modul Penjualan dan Piutang

4\. Modul Pembelian dan Hutang

5\. Modul Persediaan

6\. Modul Produksi

7\. Modul Pajak

8\. Modul Laporan dan Dashboard

9\. Modul Hak Akses Pengguna



Setiap modul memiliki fungsi utama masing-masing, tetapi tetap saling terhubung dengan modul lain. Misalnya, transaksi penjualan akan memengaruhi piutang dan laporan keuangan, transaksi pembelian dapat memengaruhi hutang dan persediaan, sedangkan proses produksi dapat memengaruhi penggunaan bahan dan hasil barang jadi.



\---



\# \*\*6. Detail Kebutuhan Fungsional\*\*



\## \*\*6.1 Modul Akuntansi dan Keuangan\*\*



Modul Akuntansi dan Keuangan menjadi pusat pencatatan transaksi perusahaan. Modul ini digunakan untuk mencatat jurnal umum, melihat Chart of Account, melakukan posting ke buku besar, menyusun trial balance, membuat jurnal penyesuaian, serta menghasilkan laporan keuangan.



Fitur yang perlu tersedia dalam modul ini adalah input jurnal umum, daftar jurnal umum, daftar akun atau Chart of Account, buku besar per akun, trial balance, jurnal penyesuaian, laporan laba rugi, laporan perubahan modal, dan neraca.



Pada halaman utama modul ini, sistem perlu menampilkan ringkasan total transaksi, total debit, total kredit, dan status keseimbangan data. Jika total debit dan kredit tidak sama, sistem perlu menampilkan informasi bahwa data belum seimbang.



\*\*Kriteria keberhasilan:\*\* pengguna dapat memasukkan transaksi debit dan kredit, sistem menyimpan transaksi ke jurnal umum, sistem menampilkan saldo akun pada buku besar, dan trial balance dapat menunjukkan total debit serta kredit secara seimbang.



\---



\## \*\*6.2 Modul Kas dan Bank\*\*



Modul Kas dan Bank digunakan untuk mencatat seluruh transaksi yang berhubungan dengan penerimaan dan pengeluaran kas maupun bank. Modul ini membantu perusahaan mengetahui saldo kas, saldo bank, mutasi transaksi, dan hasil rekonsiliasi.



Fitur yang perlu tersedia adalah input kas masuk, input kas keluar, transfer kas ke bank atau bank ke kas, daftar mutasi kas dan bank, rekonsiliasi bank, riwayat transaksi, serta filter transaksi berdasarkan periode.



Pada halaman utama modul ini, sistem perlu menampilkan saldo kas, saldo bank, total penerimaan, total pengeluaran, dan grafik arus kas masuk serta keluar.



\*\*Kriteria keberhasilan:\*\* pengguna dapat mencatat transaksi kas atau bank, sistem memperbarui saldo secara otomatis, daftar mutasi dapat ditampilkan, dan data dapat difilter berdasarkan periode tertentu.



\---



\## \*\*6.3 Modul Penjualan dan Piutang\*\*



Modul Penjualan dan Piutang digunakan untuk mencatat transaksi penjualan dan memantau pembayaran pelanggan. Modul ini penting karena transaksi penjualan dapat menghasilkan piutang apabila pelanggan belum melakukan pembayaran secara penuh.



Fitur yang perlu tersedia adalah input penjualan baru, pembuatan invoice, daftar pelanggan, pencatatan pembayaran pelanggan, daftar invoice, daftar piutang, status pembayaran, aging piutang, dan laporan penjualan.



Pada halaman utama modul ini, sistem perlu menampilkan total penjualan, piutang berjalan, invoice lunas, invoice jatuh tempo, grafik penjualan bulanan, dan ringkasan umur piutang.



\*\*Kriteria keberhasilan:\*\* pengguna dapat membuat invoice penjualan, sistem dapat mencatat status pembayaran, piutang otomatis muncul jika transaksi belum lunas, dan status invoice dapat berubah ketika pembayaran dicatat.



\---



\## \*\*6.4 Modul Pembelian dan Hutang\*\*



Modul Pembelian dan Hutang digunakan untuk mencatat transaksi pembelian perusahaan serta memantau hutang kepada pemasok. Modul ini mendukung pencatatan pembelian bahan, perlengkapan, kebutuhan produksi, dan kebutuhan operasional lainnya.



Fitur yang perlu tersedia adalah input pembelian, daftar purchase order, invoice pembelian, daftar pemasok, daftar hutang, pembayaran hutang, status pembayaran, dan laporan pembelian.



Pada halaman utama modul ini, sistem perlu menampilkan total pembelian, hutang usaha, pembayaran hutang, tagihan jatuh tempo, daftar pemasok, dan grafik hutang berdasarkan jatuh tempo.



\*\*Kriteria keberhasilan:\*\* pengguna dapat mencatat pembelian, sistem dapat membedakan pembelian tunai dan kredit, hutang otomatis muncul jika pembelian belum dibayar, dan status hutang berubah setelah pembayaran dicatat.



\---



\## \*\*6.5 Modul Persediaan\*\*



Modul Persediaan digunakan untuk mencatat barang masuk, barang keluar, jumlah stok, nilai persediaan, dan status stok. Modul ini penting karena perusahaan bergerak di bidang manufaktur sehingga membutuhkan pengelolaan bahan dan produk yang rapi.



Fitur yang perlu tersedia adalah daftar barang, kartu stok, input barang masuk, input barang keluar, penyesuaian stok, stok minimum, peringatan stok rendah, nilai persediaan, dan laporan persediaan.



Pada halaman utama modul ini, sistem perlu menampilkan total item, stok tersedia, stok minimum, nilai persediaan, daftar persediaan, peringatan stok rendah, pergerakan stok, dan persediaan per kategori.



\*\*Kriteria keberhasilan:\*\* pengguna dapat mencatat barang masuk dan keluar, sistem memperbarui stok secara otomatis, sistem menampilkan peringatan jika stok berada di bawah batas minimum, dan laporan persediaan dapat ditampilkan.



\---



\## \*\*6.6 Modul Produksi\*\*



Modul Produksi digunakan untuk mencatat kegiatan produksi perusahaan. Modul ini menghubungkan bahan baku, proses produksi, hasil produksi, dan biaya produksi.



Fitur yang perlu tersedia adalah input perintah produksi, daftar work order, data bahan baku yang digunakan, status proses produksi, hasil produksi, progress produksi, Bill of Material sederhana, dan laporan biaya produksi.



Pada halaman utama modul ini, sistem perlu menampilkan jumlah order produksi, order dalam proses, order selesai, biaya produksi, daftar perintah produksi, penggunaan bahan, dan progress produksi.



\*\*Kriteria keberhasilan:\*\* pengguna dapat membuat perintah produksi, sistem mencatat bahan yang digunakan, status produksi dapat diperbarui, hasil produksi dapat menambah stok barang jadi, dan biaya produksi dapat direkap.



\---



\## \*\*6.7 Modul Pajak\*\*



Modul Pajak digunakan untuk mencatat dan memantau kewajiban perpajakan perusahaan. Modul ini mencakup PPN, PPh 21, PPh 22/23, PPh Final, dan pajak atas bank.



Fitur yang perlu tersedia adalah daftar transaksi pajak, rekap PPN, rekap PPh, pembayaran pajak, status pembayaran pajak, filter masa pajak, dan laporan pajak.



Pada halaman utama modul ini, sistem perlu menampilkan total kewajiban pajak, jumlah PPN, jumlah PPh, pajak yang sudah dibayar, rekap pajak per jenis, dan status pembayaran pajak.



\*\*Kriteria keberhasilan:\*\* pengguna dapat mencatat transaksi pajak, sistem dapat mengelompokkan pajak berdasarkan jenisnya, status pajak dapat diperbarui menjadi dibayar atau belum dibayar, dan laporan pajak dapat ditampilkan per periode.



\---



\## \*\*6.8 Modul Laporan dan Dashboard\*\*



Modul Laporan dan Dashboard digunakan untuk menampilkan ringkasan informasi dari seluruh modul ERP. Modul ini menjadi halaman yang membantu manajemen membaca kondisi perusahaan secara cepat.



Fitur yang perlu tersedia adalah dashboard ringkasan, laporan laba rugi, laporan neraca, laporan arus kas, laporan penjualan, laporan pembelian, laporan persediaan, laporan pajak, filter periode, dan fitur unduh laporan.



Pada halaman utama modul ini, sistem perlu menampilkan ringkasan kas dan bank, penjualan, pembelian, persediaan, laba rugi, tren penjualan, komposisi biaya, status piutang dan hutang, serta laporan terakhir.



\*\*Kriteria keberhasilan:\*\* pengguna dapat memilih periode laporan, memilih jenis laporan, melihat ringkasan data, dan mengunduh laporan dalam format PDF atau Excel.



\---



\## \*\*6.9 Modul Hak Akses Pengguna\*\*



Modul Hak Akses Pengguna digunakan untuk mengatur akun pengguna, role, izin akses, dan aktivitas pengguna. Modul ini penting untuk menjaga keamanan data perusahaan.



Fitur yang perlu tersedia adalah daftar pengguna, tambah pengguna, edit pengguna, role pengguna, izin akses per modul, status akun aktif atau nonaktif, log aktivitas, dan audit trail.



Pada halaman utama modul ini, sistem perlu menampilkan total pengguna, role aktif, pengguna online, aktivitas hari ini, daftar pengguna, role permission, log aktivitas, dan akses cepat pengelolaan pengguna.



\*\*Kriteria keberhasilan:\*\* admin dapat membuat akun pengguna, menentukan role, mengatur akses per modul, menonaktifkan akun, dan melihat riwayat aktivitas pengguna.



\---



\# \*\*7. Kebutuhan Non-Fungsional\*\*



Sistem harus mudah digunakan oleh pengguna yang sebelumnya terbiasa menggunakan Excel. Tampilan sistem perlu sederhana, jelas, dan tidak terlalu banyak elemen yang membingungkan. Setiap halaman harus memiliki menu yang konsisten, tombol aksi yang jelas, dan informasi yang mudah dibaca.



Sistem juga harus responsif untuk digunakan pada laptop atau komputer desktop. Untuk kebutuhan demo, prioritas utama adalah tampilan web desktop dengan rasio yang rapi dan mudah dipresentasikan.



Dari sisi keamanan, sistem harus memiliki login, role pengguna, dan pembatasan akses per modul. Data keuangan tidak boleh dapat diubah oleh semua pengguna. Hanya pengguna dengan hak akses tertentu yang dapat menambah, mengedit, atau menghapus data.



Dari sisi performa, halaman dashboard dan tabel data harus dapat dimuat dengan cepat. Filter periode dan pencarian data harus berjalan dengan lancar agar pengguna dapat menemukan transaksi tertentu dengan mudah.



\---



\# \*\*8. Struktur Role dan Hak Akses\*\*



| Role          | Hak Akses Utama                                                                |

| ------------- | ------------------------------------------------------------------------------ |

| Admin         | Mengelola seluruh modul, pengguna, role, dan data sistem                       |

| Staf Keuangan | Mengelola akuntansi, kas bank, penjualan, pembelian, pajak, dan laporan        |

| Staf Gudang   | Mengelola persediaan dan data barang masuk/keluar                              |

| Staf Produksi | Mengelola perintah produksi, bahan baku, dan hasil produksi                    |

| Manajemen     | Melihat dashboard, laporan, ringkasan piutang, hutang, dan performa perusahaan |



\---



\# \*\*9. Alur Sistem Utama\*\*



Alur utama sistem dimulai dari pengguna melakukan login. Setelah berhasil masuk, sistem menampilkan dashboard sesuai hak akses pengguna. Jika pengguna adalah staf keuangan, maka menu yang dapat diakses meliputi akuntansi, kas dan bank, penjualan, pembelian, pajak, serta laporan. Jika pengguna adalah staf gudang atau produksi, maka sistem menampilkan menu persediaan dan produksi.



Setiap transaksi yang dimasukkan ke sistem akan tersimpan pada modul terkait. Transaksi tersebut kemudian dapat memengaruhi data pada modul lain. Contohnya, transaksi penjualan kredit akan masuk ke modul Penjualan dan Piutang, lalu datanya juga dapat digunakan pada laporan keuangan. Transaksi pembelian kredit akan masuk ke modul Pembelian dan Hutang, sementara pembelian barang dapat menambah data persediaan.



Pada akhir periode, pengguna dapat membuka modul Laporan dan Dashboard untuk melihat rekap data dan menyusun laporan perusahaan.



\---



\# \*\*10. Struktur Menu Aplikasi\*\*



Menu utama aplikasi terdiri dari:



| Menu                 | Isi Halaman                                                                  |

| -------------------- | ---------------------------------------------------------------------------- |

| Dashboard            | Ringkasan seluruh kondisi perusahaan                                         |

| Akuntansi \& Keuangan | Jurnal umum, buku besar, trial balance, jurnal penyesuaian, laporan keuangan |

| Kas \& Bank           | Kas masuk, kas keluar, mutasi bank, rekonsiliasi                             |

| Penjualan \& Piutang  | Invoice, pelanggan, pembayaran, piutang                                      |

| Pembelian \& Hutang   | Purchase order, pemasok, invoice pembelian, hutang                           |

| Persediaan           | Data barang, kartu stok, barang masuk, barang keluar                         |

| Produksi             | Perintah produksi, bahan baku, work order, hasil produksi                    |

| Pajak                | Daftar pajak, rekap PPN, rekap PPh, pembayaran pajak                         |

| Laporan              | Dashboard laporan, unduh laporan, laporan terakhir                           |

| Hak Akses            | Pengguna, role, permission, audit trail                                      |



\---



\# \*\*11. Kebutuhan Data Utama\*\*



Sistem membutuhkan beberapa data utama agar dapat berjalan.



Data akun atau Chart of Account digunakan untuk pencatatan akuntansi. Data pengguna digunakan untuk login dan pengaturan hak akses. Data pelanggan digunakan dalam transaksi penjualan dan piutang. Data pemasok digunakan dalam transaksi pembelian dan hutang. Data barang digunakan dalam modul persediaan dan produksi. Data transaksi digunakan untuk jurnal umum, kas bank, penjualan, pembelian, pajak, serta laporan.



\---



\# \*\*12. Entity atau Tabel Database yang Disarankan\*\*



| Entity                 | Fungsi                            |

| ---------------------- | --------------------------------- |

| users                  | Menyimpan data pengguna           |

| roles                  | Menyimpan jenis role pengguna     |

| permissions            | Menyimpan izin akses per modul    |

| accounts               | Menyimpan Chart of Account        |

| journal\_entries        | Menyimpan transaksi jurnal        |

| journal\_details        | Menyimpan detail debit dan kredit |

| cash\_bank\_transactions | Menyimpan transaksi kas dan bank  |

| customers              | Menyimpan data pelanggan          |

| sales\_invoices         | Menyimpan invoice penjualan       |

| sales\_payments         | Menyimpan pembayaran pelanggan    |

| suppliers              | Menyimpan data pemasok            |

| purchase\_invoices      | Menyimpan invoice pembelian       |

| purchase\_payments      | Menyimpan pembayaran hutang       |

| items                  | Menyimpan data barang             |

| inventory\_transactions | Menyimpan barang masuk dan keluar |

| production\_orders      | Menyimpan perintah produksi       |

| production\_materials   | Menyimpan bahan yang digunakan    |

| tax\_transactions       | Menyimpan transaksi pajak         |

| reports                | Menyimpan riwayat laporan         |

| activity\_logs          | Menyimpan aktivitas pengguna      |



\---



\# \*\*13. Teknologi yang Disarankan\*\*



Untuk kebutuhan tugas besar dan demo, sistem dapat dibuat menggunakan teknologi yang ringan dan mudah dikembangkan.



Frontend dapat menggunakan \*\*React.js\*\* atau \*\*Next.js\*\* agar tampilan web lebih modern dan modular. Styling dapat menggunakan \*\*Tailwind CSS\*\* supaya tampilan dashboard lebih cepat dibuat dan konsisten. Backend dapat menggunakan \*\*Node.js Express\*\*, \*\*Laravel\*\*, atau \*\*FastAPI\*\*, tergantung kemampuan tim. Database dapat menggunakan \*\*MySQL\*\* atau \*\*PostgreSQL\*\* karena cocok untuk data transaksi.



Untuk demo awal, sistem juga bisa dibuat dalam bentuk frontend prototype terlebih dahulu dengan data dummy. Setelah tampilan dan alur sudah siap, barulah fungsi backend dan database ditambahkan secara bertahap.



\---



\# \*\*14. Prioritas Pengembangan\*\*



Prioritas pertama adalah membuat tampilan utama dan navigasi antar modul. Ini penting agar sistem dapat langsung digunakan untuk demo. Setelah itu, tim dapat membuat input data sederhana untuk modul Akuntansi, Kas dan Bank, Penjualan, Pembelian, dan Persediaan.



Prioritas kedua adalah membuat modul Produksi, Pajak, Laporan, dan Hak Akses. Modul ini dapat dibuat setelah alur transaksi utama sudah berjalan.



Prioritas ketiga adalah integrasi data antar modul, seperti penjualan yang memengaruhi piutang, pembelian yang memengaruhi hutang, barang masuk yang memengaruhi persediaan, dan laporan yang mengambil data dari beberapa modul.



\---



\# \*\*15. MVP Sistem\*\*



Versi MVP atau Minimum Viable Product dari sistem ini harus memiliki fitur berikut:



1\. Login pengguna

2\. Sidebar navigasi antar modul

3\. Dashboard utama

4\. Input jurnal umum

5\. Input transaksi kas dan bank

6\. Input penjualan dan pembayaran pelanggan

7\. Input pembelian dan pembayaran hutang

8\. Input barang masuk dan barang keluar

9\. Input perintah produksi sederhana

10\. Daftar transaksi pajak

11\. Halaman laporan dan dashboard

12\. Pengaturan hak akses pengguna sederhana



Untuk kebutuhan demo, MVP tidak harus langsung menghitung seluruh laporan secara kompleks. Namun, tampilan alur data dan contoh output harus terlihat jelas.



\---



\# \*\*16. User Story\*\*



| Role          | User Story                                                                            |

| ------------- | ------------------------------------------------------------------------------------- |

| Staf Keuangan | Saya ingin mencatat jurnal umum agar transaksi perusahaan tersimpan rapi              |

| Staf Keuangan | Saya ingin melihat trial balance agar dapat memastikan debit dan kredit seimbang      |

| Staf Keuangan | Saya ingin mencatat kas masuk dan kas keluar agar saldo kas dapat dipantau            |

| Staf Keuangan | Saya ingin mencatat invoice penjualan agar piutang pelanggan dapat dipantau           |

| Staf Keuangan | Saya ingin mencatat pembelian agar hutang perusahaan dapat diketahui                  |

| Staf Gudang   | Saya ingin mencatat barang masuk dan keluar agar stok selalu diperbarui               |

| Staf Produksi | Saya ingin mencatat perintah produksi agar proses produksi dapat dipantau             |

| Manajemen     | Saya ingin melihat dashboard agar kondisi perusahaan dapat diketahui secara cepat     |

| Admin         | Saya ingin mengatur hak akses agar pengguna hanya dapat membuka modul sesuai tugasnya |



\---



\# \*\*17. Acceptance Criteria\*\*



Sistem dianggap berhasil apabila pengguna dapat login sesuai role, membuka menu sesuai hak akses, memasukkan data transaksi pada setiap modul, melihat data yang sudah disimpan dalam bentuk tabel, melakukan pencarian dan filter data, serta melihat ringkasan data pada dashboard.



Selain itu, sistem juga dianggap berhasil jika tampilan mockup atau prototype dapat menjelaskan alur kerja ERP secara jelas pada saat demo. Setiap modul harus memiliki halaman yang berbeda, nama modul yang jelas, data contoh yang relevan, dan tombol aksi yang mudah dipahami.



\---



\# \*\*18. Batasan Sistem\*\*



Sistem yang dibuat untuk kebutuhan tugas besar ini berfokus pada rancangan dan demo konsep ERP. Oleh karena itu, beberapa fitur lanjutan seperti integrasi bank otomatis, pelaporan pajak resmi, approval bertingkat, audit lengkap, dan integrasi dengan sistem eksternal belum menjadi prioritas utama.



Pada tahap awal, sistem dapat menggunakan data dummy atau data contoh agar alur demo dapat berjalan. Perhitungan laporan dapat dibuat sederhana terlebih dahulu, lalu dikembangkan lebih lanjut jika sistem ingin digunakan secara nyata.



\---



\# \*\*19. Risiko Pengembangan\*\*



Risiko utama dalam pengembangan sistem adalah ruang lingkup yang terlalu besar karena ERP memiliki banyak modul. Untuk menghindari hal tersebut, tim perlu fokus pada fitur utama yang dibutuhkan untuk demo. Jangan semua fitur dibuat terlalu kompleks dari awal, karena nanti development bisa jadi “kerja rodi digital”.



Risiko lainnya adalah data antar modul belum saling terhubung dengan baik. Oleh karena itu, tim perlu menentukan struktur database sejak awal agar alur penjualan, pembelian, kas, persediaan, dan laporan dapat dirancang secara konsisten.



\---



\# \*\*20. Kesimpulan PRD\*\*



Sistem ERP Usulan Tim PT. Catur Reka Pilarindo dirancang sebagai aplikasi web yang membantu perusahaan mengelola pencatatan keuangan dan operasional secara lebih terintegrasi. Sistem ini terdiri dari 9 modul utama yang saling mendukung, yaitu Akuntansi dan Keuangan, Kas dan Bank, Penjualan dan Piutang, Pembelian dan Hutang, Persediaan, Produksi, Pajak, Laporan dan Dashboard, serta Hak Akses Pengguna.



Dengan adanya sistem ini, perusahaan diharapkan dapat mengurangi pencatatan manual, mempercepat proses rekap data, meningkatkan ketepatan pencatatan, dan memudahkan penyusunan laporan. Untuk kebutuhan tugas besar, PRD ini dapat digunakan sebagai dasar pembuatan mockup, prototype web, dan demo sistem ERP usulan tim.

