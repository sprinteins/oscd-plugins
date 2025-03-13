export const autoDocIdentifier = 'AUTO_DOC'

export function getAutoDocElement(xmlDocument: Document): Element {
    return xmlDocument.documentElement.querySelector(`Private[type="${autoDocIdentifier}"]`) as Element
}
