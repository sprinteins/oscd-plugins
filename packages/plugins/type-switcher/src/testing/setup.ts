import { vi } from 'vitest'

vi.mock('@omicronenergy/oscd-ui/icon/OscdIcon.js', () => ({
	OscdIcon: class extends HTMLElement {}
}))
