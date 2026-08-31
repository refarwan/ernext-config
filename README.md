# 🚀 ernext-config

Translations: [English](https://github.com/refarwan/ernext-config/blob/main/README.md) | [Bahasa Indonesia](https://github.com/refarwan/ernext-config/blob/main/README-id.md)

[![npm version](https://img.shields.io/npm/v/ernext-config.svg?style=flat-flat&color=3399ff)](https://www.npmjs.com/package/ernext-config)
[![license](https://img.shields.io/npm/l/ernext-config.svg?style=flat-flat&color=47d147)](https://github.com/refarwan/ernext-config)

The ultimate, zero-config Prettier, ESLint, Tailwind CSS v4, and Next.js orchestrator. Standardize your code formatting, enforce type-only imports, manage strict casing conventions, auto-convert pixel units to native Tailwind v4 values, resolve class conflicts accurately, and dynamically configure Next.js environment checks, proxies, and asset domains in seconds.

---

## ✨ Features

- ⚡ **Auto-pilot Setup**: Installs required devDependencies, copies configuration templates, and configures `.vscode` settings and recommended extensions automatically.
- 📐 **Strict Type-only Imports**: Configures VS Code and ESLint to automatically rewrite `import type { ... }` for TS interfaces and types.
- 🎯 **Tailwind CSS v4 Px-to-Rem Converter**:
  - Automatically converts arbitrary pixel utilities (e.g. `w-[100px]` $\rightarrow$ `w-25`, `w-[111px]` $\rightarrow$ `w-27.75`, `p-[15px]` $\rightarrow$ `p-3.75`, `gap-[6px]` $\rightarrow$ `gap-1.5`) into modern Tailwind CSS v4 fractional and integer units upon saving or formatting.
- 🛡️ **Accurate Tailwind Linting & Conflict Detection**:
  - Integrates `eslint-plugin-tailwindcss` to catch real conflicting utility classes without false-positive warnings on pseudo-elements (like `text-slate-800 placeholder:text-gray-400`).
  - Pre-configures `.vscode/settings.json` to silence flawed extension linter conflicts while delegating full accuracy to ESLint.
- 📁 **Casing Conventions Enforcer**:
  - **Components (`components/`)**: Enforces **PascalCase** for component files (e.g. `Navbar.tsx`), and **PascalCase** or **kebab-case** for folders.
  - **Hooks (`hooks/`)**: Enforces **camelCase** for files starting with `use` (e.g. `useActive.ts`), and **kebab-case** for folders and other non-hook files.
  - **Contexts (`contexts/`)**: Enforces **PascalCase** for providers, **camelCase** for hooks, and **kebab-case** for other files/folders.
  - **Utils, interfaces, lib, services, types, constants, consts**: Enforces **kebab-case** for both files and folders (e.g. `get-hello-world.ts`, `default-name.ts`).
- 🔮 **Smart Import Sorting**: Auto-sorts imports, separating logic and components into clear categories, and cleanly separating value imports from type-only imports.
- 🎨 **Tailwind CSS Sorting**: Automatically sorts Tailwind CSS classes inside React components using Prettier to ensure styling consistency without distracting inline ESLint errors.
- 🌐 **Dynamic Next.js Orchestration**:
  - Validates required environment variables (e.g., `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`).
  - Parses image `remotePatterns` dynamically from API/CDN variables.
  - Enables unoptimized image processing automatically on `localhost`.
  - Configures allowed origins for Server Actions and middleware client max body sizes.
  - Generates proxy rewrites (`/data/:path*` to API URL) automatically.
- 🛠️ **Idempotent Setup Script**: Won't corrupt or duplicate imports or configurations if run multiple times.

---

## 📦 Installation & Setup

To apply these standard configurations to your Next.js project, simply run the initialization command directly in your project root:
```bash
npx ernext-config
```
*No prior installation is required! The setup script will automatically configure your editor settings, update ESLint/Prettier configs, and install `ernext-config` along with all required devDependencies into your local project.*

> [!TIP]
> **VS Code Extension Caching**: If your VS Code editor still displays false-positive red underline errors after setup, reload your editor window by opening the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and running **`Developer: Restart Window`** to force the extensions to load the newly installed plugins.

> [!IMPORTANT]
> **Editor Extensions Recommended**:
> For the best experience in VS Code or Antigravity IDE, ensure you have installed the official [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), and [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extensions (which are auto-recommended in `.vscode/extensions.json`).

---

## ⚙️ How It Works (Automatic Setup)

When you run `npx ernext-config`, the initialization script runs the following steps in your project root:

1. **Copies `.prettierrc`**: Adds structured rules for Next.js import sorting and Tailwind CSS formatting.
2. **Configures `.vscode` Templates**:
   - Safely merges standard settings into `.vscode/settings.json` (enabling type-only auto-imports, ESLint `source.fixAll.eslint` on save, and Tailwind v4 lint options).
   - Generates `.vscode/extensions.json` with workspace extension recommendations.
3. **Installs Dev Dependencies**: Installs the required plugins (`eslint-plugin-check-file`, `eslint-plugin-tailwindcss`, `@ianvs/prettier-plugin-sort-imports`, `prettier-plugin-tailwindcss`, `eslint-config-next`, `eslint-config-prettier`, etc.) to your local project.
4. **Modifies `eslint.config.mjs`**: Automatically injects `eslintConfig` (as `ernextConfig`) at the start of your ESLint Flat Config.
5. **Configures Scripts**: Adds or updates `lint`, `lint:fix`, and `format` scripts in your `package.json` to automatically format all files using ESLint and Prettier.
6. **Initial Formatting & Linting**: Automatically runs a formatting pass (`npm run format`) followed by a lint check (`npm run lint`) to tidy up your codebase immediately.

---

## 📜 Formatting Standards Applied

### Prettier Import Sorting
The plugin `@ianvs/prettier-plugin-sort-imports` organizes your imports into logical groups separated by empty lines. Here is the exact sorting order applied:

#### 1. Value Imports (Logic & Runtime Code)
1. **Built-in Node.js Modules**: Core modules (e.g. `fs`, `path`).
2. **Third-party Modules**: Installed packages (e.g. `react`, `next`, `lucide-react`).
3. **Aliased Constants** (using `@/constants` or `@/const`).
4. **Local Constants** (using relative paths `./constants`, `./const`).
5. **Aliased Utils, Hooks & Functions** (e.g. `@/utils`, `@/hooks`, `@/helpers`, `@/services`, `@/libs`, etc.).
6. **Local Utils, Hooks & Functions** (e.g. `./utils`, `./hooks`, etc.).
7. **Aliased JSX Components & Pages** (e.g. `@/components`, `@/layouts`, `@/pages`, etc.).
8. **Local JSX Components & Pages** (e.g. `./components`, `./layouts`, etc.).
9. **Aliased Other Files** (styles, assets, config files, etc.).
10. **Local Other Files** (relative paths of other files).

#### 2. Type Imports (Types & Interfaces)
Type imports follow the exact same hierarchy structure (Built-in Types, Third-party Types, Aliased/Local Constants Types, Aliased/Local Utils Types, Aliased/Local Component Types, and Other Types), with each subset sorted internally.

Example of sorted imports:
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

### Naming & Directory Conventions
- **Casing Rules**: 
  - **`components/`**: strictly **PascalCase** for component files (e.g. `Navbar.tsx`, `MSItem.tsx`, `Footer.tsx`). Folder names inside components can be **PascalCase** or **kebab-case** (e.g. `MarqueeSelection/` or `providers/`).
  - **`hooks/`**: **camelCase** for files starting with `use` (e.g. `useVideoPlayer.ts`, `useAuth.ts`), and **kebab-case** for folders and other non-hook files (e.g. `interfaces.ts`, `index.ts`).
  - **`contexts/`**:
    - **`PascalCase`** for React Context Provider component files (e.g. `PopupProvider.tsx`, `PopupContext.tsx`).
    - **`camelCase`** for custom hooks starting with `use` (e.g. `usePopup.ts`).
    - **`kebab-case`** for other files (e.g. `interfaces.ts`, `popup-helper.ts`) and all folders (e.g. `popup/`, `bubble-menu/`).
  - **`utils/`**, **`interfaces/`**, **`services/`**, **`lib/`**, **`types/`**, **`constants/`**, **`consts/`**: strictly **kebab-case** for both files and folders (e.g. `get-hello-world.ts`, `boolean-state.ts`, `user-roles.ts`, `default-name.ts`).
  - **Others (Default)**: All other files and folders not specified above must default to **kebab-case** (e.g. `app/tests/test-file.ts`).
- **Interfaces & Types Directory Structure**:
  - **Single file (few interfaces)**: Use a single `interfaces.ts` file directly in the module folder (e.g. `src/users/interfaces.ts`).
  - **Folder structure (multiple interfaces)**: Create an `interfaces/` folder, place individual `*.interface.ts` or `*.type.ts` files inside, and export them all from `interfaces/index.ts` using **named exports** (e.g. `export { User } from './user.interface';`). *Wildcard exports (`export *`) are strictly forbidden in all source files (except the `generated` folder).*
- **Functions & Utilities Directory Structure**:
  - **Single file (few utilities)**: Use a single `utils.ts` file directly in the module folder (e.g. `src/users/utils.ts`).
  - **Folder structure (multiple utilities)**: Create a `utils/` folder, place individual `*.util.ts` or `*.function.ts` files inside, and export them all from `utils/index.ts` using **named exports** (e.g. `export { formatDate } from './format-date.util';`). *Wildcard exports (`export *`) are strictly forbidden in all source files (except the `generated` folder).*
- **Constants & Enums Directory Structure**:
  - **Single file (few constants)**: Use a single `constants.ts` file directly in the module folder (e.g. `src/users/constants.ts`).
  - **Folder structure (multiple constants)**: Create a `constants/` folder, place individual `*.constant.ts` or `*.enum.ts` files inside, and export them all from `constants/index.ts` using **named exports** (e.g. `export { USER_ROLES } from './user-roles.constant';`). *Wildcard exports (`export *`) are strictly forbidden in all source files (except the `generated` folder).*

---

## 📄 License

MIT © [refarwan](https://github.com/refarwan)
