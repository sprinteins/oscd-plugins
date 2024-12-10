import { describe, it, expect, beforeEach } from 'vitest';
import { writable, type Writable } from 'svelte/store';
import { pluginStore } from './index';
import { placeholderStore } from './placeholder.store';

describe('placeholders', () => {
    let xmlDocument: Writable<XMLDocument | undefined>;

    beforeEach(() => {
        xmlDocument = writable<XMLDocument | undefined>(undefined);
        const parser = new DOMParser();
        const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <SCL xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates" revision="B" version="2007">
        <IED configVersion="X.X" engRight="limited" manufacturer="Anon" originalSclRevision="X" originalSclVersion="XXXX" type="DeviceType" name="Device_01">
        <Services name="XX">
            <DynAssociation max="X"/>
        </Services>
        </IED>
        <IED configVersion="X.2" engRight="limited2" manufacturer="Anon2" originalSclRevision="X2" originalSclVersion="XXXX2" type="DeviceType2" name="Device_02">
        <Services name="XX2">
            <DynAssociation max="X2"/>
        </Services>
        </IED>
    </SCL>`;
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
        xmlDocument.set(xmlDoc);
        pluginStore.init({
            newXMLDocument: xmlDoc,
            newPluginHostElement: document.createElement('SCL')
        });
    });

    it('should replace placeholders with corresponding XML values', () => {
        const markdownText = "This is a {{//IED[1]/@manufacturer}} and {{//IED/Services/@name}} test.";
        const result = placeholderStore.fillPlaceholder(markdownText);

        expect(result).toBe("This is a Anon and XX, XX2 test.");
    });

    it('should not modify text if no placeholders are provided', () => {
        const markdownText = "This is a test without placeholders.";

        const result = placeholderStore.fillPlaceholder(markdownText);

        expect(result).toBe(markdownText);
    });

    it('should replace multiple instances of the same placeholder', () => {
        const markdownText = "This is a {{//IED[1]/@manufacturer}} and another {{//IED[1]/@manufacturer}} test.";

        const result = placeholderStore.fillPlaceholder(markdownText);

        expect(result).toBe("This is a Anon and another Anon test.");
    });

    it('should handle nested XML elements', () => {
        const markdownText = "Device name is {{//IED[1]/@name}} and its type is {{//IED[1]/@type}}.";

        const result = placeholderStore.fillPlaceholder(markdownText);

        expect(result).toBe("Device name is Device_01 and its type is DeviceType.");
    });

    it('should handle missing placeholders gracefully', () => {
        const markdownText = "This is a {{//NonExistentElement/@nonExistentAttribute}} test.";

        const result = placeholderStore.fillPlaceholder(markdownText);

        expect(result).toBe("This is a N/A test.");
    });
    
    it('should fill table with corresponding XML values', () => {
        const input: PlaceholderTable = {
            tableColumns:
                [
                {columnTitle: "IED Manufactorer", placeholder: "//IED/@manufacturer"},
                {columnTitle: "Service Name", placeholder: "//IED/Services/@name"}
                ]
        }

        const result = placeholderStore.fillTableWithPlaceholders(input);
        const expected = `
            | IED Manufactorer | Service Name |
            | --- | --- |
            | Anon | XX |
            | Anon2 | XX2 |`.replace(/^\s+/gm, '');

        expect(result).toBe(expected);
    });

    it('should handle empty table columns', () => {
        const input: PlaceholderTable = {
            tableColumns: []
        };

        const result = placeholderStore.fillTableWithPlaceholders(input);
        const expected = "|  |\n|  |\n|  |";

        expect(result).toBe(expected);
    });

    it('should handle table with single column', () => {
        const input: PlaceholderTable = {
            tableColumns: [
                { columnTitle: "IED Manufacturer", placeholder: "//IED/@manufacturer" }
            ]
        };

        const result = placeholderStore.fillTableWithPlaceholders(input);
        const expected = `
            | IED Manufacturer |
            | --- |
            | Anon |
            | Anon2 |`.replace(/^\s+/gm, '');

        expect(result).toBe(expected);
    });

    it('should handle table with missing XML values', () => {
        const input: PlaceholderTable = {
            tableColumns: [
                { columnTitle: "Non Existent", placeholder: "//NonExistentElement/@nonExistentAttribute" }
            ]
        };

        const result = placeholderStore.fillTableWithPlaceholders(input);
        const expected = `
            | Non Existent |
            | --- |
            | N/A |`.replace(/^\s+/gm, '');

        expect(result).toBe(expected);
    });

    it('should handle table with mixed existing and non-existing XML values', () => {
        const input: PlaceholderTable = {
            tableColumns: [
                { columnTitle: "IED Manufacturer", placeholder: "//IED/@manufacturer" },
                { columnTitle: "Non Existent", placeholder: "//NonExistentElement/@nonExistentAttribute" }
            ]
        };

        const result = placeholderStore.fillTableWithPlaceholders(input);
        const expected = `
            | IED Manufacturer | Non Existent |
            | --- | --- |
            | Anon | N/A |
            | Anon2 |  |`.replace(/^\s+/gm, '');

        expect(result).toBe(expected);
    });
});

type Placeholder = string;
interface ColumnWithPlaceholder {
    columnTitle: string;
    placeholder: Placeholder;
}
interface PlaceholderTable {
    tableColumns: ColumnWithPlaceholder[];
}
