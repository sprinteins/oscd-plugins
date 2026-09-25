/**
 * Bridges OpenSCD --oscd-* CSS custom properties to Shadcn/Tailwind HSL triplet variables.
 *
 * Resolution priority for each color:
 *  1. --oscd-theme-* on :root  (explicit host-page override)
 *  2. --oscd-*      on node    (OpenSCD's computed value, inherited into plugin shadow root)
 *  3. Hard-coded spec default  (oscd-api defaults, used in standalone / Storybook)
 *
 * OpenSCD sets --oscd-* via `* { }` inside its shadow root. CSS custom properties
 * inherit across shadow boundaries, so node (inside the plugin shadow root) sees them.
 */
import chroma from 'chroma-js'

// oscd-api spec defaults (https://github.com/openscd/oscd-api/blob/main/docs/plugin-api.md#theming)
const OSCD_SPEC_DEFAULTS: Record<string, string> = {
	'--oscd-primary': '#2aa198',
	'--oscd-secondary': '#6c71c4',
	'--oscd-error': '#dc322f',
	'--oscd-base03': '#002b36',
	'--oscd-base02': '#073642',
	'--oscd-base01': '#586e75',
	'--oscd-base00': '#657b83',
	'--oscd-base0': '#839496',
	'--oscd-base1': '#93a1a1',
	'--oscd-base2': '#eee8d5',
	'--oscd-base3': '#fdf6e3'
}

