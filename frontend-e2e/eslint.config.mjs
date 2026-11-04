import playwright from "eslint-plugin-playwright";
import baseConfig from "../eslint.config.mjs";

export default [
    {
        ...playwright.configs["flat/recommended"],
        // Playwright rules must not run on Cypress specs (*.cy.ts), which use Chai assertions.
        files: ["**/*.spec.ts", "**/*.spec.js", "**/*.test.ts", "**/*.test.js"],
    },
    ...baseConfig,
    {
        files: [
            "**/*.ts",
            "**/*.js"
        ],
        // Override or add rules here
        rules: {}
    }
];
