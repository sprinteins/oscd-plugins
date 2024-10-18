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
});