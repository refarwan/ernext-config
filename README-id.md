# 🚀 ernext-config

Terjemahan: [English](README.md) | [Bahasa Indonesia](README-id.md)

[![npm version](https://img.shields.io/npm/v/ernext-config.svg?style=flat-flat&color=3399ff)](https://www.npmjs.com/package/ernext-config)
[![license](https://img.shields.io/npm/l/ernext-config.svg?style=flat-flat&color=47d147)](https://github.com/refarwan/ernext-config)

Orkestrator konfigurasi ESLint, Prettier, dan Next.js terbaik. Standardisasi format kode Anda, paksakan penggunaan type-only import, kelola casing penamaan React (Components, Hooks, Utils) dengan ketat, dan jalankan konfigurasi otomatis Next.js (validasi env, RemotePatterns gambar, dan rewrites API) tanpa ribet.

---

## ✨ Fitur

- ⚡ **Setup Otomatis**: Memasang semua plugin, menyalin template konfigurasi, dan mengatur setelan VS Code & ESLint secara otomatis.
- 📐 **Paksakan Type-only Import**: Mengonfigurasi VS Code dan ESLint untuk menulis `import type { ... }` pada interface dan type secara otomatis.
- 📁 **Konvensi Casing React & Next.js**:
  - Components (`components/`): Mewajibkan **PascalCase** atau **kebab-case** untuk penamaan file dan folder.
  - Hooks (`hooks/`): Mewajibkan **camelCase** untuk nama file (contoh: `useActive.ts`).
  - Utils, contexts, interfaces, lib, services, types: Mewajibkan **kebab-case** atau **camelCase**.
- 🔮 **Pengurutan Impor Cerdas**: Mengurutkan impor secara otomatis, memisahkan impor modul logika dan impor tipe data.
- 🌐 **Orkestrasi Next.js Dinamis**:
  - Validasi variabel lingkungan (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, dll.).
  - Mengonfigurasi RemotePatterns gambar secara otomatis dari URL API/CDN.
  - Mengaktifkan mode gambar unoptimized pada `localhost`.
  - Mengatur allowed origins untuk Server Actions dan middleware client max body size.
  - Mengatur rewrite otomatis untuk `/data/:path*` ke API URL.

---

## 📦 Instalasi & Setup

Jalankan perintah berikut di folder root proyek Next.js Anda untuk menerapkan konfigurasi ini:
```bash
npx ernext-config
```
*Tidak perlu melakukan instalasi awal! Script setup akan otomatis mengunduh package, menyalin template, mengonfigurasi berkas lokal, serta memasang seluruh devDependencies yang dibutuhkan.*

> [!TIP]
> **Pembersihan Cache VS Code**: Jika VS Code masih menampilkan garis merah setelah setup selesai, buka Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) lalu jalankan perintah **`Developer: Restart Window`** agar editor memuat plugin baru secara bersih.

> [!IMPORTANT]
> **Rekomendasi Ekstensi VS Code**:
> Agar linting real-time, pemformatan otomatis saat menyimpan (*format on save*), dan type-only import otomatis dapat berfungsi maksimal, pastikan Anda telah memasang ekstensi resmi [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) dan [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

---

## 🛠️ Konfigurasi Next.js (`defineNextConfig`)

Dalam berkas `next.config.ts` (atau `next.config.js`), gunakan pembungkus `defineNextConfig` untuk menyederhanakan validasi env dan aset gambar:

```typescript
import { defineNextConfig } from "ernext-config";

const nextConfig = defineNextConfig({
  /* 
  Opsi kustom Next.js Anda.
  ernext-config secara otomatis menangani:
  - Validasi env wajib
  - Pembuatan remotePatterns untuk gambar
  - Unoptimized gambar di localhost
  - Batas ukuran upload & server action origins
  - Pemetaan rewrite (/data/:path* -> NEXT_PUBLIC_API_URL)
  */
});

export default nextConfig;
```

### Kustomisasi Opsi `defineNextConfig`

Anda bisa meneruskan opsi konfigurasi Next.js standar, atau mengubah variabel env yang wajib divalidasi lewat opsi `requiredEnvs`:

```typescript
import { defineNextConfig } from "ernext-config";

export default defineNextConfig({
  requiredEnvs: ["NEXT_PUBLIC_API_URL", "CUSTOM_SECRET_KEY"],
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
});
```

---

## ⚙️ Integrasi Manual (Cadangan)

Jika Anda ingin mengaturnya secara manual, ikuti langkah-langkah berikut:

### 1. Perbarui `eslint.config.mjs`

```javascript
import { eslintConfig } from "ernext-config";

export default [
  ...eslintConfig, // Tambahkan spread operator ini di awal array
  
  // Aturan kustom lainnya...
];
```

### 2. Perbarui `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.preferTypeOnlyAutoImports": true
}
```

---

## 📜 Standar Pemformatan yang Diterapkan

### Pengurutan Impor Prettier
Kami menggunakan `@ianvs/prettier-plugin-sort-imports` untuk merapikan susunan impor. Urutan pengelompokan impor adalah:
1. **Modul bawaan Node.js** (contoh: `fs`, `path`).
2. **Modul pihak ketiga** (contoh: `react`, `next`).
3. **Modul logika lokal dengan Alias** (`@/utils`, `@/hooks`, dll.).
4. **Modul logika lokal Relatif** (relative `./utils`, `./hooks`, dll.).
5. **Type Imports** (tipe bawaan, tipe pihak ketiga, tipe alias, dan tipe relatif).

### Konvensi Casing Folder & Berkas (check-file)
- **`components/`**: PascalCase atau kebab-case (contoh: `Navbar.tsx`, `MSItem.tsx`, `footer/Footer.tsx`).
- **`hooks/`**: camelCase (contoh: `useVideoPlayer.ts`, `useAuth.ts`).
- **`utils/`**, **`contexts/`**, **`interfaces/`**: kebab-case atau camelCase (contoh: `axios-instance.tsx`, `item-data-map.ts`).

---

## 📄 Lisensi

MIT © [refarwan](https://github.com/refarwan)
