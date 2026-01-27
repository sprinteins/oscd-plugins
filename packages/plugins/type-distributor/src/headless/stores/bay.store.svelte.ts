class UseBayStore {
	selectedBay: string | null = $state<string | null>(null)
	selectedBayUuid = $state<string | null>(null)
	assigendBayType: string | null = null // As soon as any lnode is assigned
}

export const bayStore = new UseBayStore()
