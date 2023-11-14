module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	plugins: ['svelte3', '@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	overrides: [
		{ 
			files: ['*.svelte'], 
			processor: 'svelte3/svelte3', 
			rules: { 
				"missing-custom-element-compile-options": "off",
				"comma-dangle": "off",
			}
		},
	],
	settings: {
		'svelte3/typescript': () => require('typescript'),
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	rules: {
		semi: ["error", "never"],
		quotes: ["error", "double"],
    	"missing-custom-element-compile-options": "off",
		indent: ["error", "tab"],
		"no-tabs": "off",
		"comma-dangle": ["error", "always-multiline"],
		"key-spacing": ["error", { "align": "value" }],
	}
};
