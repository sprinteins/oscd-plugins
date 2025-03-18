import { writable, get } from 'svelte/store'

class SignalDndStore {
	_draggedIndex = writable<number>(-1)
	_dropIndex = writable<number>(-1)

	handleDragStart(index: number) {
		this._draggedIndex.set(index)
	}

	handleDragEnd(index: number) {
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
