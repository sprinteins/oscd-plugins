import type { Utils } from '@/plugin/v1/utils'
import type { Xml } from './types'

export function findElementsBySelector<
	CurrentDefinitionElement extends Utils.CurrentDefinitionElements
>({
	selector,
	root
}: {
	selector: string
	root: Element
}): Xml.SclElement<CurrentDefinitionElement>[] {
	return Array.from(root.querySelectorAll(selector))
}
