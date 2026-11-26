// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/svelte'
import { afterEach, expect, it, vi } from 'vitest'
import TelemetryView from './telemetry-view.svelte'

afterEach(() => {
	cleanup()
})

it('GIVEN the TelemetryView WHEN rendered THEN its legacy-compatible layout tokens are available', async () => {
	const root = document.implementation.createDocument(
		'',
		'SCL',
		null
	).documentElement
	const { container } = render(TelemetryView, {
		root,
		onDiagramSizeCalculated: vi.fn()
	})

	await vi.waitFor(() => {
		expect(container.querySelector('.root')).toBeTruthy()
		expect(container.querySelector('.sidebar')).toBeTruthy()
		expect(container.querySelector('.sidebar-content')).toBeTruthy()
	})

	const view = container.querySelector('.root')
	if (!(view instanceof HTMLElement)) {
		throw new Error('Expected TelemetryView root element')
	}
	const styles = getComputedStyle(view)
	const sidebarContent = container.querySelector('.sidebar-content')

	expect(styles.height).toBe('100%')
	expect(styles.getPropertyValue('--sidebar-width').trim()).toBe('400px')
	expect(styles.getPropertyValue('--color-sidebar-background').trim()).toBe(
		'#fdf6e3'
	)
	expect(styles.getPropertyValue('--color-canvas-background').trim()).toBe(
		'#f3ecda'
	)
	expect(sidebarContent).toBeInstanceOf(HTMLElement)
	expect(sidebarContent?.classList.contains('bg-background')).toBe(false)
	expect(styles.getPropertyValue('--color-message-goose').trim()).toBe(
		'#288409'
	)
	expect(styles.getPropertyValue('--color-message-mms').trim()).toBe(
		'#3253a8'
	)
	expect(
		styles.getPropertyValue('--color-message-sampledvalues').trim()
	).toBe('#c73c61')
})
