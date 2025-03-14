class UseDialogStore {
	dialogRef = $state<HTMLDialogElement | null>(null)
	isOpen = $state(false)

	openDialog() {
		this.dialogRef?.showModal()
		this.isOpen = true
	}

	closeDialog() {
		this.dialogRef?.close()
	}
}

export const dialogStore = new UseDialogStore()
