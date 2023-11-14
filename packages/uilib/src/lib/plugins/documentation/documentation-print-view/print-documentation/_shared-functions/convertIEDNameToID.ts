export function convertIEDNameToID(iedName: string, withHash: boolean): string {
	const newName = iedName.toLocaleLowerCase().replaceAll(" ", "_")
	if (withHash) {
		return `#href_ied_in_bay_${newName}`
	} else{
		return `href_ied_in_bay_${newName}`
	}
}