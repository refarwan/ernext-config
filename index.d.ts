import type { Linter } from "eslint";
import type { NextConfig } from "next";

export const eslintConfig: Linter.Config[];
export function defineNextConfig(customConfig?: any): NextConfig;
