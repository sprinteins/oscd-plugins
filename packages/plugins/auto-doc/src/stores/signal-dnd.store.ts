import { writable, get } from 'svelte/store'

class SignalDndStore {
	private _draggedIndex = writable<number>(-1)
	private _dropIndex = writable<number>(-1)

	handleDragStart(index: number) {
		console.log('DragStart:', index)
		this._draggedIndex.set(index)
	}

	handleDragEnd(index: number) {
		console.log('DragEnd:', index)
		this._draggedIndex.set(-1)
	}

	get draggedIndex() {
		return get(this._draggedIndex)
	}

	get dropIndex() {
		return get(this._dropIndex)
	}
}

export const signalDndStore = new SignalDndStore()
