import definition from '../constants/definition.generated'

// INFINITE LOOP VIA EQFUNCTION AND GENERAL EQUIPMENT
// scl.substation.voltageLevel.powerTransformer.transformerWinding.subEquipment.eqFunction.generalEquipment.eqFunction.generalEquipment.eqFunction

const structure: Record<string, any> = {}
let currentPath = ''
export default function buildStructure(definition, entrypoint) {
	const subElements =
		definition[entrypoint]?.subElements &&
		Object.keys(definition[entrypoint].subElements)
	if (
		subElements &&
		(!subElements.length ||
			(subElements.length === 1 && subElements.includes('anyAllowed')))
	)
		return currentPath.split('.').slice(0, -1).join('.')

	currentPath = currentPath ? `${currentPath}.${entrypoint}` : entrypoint

	for (const subElement of subElements) {
		if (subElement === 'anyAllowed') continue
		if (!currentPath.includes('.')) structure[subElement] = {}
		else setResult(subElement, currentPath)
		buildStructure(definition, subElement)
		console.log(structure)
	}

	currentPath = currentPath.split('.').slice(0, -1).join('.')
}

function setResult(result, currentPath) {
	const pathArray = currentPath.split('.')
	console.log(currentPath)
	let currentLevel = structure

	for (let i = 1; i < pathArray.length; i++) {
		const path = pathArray[i]
		if (!currentLevel[path]) {
			currentLevel[path] = {}
		}
		if (i === pathArray.length - 1) {
			currentLevel[path] = { ...currentLevel[path], [result]: {} }
		} else {
			currentLevel = currentLevel[path]
		}
	}
}

buildStructure(definition, 'scl')
console.log(structure)
