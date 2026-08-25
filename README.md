# 🚀 ernext-config

Translations: [English](README.md) | [Bahasa Indonesia](README-id.md)

[![npm version](https://img.shields.io/npm/v/ernext-config.svg?style=flat-flat&color=3399ff)](https://www.npmjs.com/package/ernext-config)
[![license](https://img.shields.io/npm/l/ernext-config.svg?style=flat-flat&color=47d147)](https://github.com/refarwan/ernext-config)

The ultimate ESLint, Prettier, and Next.js config orchestrator. Standardize code format, enforce type-only imports, enforce clean component and folder casing, and dynamically manage Next.js environment check, proxies, and image domains with minimal configuration.

---

## ✨ Features

- ⚡ **Auto-Setup**: Installs all required plugins, copies configuration templates, and configures VS Code & ESLint settings automatically.
- 📐 **Enforce Type-Only Imports**: Directs ESLint and VS Code to automatically rewrite `import type { ... }` for TS interfaces and types.
- 📁 **React & Next.js Casing Conventions**:
  - Components (`components/`): Enforces **PascalCase** or **kebab-case** for file and folder naming.
  - Hooks (`hooks/`): Enforces **camelCase** for filenames (e.g. `useActive.ts`).
  - Utils, contexts, interfaces, lib, services, types: Enforces **kebab-case** or **camelCase**.
- 🔮 **Smart Import Sorting**: Auto-sorts imports, cleanly separating values from types and grouping aliased paths.
- 🌐 **Dynamic Next.js Orchestration**:
  - Validates environment variables (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL, etc.).
  - Configures image RemotePatterns dynamically from API/CDN URL variables.
  - Enables unoptimized image processing automatically on `localhost`.
  - Configures allowed origins for Server Actions and middleware client max body sizes.
  - Configures standard rewrites (`/data/:path*` to API URL).

---

## 📦 Installation & Setup

Apply this standardization to your Next.js project by running the setup CLI inside your project root:
```bash
npx ernext-config
```
*No initial installation is needed! The setup script will download the package, copy templates, configure your local files, and install all required devDependencies.*

> [!TIP]
> **VS Code Extension Cache**: If VS Code shows fake lint errors after setup, open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and execute **`Developer: Restart Window`** to reload extensions.

> [!IMPORTANT]
> **Recommended VS Code Extensions**:
> To get real-time linting, format on save, and automatic type-only imports, install the official [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) VS Code extensions.

---

## 🛠️ Next.js Configuration (`defineNextConfig`)

In `next.config.ts` (or `next.config.js`), use the `defineNextConfig` wrapper to simplify environment checks and asset configurations:

```typescript
import { defineNextConfig } from "ernext-config";

export default defineNextConfig({
  /* 
  Custom Next.js options.
  ernext-config handles:
  - Required env validation
  - Images remote patterns parsing
  - Localhost unoptimized images
  - Max body size & server action origins
  - Rewrite mapping (/data/:path* -> NEXT_PUBLIC_API_URL)
  */
});
```

### Next.js Config Options (Customizable)

You can pass standard Next.js options, or configure `requiredEnvs` to change validated environment variables:

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

## ⚙️ Manual Integration (Fallback)

If you prefer to configure files manually, follow these steps:

### 1. Update `eslint.config.mjs`

```javascript
import { eslintConfig } from "ernext-config";

export default [
  ...eslintConfig, // Add the spread operator at the start
  
  // Custom rules...
];
```

### 2. Update `.vscode/settings.json`

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

## 📜 Formatting Standards

### Prettier Import Sorting
We use `@ianvs/prettier-plugin-sort-imports` to group imports clearly. The order is:
1. **Built-in Node.js modules** (e.g. `fs`, `path`).
2. **Third-party modules** (e.g. `react`, `next`).
3. **Aliased Logic Modules** (`@/utils`, `@/hooks`, etc.).
4. **Local Logic Modules** (relative `./utils`, `./hooks`, etc.).
5. **Type Imports** (built-in, third-party, aliased, and relative type definitions).

### Folder & File Casing (check-file)
- **`components/`**: PascalCase or kebab-case (e.g. `Navbar.tsx`, `MSItem.tsx`, `footer/Footer.tsx`).
- **`hooks/`**: camelCase (e.g. `useVideoPlayer.ts`, `useAuth.ts`).
- **`utils/`**, **`contexts/`**, **`interfaces/`**: kebab-case or camelCase (e.g. `axios-instance.tsx`, `item-data-map.ts`).

---

## 📄 License

MIT © [refarwan](https://github.com/refarwan)
