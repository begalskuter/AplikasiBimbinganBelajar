-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 23, 2026 at 09:30 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `synau_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_id` bigint(20) UNSIGNED NOT NULL,
  `guru_id` bigint(20) UNSIGNED NOT NULL,
  `paket` enum('mingguan','bulanan') NOT NULL,
  `hari_dipilih` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`hari_dipilih`)),
  `waktu_mulai` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`waktu_mulai`)),
  `tanggal_mulai` date NOT NULL,
  `catatan` text DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `total_harga` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gurus`
--

CREATE TABLE `gurus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `bio` text DEFAULT NULL,
  `mata_pelajaran` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`mata_pelajaran`)),
  `jadwal` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`jadwal`)),
  `slot_jam` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`slot_jam`)),
  `harga_mingguan` int(11) NOT NULL DEFAULT 0,
  `harga_bulanan` int(11) NOT NULL DEFAULT 0,
  `menit_per_sesi` int(11) NOT NULL DEFAULT 90,
  `rating` decimal(3,1) NOT NULL DEFAULT 0.0,
  `total_siswa` int(11) NOT NULL DEFAULT 0,
  `terverifikasi` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `cv_path` varchar(255) DEFAULT NULL,
  `ktp_path` varchar(255) DEFAULT NULL,
  `ijazah_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gurus`
--

