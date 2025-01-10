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
    rootElement.appendChild(newPrivateArea);

    eventStore.createAndDispatchActionEvent(rootElement, newPrivateArea);
    return newPrivateArea;
}

function insertBlockAtPosition(docDef: Element, blockIdElement: Element, position: number) {
    if (position >= 0 && position < docDef.children.length) {
        docDef.insertBefore(blockIdElement, docDef.children[position]);
    } else {
        docDef.appendChild(blockIdElement);
    }
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
        currentPrivateArea.appendChild(newDocDef);
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
            docTemplate.setAttribute('title', newTitle);
            updates.title = newTitle;
        }
        if (newDescription) {
            docTemplate.setAttribute('description', newDescription);
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

function addBlockToDocumentTemplate(docTemplate: Element, type: ElementType, position: number) {
    const generatedId = uuidv4();
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }
    const blockElement = createElement(xmlDoc, 'Block', { 
        id: generatedId,
        type: type 
    });
    docTemplate.appendChild(blockElement);

    insertBlockAtPosition(docTemplate, blockElement, position);
    eventStore.createAndDispatchActionEvent(docTemplate, blockElement);
    eventStore.moveAndDispatchActionEvent(docTemplate, docTemplate, blockElement, position);

    return generatedId;
}

function editBlockContentOfDocumentTemplate(docTemplate: Element, blockId: string, content: string) {
    const blockElement = docTemplate.querySelector(`Block[id="${blockId}"]`);
    if (blockElement) {
        blockElement.textContent = content;
        eventStore.updateAndDispatchActionEvent(blockElement, { content: content });
    }
}

function moveBlockInDocumentTemplate(docTemplate: Element, blockId: string, position: number) {
    const blockIdElement = docTemplate.querySelector(`Block[id="${blockId}"]`);
    if (blockIdElement) {
        insertBlockAtPosition(docTemplate, blockIdElement, position);
        eventStore.moveAndDispatchActionEvent(docTemplate, docTemplate, blockIdElement, position);
    }
}

function deleteBlockFromDocumentTemplate(docTemplate: Element, blockId: string) {
    const blockElement = docTemplate.querySelector(`Block[id="${blockId}"]`);
    if (blockElement && blockElement.parentNode === docTemplate) {
        docTemplate.removeChild(blockElement);
        eventStore.deleteAndDispatchActionEvent(docTemplate, blockElement);
    }
}

function deleteDocumentTemplate(docTemplateId: string) {
    const currentPrivateArea = get(autoDocArea);
    if (currentPrivateArea) {
        const docTemplate = getDocumentTemplate(docTemplateId);
        if (docTemplate) {
            currentPrivateArea.removeChild(docTemplate);
            eventStore.deleteAndDispatchActionEvent(currentPrivateArea, docTemplate);
        }
    }
}

function duplicateDocumentTemplate(docTemplateId: string, newTitle: string, newDescription: string) {
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const currentPrivateArea = get(autoDocArea);
    if (currentPrivateArea) {
        const docTemplate = getDocumentTemplate(docTemplateId);
        if (docTemplate) {
            const newDocTemplate = docTemplate.cloneNode(true) as Element;
            newDocTemplate.setAttribute('id', uuidv4());
            newDocTemplate.setAttribute('date', new Date().toISOString());
            newDocTemplate.setAttribute('title', newTitle);
            newDocTemplate.setAttribute('description', newDescription);

            const blocks = newDocTemplate.querySelectorAll('Block');
            for (const block of blocks) {
                block.setAttribute('id', uuidv4());
            }

            currentPrivateArea.appendChild(newDocTemplate);
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
    duplicateDocumentTemplate
};