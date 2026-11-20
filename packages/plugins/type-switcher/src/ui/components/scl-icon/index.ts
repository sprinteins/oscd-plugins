import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js'

// The host may already register this global element; lowercase imports register unconditionally.
if (!customElements.get('oscd-icon')) {
	customElements.define('oscd-icon', OscdIcon)
}
