module.exports = {
	env: {
		browser: true,
		es2021:  true,
	},
	extends:        ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	overrides:      [],
	ignorePatterns: [".eslintrc.js", "*.cjs", "dist"],
	parserOptions:  {
		ecmaVersion: "latest",
		sourceType:  "module",
	},
	rules: {
		semi: ["error", "never"],
		quotes:	["error", "double"],
		indent:	["error", "tab"],
		"no-tabs": "off",
		"comma-dangle": ["error", "always-multiline"],
		"key-spacing": ["error", { "align": "value" }],
	},
}
