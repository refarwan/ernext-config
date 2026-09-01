let checkFile = null;
let nextVitals = [];
let nextTs = [];
let eslintPluginPrettierRecommended = {};
let tailwindPlugin = null;

try {
  checkFile = require("eslint-plugin-check-file");
} catch (e) {
  // Silent fallback if loaded before install finishes
}

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

try {
  tailwindPlugin = require("eslint-plugin-tailwindcss");
} catch (e) {
  // Silent fallback if loaded before install finishes
}

const customTailwindPlugin = {
  rules: {
    "px-to-tailwind": {
      meta: {
        type: "suggestion",
        docs: {
          description:
            "Convert pixel arbitrary values (e.g. w-[100px] -> w-25, w-[111px] -> w-27.75) to Tailwind v4 values",
        },
        fixable: "code",
        schema: [],
      },
      create(context) {
        const regex =
          /(?:^|\s)(?<full>(?:[a-zA-Z0-9_-]+:)*(!?-?(?:w|h|min-w|min-h|max-w|max-h|size|p[xytbrlse]?|m[xytbrlse]?|gap(?:-[xy])?|inset(?:-[xy])?|top|right|bottom|left|rounded(?:-[a-z]+)?|tracking|leading))-\[(\d+(?:\.\d+)?)px\])(?=\s|$)/g;

        function checkNode(node, strVal, rawStartOffset) {
          if (typeof strVal !== "string") return;
          let match;
          regex.lastIndex = 0;
          while ((match = regex.exec(strVal)) !== null) {
            const full = match.groups.full;
            const pxStr = match[3];
            const unit = parseFloat(pxStr) / 4;
            const replacement = full.replace(`[${pxStr}px]`, `${unit}`);
            const matchIndex = match.index + match[0].indexOf(full);

            context.report({
              node,
              message: `Convert arbitrary '${full}' to Tailwind v4 '${replacement}'`,
              fix(fixer) {
                const start = rawStartOffset + matchIndex;
                const end = start + full.length;
                return fixer.replaceTextRange([start, end], replacement);
              },
            });
          }
        }

        return {
          JSXAttribute(node) {
            if (node.name.name !== "className" && node.name.name !== "class") return;
            if (node.value?.type === "Literal" && typeof node.value.value === "string") {
              checkNode(node, node.value.value, node.value.range[0] + 1);
            } else if (
              node.value?.type === "JSXExpressionContainer" &&
              node.value.expression.type === "Literal" &&
              typeof node.value.expression.value === "string"
            ) {
              checkNode(node, node.value.expression.value, node.value.expression.range[0] + 1);
            }
          },
        };
      },
    },
  },
};

const tailwindConfigEntry = tailwindPlugin
  ? [
      ...(Array.isArray(tailwindPlugin.configs?.["flat/recommended"])
        ? tailwindPlugin.configs["flat/recommended"]
        : tailwindPlugin.configs?.["flat/recommended"]
        ? [tailwindPlugin.configs["flat/recommended"]]
        : [
            {
              plugins: {
                tailwindcss: tailwindPlugin,
              },
            },
          ]),
      {
        settings: {
          tailwindcss: {
            cssConfigPath: "app/globals.css",
          },
        },
        rules: {
          "tailwindcss/no-contradicting-classname": "error",
          "tailwindcss/classnames-order": "off",
          "tailwindcss/no-custom-classname": "off",
          "tailwindcss/enforces-shorthand": "off",
          "tailwindcss/no-unnecessary-arbitrary-value": "warn",
        },
      },
    ]
  : [];

const NEXT_SPECIAL_FILES =
  "page|layout|loading|error|not-found|global-not-found|global-error|forbidden|unauthorized|template|default|icon|apple-icon|opengraph-image|twitter-image";

const checkFileConfigEntries = checkFile
  ? [
      {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
          "check-file": checkFile,
        },
        rules: {
          "check-file/filename-naming-convention": [
            "error",
            {
              [`**/!(${NEXT_SPECIAL_FILES}).{tsx,jsx}`]: "PASCAL_CASE",
              "**/use*.{ts,js}": "CAMEL_CASE",
              "**/contexts/**/!(use*).ts": "KEBAB_CASE",
              "**/contexts/**/!(use*).js": "KEBAB_CASE",
              "**/hooks/**/!(use*).{ts,js}": "KEBAB_CASE",
              "**/utils/**/*.{ts,js}": "KEBAB_CASE",
              "**/interfaces/**/*.{ts,js}": "KEBAB_CASE",
              "**/services/**/*.{ts,js}": "KEBAB_CASE",
              "**/lib/**/*.{ts,js}": "KEBAB_CASE",
              "**/types/**/*.{ts,js}": "KEBAB_CASE",
              "**/constants/**/*.{ts,js}": "KEBAB_CASE",
              "**/consts/**/*.{ts,js}": "KEBAB_CASE",
            },
            {
              ignoreMiddleExtensions: true,
            },
          ],
          "check-file/folder-naming-convention": [
            "error",
            {
              "**/components/**/":
                "@(*([A-Z]*([a-z0-9]))|+([a-z])*([a-z0-9])*(-+([a-z0-9]))|\\(+([a-z])*([a-z0-9])*(-+([a-z0-9]))\\)|\\@+([a-z])*([a-z0-9])*([A-Z]*([a-z0-9]))|\\[*\\]|\\_+([a-z])*([a-z0-9])*(-+([a-z0-9])))",
              "**/hooks/**/": "NEXT_JS_APP_ROUTER_CASE",
              "**/utils/**/": "NEXT_JS_APP_ROUTER_CASE",
              "**/contexts/**/": "NEXT_JS_APP_ROUTER_CASE",
              "**/interfaces/**/": "NEXT_JS_APP_ROUTER_CASE",
              "**/services/**/": "NEXT_JS_APP_ROUTER_CASE",
              "**/lib/**/": "NEXT_JS_APP_ROUTER_CASE",
              "**/constants/**/": "NEXT_JS_APP_ROUTER_CASE",
              "**/consts/**/": "NEXT_JS_APP_ROUTER_CASE",
            },
          ],
        },
      },
      {
        files: ["**/*.{js,jsx,ts,tsx}"],
        ignores: [
          `**/!(${NEXT_SPECIAL_FILES}).{tsx,jsx}`,
          "**/use*.{ts,js}",
        ],
        rules: {
          "check-file/filename-naming-convention": [
            "error",
            {
              "**/*.{js,jsx,ts,tsx}": "KEBAB_CASE",
            },
            {
              ignoreMiddleExtensions: true,
            },
          ],
        },
      },
    ]
  : [];

const eslintConfig = [
  {
    ignores: ["**/generated/**/*"],
  },
  ...nextVitals,
  ...nextTs,
  eslintPluginPrettierRecommended,
  ...tailwindConfigEntry,
  {
    plugins: {
      "custom-tailwind": customTailwindPlugin,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "custom-tailwind/px-to-tailwind": "warn",
      "prettier/prettier": "off",
    },
  },
  ...checkFileConfigEntries,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportAllDeclaration",
          message:
            "Wildcard exports (export *) are not allowed. Please export specific members instead.",
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
