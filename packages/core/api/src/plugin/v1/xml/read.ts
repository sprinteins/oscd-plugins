import type { Utils } from '@/plugin/v1/utils'
import type { Xml } from './types'
import type { AvailableStandardVersion } from '@oscd-plugins/core-standard'

<<<<<<< Updated upstream
export function findElementsBySelector<
	CurrentDefinitionElement extends Utils.CurrentDefinitionElements
=======
export function findOneElementBySelector<
	GenericVersion extends AvailableStandardVersion,
	CurrentDefinitionElement extends
		Utils.CurrentDefinitionElement<GenericVersion>
>>>>>>> Stashed changes
>({
	selector,
	root
}: {
	selector: string
	root: Element
}): Xml.SclElement<GenericVersion, CurrentDefinitionElement> | null {
	return root.querySelector(selector)
}

export function findAllElementsBySelector<
	GenericVersion extends AvailableStandardVersion,
	CurrentDefinitionElement extends
		Utils.CurrentDefinitionElement<GenericVersion>
>({
	selector,
	root
}: {
	selector: string
	root: Element
}): Xml.SclElement<GenericVersion, CurrentDefinitionElement>[] {
	return Array.from(root.querySelectorAll(selector))
}
