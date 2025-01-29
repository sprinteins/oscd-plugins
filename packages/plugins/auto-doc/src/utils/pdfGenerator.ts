import jsPDF from 'jspdf';
import type {ElementType} from "@/components/elements/types.elements"




function generatePdf(templateTitle: string , allBlocks: NodeList){
    const doc = new jsPDF();
    doc.setFontSize(12);
    let y = 10; 
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 10; 
    const blockConvertedToArray = Array.prototype.slice.call(allBlocks);

    const blockHandler: Record<ElementType, (block: Element) => void> = {
        text: handleTextBlock,
        image: () => {},
        signalList: () => {}
    }

    for(const block of blockConvertedToArray){

        const blockType = block.getAttribute('type') as ElementType;
        
        if(blockType && blockHandler[blockType]){
            blockHandler[blockType](block);
        }
            
    }
    
    doc.save(`${templateTitle}.pdf`);

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
}




export const pdfGenerator = {
    generatePdf
}