import { mount } from 'svelte'
import Plugin from './plugin.svelte'
import { sclMockA } from '@oscd-plugins/core-api/mocks/v1'

mount(Plugin, {
	target: document.getElementById('plugin') as Element,
	props: {
		doc: new DOMParser().parseFromString(sclMockA, 'text/xml'),
		docName: 'scl-mock-A',
		editCount: 0,
		locale: 'en',
		isCustomInstance: false
	}
})
