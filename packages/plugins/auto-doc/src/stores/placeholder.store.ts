// SVELTE
import { get } from "svelte/store";
// STORES
import { pluginStore } from './index'


//====== STORES ======//
const { xmlDocument } = pluginStore

//==== PRIVATE ACTIONS
const namespaceResolver = (prefix: string | null): string | null => {
    const namespaces: { [key: string]: string } = {
        '': 'http://www.iec.ch/61850/2003/SCL',
        'xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'sxy': 'http://www.iec.ch/61850/2003/SCLcoordinates'
    };
    if (prefix === null) return null;
    return namespaces[prefix] || null;
};

//==== PUBLIC ACTIONS
function fillPlaceholder(markdownText: string): string {
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    return markdownText.replace(/{{(.*?)}}/g, (match, placeholder) => {

        try {
            const result = xmlDoc.evaluate(
                placeholder,
                xmlDoc,
                namespaceResolver,
                XPathResult.ANY_TYPE,
                null
            );

            const values: string[] = [];
            let node = result.iterateNext();

            while (node) {
                values.push(node.textContent || 'N/A');
                node = result.iterateNext();
            }

            const value = values.length > 1 ? values.join(', ') : values[0] || 'N/A';
            return value;
        } catch (error) {
            console.error(`Error evaluating XPath ${placeholder}:`, error);
            return 'Error';
        }
    });
}

export const placeholderStore = {
    // actions
    fillPlaceholder
}