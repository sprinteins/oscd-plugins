export function instantiateCustomElement(tagName: string, element: CustomElementConstructor) {
	customElements.define(tagName, element);
}