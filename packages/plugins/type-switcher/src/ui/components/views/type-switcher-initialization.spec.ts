import { render } from '@testing-library/svelte'
import type { ComponentProps } from 'svelte'
import { afterEach, expect, it, vi } from 'vitest'
import type { TypeLinker } from '../type-linker'
import TypeSwitcher from './type-switcher.svelte'

vi.mock('../type-linker', () => ({
	TypeLinker: (
		_anchor: Comment,
		props: Pick<ComponentProps<typeof TypeLinker>, 'handleRelink'>
	) => {
		props.handleRelink({ sourceIndexes: [], targetIndex: -1 })
	}
}))

const onAction = vi.fn()

afterEach(() => {
	document.body.removeEventListener('editor-action', onAction)
	vi.restoreAllMocks()
})

it('GIVEN the view is not initialized WHEN a relink is requested THEN it logs an error without emitting an editor action', () => {
	const onError = vi.spyOn(console, 'error').mockImplementation(() => {})
	document.body.addEventListener('editor-action', onAction)
	const doc = new DOMParser().parseFromString('<SCL />', 'application/xml')

	render(TypeSwitcher, { doc: doc.documentElement })

	expect(onError).toHaveBeenCalledWith('Root or snackbar not initialized')
	expect(onAction).not.toHaveBeenCalled()
})
