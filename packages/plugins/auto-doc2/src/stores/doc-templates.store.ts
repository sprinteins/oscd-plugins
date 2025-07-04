import { v4 as uuidv4 } from 'uuid';
import type {ElementType} from '@/ui/components/elements/types.elements'

// OPENSCD
import { createElement } from '@oscd-plugins/core'
// SVELTE
import { writable, get } from 'svelte/store'
// STORES
import { eventStore } from './index'

//====== STORES ======//
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

//==== STATE
const autoDocArea = writable<Element | null>(null);

//==== PRIVATE ACTIONS
function setAutoDocArea() {
    const xmlDoc = pluginGlobalStore.xmlDocument;
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }
    const newAutoDocArea = createAutoDocArea(xmlDoc);
    autoDocArea.set(newAutoDocArea);

}

function createAutoDocArea(xmlDocument: Document): Element {
    const rootElement = xmlDocument.documentElement;
    const existingAutoDocArea = rootElement.querySelector('Private[type="AUTO_DOC"]');
    if (existingAutoDocArea) {
        return existingAutoDocArea;
    }
    const newPrivateArea = createElement(xmlDocument, 'Private', { type: 'AUTO_DOC' });
    eventStore.createAndDispatchActionEvent(rootElement, newPrivateArea);
    return newPrivateArea;
}
function getAutoDocArea() {
    const privateArea = get(autoDocArea);
    if (!privateArea) {
        throw new Error("AutoDoc area is not defined");
    }

    return privateArea;
}

//==== PUBLIC ACTIONS
function getDocumentTemplate(id: string): Element | null {
    const currentPrivateArea = get(autoDocArea);
    if (currentPrivateArea) {
        return currentPrivateArea.querySelector(`DocumentTemplate[id="${id}"]`);
    }
    return null;
}

function getAllDocumentTemplates() {
    const currentPrivateArea = get(autoDocArea);
    if (currentPrivateArea) {
        return Array.from(currentPrivateArea.querySelectorAll('DocumentTemplate'));
    }
    return [];
}

function getAllBlocksOfDocumentTemplate(docTemplateId: string) {
    const docTemplate = getDocumentTemplate(docTemplateId);
    if (docTemplate) {
        return Array.from(docTemplate.querySelectorAll('Block'));
    }
    return [];
}

function getBlockOfDocumentTemplate(docTemplateId: string, blockId: string) {
    const docTemplate = getDocumentTemplate(docTemplateId);
    if (docTemplate) {
        return docTemplate.querySelector(`Block[id="${blockId}"]`);
    }
    return null;
}

function addDocumentTemplate(): string | null {
    let generatedId: string | null = null;
    const xmlDoc = pluginGlobalStore.xmlDocument;
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const currentPrivateArea = get(autoDocArea);
    if (currentPrivateArea) {
        const id = uuidv4();

        const newDocDef = createElement(xmlDoc, 'DocumentTemplate', {
            id: id,
            date: new Date().toISOString()
        });

        eventStore.createAndDispatchActionEvent(currentPrivateArea, newDocDef);
        generatedId = id;
    }

    return generatedId;
}

function importDocumentTemplates(docTemplates: Element[]) {
    const xmlDoc = pluginGlobalStore.xmlDocument;
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const currentPrivateArea = get(autoDocArea);
    if (!currentPrivateArea) {
        throw new Error('No auto doc private area found')
    }

    // Import to own doc, so there are no references to the original doc
    const importedDocTemplates = docTemplates.map(docTemplate => xmlDoc.importNode(docTemplate, true))

    eventStore.createMultipleAndDispatchActionEvent(currentPrivateArea, importedDocTemplates, 'Import auto doc templates');
}

function editDocumentTemplateTitleAndDescription(docTemplateId: string, newTitle?: string, newDescription?: string) {
    const docTemplate = getDocumentTemplate(docTemplateId);
    if (docTemplate) {
        const updates: { title?: string; description?: string, id?: string; date?: string } = {};
        if (newTitle) {
            updates.title = newTitle;
        }
        if (newDescription) {
            updates.description = newDescription;
        }
        const id = docTemplate.getAttribute('id');
        if (id) {
            updates.id = id;
        }
        const date = docTemplate.getAttribute('date');
        if (date) {
            updates.date = date;
        }
        if (Object.keys(updates).length > 0) {
            eventStore.updateAndDispatchActionEvent(docTemplate, updates);
        }
    }
}

function addBlockToDocumentTemplate(docTemplate: Element, type: ElementType, reference?: Element | null) {
    const generatedId = uuidv4();
    const xmlDoc = pluginGlobalStore.xmlDocument;
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }
    const blockElement = createElement(xmlDoc, 'Block', { 
        id: generatedId,
        type: type 
    });

    eventStore.createAndDispatchActionEvent(docTemplate, blockElement, reference);

    return generatedId;
}

