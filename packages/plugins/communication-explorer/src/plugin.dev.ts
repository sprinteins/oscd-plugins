import { sclMockA, sclMockB, sclMockC } from '@oscd-plugins/core-api/mocks/v1'
import { mount } from 'svelte'
import Plugin from './plugin.svelte'

const MOCKS = { sclMockA, sclMockB, sclMockC }
const activeMock: keyof typeof MOCKS = 'sclMockA' // select Test-File for local Development

mount(Plugin, {
	target: document.getElementById('plugin') as Element,
	props: {
		doc: new DOMParser().parseFromString(MOCKS[activeMock], 'text/xml'),
		docName: activeMock,
		editCount: 0,
		locale: 'en'
	}
})
