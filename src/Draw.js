import { getDecimalLength, getDecimalPart } from './utils.js'
import { romanize } from './utils.js'

/**
 * Draw Class to create a D3 visualization.
 * 
 * @class
 * @param {string} [svgSelector='container'] - The CSS selector to attach the SVG element to.
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
    constructor(svgSelector = 'container', data, options = {}) {
        this.svg = d3.select(svgSelector)
        this.data = data
        this.xOffset = options.xOffset || 20
        this.yOffset = options.yOffset || 20
        this.shape = options.shape || 'circle'
        this.size = options.size || 5
        this.fill = options.fill || 'blue'
        this.textFontSize = options.textFontSize || 12
        this.textFill = options.textFill || 'black'
        this.minimap = options.minimap || false
        this.init()

        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
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

        // Calculate SVG dimensions
        const svgWidth = maxX - minX + this.xOffset
        const svgHeight = maxY - minY + this.yOffset

        // Set SVG dimensions
        this.svg.attr('width', svgWidth)
            .attr('height', svgHeight)

        this._drawShape(this.shape, minX, minY)
        if (!this.minimap) {
            this._drawTextLabels(minX, minY)
            this._drawChapterMarker(minX, minY)
        }
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
            shapes.attr('x', d => d.x - minX + this.xOffset - this.size)
                  .attr('y', d => d.y - minY + this.yOffset - this.size)
                  .attr('width', this.size * 2)
                  .attr('height', this.size * 2)
        } else if (shapeType === 'ellipse') {
            shapes.attr('cx', d => d.x - minX + this.xOffset)
                  .attr('cy', d => d.y - minY + this.yOffset)
                  .attr('rx', this.size)  // Adapt the x-radius as needed
                  .attr('ry', this.size * 0.7)  // Adapt the y-radius as needed
        } else if (shapeType === 'polygon') {
            // Generalized for an equilateral triangle, but can be modified for other polygons
            shapes.attr('points', d => {
                const x = d.x - minX + this.xOffset
                const y = d.y - minY + this.yOffset
                const halfWidth = this.size
                return [
                    `${x},${y - this.size}`,
                    `${x - halfWidth},${y + halfWidth}`,
                    `${x + halfWidth},${y + halfWidth}`
                ].join(' ')
            })
        }

        // Add click event handling for each shape
        shapes.on('click', (event, d) => {
            console.log(`Clicked ${shapeType} with data:`, d)
            let queryString = new URLSearchParams({ n: d.properties.number }).toString()
            let currentUrl = window.location.href.replace('index.html', '')
            window.open(`${currentUrl}?${queryString}`, '_blank')
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

    /**
     * Draws the special circle with an asterisk and number inside.
     * 
     * @private
     * @param {number} minX - The minimum X-coordinate in the data.
     * @param {number} minY - The minimum Y-coordinate in the data.
     */
    _drawChapterMarker(minX, minY) {
        const specialNodes = Object.values(this.data).flat().filter(d => {
            const decimalPart = getDecimalPart(d.properties.number)
            if (decimalPart) {
                return decimalPart === '0'
            }
            return false
        })

        // Create circles for special nodes
        const circles = this.svg.selectAll('.special-circle')
            .data(specialNodes)
            .enter()
            .append('circle')
            .attr('class', 'special-circle')
            .attr('cx', d => d.x - minX + this.xOffset)
            .attr('cy', d => d.y - minY + this.yOffset)
            .attr('r', 17)
            .attr('fill', 'transparent')
            .attr('stroke', 'black')
            .attr('stroke-width', 5)

        // Create text for special nodes
        const texts = this.svg.selectAll('.special-text')
            .data(specialNodes)
            .enter()
            .append('text')
            .attr('class', 'special-text')
            .attr('x', d => d.x - minX + this.xOffset)
            .attr('y', d => d.y - minY + this.yOffset)
            .attr('font-family', 'EB Garamond, serif')
            .attr('font-size', '12px')
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')

        // Create tspans for the ❋ character
        texts.append('tspan')
            .text('❋')

        // Create tspans for the node's number
        texts.append('tspan')
            .attr('dx', '-1')
            .text(d => d.properties.number.split('.')[0])

        circles.on('mouseenter', (event, d) => this._showTooltip(event, d))
            .on('mouseleave', () => this._hideTooltip())

        texts.on('mouseenter', (event, d) => this._showTooltip(event, d))
            .on('mouseleave', () => this._hideTooltip())
    }

    _showTooltip(event, d) {
        this.tooltip.transition()
            .duration(200)
            .style('opacity', .9)
        this.tooltip.html(`Volume ${romanize(d.properties.volume)}<br>Part ${romanize(d.properties.part)}<br>Section ${d.properties.section}`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px')
    }
    
    _hideTooltip() {
        this.tooltip.transition()
            .duration(500)
            .style('opacity', 0)
    }   
}