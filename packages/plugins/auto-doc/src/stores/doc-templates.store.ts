import { v4 as uuidv4 } from 'uuid';
// OPENSCD
import { createElement } from '@oscd-plugins/core'
// SVELTE
import { writable, get } from 'svelte/store'
// STORES
import { pluginStore } from './index'

//====== STORES ======//
const { xmlDocument } = pluginStore

//==== STATE
const autoDocArea = writable<Element | null>(null);

//==== PRIVATE ACTIONS
function setPrivateArea() {
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }
    const newPrivateArea = createPrivateArea(xmlDoc);
    autoDocArea.set(newPrivateArea);

}

function createPrivateArea(xmlDocument: Document): Element {
    const rootElement = xmlDocument.documentElement;
    const existingPrivateArea = rootElement.querySelector('Private[type="AUTO_DOC"]');
    if (existingPrivateArea) {
        return existingPrivateArea;
    }

    const newPrivateArea = createElement(xmlDocument, 'Private', { type: 'AUTO_DOC' });
    rootElement.appendChild(newPrivateArea);

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

function addDocumentTemplate(description: string): string | null {
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
            date: new Date().toISOString(),
            description: description
        });
        currentPrivateArea.appendChild(newDocDef);
        generatedId = id;
    }

    return generatedId;
}

function addBlockToDocumentTemplate(docTemplate: Element, content: string, type: string, position: number) {
    const generatedId = uuidv4();
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }
    const blockElement = createElement(xmlDoc, 'Block', { 
        id: generatedId,
        type: type 
    });
    blockElement.textContent = content;
    docTemplate.appendChild(blockElement);

    insertBlockAtPosition(docTemplate, blockElement, position);

    return generatedId;
}

function moveBlockInDocumentTemplate(docTemplate: Element, blockId: string, position: number) {
    const blockIdElement = docTemplate.querySelector(`Block[id="${blockId}"]`);
    if (blockIdElement) {
        insertBlockAtPosition(docTemplate, blockIdElement, position);
    }
}

function deleteBlockFromDocumentTemplate(docTemplate: Element, blockId: string) {
    // Find the block element in DocumentTemplate and remove it
    const blockElement = docTemplate.querySelector(`Block[id="${blockId}"]`);
    if (blockElement && blockElement.parentNode === docTemplate) {
        docTemplate.removeChild(blockElement);
    }
}

function deleteDocumentTemplate(docTemplateId: string) {
    const currentPrivateArea = get(autoDocArea);
    if (currentPrivateArea) {
        const docTemplate = getDocumentTemplate(docTemplateId);
        if (docTemplate) {
            currentPrivateArea.removeChild(docTemplate);
        }
    }
}

function duplicateDocumentTemplate(docTemplateId: string, newDescription: string) {
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
            newDocTemplate.setAttribute('description', newDescription);

            // Update the ids of the cloned Blocks
            const blocks = newDocTemplate.querySelectorAll('Block');
            for (const block of blocks) {
                block.setAttribute('id', uuidv4());
            }

            currentPrivateArea.appendChild(newDocTemplate);
        }
    }
}

//==== INITIALIZATION
function init() {
    setPrivateArea();
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
    deleteDocumentTemplate,
    deleteBlockFromDocumentTemplate,
    duplicateDocumentTemplate
};