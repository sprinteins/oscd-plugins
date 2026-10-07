import { XMLEditor } from '@openscd/oscd-editor'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'
import { mount } from 'svelte'
import Plugin from './plugin.svelte'

mount(Plugin, {
	target: document.getElementById('plugin') as Element,
	props: {
		doc: new DOMParser().parseFromString(ssdMockA, 'text/xml'),
		docName: 'scl-mock-A.ssd',
		editCount: 0,
		editor: new XMLEditor(),
		locale: 'en',
		isCustomInstance: false
	}
})
