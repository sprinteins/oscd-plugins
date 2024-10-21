import { createElement } from '@oscd-plugins/core';
import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

//==== STATE
const privateArea = writable<Element | null>(null);

//==== PRIVATE ACTIONS
function setPrivateArea(xmlDocument: Document) {
    const newPrivateArea = createPrivateArea(xmlDocument);
    privateArea.set(newPrivateArea);
}

//==== PUBLIC ACTIONS
function getDocDef(xmlDocument: Document, id: string) {
    const privateArea = xmlDocument.documentElement.querySelector('Private[type="AUTO_DOC"]');
    if (privateArea) {
        return privateArea.querySelector(`DocDef[id="${id}"]`);
    }
    return null;
}

function getAllDocDefs(xmlDocument: Document) {
    const privateArea = xmlDocument.documentElement.querySelector('Private[type="AUTO_DOC"]');
    if (privateArea) {
        return Array.from(privateArea.querySelectorAll('DocDef'));
    }
    return [];
}

function addDocDef(xmlDocument: Document, description: string): string | null {
    let generatedId: string | null = null;

    privateArea.subscribe(currentPrivateArea => {
        if (currentPrivateArea) {
            const id = uuidv4();
            const newDocDef = createElement(xmlDocument, 'DocDef', {
                id: id,
                date: new Date().toISOString(),
                description: description
            });
            currentPrivateArea.appendChild(newDocDef);
            generatedId = id;
        }
    })();

    return generatedId;
}

function addContentToDocDef(xmlDocument: Document, docDefElement: Element, content: string) {
    const contentElement = createElement(xmlDocument, 'Content', {});
    contentElement.textContent = content;
    docDefElement.appendChild(contentElement);
}

function createPrivateArea(xmlDocument: Document): Element {
    // Locate the root element
    const rootElement = xmlDocument.documentElement;

    // Check if the Private element with type="AUTO_DOC" already exists
    const existingPrivateArea = rootElement.querySelector('Private[type="AUTO_DOC"]');
    if (existingPrivateArea) {
        return existingPrivateArea;
    }

    // Create the private area with the attribute type="AUTO_DOC"
    const newPrivateArea = createElement(xmlDocument, 'Private', { type: 'AUTO_DOC' });

    // Append the private area to the root element
    rootElement.appendChild(newPrivateArea);

    return newPrivateArea;
}

//==== INITIALIZATION
function init(xmlDocument: Document) {
    setPrivateArea(xmlDocument);
}

export const docTemplatesStore = {
    // state
    privateArea,
    // actions
    init,
    createPrivateArea,
    addDocDef,
    addContentToDocDef,
    getDocDef,
    getAllDocDefs
};