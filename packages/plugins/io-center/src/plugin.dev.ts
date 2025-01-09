import { mount } from 'svelte'
import Plugin from './plugin.svelte'
import { parseXmlDocument } from '@oscd-plugins/core-api/instance/v1'

const { xmlDocument } = await parseXmlDocument()

mount(Plugin, {
	target: document.getElementById('plugin') as Element,
	props: {
		doc: xmlDocument,
		docName: 'scl-mock-A',
		editCount: 0,
		locale: 'en'
	}
})
