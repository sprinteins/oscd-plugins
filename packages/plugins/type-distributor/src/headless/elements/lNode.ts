import type { LNodeTemplate } from "../types";

export function createLNodeElement(lNode: LNodeTemplate, iedName: string, doc: XMLDocument): Element {
  const lnElement = doc.createElement(lNode.lnClass === "lln0" ? "LLN0" : "LN");
  lnElement.setAttribute("lnClass", lNode.lnClass);
  lnElement.setAttribute("lnType", lNode.lnType);
  lnElement.setAttribute("lnInst", lNode.lnInst);
  lnElement.setAttribute("iedName", iedName);

  return lnElement;
}