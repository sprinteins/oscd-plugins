export function pushInStringArrayIfNotPresent(array: string[], string: string) {
	if (!array.includes(string)) array.push(string)
}
