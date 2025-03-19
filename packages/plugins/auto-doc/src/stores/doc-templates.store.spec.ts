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
		const autoDocArea = docTemplatesStore.privateArea;

		// Assert
		autoDocArea.subscribe(value => {
			expect(value).not.toBeNull();
			expect(value?.tagName).toBe('Private');
			expect(value?.getAttribute('type')).toBe('AUTO_DOC');
		})();

  });

  it('should not create a new "private" element if one already exists', () => {
		// Act
		docTemplatesStore.init();
		const autoDocArea = docTemplatesStore.privateArea;

		// Assert
		autoDocArea.subscribe(value => {
				const xmlDocValue = get(xmlDocument);
		expect(xmlDocValue?.documentElement.querySelectorAll('Private[type="AUTO_DOC"]').length).toBe(1);
		})();
  });

	it('should add a new "DocumentTemplate" element with current date, description, and id attributes', () => {
		// Arrange
		const title = 'Test Title';
		const description = 'Test Description';

		// Act
		const generatedId = docTemplatesStore.addDocumentTemplate();
		if(generatedId){

			docTemplatesStore.editDocumentTemplateTitleAndDescription(generatedId, title, description);
		}

		// Assert
		const xmlDocValue = get(xmlDocument);
		const privateArea = xmlDocValue?.documentElement.querySelector('Private[type="AUTO_DOC"]');
		const docDef = privateArea?.querySelector('DocumentTemplate');
		expect(docDef).not.toBeNull();
		expect(docDef?.getAttribute('date')).not.toBeNull();
		expect(docDef?.getAttribute('title')).toBe(title);
		expect(docDef?.getAttribute('description')).toBe(description);
		expect(docDef?.getAttribute('id')).toBe(generatedId);
	});

	it('should retrieve a "DocumentTemplate" element by id', () => {
		// Arrange
		docTemplatesStore.addDocumentTemplate();
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
		const titles = ['Title 1', 'Title 2'];
		const descriptions = ['Description 1', 'Description 2'];
		for (let i = 0; i < descriptions.length; i++) {
			const generatedId = docTemplatesStore.addDocumentTemplate();
			if(generatedId){
				docTemplatesStore.editDocumentTemplateTitleAndDescription(generatedId, titles[i], descriptions[i]);
			}
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
		const id = docTemplatesStore.addDocumentTemplate();
		if (!id) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(id);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const type = "text";

		// Act
		const blockId = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 0);

		// Assert
		const blockElements = getAllBlockElements(docDef);
		expect(blockElements.length).toBeGreaterThan(0);

		const blockElement = blockElements[0];
		expect(blockElement?.getAttribute('type')).toBe(type);
		expect(blockElement?.getAttribute('id')).toBe(blockId);
	});

	it('should retrieve a "Block" element by id from a given "DocumentTemplate"', () => {
		// Arrange
		const generatedId = docTemplatesStore.addDocumentTemplate();
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const type = "text";
		const blockId = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 0);

		// Act
		const retrievedBlock = docTemplatesStore.getBlockOfDocumentTemplate(generatedId, blockId);

		// Assert
		expect(retrievedBlock).not.toBeNull();
		expect(retrievedBlock?.getAttribute('type')).toBe(type);
		expect(retrievedBlock?.getAttribute('id')).toBe(blockId);
	});

	it('should retrieve all "Block" elements of a given "DocumentTemplate"', () => {
		// Arrange
		const generatedId = docTemplatesStore.addDocumentTemplate();
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const type = "image";

		// Add blocks to the document definition
		docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 0);
		docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 1);
		docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 2);

		// Act
		const blocks = docTemplatesStore.getAllBlocksOfDocumentTemplate(generatedId);

		// Assert
		expect(blocks.length).toBe(3);
	});

	it('should insert "BlockId" element at the correct position', () => {
		// Arrange
		docTemplatesStore.init();
		const generatedId = docTemplatesStore.addDocumentTemplate();
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const type = "text";

		// Act
		const idBlock1 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 0);
		const idBlock2 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 1);
		const idBlock3 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 1);

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
		const generatedId = docTemplatesStore.addDocumentTemplate();
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const type = "signalList";

		// Add blocks to the document definition
		const idBlock1 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 0);
		const idBlock2 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 1);
		const idBlock3 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 2);

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
	
	it('should duplicate a block from the document definition', () => {
		// Arrange
		docTemplatesStore.init();
		const generatedId = docTemplatesStore.addDocumentTemplate();
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const type = "text";

		// Add blocks to the document definition
		const idBlock1 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 0);
		const idBlock2 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 1);
		const idBlock3 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 2);

		// Act
		docTemplatesStore.duplicateBlockFromDocumentTemplate(docDef, idBlock2, 2);

		// Assert
		const blockElements = getAllBlockElements(docDef);
		expect(blockElements.length).toBe(4);

		expect(blockElements[0].getAttribute('id')).toBe(idBlock1);
		expect(blockElements[1].getAttribute('id')).toBe(idBlock2);
		expect(blockElements[3]?.getAttribute('id')).toBe(idBlock3);

		const duplicationSourceElement = blockElements[1];
		const duplicationResultElement = blockElements[2];

		expect(duplicationResultElement).not.toBeNull();
		expect(duplicationResultElement?.getAttribute("id")).not.toBe(duplicationSourceElement.getAttribute("id"));
		expect(duplicationResultElement?.getAttribute("type")).toBe(type);
		expect(duplicationResultElement?.textContent).toBe(duplicationSourceElement.textContent);
	});

	it('should delete a block from the document definition', () => {
		// Arrange
		docTemplatesStore.init();
		const generatedId = docTemplatesStore.addDocumentTemplate();
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const type = "text";

		// Add blocks to the document definition
		const idBlock1 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 0);
		const idBlock2 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 1);
		const idBlock3 = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 2);

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
		const generatedId = docTemplatesStore.addDocumentTemplate();
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
		const title = 'Test Title';
		const description = 'Original Description';
		const newTitle = 'Test Title_Copy';
		const newDescription = 'Copied from Test Title\'s description: Original Description';
		const generatedId = docTemplatesStore.addDocumentTemplate();
	
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		docTemplatesStore.editDocumentTemplateTitleAndDescription(generatedId, title, description);
		
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		

		// Act
		docTemplatesStore.duplicateDocumentTemplate(generatedId);

		// Assert
		const xmlDocValue = get(xmlDocument);
		const privateArea = xmlDocValue?.documentElement.querySelector('Private[type="AUTO_DOC"]');
		const duplicatedDocDefs = privateArea?.querySelectorAll(`DocumentTemplate[description="${newDescription}"]`);
		expect(duplicatedDocDefs?.length).toBe(1);

		const duplicatedDocDef = duplicatedDocDefs?.[0];
		expect(duplicatedDocDef).not.toBeNull();
		expect(duplicatedDocDef?.getAttribute('title')).toBe(newTitle);
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

	it('should edit the content of a "Block" element within a "DocumentTemplate"', () => {
		// Arrange
		const generatedId = docTemplatesStore.addDocumentTemplate();
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
		const updatedContent = 'Updated block content';
		const type = "signalList";
		const blockId = docTemplatesStore.addBlockToDocumentTemplate(docDef, type, 0);
	
		// Act
		docTemplatesStore.editBlockContentOfDocumentTemplate(docDef, blockId, updatedContent);
	
		// Assert
		const blockElement = docDef.querySelector(`Block[id="${blockId}"]`);
		expect(blockElement).not.toBeNull();
		expect(blockElement?.textContent).toBe(updatedContent);
		expect(blockElement?.getAttribute('id')).toBe(blockId);
		expect(blockElement?.getAttribute('type')).toBe(type);
	});
	
	it('should edit the description of a "DocumentTemplate" element', () => {
		// Arrange
		const title = 'Test Title';
		const initialDescription = 'Initial Description';
		const updatedDescription = 'Updated Description';
		const generatedId = docTemplatesStore.addDocumentTemplate();
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		docTemplatesStore.editDocumentTemplateTitleAndDescription(generatedId, title, initialDescription);
		
		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
	
		// Act
		docTemplatesStore.editDocumentTemplateTitleAndDescription(generatedId, undefined, updatedDescription);
	
		// Assert
		const updatedDocDef = docTemplatesStore.getDocumentTemplate(generatedId);
		expect(updatedDocDef).not.toBeNull();
		expect(updatedDocDef?.getAttribute('description')).toBe(updatedDescription);
	});

	it('should edit the title of a "DocumentTemplate" element', () => {
		// Arrange
		const initialTitle = 'Initial Title';
		const updatedTitle = 'Updated Title';
		const description = 'Test Description';
		const generatedId = docTemplatesStore.addDocumentTemplate();
		if (!generatedId) {
			throw new Error('adding DocumentTemplate failed');
		}
		docTemplatesStore.editDocumentTemplateTitleAndDescription(generatedId, initialTitle, description);

		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
			throw new Error('DocumentTemplate not found');
		}
	
		// Act
		docTemplatesStore.editDocumentTemplateTitleAndDescription(generatedId, updatedTitle);
	
		// Assert
		const updatedDocDef = docTemplatesStore.getDocumentTemplate(generatedId);
		expect(updatedDocDef).not.toBeNull();
		expect(updatedDocDef?.getAttribute('title')).toBe(updatedTitle);
	});

	it('should preserve id and date attributes when editing title and description', () => {
		// Arrange
		const title = 'Initial Title';
		const description = 'Initial Description';
		const generatedId = docTemplatesStore.addDocumentTemplate();
		if (!generatedId) {
		  throw new Error('adding DocumentTemplate failed');
		}
		docTemplatesStore.editDocumentTemplateTitleAndDescription(generatedId, title, description);

		const docDef = docTemplatesStore.getDocumentTemplate(generatedId);
		if (!docDef) {
		  throw new Error('DocumentTemplate not found');
		}
		const initialDate = docDef.getAttribute('date');
		const initialId = docDef.getAttribute('id');
	
		// Act
		const newTitle = 'Updated Title';
		const newDescription = 'Updated Description';
		docTemplatesStore.editDocumentTemplateTitleAndDescription(generatedId, newTitle, newDescription);
	
		// Assert
		const updatedDocDef = docTemplatesStore.getDocumentTemplate(generatedId);
		expect(updatedDocDef).not.toBeNull();
		expect(updatedDocDef?.getAttribute('title')).toBe(newTitle);
		expect(updatedDocDef?.getAttribute('description')).toBe(newDescription);
		expect(updatedDocDef?.getAttribute('id')).toBe(initialId);
		expect(updatedDocDef?.getAttribute('date')).toBe(initialDate);
	  });
});



function getAllBlockElements(DocumentTemplate: Element): Element[] {
	return Array.from(DocumentTemplate.children).filter(child => 
		child.tagName === 'Block'
	);
}