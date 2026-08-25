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
    } else {
      console.error("❌ Template .prettierrc tidak ditemukan!");
    }
  } catch (err) {
    console.error("❌ Gagal me-copy file .prettierrc:", err.message);
  }

  // 2. Copy / Merge .vscode/settings.json
  try {
    const vscodeTemplatePath = path.join(__dirname, "../templates/.vscode/settings.json");
    const vscodeTargetDir = path.join(targetDir, ".vscode");
    const vscodeTargetPath = path.join(vscodeTargetDir, "settings.json");

    if (fs.existsSync(vscodeTemplatePath)) {
      if (!fs.existsSync(vscodeTargetDir)) {
        fs.mkdirSync(vscodeTargetDir, { recursive: true });
      }

      let mergedSettings = {};
      if (fs.existsSync(vscodeTargetPath)) {
        try {
          const existingContent = fs.readFileSync(vscodeTargetPath, "utf8");
          mergedSettings = JSON.parse(existingContent);
        } catch (e) {
          console.warn("⚠️ Gagal membaca settings.json yang sudah ada, akan ditimpa.");
        }
      }

      const templateSettings = JSON.parse(fs.readFileSync(vscodeTemplatePath, "utf8"));
      mergedSettings = { ...mergedSettings, ...templateSettings };

      fs.writeFileSync(vscodeTargetPath, JSON.stringify(mergedSettings, null, 2), "utf8");
      console.log("✅ File .vscode/settings.json berhasil dikonfigurasi!");
    }
  } catch (err) {
    console.error("❌ Gagal mengatur .vscode/settings.json:", err.message);
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

      // Cek apakah sudah pernah diinjeksi
      if (!content.includes("ernext-config")) {
        // Prepend import di awal berkas
        content = "import { eslintConfig } from 'ernext-config';\n" + content;

        // Injeksi ...eslintConfig
        if (content.includes("const eslintConfig = [")) {
          const index = content.indexOf("const eslintConfig = [");
          const lastIndex = content.indexOf("];", index);
          if (lastIndex !== -1) {
            const prefix = content.slice(0, lastIndex);
            const comma = prefix.trim().endsWith(",") ? "" : ",";
            content = prefix + `${comma}\n  ...eslintConfig\n` + content.slice(lastIndex);
            console.log("✅ Berhasil menginjeksi eslintConfig di dalam variabel eslintConfig di eslint.config.mjs!");
          }
        } else if (content.includes("export default tseslint.config(")) {
          const lastIndex = content.lastIndexOf(");");
          if (lastIndex !== -1) {
            const prefix = content.slice(0, lastIndex);
            const comma = prefix.trim().endsWith(",") ? "" : ",";
            content = prefix + `${comma}\n  ...eslintConfig\n` + content.slice(lastIndex);
            console.log("✅ Berhasil menginjeksi eslintConfig di akhir tseslint.config di eslint.config.mjs!");
          }
        } else if (content.includes("export default [")) {
          const lastIndex = content.lastIndexOf("];");
          if (lastIndex !== -1) {
            const prefix = content.slice(0, lastIndex);
            const comma = prefix.trim().endsWith(",") ? "" : ",";
            content = prefix + `${comma}\n  ...eslintConfig\n` + content.slice(lastIndex);
            console.log("✅ Berhasil menginjeksi eslintConfig di akhir array export default di eslint.config.mjs!");
          }
        } else {
          console.log("\n⚠️ Pola export default tidak dikenali.");
          console.log("Silakan tambahkan secara manual di eslint.config.mjs:");
          console.log("  ...eslintConfig,");
        }

        fs.writeFileSync(eslintConfigPath, content, "utf8");
      } else {
        console.log("ℹ️ eslintConfig sudah terdaftar di eslint.config.mjs.");
      }
    } else {
      // Jika file tidak ada, buat baru
      const defaultEslintConfig = `import { eslintConfig } from "ernext-config";\n\nexport default [\n  ...eslintConfig,\n];\n`;
      fs.writeFileSync(eslintConfigPath, defaultEslintConfig, "utf8");
      console.log("✅ File eslint.config.mjs baru berhasil dibuat!");
    }
  } catch (err) {
    console.error("❌ Gagal menginjeksi eslint.config.mjs otomatis:", err.message);
  }

  // 5. Tambahkan/Perbarui script "format" di package.json target
  try {
    const targetPkgJsonPath = path.join(targetDir, "package.json");
    if (fs.existsSync(targetPkgJsonPath)) {
      const targetPkgJson = JSON.parse(fs.readFileSync(targetPkgJsonPath, "utf8"));
      if (!targetPkgJson.scripts) {
        targetPkgJson.scripts = {};
      }
      targetPkgJson.scripts.format = 'prettier --write "app/**/*.{js,jsx,ts,tsx}" "components/**/*.{js,jsx,ts,tsx}" "contexts/**/*.{js,jsx,ts,tsx}" "hooks/**/*.{js,jsx,ts,tsx}" "utils/**/*.{js,jsx,ts,tsx}" "pages/**/*.{js,jsx,ts,tsx}" "*.{js,mjs,json}"';
      fs.writeFileSync(targetPkgJsonPath, JSON.stringify(targetPkgJson, null, 2), "utf8");
      console.log("✅ Script 'format' berhasil ditambahkan/diperbarui di package.json!");
    }
  } catch (err) {
    console.error("❌ Gagal menambahkan script format ke package.json:", err.message);
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
