const checkFile = require("eslint-plugin-check-file");

let nextVitals = [];
let nextTs = [];
let eslintPluginPrettierRecommended = {};

try {
  nextVitals = require("eslint-config-next/core-web-vitals");
} catch (e) {
  // Silent fallback if loaded before install finishes
}

try {
  nextTs = require("eslint-config-next/typescript");
} catch (e) {
  // Silent fallback if loaded before install finishes
}

try {
  eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
} catch (e) {
  // Silent fallback if loaded before install finishes
}

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  eslintPluginPrettierRecommended,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "components/**/*.{tsx,jsx}": "PASCAL_CASE|KEBAB_CASE",
          "hooks/**/*.{ts,js}": "CAMEL_CASE",
          "utils/**/*.{ts,js}": "KEBAB_CASE|CAMEL_CASE",
          "contexts/**/*.{ts,js,tsx,jsx}": "KEBAB_CASE|CAMEL_CASE",
          "interfaces/**/*.{ts,js}": "KEBAB_CASE",
          "services/**/*.{ts,js}": "KEBAB_CASE",
          "lib/**/*.{ts,js}": "KEBAB_CASE",
          "types/**/*.{ts,js}": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "components/**/": "PASCAL_CASE|KEBAB_CASE",
          "hooks/**/": "KEBAB_CASE",
          "utils/**/": "KEBAB_CASE",
          "contexts/**/": "KEBAB_CASE",
          "interfaces/**/": "KEBAB_CASE",
          "services/**/": "KEBAB_CASE",
          "lib/**/": "KEBAB_CASE",
        },
      ],
    },
  },
];

function defineNextConfig(customConfig = {}) {
  const requiredEnvs = customConfig.requiredEnvs || [
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY",
    "NEXT_PUBLIC_CDN_URL",
  ];

  let allEnvironmentDefined = true;
  requiredEnvs.forEach((key) => {
    if (!process.env[key]) {
      console.error(`❌ Environment variable ${key} is not defined`);
      allEnvironmentDefined = false;
    }
  });

  if (!allEnvironmentDefined && process.env.NODE_ENV === "production") {
    throw new Error("Incomplete environment configuration");
  }

  const remotePatterns = [];
  let apiHostnameLocal = false;

  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
      apiHostnameLocal = apiUrl.hostname === "localhost" || apiUrl.hostname === "127.0.0.1";
      remotePatterns.push({
        protocol: apiUrl.protocol.replace(":", ""),
        hostname: apiUrl.hostname,
        port: apiUrl.port || "",
        pathname: "/**",
      });
    } catch (e) {
      // Ignored
    }
  }

  if (process.env.NEXT_PUBLIC_CDN_URL) {
    try {
      const cdnUrl = new URL(process.env.NEXT_PUBLIC_CDN_URL);
      remotePatterns.push({
        protocol: cdnUrl.protocol.replace(":", ""),
        hostname: cdnUrl.hostname,
        port: cdnUrl.port || "",
        pathname: "/**",
      });
    } catch (e) {
      // Ignored
    }
  }

  const maxBodySizeMb = Number(process.env.NEXT_PUBLIC_MAX_FILE_UPLOAD_SIZE_MB || 10);
  const middlewareClientMaxBodySize = maxBodySizeMb * 1024 * 1024;

  const allowedOrigins = process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : [];

  const baseConfig = {
    experimental: {
      globalNotFound: true,
      serverActions: {
        allowedOrigins,
      },
      middlewareClientMaxBodySize,
    },
    images: {
      unoptimized: apiHostnameLocal,
      remotePatterns,
    },
    async rewrites() {
      const userRewrites = customConfig.rewrites ? await customConfig.rewrites() : { fallback: [] };
      const apiFallback = process.env.NEXT_PUBLIC_API_URL ? [
        {
          source: "/data/:path*",
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        },
      ] : [];

      const combined = { ...userRewrites };
      if (!combined.fallback) {
        combined.fallback = [];
      }
      combined.fallback = [...combined.fallback, ...apiFallback];
      return combined;
    },
  };

  const { requiredEnvs: _, rewrites: __, ...otherCustomConfig } = customConfig;

  return {
    ...baseConfig,
    ...otherCustomConfig,
    experimental: {
      ...baseConfig.experimental,
      ...(otherCustomConfig.experimental || {}),
      serverActions: {
        ...baseConfig.experimental.serverActions,
        ...((otherCustomConfig.experimental && otherCustomConfig.experimental.serverActions) || {}),
      },
    },
    images: {
      ...baseConfig.images,
      ...(otherCustomConfig.images || {}),
      remotePatterns: [
        ...baseConfig.images.remotePatterns,
        ...((otherCustomConfig.images && otherCustomConfig.images.remotePatterns) || []),
      ],
    },
  };
}

module.exports = {
  eslintConfig,
  defineNextConfig,
};
