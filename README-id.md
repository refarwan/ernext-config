# 🚀 ernext-config

Terjemahan: [English](https://github.com/refarwan/ernext-config/blob/main/README.md) | [Bahasa Indonesia](https://github.com/refarwan/ernext-config/blob/main/README-id.md)

[![npm version](https://img.shields.io/npm/v/ernext-config.svg?style=flat-flat&color=3399ff)](https://www.npmjs.com/package/ernext-config)
[![license](https://img.shields.io/npm/l/ernext-config.svg?style=flat-flat&color=47d147)](https://github.com/refarwan/ernext-config)

Orkestrator Prettier, ESLint, dan Next.js terbaik tanpa konfigurasi ribet. Standardisasi format kode Anda, paksakan penggunaan type-only import, kelola casing penamaan React (Components, Hooks, Utils) dengan ketat, dan jalankan konfigurasi otomatis Next.js (validasi env, RemotePatterns gambar, dan rewrites API) dalam hitungan detik.

---

## ✨ Fitur

- ⚡ **Setup Otomatis**: Memasang semua devDependencies, menyalin template konfigurasi, dan mengatur setelan VS Code secara otomatis.
- 📐 **Paksakan Type-only Import**: Mengonfigurasi VS Code dan ESLint untuk otomatis menulis `import type { ... }` pada interface dan type.
- 📁 **Konvensi Casing Ketat**:
  - **Components (`components/`)**: Mewajibkan **PascalCase** untuk file komponen (contoh: `Navbar.tsx`), dan **PascalCase** atau **kebab-case** untuk folder.
  - **Hooks (`hooks/`)**: Mewajibkan **camelCase** untuk file yang diawali `use` (contoh: `useActive.ts`), serta **kebab-case** untuk folder dan file non-hook lainnya.
  - **Contexts (`contexts/`)**: Mewajibkan **PascalCase** untuk provider, **camelCase** untuk hook, dan **kebab-case** untuk file/folder lainnya.
  - **Utils, interfaces, lib, services, types, constants, consts**: Mewajibkan **kebab-case** untuk file maupun folder (contoh: `get-hello-world.ts`, `default-name.ts`).
- 🔮 **Pengurutan Impor Cerdas**: Mengurutkan impor secara otomatis, memisahkan impor modul logika dan tipe data ke dalam kategori yang jelas.
- 🎨 **Pengurutan Kelas Tailwind CSS**: Mengurutkan kelas-kelas Tailwind CSS secara otomatis pada berkas React/Next.js untuk menjaga visual styling yang konsisten.
- 🌐 **Orkestrasi Next.js Dinamis**:
  - Validasi variabel lingkungan (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, dll.).
  - Mengonfigurasi RemotePatterns gambar secara otomatis dari variabel API/CDN.
  - Mengaktifkan mode gambar unoptimized pada `localhost`.
  - Mengatur allowed origins untuk Server Actions dan middleware client max body size.
  - Mengatur rewrite otomatis untuk `/data/:path*` ke API URL.
- 🛠️ **Script Setup Idempotent**: Tidak akan merusak atau menduplikasi impor jika dijalankan berkali-kali.

---

## 📦 Instalasi & Setup

Untuk menerapkan standar konfigurasi ini ke proyek Next.js Anda, cukup jalankan perintah inisialisasi berikut langsung di folder root proyek Anda:

```bash
npx ernext-config
```

_Tidak perlu melakukan instalasi awal! Script setup akan secara otomatis mengatur konfigurasi editor Anda, memperbarui eslint/prettier config, serta menginstal `ernext-config` beserta seluruh devDependencies yang dibutuhkan ke dalam proyek lokal Anda._

> [!TIP]
> **Pembersihan Cache Ekstensi VS Code**: Jika editor VS Code Anda masih menampilkan garis merah/error palsu setelah menjalankan setup, muat ulang window editor Anda dengan membuka Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) lalu jalankan perintah **`Developer: Restart Window`** agar ekstensi memuat plugin baru yang baru saja dipasang secara bersih.

> [!IMPORTANT]
> **Rekomendasi Ekstensi Editor**:
> Untuk pengalaman terbaik di VS Code atau Antigravity IDE, pastikan Anda telah menginstal ekstensi resmi [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode). Ekstensi ini diperlukan agar linting real-time, pemformatan otomatis saat menyimpan (_format on save_), dan type-only import otomatis dapat berfungsi secara maksimal.

---

## ⚙️ Cara Kerja (Setup Otomatis)

Saat Anda menjalankan `npx ernext-config`, script inisialisasi akan mengeksekusi langkah-langkah berikut di folder root proyek Anda:

1. **Menyalin `.prettierrc`**: Menyediakan aturan terstruktur untuk pengurutan impor dan pemformatan kode Next.js.
2. **Mengonfigurasi Pengaturan VS Code**: Menggabungkan konfigurasi secara aman ke dalam `.vscode/settings.json` Anda untuk mengaktifkan fitur type-only auto-imports.
3. **Menginstal Dev Dependencies**: Memasang plugin yang diperlukan (`eslint-plugin-check-file`, `@ianvs/prettier-plugin-sort-imports`, `prettier-plugin-tailwindcss`, `eslint-config-next`, `eslint-config-prettier`, dll.) ke dalam proyek lokal Anda.
4. **Memodifikasi `eslint.config.mjs`**: Secara otomatis menyisipkan aturan `eslintConfig` (sebagai `ernextConfig`) pada awal konfigurasi ESLint Flat Config Anda.
5. **Mengonfigurasi Script**: Menambahkan atau memperbarui script `format` pada `package.json` target untuk pemformatan otomatis berkas menggunakan Prettier.
6. **Pemformatan & Linting Awal**: Menjalankan format perdana (`npm run format`) diikuti pemeriksaan lint (`npm run lint`) untuk merapikan kode secara langsung.





## 📜 Standar Pemformatan yang Diterapkan

### Pengurutan Impor Prettier

Plugin `@ianvs/prettier-plugin-sort-imports` merapikan susunan impor Anda ke dalam kelompok logika yang jelas dan dipisahkan oleh baris kosong. Berikut adalah urutan spesifik yang diterapkan:

#### 1. Value Imports (Kode Logika & Runtime)

1. **Modul Bawaan Node.js (Built-in)**: Modul inti Node (contoh: `fs`, `path`).
2. **Modul Pihak Ketiga (Third-party)**: Package yang diinstal (contoh: `react`, `next`, `lucide-react`).
3. **Alias Constants**: menggunakan alias `@/constants` atau `@/const`.
4. **Lokal Constants**: menggunakan path relatif `./constants`, `./const`.
5. **Alias Utils, Hooks & Functions**: (contoh: `@/utils`, `@/hooks`, `@/helpers`, `@/services`, `@/libs`, dll.).
6. **Lokal Utils, Hooks & Functions**: (contoh: `./utils`, `./hooks`, dll.).
7. **Alias JSX Components & Pages**: (contoh: `@/components`, `@/layouts`, `@/pages`, dll.).
8. **Lokal JSX Components & Pages**: (contoh: `./components`, `./layouts`, dll.).
9. **Alias Berkas Lainnya**: (styles, assets, berkas konfigurasi, dll.).
10. **Lokal Berkas Lainnya**: (jalur relatif dari berkas lainnya).

#### 2. Type Imports (Tipe Data & Interface)

Impor tipe data mengikuti hierarki struktur yang persis sama (Tipe Bawaan, Tipe Pihak Ketiga, Tipe Alias/Lokal Konstanta, Tipe Alias/Lokal Utils, Tipe Alias/Lokal Komponen, dan Tipe Lainnya), di mana masing-masing bagian juga diurutkan secara internal.

Contoh impor yang sudah terurut:

```typescript
// --- 1. VALUE IMPORTS (KODE LOGIKA) ---
import fs from "fs";
import { useState } from "react";
import Link from "next/link";

// Alias Local Modules
import { API_ROUTES, APP_KEYS } from "@/constants";
import { useAuth } from "@/hooks";
import { formatDate } from "@/utils";
import { Button, Sidebar } from "@/components";
import "@/styles/globals.css";

// Relative Local Modules
import { CONFIG_DEFAULTS } from "./constants";
import { parseJson } from "./utils";
import { LocalCard } from "./components";
import "./local-style.css";

// --- 2. TYPE IMPORTS (INTERFACE / TYPES) ---
import type { Metadata } from "next";

// Alias Type Modules
import type { AuthState } from "@/hooks";
import type { ButtonProps } from "@/components/Button/interfaces";
```

### Konvensi Penamaan & Direktori

- **Aturan Casing**:
  - **`components/`**: wajib **PascalCase** untuk berkas komponen (contoh: `Navbar.tsx`, `MSItem.tsx`, `Footer.tsx`). Nama folder di dalam komponen dapat berupa **PascalCase** atau **kebab-case** (contoh: `MarqueeSelection/` atau `providers/`).
  - **`hooks/`**: wajib **camelCase** untuk berkas yang berawalan `use` (contoh: `useVideoPlayer.ts`, `useAuth.ts`), serta **kebab-case** untuk folder dan berkas non-hook lainnya (contoh: `interfaces.ts`, `index.ts`).
  - **`contexts/`**:
    - **`PascalCase`** untuk berkas komponen React Context Provider (contoh: `PopupProvider.tsx`, `PopupContext.tsx`).
    - **`camelCase`** untuk custom hooks yang berawalan `use` (contoh: `usePopup.ts`).
    - **`kebab-case`** untuk berkas lainnya (contoh: `interfaces.ts`, `popup-helper.ts`) serta seluruh nama folder (contoh: `popup/`, `bubble-menu/`).
  - **`utils/`**, **`interfaces/`**, **`services/`**, **`lib/`**, **`types/`**, **`constants/`**, **`consts/`**: wajib **kebab-case** untuk berkas maupun folder (contoh: `get-hello-world.ts`, `boolean-state.ts`, `user-roles.ts`, `default-name.ts`).
- **Struktur Direktori Interface & Type**:
  - **Berkas Tunggal (sedikit interface)**: Gunakan satu berkas `interfaces.ts` langsung di folder modul (contoh: `src/users/interfaces.ts`).
  - **Struktur Folder (banyak interface)**: Buat folder `interfaces/`, letakkan masing-masing berkas `*.interface.ts` atau `*.type.ts` di dalamnya, lalu ekspor semuanya melalui `interfaces/index.ts` menggunakan **named exports** (contoh: `export { User } from './user.interface';`). *Ekspor wildcard (`export *`) dilarang keras di seluruh berkas sumber (kecuali folder `generated`).*
- **Struktur Direktori Function & Util**:
  - **Berkas Tunggal (sedikit utilitas)**: Gunakan satu berkas `utils.ts` langsung di folder modul (contoh: `src/users/utils.ts`).
  - **Struktur Folder (banyak utilitas)**: Buat folder `utils/`, letakkan masing-masing berkas `*.util.ts` atau `*.function.ts` di dalamnya, lalu ekspor semuanya melalui `utils/index.ts` menggunakan **named exports** (contoh: `export { formatDate } from './format-date.util';`). *Ekspor wildcard (`export *`) dilarang keras di seluruh berkas sumber (kecuali folder `generated`).*
- **Struktur Direktori Constant & Enum**:
  - **Berkas Tunggal (sedikit konstanta)**: Gunakan satu berkas `constants.ts` langsung di folder modul (contoh: `src/users/constants.ts`).
  - **Struktur Folder (banyak konstanta)**: Buat folder `constants/`, letakkan masing-masing berkas `*.constant.ts` or `*.enum.ts` di dalamnya, lalu ekspor semuanya melalui `constants/index.ts` menggunakan **named exports** (contoh: `export { USER_ROLES } from './user-roles.constant';`). *Ekspor wildcard (`export *`) dilarang keras di seluruh berkas sumber (kecuali folder `generated`).*

---

## 📄 Lisensi

MIT © [refarwan](https://github.com/refarwan)
