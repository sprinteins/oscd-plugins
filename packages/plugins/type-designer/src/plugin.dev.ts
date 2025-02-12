import { mount } from 'svelte'
import Plugin from './plugin.svelte'
import { ssdMockA } from '@oscd-plugins/core-api/mocks/v1'

mount(Plugin, {
	target: document.getElementById('plugin') as Element,
	props: {
		doc: new DOMParser().parseFromString(ssdMockA, 'text/xml'),
		docName: 'scl-mock-A.ssd',
		editCount: 0,
		locale: 'en',
		isCustomInstance: false
	}
})
