export function createLDeviceElement(lDeviceInst: string, doc: XMLDocument): Element {
  const lDevice = doc.createElement("LDevice");
  lDevice.setAttribute("inst", lDeviceInst);
  return lDevice;
}

export function getLDevice(server: Element, lDeviceInst: string): Element | undefined {
  return Array.from(server.children).find(
    (child) =>
      child.localName === "LDevice" && child.getAttribute("inst") === lDeviceInst,
  );
}