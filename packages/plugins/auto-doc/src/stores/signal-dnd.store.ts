import { writable, get } from 'svelte/store'

class SignalDndStore {
  private _draggedIndex = writable<number>(-1)
  private _dropIndex = writable<number>(-1)

  handleDragStart(index: number) {
    console.log('handleDragStart', index)
    this._draggedIndex.set(index)
  }

  handleDragEnd() {
    console.log('handleDragEnd, draggedIndex', this.draggedIndex, 'dropIndex', this.dropIndex)
    this._draggedIndex.set(-1)
    this._dropIndex.set(-1)
  }

  updateDropIndex(index: number) {
    this._dropIndex.set(index)
  }

  get draggedIndex() {
    return get(this._draggedIndex)
  }

  get dropIndex() {
    return get(this._dropIndex)
  }
}

export const signalDndStore = new SignalDndStore() 