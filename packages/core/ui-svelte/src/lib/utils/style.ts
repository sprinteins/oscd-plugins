export function setInlineStylesVariables(styles: Record<string, string>) {
	return Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';')
}
