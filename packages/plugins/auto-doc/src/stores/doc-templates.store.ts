import { createElement } from '@oscd-plugins/core';
import { writable } from 'svelte/store';

//==== STATE
const privateArea = writable<Element | null>(null);

//==== PRIVATE ACTIONS
function setPrivateArea(newXmlDocument: Document) {
    const newPrivateArea = createPrivateArea(newXmlDocument);
    privateArea.set(newPrivateArea);
}

//==== PUBLIC ACTIONS
function createPrivateArea(newXmlDocument: Document): Element {
    // Locate the root element
    const rootElement = newXmlDocument.documentElement;

    // Check if the Private element with type="AUTO_DOC" already exists
    const existingPrivateArea = rootElement.querySelector('Private[type="AUTO_DOC"]');
    if (existingPrivateArea) {
        return existingPrivateArea;
    }

    // Create the private area with the attribute type="AUTO_DOC"
    const newPrivateArea = createElement(newXmlDocument, 'Private', { type: 'AUTO_DOC' });

    // Append the private area to the root element
    rootElement.appendChild(newPrivateArea);

    return newPrivateArea;
}

//==== INITIALIZATION
function init(newXmlDocument: Document) {
    setPrivateArea(newXmlDocument);
}

export const docTemplatesStore = {
    // state
    privateArea,
    // actions
    init,
    createPrivateArea
};