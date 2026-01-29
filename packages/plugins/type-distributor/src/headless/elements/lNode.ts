import type { LNodeTemplate } from "../types";

export function createLNodeElement(lNode: LNodeTemplate, doc: XMLDocument): Element {
  const lnElement = doc.createElement(lNode.lnClass === "LLN0" ? "LLN0" : "LN");
  lnElement.setAttribute("lnClass", lNode.lnClass);
  lnElement.setAttribute("lnType", lNode.lnType);
  lnElement.setAttribute("lnInst", lNode.lnInst);

  return lnElement;
}

export function hasLNode(lDevice: Element, lNode: LNodeTemplate): boolean {
	return Array.from(lDevice.children).some(
		(child) =>
			(child.localName === 'LN' || child.localName === 'LLN0') &&
			child.getAttribute('lnClass') === lNode.lnClass &&
			child.getAttribute('lnType') === lNode.lnType &&
			child.getAttribute('lnInst') === lNode.lnInst
	)
}