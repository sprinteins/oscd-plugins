import { docTemplatesStore } from './doc-templates.store';
import { describe, it, expect, beforeEach } from 'vitest';
import { get, writable, type Writable } from 'svelte/store';
import { pluginStore } from './index';

describe('DocumentTemplateStore', () => {
  let xmlDocument: Writable<XMLDocument | undefined>;;

  beforeEach(() => {
		xmlDocument = writable<XMLDocument | undefined>(undefined);
		const parser = new DOMParser();
		const xmlString = "<SCL></SCL>";
		const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
		xmlDocument.set(xmlDoc);
		pluginStore.init({
			newXMLDocument: xmlDoc,
			newPluginHostElement: document.createElement('SCL')
		});

		docTemplatesStore.init();
  });

  it('should create a "private" element with type="AUTO_DOC" if it does not exist', () => {
    	// Act
		const privateArea = docTemplatesStore.privateArea;

		// Assert
		privateArea.subscribe(value => {
			expect(value).not.toBeNull();
			expect(value?.tagName).toBe('Private');
			expect(value?.getAttribute('type')).toBe('AUTO_DOC');
		})();

  });

  it('should not create a new "private" element if one already exists', () => {
		// Act
		docTemplatesStore.init();
		const privateArea = docTemplatesStore.privateArea;

		// Assert
		privateArea.subscribe(value => {
				const xmlDocValue = get(xmlDocument);
		expect(xmlDocValue?.documentElement.querySelectorAll('Private[type="AUTO_DOC"]').length).toBe(1);
		})();
  });

	it('should add a new "DocumentTemplate" element with current date, description, and id attributes', () => {
		// Arrange
		const description = 'Test Description';

		// Act
		const generatedId = docTemplatesStore.addDocumentTemplate(description);

		// Assert
		const xmlDocValue = get(xmlDocument);
		const privateArea = xmlDocValue?.documentElement.querySelector('Private[type="AUTO_DOC"]');
		const docDef = privateArea?.querySelector('DocumentTemplate');
		expect(docDef).not.toBeNull();
		expect(docDef?.getAttribute('date')).not.toBeNull();
		expect(docDef?.getAttribute('description')).toBe(description);
		expect(docDef?.getAttribute('id')).toBe(generatedId);
	});

	it('should retrieve a "DocumentTemplate" element by id', () => {
		// Arrange
		const description = 'Test Description';
		docTemplatesStore.addDocumentTemplate(description);
		const xmlDocValue = get(xmlDocument);
		const privateArea = xmlDocValue?.documentElement.querySelector('Private[type="AUTO_DOC"]');
		const docDef = privateArea?.querySelector('DocumentTemplate');
		const id = docDef?.getAttribute('id');

		// Act
		const retrievedDocDef = id ? docTemplatesStore.getDocumentTemplate(id) : null;

		// Assert
		expect(retrievedDocDef).toBe(docDef);
	});

	it('should retrieve all "DocumentTemplate" elements', () => {
		// Arrange
		docTemplatesStore.init();
		const descriptions = ['Description 1', 'Description 2'];
		for (const desc of descriptions) {
			docTemplatesStore.addDocumentTemplate(desc);
		}

		// Act
		const docDefs = docTemplatesStore.getAllDocumentTemplates();

		// Assert
		expect(docDefs.length).toBe(descriptions.length);
		docDefs.forEach((docDef, index) => {
			expect(docDef.getAttribute('description')).toBe(descriptions[index]);
		});
	});

	it('should add a "Block" element with markdown text to an existing "DocumentTemplate" element', () => {
		// Arrange
		const description = 'Test Description';
		const id = docTemplatesStore.addDocumentTemplate(description);
		if (!id) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(id);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const content = 'This is some markdown content';
		const type = "standard";

		// Act
		const blockId = docTemplatesStore.addBlockToDocumentTemplate(docDef, content, type, 0);

		// Assert
		const blockElements = getAllBlockElements(docDef);
		expect(blockElements.length).toBeGreaterThan(0);

		const blockElement = blockElements[0];
		expect(blockElement?.textContent).toBe(content);
		expect(blockElement?.getAttribute('type')).toBe(type);
		expect(blockElement?.getAttribute('id')).toBe(blockId);
	});

	it('should retrieve a "Block" element by id from a given "DocumentTemplate"', () => {
		// Arrange
		const description = 'Test Description';
		const generatedId = docTemplatesStore.addDocumentTemplate(description);
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const content = 'Block content';
		const type = "standard";
		const blockId = docTemplatesStore.addBlockToDocumentTemplate(docDef, content, type, 0);

		// Act
		const retrievedBlock = docTemplatesStore.getBlockOfDocumentTemplate(generatedId, blockId);

		// Assert
		expect(retrievedBlock).not.toBeNull();
		expect(retrievedBlock?.textContent).toBe(content);
		expect(retrievedBlock?.getAttribute('type')).toBe(type);
		expect(retrievedBlock?.getAttribute('id')).toBe(blockId);
	});

	it('should retrieve all "Block" elements of a given "DocumentTemplate"', () => {
		// Arrange
		const description = 'Test Description';
		const generatedId = docTemplatesStore.addDocumentTemplate(description);
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const content1 = 'First block content';
		const content2 = 'Second block content';
		const content3 = 'Third block content';
		const type = "standard";

		// Add blocks to the document definition
		docTemplatesStore.addBlockToDocumentTemplate(docDef, content1, type, 0);
		docTemplatesStore.addBlockToDocumentTemplate(docDef, content2, type, 1);
		docTemplatesStore.addBlockToDocumentTemplate(docDef, content3, type, 2);

		// Act
		const blocks = docTemplatesStore.getAllBlocksOfDocumentTemplate(generatedId);

		// Assert
		expect(blocks.length).toBe(3);
		expect(blocks[0].textContent).toBe(content1);
		expect(blocks[1].textContent).toBe(content2);
		expect(blocks[2].textContent).toBe(content3);
	});

	it('should insert "BlockId" element at the correct position', () => {
		// Arrange
		docTemplatesStore.init();
		const description = 'Test Description';
		const generatedId = docTemplatesStore.addDocumentTemplate(description);
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const content1 = 'First block content';
		const content2 = 'Second block content';
		const content3 = 'Third block content';
		const type = "standard";

		// Act
		const idBlock1 = docTemplatesStore.addBlockToDocumentTemplate(docDef, content1, type, 0);
		const idBlock2 = docTemplatesStore.addBlockToDocumentTemplate(docDef, content2, type, 1);
		const idBlock3 = docTemplatesStore.addBlockToDocumentTemplate(docDef, content3, type, 1);

		// Assert
		const blockElements = docDef?.querySelectorAll('Block');
		if(!blockElements) {
			throw new Error('Block elements not found');
		}
		expect(blockElements?.length).toBe(3); // Ensure there are 3 elements

		// Check the order of blocks
		expect(blockElements[0].getAttribute('id')).toBe(idBlock1);
		expect(blockElements[1].getAttribute('id')).toBe(idBlock3);
		expect(blockElements[2].getAttribute('id')).toBe(idBlock2);
	});

	it('should move a block to the specified position in the document definition', () => {
		// Arrange
		docTemplatesStore.init();
		const description = 'Test Description';
		const generatedId = docTemplatesStore.addDocumentTemplate(description);
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const content1 = 'First block content';
		const content2 = 'Second block content';
		const content3 = 'Third block content';
		const type = "standard";

		// Add blocks to the document definition
		const idBlock1 = docTemplatesStore.addBlockToDocumentTemplate(docDef, content1, type, 0);
		const idBlock2 = docTemplatesStore.addBlockToDocumentTemplate(docDef, content2, type, 1);
		const idBlock3 = docTemplatesStore.addBlockToDocumentTemplate(docDef, content3, type, 2);

		// Assert
		let blockElements = getAllBlockElements(docDef);
		expect(blockElements?.length).toBe(3); // Ensure there are 3 elements
		expect(idBlock1).toBe(blockElements?.[0]?.getAttribute('id'));
		expect(idBlock2).toBe(blockElements?.[1]?.getAttribute('id'));
		expect(idBlock3).toBe(blockElements?.[2]?.getAttribute('id'));

		// Act
		docTemplatesStore.moveBlockInDocumentTemplate(docDef, idBlock3, 0);

		// Assert
		blockElements = getAllBlockElements(docDef);
		expect(blockElements?.length).toBe(3); // Ensure there are 3 elements
		expect(idBlock3).toBe(blockElements?.[0]?.getAttribute('id'));
		expect(idBlock1).toBe(blockElements?.[1]?.getAttribute('id'));
		expect(idBlock2).toBe(blockElements?.[2]?.getAttribute('id'));
	});

	it('should delete a block from the document definition', () => {
		// Arrange
		docTemplatesStore.init();
		const description = 'Test Description';
		const generatedId = docTemplatesStore.addDocumentTemplate(description);
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const content1 = 'First block content';
		const content2 = 'Second block content';
		const content3 = 'Third block content';
		const type = "standard";

		// Add blocks to the document definition
		const idBlock1 = docTemplatesStore.addBlockToDocumentTemplate(docDef, content1, type, 0);
		const idBlock2 = docTemplatesStore.addBlockToDocumentTemplate(docDef, content2, type, 1);
		const idBlock3 = docTemplatesStore.addBlockToDocumentTemplate(docDef, content3, type, 2);

		// Act
		docTemplatesStore.deleteBlockFromDocumentTemplate(docDef, idBlock2);

    	// Assert
		const blockElements = getAllBlockElements(docDef);
		expect(blockElements.length).toBe(2); 
		expect(blockElements[0].getAttribute('id')).toBe(idBlock1);
		expect(blockElements[1].getAttribute('id')).toBe(idBlock3);
	});

	it('should delete a "DocumentTemplate" element by id', () => {
		// Arrange
		const description = 'Test Description';
		const generatedId = docTemplatesStore.addDocumentTemplate(description);
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}

		// Act
		docTemplatesStore.deleteDocumentTemplate(generatedId);

		// Assert
		const xmlDocValue = get(xmlDocument);
		const privateArea = xmlDocValue?.documentElement.querySelector('Private[type="AUTO_DOC"]');
		const deletedDocDef = privateArea?.querySelector(`DocumentTemplate[id="${generatedId}"]`);
		expect(deletedDocDef).toBeNull();
	});

	it('should duplicate a "DocumentTemplate" element with a new description and unique ids for blocks', () => {
		// Arrange
		const description = 'Original Description';
		const newDescription = 'Duplicated Description';
		const generatedId = docTemplatesStore.addDocumentTemplate(description);
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const content1 = 'First block content';
		const content2 = 'Second block content';
		const type = "standard";

		// Add blocks to the document definition
		const idBlock1 = docTemplatesStore.addBlockToDocumentTemplate(docDef, content1, type, 0);
		const idBlock2 = docTemplatesStore.addBlockToDocumentTemplate(docDef, content2, type, 1);

		// Act
		docTemplatesStore.duplicateDocumentTemplate(generatedId, newDescription);

		// Assert
		const xmlDocValue = get(xmlDocument);
		const privateArea = xmlDocValue?.documentElement.querySelector('Private[type="AUTO_DOC"]');
		const duplicatedDocDefs = privateArea?.querySelectorAll(`DocumentTemplate[description="${newDescription}"]`);
		expect(duplicatedDocDefs?.length).toBe(1);

		const duplicatedDocDef = duplicatedDocDefs?.[0];
		expect(duplicatedDocDef).not.toBeNull();
		expect(duplicatedDocDef?.getAttribute('description')).toBe(newDescription);
		expect(duplicatedDocDef?.getAttribute('id')).not.toBe(generatedId);

		const originalBlocks = docDef.querySelectorAll('Block');
		const duplicatedBlocks = duplicatedDocDef?.querySelectorAll('Block');
		expect(duplicatedBlocks?.length).toBe(originalBlocks.length);

		originalBlocks.forEach((block, index) => {
			expect(duplicatedBlocks?.[index]?.textContent).toBe(block.textContent);
			expect(duplicatedBlocks?.[index]?.getAttribute('type')).toBe(block.getAttribute('type'));
			expect(duplicatedBlocks?.[index]?.getAttribute('id')).not.toBe(block.getAttribute('id'));
		});
	});
});

function getAllBlockElements(DocumentTemplate: Element): Element[] {
	return Array.from(DocumentTemplate.children).filter(child => 
		child.tagName === 'Block'
	);
}