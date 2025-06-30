import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable unused variables error - comment out these problematic rules
      "@typescript-eslint/no-unused-vars": "off",
      // Disable img element warning - comment out this rule  
      "@next/next/no-img-element": "off",
      // Disable unescaped entities warning - comment out this rule
      "react/no-unescaped-entities": "off"
    }
  }
];

export default eslintConfig;
