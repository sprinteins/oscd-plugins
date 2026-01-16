class UseBayStore {
	selectedBay = $state<string | null>(null)
	selectedBayUuid = $state<string | null>(null)
}

export const bayStore = new UseBayStore()