function toHslTriplet(color: chroma.Color): string {
	const [h, s, l] = color.hsl()
	return `${Math.round(h ?? 0)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * Resolves an --oscd-* color to an HSL triplet.
 *
 * Checks --oscd-theme-* on :root first (explicit override), then reads
 * --oscd-* from node (inherited from OpenSCD's shadow root), then falls
 * back to the spec default.
 */
function resolveOscdColorAsHsl(oscdVar: string, node: HTMLElement): string {
	const themeVar = oscdVar.replace('--oscd-', '--oscd-theme-')
	const fallbackHex = OSCD_SPEC_DEFAULTS[oscdVar] ?? '#000000'

	// 1. Explicit host-page override via --oscd-theme-* on :root
	const rootOverride = getComputedStyle(document.documentElement)
		.getPropertyValue(themeVar)
		.trim()
	if (rootOverride) {
		console.debug(
			`[oscd-theme] ${oscdVar}: ✅ root override via ${themeVar}="${rootOverride}"`
		)
		try {
			return toHslTriplet(chroma(rootOverride))
		} catch {
			/* fall through */
		}
	}

	// 2. OpenSCD's computed value inherited into plugin shadow root
	const inherited = getComputedStyle(node).getPropertyValue(oscdVar).trim()
	if (inherited) {
		console.debug(
			`[oscd-theme] ${oscdVar}: ✅ inherited from OpenSCD="${inherited}"`
		)
		try {
			return toHslTriplet(chroma(inherited))
		} catch {
			/* fall through */
		}
	}

	// 3. Spec default
	console.debug(
		`[oscd-theme] ${oscdVar}: ⚠️ not found, using spec default="${fallbackHex}"`
	)
	return toHslTriplet(chroma(fallbackHex))
}

/**
 * Reads --oscd-* CSS custom properties from the document context and returns
 * a CSS block that maps them to Shadcn/Tailwind HSL color variables.
 *
 * This block is injected AFTER the inlined Tailwind theme CSS, so its
 * unlayered :root/:host rules override the @layer base vars from Tailwind.
 *
 * Falls back to the default OpenSCD Solarized palette when --oscd-* vars are
 * not present (e.g. in Storybook or standalone dev mode).
 */
export function buildOscdShadcnThemeVars(node: HTMLElement): string {
	const primary = resolveOscdColorAsHsl('--oscd-primary', node)
	const secondary = resolveOscdColorAsHsl('--oscd-secondary', node)
	const error = resolveOscdColorAsHsl('--oscd-error', node)
	const base01 = resolveOscdColorAsHsl('--oscd-base01', node) // emphasized content / secondary headings
	const base00 = resolveOscdColorAsHsl('--oscd-base00', node) // body text (mdc-theme-on-background/surface)
	const base1 = resolveOscdColorAsHsl('--oscd-base1', node) // comments / muted text (mdc-text-secondary)
	const base2 = resolveOscdColorAsHsl('--oscd-base2', node) // highlighted bg / input fills (mdc-text-field-fill)
	const base3 = resolveOscdColorAsHsl('--oscd-base3', node) // main background + surfaces (mdc-theme-background/surface)

	// Primary button foreground: always white for contrast on the teal
	const primaryForeground = `0 0% 100%`

	// Accent: very light tint of primary for hover/active states
	const primaryHue = primary.split(' ')[0]
	const accent = `${primaryHue} 35% 92%`
	const accentForeground = `${primaryHue} 60% 22%`

	console.debug(
		'[oscd-theme] resolved shadcn vars from --oscd-theme-* properties:',
		{
			'--oscd-theme-primary': `hsl(${primary})`,
			'--oscd-theme-base3 (bg)': `hsl(${base3})`,
			'--oscd-theme-base00 (fg)': `hsl(${base00})`
		}
	)

	return `
:root,
:host {
	--background: ${base3};
	--foreground: ${base00};
	--muted: ${base2};
	--muted-foreground: ${base01};
	--popover: ${base3};
	--popover-foreground: ${base00};
	--card: ${base3};
	--card-foreground: ${base00};
	--border: ${base1};
	--input: ${base2};
	--primary: ${primary};
	--primary-foreground: ${primaryForeground};
	--secondary: ${secondary};
	--secondary-foreground: ${primaryForeground};
	--accent: ${accent};
	--accent-foreground: ${accentForeground};
	--destructive: ${error};
	--destructive-foreground: ${primaryForeground};
	--ring: ${primary};
	--radius: 0.5rem;
	--sidebar-background: ${base2};
	--sidebar-foreground: ${base00};
	--sidebar-primary: ${primary};
	--sidebar-primary-foreground: ${primaryForeground};
	--sidebar-accent: ${accent};
	--sidebar-accent-foreground: ${accentForeground};
	--sidebar-border: ${base1};
	--sidebar-ring: ${primary};
}

.dark {
	--background: 222.2 84% 4.9%;
	--foreground: 210 40% 98%;
	--muted: 217.2 32.6% 17.5%;
	--muted-foreground: 215 20.2% 65.1%;
	--popover: 222.2 84% 4.9%;
	--popover-foreground: 210 40% 98%;
	--card: 222.2 84% 4.9%;
	--card-foreground: 210 40% 98%;
	--border: 217.2 32.6% 17.5%;
	--input: 217.2 32.6% 17.5%;
	--primary: 210 40% 98%;
	--primary-foreground: 222.2 47.4% 11.2%;
	--secondary: 217.2 32.6% 17.5%;
	--secondary-foreground: 210 40% 98%;
	--accent: 217.2 32.6% 17.5%;
	--accent-foreground: 210 40% 98%;
	--destructive: 0 62.8% 30.6%;
	--destructive-foreground: 210 40% 98%;
	--ring: 212.7 26.8% 83.9%;
	--radius: 0.5rem;
	--sidebar-background: 240 5.9% 10%;
	--sidebar-foreground: 240 4.8% 95.9%;
	--sidebar-primary: 224.3 76.3% 48%;
	--sidebar-primary-foreground: 0 0% 100%;
	--sidebar-accent: 240 3.7% 15.9%;
	--sidebar-accent-foreground: 240 4.8% 95.9%;
	--sidebar-border: 240 3.7% 15.9%;
	--sidebar-ring: 217.2 91.2% 59.8%;
}
`
}
