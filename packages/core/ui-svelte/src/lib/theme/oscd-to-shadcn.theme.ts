/**
 * Bridges OpenSCD --oscd-* CSS custom properties to Shadcn/Tailwind HSL triplet variables.
 *
 * OpenSCD core sets --oscd-* on every element in the light DOM via `* { ... }`.
 * These inherit into plugin shadow DOMs. We resolve them to actual rgb() values
 * by using the browser's color computation on a temporary element, then convert
 * to the bare "H S% L%" triplet format that Shadcn's Tailwind config expects.
 */

// Solarized palette defaults (what OpenSCD uses when no custom theme is applied)
const OSCD_DEFAULTS = {
	'--oscd-primary': '#2aa198',
	'--oscd-secondary': '#6c71c4',
	'--oscd-error': '#dc322f',
	'--oscd-base01': '#586e75',
	'--oscd-base1': '#93a1a1',
	'--oscd-base2': '#eee8d5',
	'--oscd-base3': '#fdf6e3',
} as const

type OscdColorVar = keyof typeof OSCD_DEFAULTS

function rgbToHslTriplet(r: number, g: number, b: number): string {
	const rr = r / 255
	const gg = g / 255
	const bb = b / 255
	const max = Math.max(rr, gg, bb)
	const min = Math.min(rr, gg, bb)
	const l = (max + min) / 2
	if (max === min) return `0 0% ${Math.round(l * 100)}%`
	const d = max - min
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
	let h = 0
	if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6
	else if (max === gg) h = ((bb - rr) / d + 2) / 6
	else h = ((rr - gg) / d + 4) / 6
	return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * Resolves an --oscd-* CSS custom property to an HSL triplet string.
 *
 * Uses a hidden element appended to document.body so it inherits the full
 * light-DOM cascade (including OpenSCD's `* { --oscd-primary: ... }` rules).
 * `getComputedStyle(el).color` forces the browser to resolve all var() chains
 * and return the final computed rgb() value.
 */
function resolveOscdColorAsHsl(varName: OscdColorVar): string {
	const fallbackHex = OSCD_DEFAULTS[varName]

	const temp = document.createElement('div')
	temp.style.cssText = 'position:fixed;top:-9999px;opacity:0;pointer-events:none'
	// By setting 'color' to the var(), the browser must resolve the full var() chain
	// (including nested vars like --oscd-primary: var(--oscd-theme-primary, #2aa198))
	temp.style.color = `var(${varName}, ${fallbackHex})`
	document.body.appendChild(temp)
	const computed = getComputedStyle(temp).color // e.g. "rgb(42, 161, 152)"
	document.body.removeChild(temp)

	const match = computed.match(/\d+\.?\d*/g)
	if (match && match.length >= 3) {
		return rgbToHslTriplet(+match[0], +match[1], +match[2])
	}

	// Fallback: parse the hex directly
	return rgbToHslTriplet(
		parseInt(fallbackHex.slice(1, 3), 16),
		parseInt(fallbackHex.slice(3, 5), 16),
		parseInt(fallbackHex.slice(5, 7), 16)
	)
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
export function buildOscdShadcnThemeVars(): string {
	const primary = resolveOscdColorAsHsl('--oscd-primary')
	const secondary = resolveOscdColorAsHsl('--oscd-secondary')
	const error = resolveOscdColorAsHsl('--oscd-error')
	const base3 = resolveOscdColorAsHsl('--oscd-base3') // lightest bg
	const base2 = resolveOscdColorAsHsl('--oscd-base2') // muted bg
	const base1 = resolveOscdColorAsHsl('--oscd-base1') // subtle fg
	const base01 = resolveOscdColorAsHsl('--oscd-base01') // main fg text

	// Derive accent from primary hue (same hue, very high lightness)
	const primaryHue = primary.split(' ')[0]
	const accent = `${primaryHue} 40% 92%`
	const accentForeground = `${primaryHue} 64% 25%`

	return `
:root,
:host {
	--background: ${base3};
	--foreground: ${base01};
	--muted: ${base2};
	--muted-foreground: ${base1};
	--popover: ${base3};
	--popover-foreground: ${base01};
	--card: ${base3};
	--card-foreground: ${base01};
	--border: ${base2};
	--input: ${base2};
	--primary: ${primary};
	--primary-foreground: ${base3};
	--secondary: ${secondary};
	--secondary-foreground: ${base3};
	--accent: ${accent};
	--accent-foreground: ${accentForeground};
	--destructive: ${error};
	--destructive-foreground: ${base3};
	--ring: ${primary};
	--radius: 0.5rem;
	--sidebar-background: ${base3};
	--sidebar-foreground: ${base01};
	--sidebar-primary: ${primary};
	--sidebar-primary-foreground: ${base3};
	--sidebar-accent: ${secondary};
	--sidebar-accent-foreground: ${base3};
	--sidebar-border: ${base2};
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
