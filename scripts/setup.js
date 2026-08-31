#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const pkgJson = require("../package.json");

const projectRoot = process.env.INIT_CWD || process.cwd();

let targetDir = projectRoot;
if (projectRoot.includes("node_modules")) {
  targetDir = projectRoot.split("/node_modules")[0];
}

function setupProject() {
  console.log("\n🚀 [ernext-config] Memulai setup otomatis untuk Next.js...");

  // 1. Copy file .prettierrc
  try {
    const templatePrettier = path.join(__dirname, "../templates/.prettierrc");
    const targetPrettier = path.join(targetDir, ".prettierrc");
    if (fs.existsSync(templatePrettier)) {
      fs.copyFileSync(templatePrettier, targetPrettier);
      console.log("✅ File .prettierrc berhasil di-copy ke project Next.js!");

      // Tambahkan konfigurasi tailwindStylesheet secara dinamis untuk Tailwind CSS v4
      try {
        const rc = JSON.parse(fs.readFileSync(targetPrettier, "utf8"));
        if (fs.existsSync(path.join(targetDir, "src/app/globals.css"))) {
          rc.tailwindStylesheet = "./src/app/globals.css";
        } else if (fs.existsSync(path.join(targetDir, "app/globals.css"))) {
          rc.tailwindStylesheet = "./app/globals.css";
        } else {
          rc.tailwindStylesheet = "./app/globals.css"; // Default fallback
        }
        fs.writeFileSync(targetPrettier, JSON.stringify(rc, null, 4), "utf8");
        console.log(`✅ Mengatur tailwindStylesheet ke "${rc.tailwindStylesheet}" di .prettierrc!`);
      } catch (err) {
        console.warn("⚠️ Gagal menyisipkan tailwindStylesheet secara otomatis:", err.message);
      }
    } else {
      console.error("❌ Template .prettierrc tidak ditemukan!");
    }
  } catch (err) {
    console.error("❌ Gagal me-copy file .prettierrc:", err.message);
  }

  // 2. Copy / Merge .vscode (settings.json & extensions.json)
  try {
    const vscodeTargetDir = path.join(targetDir, ".vscode");
    if (!fs.existsSync(vscodeTargetDir)) {
      fs.mkdirSync(vscodeTargetDir, { recursive: true });
    }

    // 2.1 settings.json
    const vscodeTemplateSettings = path.join(__dirname, "../templates/.vscode/settings.json");
    const vscodeTargetSettings = path.join(vscodeTargetDir, "settings.json");
    if (fs.existsSync(vscodeTemplateSettings)) {
      let mergedSettings = {};
      if (fs.existsSync(vscodeTargetSettings)) {
        try {
          const existingContent = fs.readFileSync(vscodeTargetSettings, "utf8");
          mergedSettings = JSON.parse(existingContent);
        } catch (e) {
          console.warn("⚠️ Gagal membaca settings.json yang sudah ada, akan ditimpa.");
        }
      }
      const templateSettings = JSON.parse(fs.readFileSync(vscodeTemplateSettings, "utf8"));
      mergedSettings = { ...mergedSettings, ...templateSettings };
      fs.writeFileSync(vscodeTargetSettings, JSON.stringify(mergedSettings, null, 2), "utf8");
      console.log("✅ File .vscode/settings.json berhasil dikonfigurasi!");
    }

    // 2.2 extensions.json
    const vscodeTemplateExtensions = path.join(__dirname, "../templates/.vscode/extensions.json");
    const vscodeTargetExtensions = path.join(vscodeTargetDir, "extensions.json");
    if (fs.existsSync(vscodeTemplateExtensions)) {
      let mergedExtensions = { recommendations: [] };
      if (fs.existsSync(vscodeTargetExtensions)) {
        try {
          const existingExt = JSON.parse(fs.readFileSync(vscodeTargetExtensions, "utf8"));
          if (Array.isArray(existingExt.recommendations)) {
            mergedExtensions.recommendations = existingExt.recommendations;
          }
        } catch (e) {
          console.warn("⚠️ Gagal membaca extensions.json yang sudah ada.");
        }
      }
      const templateExt = JSON.parse(fs.readFileSync(vscodeTemplateExtensions, "utf8"));
      if (Array.isArray(templateExt.recommendations)) {
        templateExt.recommendations.forEach((item) => {
          if (!mergedExtensions.recommendations.includes(item)) {
            mergedExtensions.recommendations.push(item);
          }
        });
      }
      fs.writeFileSync(vscodeTargetExtensions, JSON.stringify(mergedExtensions, null, 2), "utf8");
      console.log("✅ File .vscode/extensions.json berhasil dikonfigurasi!");
    }
  } catch (err) {
    console.error("❌ Gagal mengatur file .vscode:", err.message);
  }

  // 3. Install devDependencies ke project user
  try {
    const devDeps = [
      `ernext-config@${pkgJson.version}`,
      "prettier",
      "eslint",
      "eslint-config-next",
      "eslint-config-prettier",
      "eslint-plugin-prettier",
      "eslint-plugin-check-file",
      "eslint-plugin-tailwindcss",
      "@ianvs/prettier-plugin-sort-imports",
      "prettier-plugin-tailwindcss"
    ];

    console.log("📦 Meng-install devDependencies untuk linter & formatter Next.js...");
    execSync(`npm install --save-dev ${devDeps.join(" ")}`, {
      cwd: targetDir,
      stdio: "inherit",
    });
    console.log("✅ Semua dependencies berhasil di-install!");
  } catch (err) {
    console.error("⚠️ Gagal meng-install dependencies otomatis:", err.message);
  }

  // 4. Injeksi otomatis eslint.config.mjs
  try {
    const eslintConfigPath = path.join(targetDir, "eslint.config.mjs");
    if (fs.existsSync(eslintConfigPath)) {
      let content = fs.readFileSync(eslintConfigPath, "utf8");
      let modified = false;

      // 4.1. Cek & perbaiki impor
      if (content.includes("import { eslintConfig } from \"ernext-config\"") || 
          content.includes("import { eslintConfig } from 'ernext-config'")) {
        content = content.replace("eslintConfig } from \"ernext-config\"", "eslintConfig as ernextConfig } from \"ernext-config\"");
        content = content.replace("eslintConfig } from 'ernext-config'", "eslintConfig as ernextConfig } from 'ernext-config'");
        modified = true;
        console.log("🔄 Mengubah impor eslintConfig ke alias aman ernextConfig...");
      } else if (!content.includes("ernext-config")) {
        content = "import { eslintConfig as ernextConfig } from 'ernext-config';\n" + content;
        modified = true;
        console.log("✅ Menambahkan impor ernextConfig di eslint.config.mjs...");
      }

      // 4.2. Cek & perbaiki spread operator
      if (!content.includes("...ernextConfig") && !content.includes("...eslintConfig")) {
        // Lakukan injeksi
        if (content.includes("const eslintConfig = [")) {
          const lastIndex = content.lastIndexOf("];");
          if (lastIndex !== -1) {
            const prefix = content.slice(0, lastIndex);
            const comma = prefix.trim().endsWith(",") ? "" : ",";
            content = prefix + `${comma}\n  ...ernextConfig\n` + content.slice(lastIndex);
            modified = true;
            console.log("✅ Berhasil menginjeksi ernextConfig di dalam variabel eslintConfig!");
          }
        } else if (content.includes("defineConfig([")) {
          const lastIndex = content.lastIndexOf("]);");
          if (lastIndex !== -1) {
            const prefix = content.slice(0, lastIndex);
            const comma = prefix.trim().endsWith(",") ? "" : ",";
            content = prefix + `${comma}\n  ...ernextConfig\n` + content.slice(lastIndex);
            modified = true;
            console.log("✅ Berhasil menginjeksi ernextConfig di dalam defineConfig!");
          }
        } else if (content.includes("export default tseslint.config(")) {
          const lastIndex = content.lastIndexOf(");");
          if (lastIndex !== -1) {
            const prefix = content.slice(0, lastIndex);
            const comma = prefix.trim().endsWith(",") ? "" : ",";
            content = prefix + `${comma}\n  ...ernextConfig\n` + content.slice(lastIndex);
            modified = true;
            console.log("✅ Berhasil menginjeksi ernextConfig di akhir tseslint.config!");
          }
        } else if (content.includes("export default [")) {
          const lastIndex = content.lastIndexOf("];");
          if (lastIndex !== -1) {
            const prefix = content.slice(0, lastIndex);
            const comma = prefix.trim().endsWith(",") ? "" : ",";
            content = prefix + `${comma}\n  ...ernextConfig\n` + content.slice(lastIndex);
            modified = true;
            console.log("✅ Berhasil menginjeksi ernextConfig di akhir array export default!");
          }
        } else {
          console.log("\n⚠️ Pola export default tidak dikenali.");
          console.log("Silakan tambahkan secara manual di eslint.config.mjs:");
          console.log("  ...ernextConfig,");
        }
      } else if (content.includes("...eslintConfig")) {
        // Ganti ...eslintConfig dengan ...ernextConfig untuk keselarasan alias
        content = content.replace(/\.\.\.eslintConfig\b/g, "...ernextConfig");
        modified = true;
        console.log("🔄 Berhasil memigrasi spread operator ...eslintConfig ke ...ernextConfig!");
      }

      if (modified) {
        fs.writeFileSync(eslintConfigPath, content, "utf8");
      } else {
        console.log("ℹ️ ernext-config sudah terintegrasi penuh di eslint.config.mjs.");
      }
    } else {
      // Jika file tidak ada, buat baru
      const defaultEslintConfig = `import { eslintConfig as ernextConfig } from "ernext-config";\n\nexport default [\n  ...ernextConfig,\n];\n`;
      fs.writeFileSync(eslintConfigPath, defaultEslintConfig, "utf8");
      console.log("✅ File eslint.config.mjs baru berhasil dibuat!");
    }
  } catch (err) {
    console.error("❌ Gagal menginjeksi eslint.config.mjs otomatis:", err.message);
  }

  // 5. Tambahkan/Perbarui script di package.json target
  try {
    const targetPkgJsonPath = path.join(targetDir, "package.json");
    if (fs.existsSync(targetPkgJsonPath)) {
      const targetPkgJson = JSON.parse(fs.readFileSync(targetPkgJsonPath, "utf8"));
      if (!targetPkgJson.scripts) {
        targetPkgJson.scripts = {};
      }
      targetPkgJson.scripts.lint = "eslint";
      targetPkgJson.scripts["lint:fix"] = "eslint --fix";
      targetPkgJson.scripts.format = 'eslint --fix && prettier --write --no-error-on-unmatched-pattern "app/**/*.{js,jsx,ts,tsx}" "components/**/*.{js,jsx,ts,tsx}" "contexts/**/*.{js,jsx,ts,tsx}" "hooks/**/*.{js,jsx,ts,tsx}" "utils/**/*.{js,jsx,ts,tsx}" "pages/**/*.{js,jsx,ts,tsx}" "scripts/**/*.{js,jsx,ts,tsx}" "*.{js,mjs,json,ts}"';
      fs.writeFileSync(targetPkgJsonPath, JSON.stringify(targetPkgJson, null, 2), "utf8");
      console.log("✅ Scripts 'lint', 'lint:fix', dan 'format' berhasil ditambahkan/diperbarui di package.json!");
    }
  } catch (err) {
    console.error("❌ Gagal menambahkan scripts ke package.json:", err.message);
  }

  // 6. Jalankan format otomatis pertama kali
  try {
    console.log("🧹 Menjalankan pemformatan kode perdana (npm run format)...");
    execSync("npm run format", {
      cwd: targetDir,
      stdio: "inherit",
    });
    console.log("✅ Berkas kode berhasil dirapikan otomatis!");
  } catch (err) {
    console.warn("⚠️ Gagal menjalankan pemformatan otomatis secara langsung:", err.message);
  }

  // 7. Jalankan linter otomatis pertama kali
  try {
    console.log("🔍 Menjalankan linter perdana (npm run lint)...");
    execSync("npm run lint", {
      cwd: targetDir,
      stdio: "inherit",
    });
    console.log("✅ Berkas kode berhasil di-lint secara otomatis!");
    console.log("\n💡 TIP: Jika editor VS Code Anda masih menampilkan garis merah/error palsu:");
    console.log("   Buka Command Palette (Cmd+Shift+P) -> jalankan 'Developer: Restart Window' agar ekstensi memuat konfigurasi baru.\n");
  } catch (err) {
    console.warn("⚠️ Gagal linter otomatis berjalan sukses:", err.message);
  }
}

setupProject();
