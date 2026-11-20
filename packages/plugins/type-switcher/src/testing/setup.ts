import { vi } from 'vitest'

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
})

vi.mock('@omicronenergy/oscd-ui/icon/OscdIcon.js', () => ({
	OscdIcon: class extends HTMLElement {}
}))