function editBlockContentOfDocumentTemplate(docTemplate: Element, blockId: string, content: string) {
    const blockElement = docTemplate.querySelector(`Block[id="${blockId}"]`);
    if (blockElement) {

        const blockIdAttribute = blockElement.getAttribute('id');
        const blockTypeAttribute = blockElement.getAttribute('type');
        blockElement.textContent = content;

        eventStore.updateAndDispatchActionEvent(blockElement, { id: blockIdAttribute, type: blockTypeAttribute });
    }
}

function moveBlockInDocumentTemplate(docTemplate: Element, blockId: string, reference?: Element | null) {
    const blockIdElement = docTemplate.querySelector(`Block[id="${blockId}"]`);
    if (blockIdElement) {
        eventStore.moveAndDispatchActionEvent(docTemplate, blockIdElement, reference);
    }
}

function deleteBlockFromDocumentTemplate(docTemplate: Element, blockId: string) {
    const blockElement = docTemplate.querySelector(`Block[id="${blockId}"]`);
    if (blockElement && blockElement.parentNode === docTemplate) {
        eventStore.deleteAndDispatchActionEvent(blockElement);
    }
}

function deleteDocumentTemplate(docTemplateId: string) {
    const currentPrivateArea = get(autoDocArea);
    if (currentPrivateArea) {
        const docTemplate = getDocumentTemplate(docTemplateId);
        if (docTemplate) {
            eventStore.deleteAndDispatchActionEvent(docTemplate);
        }
    }
}

function duplicateBlockFromDocumentTemplate(docTemplate: Element, blockId: string, position: number) {
    const blockElement = docTemplate.querySelector(`Block[id="${blockId}"]`);
    if(!blockElement || blockElement.parentNode !== docTemplate) {
        return null;
    }
    
    const duplicatedElement = blockElement.cloneNode(true) as Element;
    duplicatedElement.setAttribute("id", uuidv4());

    let reference: Element | null = null;
    if(position > 0) {
        const blocks = docTemplate.querySelectorAll("Block");
        reference = blocks[position];
    }

    eventStore.createAndDispatchActionEvent(docTemplate, duplicatedElement, reference);
    
    return duplicatedElement;
}

function duplicateDocumentTemplate(docTemplateId: string) {
    const xmlDoc = pluginGlobalStore.xmlDocument;
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const currentPrivateArea = get(autoDocArea);
    if (currentPrivateArea) {
        const docTemplate = getDocumentTemplate(docTemplateId);
        if (docTemplate) {
            const title = docTemplate.getAttribute('title');
            const description = docTemplate.getAttribute('description');

            const newDocTemplate = docTemplate.cloneNode(true) as Element;
            newDocTemplate.setAttribute('id', uuidv4());
            newDocTemplate.setAttribute('date', new Date().toISOString());
            newDocTemplate.setAttribute('title', `${title}_Copy`);
            newDocTemplate.setAttribute('description', `Copied from ${title}'s description: ${description}`);

            const blocks = newDocTemplate.querySelectorAll('Block');
            for (const block of blocks) {
                block.setAttribute('id', uuidv4());
            }

            eventStore.createAndDispatchActionEvent(currentPrivateArea, newDocTemplate);
        }
    }
}

function setMasterTemplateFlag(isMaster: boolean) {
    const currentPrivateArea = getAutoDocArea();

    const updates : {masterTemplate: string, type: string} = { masterTemplate: isMaster.toString(), type: 'AUTO_DOC' }
    eventStore.updateAndDispatchActionEvent(currentPrivateArea, updates);
}

function getMasterTemplateFlag() : boolean {
    const currentPrivateArea = getAutoDocArea()

    const flag = currentPrivateArea.getAttribute('masterTemplate');

    if(!flag) {return false}

    return flag === 'true';
}
//==== INITIALIZATION
function init() {
    setAutoDocArea();
}

export const docTemplatesStore = {
    // state
    privateArea: autoDocArea,
    // actions
    init,
    addDocumentTemplate,
    addBlockToDocumentTemplate,
    getDocumentTemplate,
    getAllDocumentTemplates,
    getBlockOfDocumentTemplate,
    getAllBlocksOfDocumentTemplate,
    moveBlockInDocumentTemplate,
    editDocumentTemplateTitleAndDescription,
    editBlockContentOfDocumentTemplate,
    deleteDocumentTemplate,
    deleteBlockFromDocumentTemplate,
    duplicateDocumentTemplate,
    importDocumentTemplates,
    duplicateBlockFromDocumentTemplate,
    setMasterTemplateFlag,
    getMasterTemplateFlag
};