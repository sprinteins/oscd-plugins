// SVELTE
import { get } from "svelte/store";
// STORES
import { pluginStore } from './index'


//====== STORES ======//
const { xmlDocument } = pluginStore

//====== TYPES ======//
type Placeholder = string;
interface ColumnWithPlaceholder {
    columnTitle: string;
    placeholder: Placeholder;
}
interface PlaceholderTable {
    tableColumns: ColumnWithPlaceholder[];
}

//==== PRIVATE ACTIONS
const namespaceResolver = (prefix: string | null): string | null => {
    const namespaces: { [key: string]: string } = {
        'default': 'http://www.iec.ch/61850/2003/SCL',
        'xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'sxy': 'http://www.iec.ch/61850/2003/SCLcoordinates'
    };
    if (prefix === null) return null;
    return namespaces[prefix] || null;
};

//==== PUBLIC ACTIONS
// Example usage
// fillPlaceholder(
//     "This is a {{//default:IED[1]/@manufacturer}} and {{//default:IED/default:Services/@name}}."
// );
// Don't forget to add the namespace in the XPath expression
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
            return 'Error evaluating XPath';
        }
    });
}

function fillTableWithPlaceholders(table: PlaceholderTable): string {

        const headers = table.tableColumns.map(col => col.columnTitle).join(' | ');
        const separator = table.tableColumns.map(() => '---').join(' | ');
        const rowsArray = table.tableColumns.map(col => {
            const filledPlaceholder = fillPlaceholder(`{{${col.placeholder}}}`);
            return filledPlaceholder.split(', ');
        });

        const numRows = Math.max(...rowsArray.map(arr => arr.length));
        const rows = Array.from({ length: numRows }, (_, rowIndex) => {
            return rowsArray.map(colArray => colArray[rowIndex] || '').join(' | ');
        }).join(' |\n| ');

        return `| ${headers} |\n| ${separator} |\n| ${rows} |`;
}
export const placeholderStore = {
    // actions
    fillPlaceholder,
    fillTableWithPlaceholders
};
