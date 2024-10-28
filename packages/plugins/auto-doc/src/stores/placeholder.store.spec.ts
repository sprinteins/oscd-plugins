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
});
