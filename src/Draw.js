import { getDecimalLength } from './utils.js'

/**
 * Draw Class to create a D3 visualization.
 * 
 * @class
 * @param {string} [svgSelector='canvas'] - The CSS selector to attach the SVG element to.
 * @param {Object} data - The data to be visualized.
 * @param {Object} [options={}] - Additional options for customization.
 * @param {number} [options.xOffset=20] - X-offset for positioning elements.
 * @param {number} [options.yOffset=20] - Y-offset for positioning elements.
 * @param {string} [options.shape='circle'] - The shape to be drawn. Can be 'circle', 'rect', 'ellipse', or 'polygon'.
 * @param {number} [options.size=5] - The radius of circle or half rect width.
 * @param {string} [options.fill='blue'] - The fill color for shapes.
 * @param {number} [options.textFontSize=12] - The font size for text labels.
 * @param {string} [options.textFill='black'] - The fill color for text.
 */
export class Draw {
    constructor(svgSelector = 'canvas', data, options = {}) {
        this.svg = d3.select(svgSelector)
        this.data = data
        this.xOffset = options.xOffset || 20
        this.yOffset = options.yOffset || 20
        this.shape = options.shape || 'circle'
        this.size = options.size || 5
        this.fill = options.fill || 'blue'
        this.textFontSize = options.textFontSize || 12
        this.textFill = options.textFill || 'black'
        this.init()
    }

    /**
     * Initializes the visualization by calculating dimensions and drawing elements.
     * 
     * @private
     */
    init() {
        // Calculate minimum and maximum x and y coordinates
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity
        Object.keys(this.data).forEach(chapter => {
            this.data[chapter].forEach(d => {
                if (!d.properties.isPlaceholder) {
                    minX = Math.min(minX, d.x)
                    maxX = Math.max(maxX, d.x)
                    minY = Math.min(minY, d.y)
                    maxY = Math.max(maxY, d.y)
                }
            })
        })
        //console.log(`minX: ${minX}, maxX: ${maxX}, minY: ${minY}, maxY: ${maxY}`)


        // Calculate SVG dimensions
        const svgWidth = maxX - minX + this.xOffset
        const svgHeight = maxY - minY + this.yOffset

        // Set SVG dimensions
        this.svg.attr('width', svgWidth)
            .attr('height', svgHeight)

        this._drawShape(this.shape, minX, minY)
        this._drawTextLabels(minX, minY)
    }

    /**
     * Draws shapes on the SVG canvas.
     * 
     * @private
     * @param {number} minX - The minimum X-coordinate in the data.
     * @param {number} minY - The minimum Y-coordinate in the data.
     */
    _drawShape(shapeType, minX, minY) {
        const shapes = this.svg.selectAll(shapeType)
            .data(Object.values(this.data).flat())
            .enter()
            .append(shapeType)
            .filter(d => !d.properties.isPlaceholder)
            .attr('fill', d => {
                if (d.properties.type) {
                    switch (d.properties.type) {
                        case 'Thm':
                            return this.fill
                        case 'Pp':
                            return '#f005e0'
                        case 'Df':
                            return '#05e0f0'
                        default:
                            return this.fill
                    }
                }
                return this.fill
            })
    
        if (shapeType === 'circle') {
            shapes.attr('cx', d => d.x - minX + this.xOffset)
                  .attr('cy', d => d.y - minY + this.yOffset)
                  .attr('r', d => {
                      const decimalCount = getDecimalLength(d.properties.number)
                      const radiusIncreaseFactor = 0
                      return this.size + (decimalCount * radiusIncreaseFactor)
                  })
        } else if (shapeType === 'rect') {
            shapes.attr('x', d => d.x - minX + this.xOffset)
                  .attr('y', d => d.y - minY + this.yOffset)
                  .attr('width', this.size * 2)
                  .attr('height', this.size * 2)
        } else if (shapeType === 'ellipse') {
            shapes.attr('cx', d => d.x - minX + this.xOffset)
                  .attr('cy', d => d.y - minY + this.yOffset)
                  .attr('rx', 15)  // Default x-radius, adapt as needed
                  .attr('ry', 10)  // Default y-radius, adapt as needed
        } else if (shapeType === 'polygon') {
            // Example for a triangle, adapt the points for other polygons
            shapes.attr('points', d => {
                const x = d.x - minX + this.xOffset;
                const y = d.y - minY + this.yOffset;
                return `${x},${y-10} ${x-10},${y+10} ${x+10},${y+10}`;
            })
        }
    
        // Add click event handling for each shape
        shapes.on('click', (event, d) => {
            console.log(`Clicked ${shapeType} with data:`, d)
        })
    }
    

    /**
     * Draws text labels on the SVG canvas.
     * 
     * @private
     * @param {number} minX - The minimum X-coordinate in the data.
     * @param {number} minY - The minimum Y-coordinate in the data.
     */
    _drawTextLabels(minX, minY) {
        this.svg.selectAll('text')
            .data(Object.values(this.data).flat())
            .enter()
            .append('text')
            .filter(d => !d.properties.isPlaceholder)
            .attr('x', d => d.x - minX + this.xOffset)
            .attr('y', d => d.y - minY - 10 + this.yOffset)
            .text(d => d.properties.number)
            .attr('text-anchor', 'middle')
            .attr('font-size', this.textFontSize)
            .attr('fill', this.textFill)
            .attr('font-family', 'EB Garamond, serif')
    }
}