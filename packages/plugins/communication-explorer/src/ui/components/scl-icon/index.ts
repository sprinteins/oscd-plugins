import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js'

if (!customElements.get('oscd-icon')) {
	customElements.define('oscd-icon', OscdIcon)
}
