import type { Insert } from '@openscd/oscd-api'
import { createElement } from '@oscd-plugins/core'

export function ensureDataTypeTemplates(doc: XMLDocument): {
    element: Element
    edit: Insert | null
} {
    let dataTypeTemplates = doc.querySelector('DataTypeTemplates')
    if (!dataTypeTemplates) {
        dataTypeTemplates = createElement(doc, 'DataTypeTemplates', {})
        const root = doc.documentElement

        const edit: Insert = {
            node: dataTypeTemplates,
            parent: root,
            reference: null
        }
        return { element: dataTypeTemplates, edit }
    }
    return { element: dataTypeTemplates, edit: null }
}
