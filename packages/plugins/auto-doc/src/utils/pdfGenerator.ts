import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type {ElementType} from "@/components/elements/types.elements"
import {docTemplatesStore} from '@/stores'
import type {Columns, SignalType} from '@/stores'
import type {SignalListOnSCD, SignalRow} from '@/components/elements/signal-list-element/types.signal-list'

/*
    For jsPDF API documentation refer to: http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html
*/


function generatePdf(templateTitle: string , allBlocks: Element[]){
    const doc = new jsPDF();
    doc.setFontSize(12);
    const INITIAL_UPPER_PAGE_COORDINATE = 10;
    const INITIAL_LOWER_PAGE_COORDINATE = 10;

    let marginTop = INITIAL_UPPER_PAGE_COORDINATE; 
    const pageHeight = doc.internal.pageSize.height;
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()
    const marginBottom = INITIAL_LOWER_PAGE_COORDINATE; 

    const blockHandler: Record<ElementType, (block: Element) => void> = {
        text: handleTextBlock,
        image: () => {},
        signalList: processSignalListForPdfGeneration
    }

    function incrementVerticalPositionForNextLine() {
        marginTop+=7;
    }

    function contentExceedsCurrentPage(marginTop: number,pageHeight: number,marginBottom: number) {
        const bufferToBottomPage = 10;
        return (marginTop + bufferToBottomPage) > (pageHeight-marginBottom);
    }

    function handleTextBlock(block: Element){
        const wrappedText : string [] = doc.splitTextToSize(block.textContent ?? "", pageWidth-35);
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

  
    function processSignalListForPdfGeneration(block: Element){
        
        if(!block.textContent) {
            console.error("No content found in Signal List Block");
            return;
        }
        const parsedBlockContent = JSON.parse(block.textContent) as SignalListOnSCD;

        const selectedRows = parsedBlockContent.selected
        const tableRows = parsedBlockContent.matches.matchedRowsForTablePdf
        const tableHeader = generateTableHeader(selectedRows)
        
        const rows = tableRows.flatMap((row) => {
            return row.matchedFilteredValuesForPdf
        })
        
    
        
        const body = generateTableBody(rows, tableHeader);
       

        autoTable(doc, {
            startY: (marginTop === INITIAL_UPPER_PAGE_COORDINATE) ? marginTop : marginTop + 10,
            columns: tableHeader,
            body: body,

            // styles
            theme: 'grid',
            columnStyles: {M_text: {}},
            headStyles: {fillColor: 0, halign: 'center'},
            styles: { cellPadding: 0.5, fontSize: 8, halign: 'center'  },

            //behavior
            rowPageBreak: 'auto', 
            pageBreak: 'avoid',
            horizontalPageBreak: true,

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