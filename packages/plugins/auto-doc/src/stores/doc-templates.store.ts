import { v4 as uuidv4 } from 'uuid';
import type {ElementType} from '@/components/elements/types.elements'

// OPENSCD
import { createElement } from '@oscd-plugins/core'
// SVELTE
import { writable, get } from 'svelte/store'
// STORES
import { pluginStore, eventStore } from './index'

//====== STORES ======//
const { xmlDocument } = pluginStore

//==== STATE
const autoDocArea = writable<Element | null>(null);

//==== PRIVATE ACTIONS
function setAutoDocArea() {
    const xmlDoc = get(xmlDocument);
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
    const xmlDoc = get(xmlDocument);
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
    const xmlDoc = get(xmlDocument);
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
        eventStore.deleteAndDispatchActionEvent(docTemplate, blockElement);
    }
}

function deleteDocumentTemplate(docTemplateId: string) {
    const currentPrivateArea = get(autoDocArea);
    if (currentPrivateArea) {
        const docTemplate = getDocumentTemplate(docTemplateId);
        if (docTemplate) {
            eventStore.deleteAndDispatchActionEvent(currentPrivateArea, docTemplate);
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
    const xmlDoc = get(xmlDocument);
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
    duplicateBlockFromDocumentTemplate,
};