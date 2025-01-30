import jsPDF from 'jspdf';
import type {ElementType} from "@/components/elements/types.elements"
import {docTemplatesStore} from '@/stores'




function generatePdf(templateTitle: string , allBlocks: Element[]){
    const doc = new jsPDF();
    doc.setFontSize(12);
    let y = 10; 
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 10; 

    const blockHandler: Record<ElementType, (block: Element) => void> = {
        text: handleTextBlock,
        image: () => {},
        signalList: handleSignalList
    }

    function incrementYPositionForNextLine() {
        y+=7;
    }

    function contentExceedsCurrentPage(y: number,pageHeight: number,marginBottom: number) {
        return (y+10) > (pageHeight-marginBottom);
    }

    function handleTextBlock(block: Element){
        const wrappedText : string [] = doc.splitTextToSize(block.textContent ?? "", 180);
            for(const line of wrappedText){
                if (contentExceedsCurrentPage(y, pageHeight, marginBottom)) {
                    doc.addPage();
                    y = 10; 
                }
                doc.text(line, 10, y);
                incrementYPositionForNextLine();
            }    
    }

    function handleSignalList(block: Element){
        console.log("SIGNAL LIST", block)
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