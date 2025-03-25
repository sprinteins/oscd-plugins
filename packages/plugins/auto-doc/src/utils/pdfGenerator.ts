import jsPDF from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
import zipcelx from 'zipcelx';
import type {ElementType} from "@/components/elements/types.elements"
import {docTemplatesStore} from '@/stores'
import type {Columns, SignalType} from '@/stores'
import type {SignalListOnSCD, SignalRow} from '@/components/elements/signal-list-element/types.signal-list'

/*
    For jsPDF API documentation refer to: http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html
*/


function generatePdf(templateTitle: string , allBlocks: Element[]){
    const doc = new jsPDF();
    const DEFAULT_FONT_SIZE = 10;
    doc.setFontSize(DEFAULT_FONT_SIZE);
    const INITIAL_UPPER_PAGE_COORDINATE = 10;
    const INITIAL_LOWER_PAGE_COORDINATE = 10;

    let marginTop = INITIAL_UPPER_PAGE_COORDINATE; 
    const pageHeight = doc.internal.pageSize.height;
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()
    const marginBottom = INITIAL_LOWER_PAGE_COORDINATE; 

    const blockHandler: Record<ElementType, (block: Element) => void> = {
        text: handleRichTextEditorBlock,
        image: () => {},
        signalList: processSignalListForPdfGeneration,
        table: processTableForPdfGeneration,
    }

    function incrementVerticalPositionForNextLine(lineHeight = 7) {
        marginTop += lineHeight;
    }

    function contentExceedsCurrentPage(marginTop: number,pageHeight: number,marginBottom: number) {
        const bufferToBottomPage = 10;
        return (marginTop + bufferToBottomPage) > (pageHeight-marginBottom);
    }

    function handleRichTextEditorBlock(block: Element){
        const parser = new DOMParser();
        const parsedBlockContent = parser.parseFromString(block.textContent ?? "", "text/html");
        const HTMLElements : HTMLCollection = parsedBlockContent.body.children;


        for (const element of HTMLElements ){
            switch(element.tagName.toLowerCase()){
                case "h1":
                    handleText(element.textContent ?? "", 20, "bold");
                    break;
                case "h2":
                    handleText(element.textContent ?? "", 16, "bold");
                    break;
                case "h3":
                    handleText(element.textContent ?? "", 14, "bold");
                    break;
                case "p":
                    processParagraph(element);
                    break;
                case "strong":
                    handleText(element.textContent ?? "", DEFAULT_FONT_SIZE, "bold");
                    break;
                case "em":
                    handleText(element.textContent ?? "", DEFAULT_FONT_SIZE, "italic");
                    break;
                case "ul":
                case "ol":
                    processList(element, 0);
                    break;
                default:
                    console.error(`Unsupported HTML element: ${element.tagName}`);
            }
        }
            
    }

    function handleText(text: string, fontSize: number, fontStyle: "normal" | "bold" | "italic", indent = 0 ){
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", fontStyle);

        const wrappedText : string [] = doc.splitTextToSize(text ?? "", pageWidth - (35 - indent));

        for(const line of wrappedText){
            if (contentExceedsCurrentPage(marginTop, pageHeight, marginBottom)) {
                doc.addPage();
                marginTop = INITIAL_UPPER_PAGE_COORDINATE; 
            }
            const horizontalSpacing = 10;
            doc.text(line, horizontalSpacing, marginTop);
            incrementVerticalPositionForNextLine();
        } 
        
    }

    function processParagraph(paragraph: Element){
        for(const node of paragraph.childNodes){
            if(node.nodeType === Node.TEXT_NODE){
                handleText(node.textContent ?? "", DEFAULT_FONT_SIZE, "normal");
            }else if(node.nodeType === Node.ELEMENT_NODE){
                const element = node as Element;
                let fontStyle: "normal" | "bold" | "italic" = "normal";
                if( element.tagName.toLowerCase() === "strong"){
                    fontStyle = "bold";
                }else if( element.tagName.toLowerCase() === "em"){
                    fontStyle = "italic";
                }
                handleText(element.textContent ?? "", DEFAULT_FONT_SIZE, fontStyle);
            }
                
        }

    }



    function processList(list: Element, indent = 0){
        const isOrdered = list.tagName.toLowerCase() === "ol";
        let itemIndex = 1;

        // biome-ignore lint/complexity/noForEach: <explanation>
        Array.from(list.children).forEach((li) => {
            if (li.tagName.toLowerCase() === "li") {
                const bullet = isOrdered ? `${itemIndex}. ` : "• ";
                itemIndex++;

                const firstParagraph = li.querySelector("p");
                if (firstParagraph) {
                    handleText(bullet + firstParagraph.textContent, 10, "normal", indent);
                    firstParagraph.remove(); // Prevent duplicate text processing
                } else {
                    handleText(bullet + (li.textContent ?? ""), 10, "normal", indent);
                }
                
                // Check for nested lists inside this list item
                // biome-ignore lint/complexity/noForEach: <explanation>
                Array.from(li.children).forEach(child => {
                    if (child.tagName.toLowerCase() === "ul" || child.tagName.toLowerCase() === "ol") {
                        processList(child, indent + 10); // Increase indent for nested lists
                    }
                });
            }
        });
    }

  
    function renderTextLine(text: string) {
        if (contentExceedsCurrentPage(marginTop, pageHeight, marginBottom)) {
            doc.addPage();
            marginTop = INITIAL_UPPER_PAGE_COORDINATE;
        }
        const horizontalSpacing = 10;
        doc.text(text, horizontalSpacing, marginTop);
        incrementVerticalPositionForNextLine();
    }
    
    function processSignalListForPdfGeneration(block: Element){
        if(!block.textContent) {
            console.error("No content found in Signal List Block");
            return;
        }
        const blockId = block.getAttribute('id');
        const parsedBlockContent = JSON.parse(block.textContent) as SignalListOnSCD;

        const selectedRows = parsedBlockContent.selected
        const tableRows = parsedBlockContent.matches.matchedRowsForTablePdf
        
        const rows = tableRows.flatMap((row) => {
            return row.matchedFilteredValuesForPdf
        })
        const header = selectedRows.map(r => ({value: r.column1, type: 'string'}))
        const individualRows = rows.map(row => row.map(r => ({value: r, type: 'string'})))

        const fileName = `SignalList_${blockId}`
        const pdfHintText = `Hint: check ${fileName}.xlsx`

        const table = [header, ...individualRows]
        const config = {
            filename: fileName,
            sheet: {
                data: table
            }
        }

       renderTextLine(pdfHintText);
        zipcelx(config)
    }

    function processTableForPdfGeneration(block: Element) {
        const content = block.textContent;
        if(!content) {
            console.error("No content found in Signal List Block");
            return;
        }

        const data = JSON.parse(content);
        
        const formattedHeader: string[][] = [data.map((row: String[]) => row[0])];
        const formattedBody: string[][] = [data.map((row: String[]) => row[1])];

        autoTable(doc, {
            head: formattedHeader,
            body: formattedBody
        });
    }

    for(const block of allBlocks){

        const blockType = block.getAttribute('type') as ElementType;
        
        if(blockType && blockHandler[blockType]){
            blockHandler[blockType](block);
        }
            
    }
    
    doc.save(`${templateTitle}.pdf`);

    
}

function generateTableBody(tableRows: string[][], tableHeader: TableHeader []) {
   const generatedRows =  tableRows.map((row) => {
        return tableHeader.reduce((acc: Record<string, string>, col, index) => {
            acc[col.dataKey as string] = row[index];
            return acc;
        }, {} as Record<string, string>);
    });
    return generatedRows
}

type TableHeader = {
    header: string;
    dataKey: keyof typeof SignalType | keyof typeof Columns;
}

function generateTableHeader(selectedRows: SignalRow[]): TableHeader[] {
    return selectedRows.map(row => ({
        header: row.column1,
        dataKey: row.searchKey
    }));
}




function downloadAsPdf(templateId: string){
    const template = docTemplatesStore.getDocumentTemplate(templateId);
    if(!template) {
        console.error("Template not found");
        return;
    }
    const templateTitle = template.getAttribute('title') ?? "N/A";
    const allBlocks: NodeList = template.querySelectorAll('Block');
    const blockConvertedToArray : Element[] = Array.prototype.slice.call(allBlocks);
    generatePdf(templateTitle, blockConvertedToArray);

}




export const pdfGenerator = {
    downloadAsPdf
}