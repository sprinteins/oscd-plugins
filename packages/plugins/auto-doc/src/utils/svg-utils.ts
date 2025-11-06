export function getSVGDimensions(svgElement: SVGElement, scale: number, maxWidth: number): { width: number; height: number } {
    const width = scale * maxWidth
		const viewBox = svgElement.getAttribute('viewBox')?.split(' ').map(Number) || []
		const svgWidth = viewBox[2] || parseFloat(svgElement.getAttribute('width') || '100')
		const svgHeight = viewBox[3] || parseFloat(svgElement.getAttribute('height') || '100')
		const aspectRatio = svgHeight / svgWidth
		const height = width * aspectRatio
    return { width, height }
}