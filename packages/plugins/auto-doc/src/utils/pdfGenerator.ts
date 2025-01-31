import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type {ElementType} from "@/components/elements/types.elements"
import {docTemplatesStore} from '@/stores'
import type {SignalListOnSCD} from '@/components/elements/signal-list-element/types.signal-list'




function generatePdf(templateTitle: string , allBlocks: Element[]){
    const doc = new jsPDF();
    doc.setFontSize(12);
    let y = 10; 
    const pageHeight = doc.internal.pageSize.height;
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()
    const marginBottom = 10; 

    const blockHandler: Record<ElementType, (block: Element) => void> = {
        text: handleTextBlock,
        image: () => {},
        signalList: processSignalListForPdfGeneration
    }

    function incrementYPositionForNextLine() {
        y+=7;
    }

    function contentExceedsCurrentPage(y: number,pageHeight: number,marginBottom: number) {
        return (y+10) > (pageHeight-marginBottom);
    }

    function handleTextBlock(block: Element){
        const wrappedText : string [] = doc.splitTextToSize(block.textContent ?? "", pageWidth-35);
            for(const line of wrappedText){
                if (contentExceedsCurrentPage(y, pageHeight, marginBottom)) {
                    doc.addPage();
                    y = 10; 
                }
                doc.text(line, 10, y);
                incrementYPositionForNextLine();
            }    
    }

  
    function processSignalListForPdfGeneration(block: Element){
        if(!block.textContent) {
            console.error("No content found in Signal List Block");
            return;
        }
        const parsedBlockContent = JSON.parse(block.textContent) as SignalListOnSCD;

        const selectedRows = parsedBlockContent.selected

        const tableHeader = selectedRows.map(row => row.column1);
        const tableRows = parsedBlockContent.matches.publishers
            
        autoTable(doc, {
            head: [tableHeader],
            body: tableRows,
            startY: y+10,
            tableWidth: 'wrap',
            styles: { cellPadding: 0.5, fontSize: 8 },

        })
    }

    for(const block of allBlocks){

        const blockType = block.getAttribute('type') as ElementType;
        
        if(blockType && blockHandler[blockType]){
            blockHandler[blockType](block);
        }
            
    }
    
    doc.save(`${templateTitle}.pdf`);

    
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