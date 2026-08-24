import { expect, test } from '@playwright/test'

test.describe('Type Designer end-to-end tests', () => {
	test('loads the development harness and mounts the plugin', async ({
		page,
	}) => {
		await page.goto('/')

		const pluginContainer = page.locator('#plugin')

		await expect(pluginContainer).toBeVisible()
		await expect(pluginContainer).not.toBeEmpty()

		await expect(
			page.getByText('Bay Types', { exact: true }),
		).toBeVisible()

		await expect(
			page.getByText('Equipment Types', { exact: true }),
		).toBeVisible()

		await expect(
			page.getByText('Function Types', { exact: true }),
		).toBeVisible()

		await expect(
			page.getByText('LN Types', { exact: true }),
		).toBeVisible()
	})

	test('filters Bay Types through the visible search input', async ({
		page,
	}) => {
		await page.goto('/')

		const bayTypeSearch = page.getByPlaceholder(
			'Search by BayType',
		)

		await expect(bayTypeSearch).toBeVisible()

		await expect(
			page.getByText('Bay_1', { exact: true }),
		).toBeVisible()

		await expect(
			page.getByText('Bay_2', { exact: true }),
		).toBeVisible()

		await bayTypeSearch.fill('Bay_1')

		await expect(
			page.getByText('Bay_1', { exact: true }),
		).toBeVisible()

		await expect(
			page.getByText('Bay_2', { exact: true }),
		).toBeHidden()

		await bayTypeSearch.clear()

		await expect(
			page.getByText('Bay_2', { exact: true }),
		).toBeVisible()
	})

    /* test('creates a new Bay Type through the visible user interface', async ({
        page,
    }) => {
        await page.goto('/')

        const bayTypeAddElement = page.getByTestId('bayType-add-element')

        const bayTypeInput = bayTypeAddElement.getByRole('textbox')
        const addBayTypeButton = bayTypeAddElement.getByRole('button', {
            name: 'Add',
        })

        await expect(bayTypeInput).toBeVisible()
        await expect(addBayTypeButton).toBeVisible()

        await bayTypeInput.fill('E2E_Bay')

        await expect(addBayTypeButton).toBeEnabled()

        await addBayTypeButton.click()

        await expect(
            page.getByText('E2E_Bay_1', { exact: true }),
        ).toBeVisible()
    }) */
})