import { sclMockA, sclMockB, sclMockC } from '@oscd-plugins/core-api/mocks/v1'
import { mount } from 'svelte'
import Plugin from './plugin.svelte'

const MOCKS = { sclMockA, sclMockB, sclMockC }
const activeMock = MOCKS.sclMockA; // select Test-File for loca Development

mount(Plugin, {
	target: document.getElementById('plugin') as Element,
	props: {
		doc: new DOMParser().parseFromString(activeMock, 'text/xml'),
		docName: 'scl-mock-C',
		editCount: 0,
		locale: 'en'
	}
})
