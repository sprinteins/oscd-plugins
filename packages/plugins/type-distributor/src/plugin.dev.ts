import { mount } from 'svelte'
import Plugin from './plugin.svelte'
import { sclMockA } from '@oscd-plugins/core-api/mocks/v1'
import { XMLEditor } from '@openscd/oscd-editor'

mount(Plugin, {
	target: document.getElementById('plugin') as Element,
	props: {
		doc: new DOMParser().parseFromString(sclMockA, 'text/xml'),
		docName: 'scl-mock-A',
		editCount: 0,
		editor: new XMLEditor(),
		locale: 'en',
		isCustomInstance: false
	}
})
