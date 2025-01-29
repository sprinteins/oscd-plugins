export function findOneCustomElement({
	selector,
	root
}: {
	selector: string
	root: Element
}) {
	return root.querySelector(selector)
}

export function findAllCustomElement({
	selector,
	root
}: {
	selector: string
	root: Element
}) {
	return Array.from(root.querySelectorAll(selector))
}

export function findAllCustomElementsByTagNameNS({
	namespace,
	tagName,
	root
}: {
	namespace: string
	tagName: string
	root: Element
}) {
	return Array.from(root.getElementsByTagNameNS(namespace, tagName))
}
