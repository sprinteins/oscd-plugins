import type { Component } from 'svelte'

class UseDialogStore {
	dialogRef = $state<HTMLDialogElement | null>(null)
	innerComponent = $state<
		| Component<
				Record<string, never>,
				{ closeCallback?: (() => void) | undefined },
				''
		  >
		| undefined
	>()
	isOpen = $state(false)
	private resolvePromise: ((value: string | undefined) => void) | undefined =
		undefined

	openDialog() {
		this.dialogRef?.showModal()
		this.isOpen = true
		return new Promise<string | undefined>((resolve) => {
			this.resolvePromise = resolve
		})
	}

	closeDialog(returnValue?: string) {
		this.dialogRef?.close()
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
