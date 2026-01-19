class UseBayStore {
    selectedBay: string | null = null
    selectedBayUuid: string | null = null
    assigendBayType: string | null = null // As soon as any lnode is assigned
}

export const bayStore = new UseBayStore()