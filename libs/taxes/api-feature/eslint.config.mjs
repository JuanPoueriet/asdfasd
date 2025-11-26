import { Linter } from "eslint";

export default [
  {
    "files": ["**/*.ts"],
    "rules": {
      "@typescript-eslint/no-empty-interface": "off"
    }
  }
] as Linter.FlatConfig[];
