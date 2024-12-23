import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/prop-types": "off", // Disable prop validation errors
      "react/react-in-jsx-scope": "off", // Disable jsx-scope rule
      "no-unused-vars": "off", //Disabple unused-variable rule
    },
  },
];
