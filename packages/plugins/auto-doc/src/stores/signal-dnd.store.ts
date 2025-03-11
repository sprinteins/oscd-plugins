import { writable } from 'svelte/store'

class SignalDndStore {
  private _draggedIndex = writable<number>(-1)
  private _dropIndex = writable<number>(-1)

  handleDragStart(index: number) {
    this._draggedIndex.set(index)
  }

  handleDragEnd() {
    this._draggedIndex.set(-1)
    this._dropIndex.set(-1)
  }

  updateDropIndex(index: number) {
    this._dropIndex.set(index)
  }

  get draggedIndex() {
    let value: number
    this._draggedIndex.subscribe(v => value = v)()
    return value!
  }

  get dropIndex() {
    let value: number
    this._dropIndex.subscribe(v => value = v)()
    return value
  }
}

export const signalDndStore = new SignalDndStore() 