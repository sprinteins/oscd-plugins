import { sclMockA } from '@oscd-plugins/core-api/mocks/v1'
import { mount } from 'svelte'
import Plugin from './plugin.svelte'

mount(Plugin, {
	target: document.getElementById('plugin') as Element,
	props: {
		doc: new DOMParser().parseFromString(sclMockA, 'text/xml'),
		docName: 'scl-mock-A',
		editCount: 0,
		locale: 'en'
	}
})
