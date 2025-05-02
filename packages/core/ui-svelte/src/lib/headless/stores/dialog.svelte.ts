// SVELTE
import { mount, unmount, tick } from 'svelte'
// TYPES
import type { Component, ComponentProps } from 'svelte'

class UseDialogStore {
	//====== STATES ======//

	dialogRef = $state<HTMLDialogElement>()
	// biome-ignore lint/suspicious/noExplicitAny: this complies to the return type of mount
	innerComponent = $state.raw<Record<string, any>>()
	innerComponentTargetRef = $state<HTMLElement>()
	isOpen = $state(false)
	private resolvePromise: ((value: string | undefined) => void) | undefined =
		undefined

	//====== ACTIONS ======//

	// biome-ignore lint/suspicious/noExplicitAny: the component can have any props
	mountInnerComponent<GenericInnerComponent extends Component<any>>(params: {
		innerComponent: GenericInnerComponent
		innerComponentProps?: ComponentProps<GenericInnerComponent>
	}) {
		if (!this.innerComponent && this.innerComponentTargetRef)
			this.innerComponent = mount(params.innerComponent, {
				target: this.innerComponentTargetRef,
				props: params.innerComponentProps || {}
			})
	}

	async unmountInnerComponent() {
		if (this.innerComponent) {
			await unmount(this.innerComponent, { outro: false })
			this.innerComponent = undefined
		}
	}

	openDialog() {
		this.dialogRef?.showModal()
		this.isOpen = true
		return new Promise<string | undefined>((resolve) => {
			this.resolvePromise = resolve
		})
	}

	async closeDialog(returnValue?: string) {
		await this.unmountInnerComponent()

		this.dialogRef?.close()
		this.isOpen = false

		if (returnValue && this.resolvePromise) {
			this.resolvePromise(returnValue)
			this.resolvePromise = undefined
		}
	}

	resetReturnValue() {
		if (this.dialogRef) this.dialogRef.returnValue = ''
	}
}

export const dialogStore = new UseDialogStore()
