import { createElement } from '@oscd-plugins/core';
import { docTemplatesStore } from './doc-templates.store';
import { describe, it, expect, beforeEach } from 'vitest';

describe('docTemplatesStore', () => {
  let xmlDocument: Document;

  beforeEach(() => {
    // Create a new XML document with a root element
    xmlDocument = document.implementation.createDocument(null, 'SCL', null);
  });

  it('should create a "private" element with type="AUTO_DOC" if it does not exist', () => {
    // Act
    const privateArea = docTemplatesStore.createPrivateArea(xmlDocument);

    // Assert
    expect(privateArea).not.toBeNull();
    expect(privateArea.tagName).toBe('Private');
    expect(privateArea.getAttribute('type')).toBe('AUTO_DOC');
    expect(xmlDocument.documentElement.contains(privateArea)).toBe(true);
  });

  it('should not create a new "private" element if one already exists', () => {
    // Arrange
    const existingPrivateArea = createElement(xmlDocument, 'Private', { type: 'AUTO_DOC' });
    xmlDocument.documentElement.appendChild(existingPrivateArea);

    // Act
    const privateArea = docTemplatesStore.createPrivateArea(xmlDocument);

    // Assert
    expect(privateArea).toBe(existingPrivateArea);
    expect(xmlDocument.documentElement.querySelectorAll('Private[type="AUTO_DOC"]').length).toBe(1);
  });

	it('should add a new "DocDef" element with current date, description, and id attributes', () => {
    // Arrange
    docTemplatesStore.init(xmlDocument);
    const currentDate = new Date().toISOString();
    const description = 'Test Description';

    // Act
    const generatedId = docTemplatesStore.addDocDef(xmlDocument, description);

    // Assert
    const privateArea = xmlDocument.documentElement.querySelector('Private[type="AUTO_DOC"]');
    const docDef = privateArea?.querySelector('DocDef');
    expect(docDef).not.toBeNull();
    expect(docDef?.getAttribute('date')).not.toBeNull();
    expect(docDef?.getAttribute('description')).toBe(description);
    expect(docDef?.getAttribute('id')).toBe(generatedId);
});

	it('should not add a "DocDef" element if private area is not initialized', () => {
		// Act
		docTemplatesStore.addDocDef(xmlDocument,"");

		// Assert
		const privateArea = xmlDocument.documentElement.querySelector('Private[type="AUTO_DOC"]');
		expect(privateArea).toBeNull();
	});

	it('should retrieve a "DocDef" element by id', () => {
		// Arrange
		docTemplatesStore.init(xmlDocument);
		const description = 'Test Description';
		docTemplatesStore.addDocDef(xmlDocument, description);
		const privateArea = xmlDocument.documentElement.querySelector('Private[type="AUTO_DOC"]');
		const docDef = privateArea?.querySelector('DocDef');
		const id = docDef?.getAttribute('id');

		// Act
		const retrievedDocDef = docTemplatesStore.getDocDef(xmlDocument, id);

		// Assert
		expect(retrievedDocDef).toBe(docDef);
	});

	it('should retrieve all "DocDef" elements', () => {
		// Arrange
		docTemplatesStore.init(xmlDocument);
		const descriptions = ['Description 1', 'Description 2'];
		for (const desc of descriptions) {
			docTemplatesStore.addDocDef(xmlDocument, desc);
		}

		// Act
		const docDefs = docTemplatesStore.getAllDocDefs(xmlDocument);

		// Assert
		expect(docDefs.length).toBe(descriptions.length);
		docDefs.forEach((docDef, index) => {
			expect(docDef.getAttribute('description')).toBe(descriptions[index]);
		});
	});

	it('should add a "content" element with markdown text to an existing "DocDef" element', () => {
		// Arrange
		docTemplatesStore.init(xmlDocument);
		const description = 'Test Description';
		const id = docTemplatesStore.addDocDef(xmlDocument, description);
		const privateArea = xmlDocument.documentElement.querySelector('Private[type="AUTO_DOC"]');
		const docDef = docTemplatesStore.getDocDef(xmlDocument, id);
		const content = 'This is some markdown content';

		// Act
		docTemplatesStore.addContentToDocDef(xmlDocument, docDef, content);

		// Assert
		const contentElement = docDef?.querySelector('Content');
		expect(contentElement).not.toBeNull();
		expect(contentElement?.textContent).toBe(content);

		
  });
});