INSERT INTO `gurus` (`id`, `user_id`, `bio`, `mata_pelajaran`, `jadwal`, `slot_jam`, `harga_mingguan`, `harga_bulanan`, `menit_per_sesi`, `rating`, `total_siswa`, `terverifikasi`, `created_at`, `updated_at`, `cv_path`, `ktp_path`, `ijazah_path`) VALUES
(1, 2, 'Guru matematika berpengalaman 5 tahun di tingkat SMP dan SMA.', '[\"Matematika SMP\",\"Matematika SMA\",\"Aljabar\"]', '[\"Senin\",\"Rabu\",\"Jumat\",\"Sabtu\"]', '[\"08:00\",\"10:15\",\"12:30\",\"14:45\",\"17:00\"]', 150000, 500000, 90, 4.9, 126, 1, '2026-05-22 23:13:38', '2026-05-22 23:13:38', NULL, NULL, NULL),
(2, 3, 'Lulusan UGM, spesialisasi fisika SMA dan persiapan UTBK.', '[\"Fisika SMA\",\"Fisika Dasar\",\"Mekanika\"]', '[\"Selasa\",\"Kamis\",\"Sabtu\"]', '[\"08:00\",\"10:15\",\"12:30\",\"14:45\",\"17:00\"]', 140000, 480000, 90, 4.8, 46, 1, '2026-05-22 23:13:38', '2026-05-22 23:13:38', NULL, NULL, NULL),
(3, 4, 'Native-like English speaker, pengalaman 4 tahun mengajar semua level.', '[\"Bahasa Inggris\",\"TOEFL Prep\",\"English Conversation\"]', '[\"Senin\",\"Rabu\",\"Jumat\"]', '[\"08:00\",\"10:15\",\"12:30\",\"14:45\",\"17:00\"]', 130000, 450000, 90, 4.8, 116, 1, '2026-05-22 23:13:39', '2026-05-22 23:13:39', NULL, NULL, NULL),
(4, 5, 'Guru IPA dan Biologi yang sabar untuk semua tingkatan.', '[\"IPA SD\",\"Biologi SMP\",\"Biologi SMA\"]', '[\"Selasa\",\"Kamis\",\"Sabtu\",\"Minggu\"]', '[\"08:00\",\"10:15\",\"12:30\",\"14:45\",\"17:00\"]', 120000, 400000, 90, 4.7, 68, 1, '2026-05-22 23:13:39', '2026-05-22 23:13:39', NULL, NULL, NULL),
(5, 6, 'Master matematika UGM, spesialisasi kalkulus dan statistika.', '[\"Matematika SMA\",\"Kalkulus\",\"Statistika\"]', '[\"Senin\",\"Rabu\",\"Sabtu\"]', '[\"08:00\",\"10:15\",\"12:30\",\"14:45\",\"17:00\"]', 140000, 470000, 90, 4.7, 97, 1, '2026-05-22 23:13:39', '2026-05-22 23:13:39', NULL, NULL, NULL),
(6, 7, 'Pengajar kimia aktif dengan pendekatan eksperimen sederhana.', '[\"Kimia SMA\",\"Kimia Dasar\",\"Kimia Organik\"]', '[\"Selasa\",\"Jumat\",\"Minggu\"]', '[\"08:00\",\"10:15\",\"12:30\",\"14:45\",\"17:00\"]', 130000, 440000, 90, 4.6, 41, 1, '2026-05-22 23:13:40', '2026-05-22 23:13:40', NULL, NULL, NULL),
(7, 8, 'Fisika jadi mudah dengan analogi kehidupan sehari-hari.', '[\"Fisika SMP\",\"Fisika SMA\"]', '[\"Senin\",\"Kamis\",\"Sabtu\"]', '[\"08:00\",\"10:15\",\"12:30\",\"14:45\",\"17:00\"]', 120000, 400000, 90, 4.6, 114, 1, '2026-05-22 23:13:40', '2026-05-22 23:13:40', NULL, NULL, NULL),
(8, 9, 'Pecinta sastra yang mengajarkan bahasa Indonesia dengan cara yang menyenangkan.', '[\"Bahasa Indonesia\",\"Menulis Kreatif\",\"Sastra\"]', '[\"Rabu\",\"Jumat\",\"Minggu\"]', '[\"08:00\",\"10:15\",\"12:30\",\"14:45\",\"17:00\"]', 110000, 380000, 90, 4.5, 125, 1, '2026-05-22 23:13:40', '2026-05-22 23:13:40', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_23_054850_create_personal_access_tokens_table', 1),
(5, '2026_05_23_055028_create_gurus_table', 2),
(6, '2026_05_23_055039_create_bookings_table', 2),
(7, '2026_05_23_055046_add_fields_to_users_table', 2),
(8, '2026_05_23_064745_add_dokumen_to_gurus_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 10, 'auth_token', '551a9dc64f3bcfa945263e2f58a8d4dcaff618e5763e1b6a0e98c804e855523a', '[\"*\"]', NULL, NULL, '2026-05-22 23:21:50', '2026-05-22 23:21:50'),
(2, 'App\\Models\\User', 10, 'auth_token', '9142e3039d4eca791679bc9a03447dd083a0973db16fc6a891bee1c7f7c4e570', '[\"*\"]', NULL, NULL, '2026-05-22 23:22:56', '2026-05-22 23:22:56'),
(4, 'App\\Models\\User', 11, 'auth_token', '76355f7c01ffd85e1ba8661f7b4a0c64f6331eb76a12ef558b74c81029c3970e', '[\"*\"]', '2026-05-23 00:28:36', NULL, '2026-05-23 00:28:34', '2026-05-23 00:28:36');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `nama_panggilan` varchar(255) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `no_hp` varchar(255) DEFAULT NULL,
  `alamat_lengkap` text DEFAULT NULL,
  `kelurahan` varchar(255) DEFAULT NULL,
  `kecamatan` varchar(255) DEFAULT NULL,
  `kota` varchar(255) DEFAULT NULL,
  `provinsi` varchar(255) DEFAULT NULL,
  `role` enum('siswa','guru','admin') NOT NULL DEFAULT 'siswa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `nama_panggilan`, `tanggal_lahir`, `no_hp`, `alamat_lengkap`, `kelurahan`, `kecamatan`, `kota`, `provinsi`, `role`) VALUES
(1, 'Test User', 'test@example.com', '2026-05-22 23:13:37', '$2y$12$IMHZZYTVq6Uqo01N87MzWudeWijYXLdhqnQ8/cKkC7HSmYfVb36RK', 'edphpgImxZ', '2026-05-22 23:13:38', '2026-05-22 23:13:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'siswa'),
(2, 'Wulandari', 'wulandari@synau.com', NULL, '$2y$12$aYpPNUXpYmXwY5KZq/KHAuanurWbHFvL7wLkCuMqnAyfJF85Is4BG', NULL, '2026-05-22 23:13:38', '2026-05-22 23:13:38', 'Wulandari', NULL, NULL, NULL, NULL, NULL, 'Yogyakarta', NULL, 'guru'),
(3, 'Andi Prasetyo', 'andi@synau.com', NULL, '$2y$12$8p5y0o4jwWMpPHKBwVeDSOkPv5l/sL0T6WKwC0vV3c3Kf/VjTX136', NULL, '2026-05-22 23:13:38', '2026-05-22 23:13:38', 'Andi', NULL, NULL, NULL, NULL, NULL, 'Yogyakarta', NULL, 'guru'),
(4, 'Sari Rahayu', 'sari@synau.com', NULL, '$2y$12$b..B3CITbv3rlMqeL9nsoeKC5.auFD/ryInoRF3VCpJbQ6Djqtmdi', NULL, '2026-05-22 23:13:39', '2026-05-22 23:13:39', 'Sari', NULL, NULL, NULL, NULL, NULL, 'Sleman', NULL, 'guru'),
(5, 'Dewi Hartini', 'dewi@synau.com', NULL, '$2y$12$Lk1yHDdpq6K3ZvKG9QuMN.R.srAXkRsQkHN0SRZd8BSnQsbD9Lm0e', NULL, '2026-05-22 23:13:39', '2026-05-22 23:13:39', 'Dewi', NULL, NULL, NULL, NULL, NULL, 'Bantul', NULL, 'guru'),
(6, 'Rudi Prasetyo', 'rudi@synau.com', NULL, '$2y$12$B7whiKHoj/CY.VFFN2.9g.7aerE1DBV2LxrIT9c7EQu3/EXLqET/u', NULL, '2026-05-22 23:13:39', '2026-05-22 23:13:39', 'Rudi', NULL, NULL, NULL, NULL, NULL, 'Yogyakarta', NULL, 'guru'),
(7, 'Nisa Aulia', 'nisa@synau.com', NULL, '$2y$12$dhpx4/X7vVEdJ0pUQ6q0u.4NQHn1aqqz9y259Bs/az.bfCj032yNm', NULL, '2026-05-22 23:13:40', '2026-05-22 23:13:40', 'Nisa', NULL, NULL, NULL, NULL, NULL, 'Sleman', NULL, 'guru'),
(8, 'Fajar Hidayat', 'fajar@synau.com', NULL, '$2y$12$8M2Oq/gwGzFvHB6gnLmpKem8tsIw0GXcBSzFI8NcehAkOyVzL94gK', NULL, '2026-05-22 23:13:40', '2026-05-22 23:13:40', 'Fajar', NULL, NULL, NULL, NULL, NULL, 'Bantul', NULL, 'guru'),
(9, 'Laila Munawaroh', 'laila@synau.com', NULL, '$2y$12$KU.NCD1ssgMu.vUqbBfIkuYhkpMBJ863iF3OT0FNjDs23j0CKJv5m', NULL, '2026-05-22 23:13:40', '2026-05-22 23:13:40', 'Laila', NULL, NULL, NULL, NULL, NULL, 'Yogyakarta', NULL, 'guru'),
(10, 'Budi Santoso', 'budi@test.com', NULL, '$2y$12$k1EPEZDJTw2pRbyod543BeYYBDo64Z9Z2IbpPffCaNn08PZACujUS', NULL, '2026-05-22 23:21:50', '2026-05-22 23:21:50', 'Budi', NULL, NULL, NULL, NULL, NULL, 'Yogyakarta', NULL, 'siswa'),
(11, 'Fadli', 'ff@gmail.com', NULL, '$2y$12$W5jpv0K8TPLjNZfOlQrjwuClFGTewZvdWJR57cNMxCuN6sVPoNiFu', NULL, '2026-05-23 00:28:34', '2026-05-23 00:28:34', 'Fadli Faiz', '2008-02-02', '23123123123', 'jl kenanga no 23', 'kenanga', 'kenangi', 'Kota Surakarta', 'Jawa Tengah', 'siswa');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookings_siswa_id_foreign` (`siswa_id`),
  ADD KEY `bookings_guru_id_foreign` (`guru_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indexes for table `gurus`
--
ALTER TABLE `gurus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gurus_user_id_foreign` (`user_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gurus`
--
ALTER TABLE `gurus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `gurus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `gurus`
--
ALTER TABLE `gurus`
  ADD CONSTRAINT `gurus_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
