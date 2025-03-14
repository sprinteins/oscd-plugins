export const autoDocIdentifier = 'AUTO_DOC'

export function getAutoDocElement(xmlDocument: Document): Element | null {
    return xmlDocument.documentElement.querySelector(`Private[type="${autoDocIdentifier}"]`)
}
