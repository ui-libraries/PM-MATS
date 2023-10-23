import data from './pm.json'
import {
    SVG
} from '@svgdotjs/svg.js'

/**
 * Class to visualize a Node object in 2D space.
 * It can calculate the position of a node based on its level, and draw it on a given SVG container.
 */
export class NodeVisualizer {
    // No changes here
    constructor(node, x = 0, y = 0) {
        this.node = node
        this.x = x
        this.y = y
    }

    draw(draw, color = 'red') {
        // Create a group for each node
        const group = draw.group()
        group.translate(this.x, this.y)

        // Add a circle element to the group
        const circleRadius = 10
        group.circle(circleRadius * 2).fill(color)

        // Add a text element to the group
        const text = group.text(this.node.properties.number.toString()).font({
            fill: 'black',
            family: 'Inconsolata',
            size: 12
        })

        // Calculate the text position and move it
        const textBox = text.bbox()
        const textX = circleRadius - textBox.width / 2
        const textY = -textBox.height
        text.move(textX, textY)

        // Attach metadata to the group for event delegation
        group.node.dataset.id = this.node.id
    }
}

/**
 * Represents a Node in a graph, including its properties and relationships.
 * @class
 */
export class Node {
    /**
     * Creates a new Node.
     * @param {string} id - The unique identifier for the Node.
     * @param {Object} [properties={}] - Additional properties of the Node.
     * @property {string} id - The unique identifier for the Node.
     * @property {Object} properties - Additional properties of the Node.
     * @property {Array<string>} proves - An array of Node IDs that this Node proves.
     * @property {Array<string>} provenBy - An array of Node IDs that prove this Node.
     */
    constructor(id, properties = {}) {
        this.id = id
        this.properties = properties
        this.proves = []
        this.provenBy = []
    }

    /**
     * Adds a Node ID to the 'proves' array, indicating a directed edge from this Node to another.
     * @param {Node} node - The Node that this Node proves.
     */
    addProof(node) {
        this.proves.push(node.properties.number)
    }

    /**
     * Adds a Node ID to the 'provenBy' array, indicating a directed edge from another Node to this Node.
     * @param {Node} node - The Node that proves this Node.
     */
    addProofFor(node) {
        this.provenBy.push(node.properties.number)
    }
}

/**
 * Represents a Graph containing nodes and their relationships.
 * @class
 */
export class Graph {
    /**
     * Creates a new Graph and loads data into it.
     * @property {Object<string, Node>} nodes - Object storing nodes, indexed by their IDs.
     */
    constructor() {
        this.nodes = {}
        this._loadJson()
    }

    /**
     * Private method to load JSON data into the Graph.
     * Populates the nodes and sets up relationships.
     * @private
     */
    _loadJson() {
        data.forEach(obj => {
            if (obj.type === "node") {
                this._insertNode(obj)
            } else if (obj.type === "relationship" && obj.label === "Proves") {
                let startNode = this.nodes[obj.start.id]
                let endNode = this.nodes[obj.end.id]

                if (startNode && endNode) {
                    startNode.addProof(endNode)
                    endNode.addProofFor(startNode)
                }
            }
        })
    }


    /**
     * Inserts a new node into the Graph.
     * @param {Object} obj - Object representing the node.
     * @private
     */
    _insertNode(obj) {
        let node = new Node(obj.id, obj.properties)
        this.nodes[node.id] = node
    }

    /**
     * Retrieves a Node by its number property.
     * @param {string} number - The number property to look for.
     * @returns {Node|null} The Node with the matching number or null.
     */
    getNodeByNumber(number) {
        for (let id in this.nodes) {
            let node = this.nodes[id]
            if (node.properties.number === number) {
                return node
            }
        }
        return null
    }

    /**
     * Retrieves a Node by its ID.
     * @param {string} id - The ID of the node.
     * @returns {Node|null} The Node with the matching ID or null.
     */
    getNodeById(id) {
        return this.nodes[id] || null
    }

    /**
     * Gets children IDs based on the node's number.
     * @param {string} number - The number property of the parent node.
     * @returns {Array<string>} Array of IDs of child nodes.
     */
    getChildrenIdsByNumber(number) {
        let childrenIds = []

        let numberParts = number.split('')

        Object.values(this.nodes).forEach(node => {
            let nodeNumberParts = node.properties.number.split('')
            let matches = nodeNumberParts.slice(0, numberParts.length).every((part, index) => part === numberParts[index])

            if (matches && nodeNumberParts.length === numberParts.length + 1) {
                childrenIds.push(node.id)
            }
        })

        // Sort by decimal number (so "2.01" comes before "2.1")
        childrenIds.sort((a, b) => {
            return parseFloat(this.nodes[a].properties.number) - parseFloat(this.nodes[b].properties.number)
        })

        return childrenIds
    }

    /**
     * Gets the parent ID of a node based on its number.
     * @param {string} number - The number property of the node.
     * @returns {string|null} The ID of the parent node or null.
     */
    getParentIdByNumber(number) {
        let inputNodeExists = Object.values(this.nodes).some(node => node.properties.number === number)
        if (!inputNodeExists) {
            console.log(`No node exists with the number ${number}`)
            return null
        }

        let parentNumber
        let numberParts = number.split(".")
        if (numberParts[1] && numberParts[1].length > 1) {
            parentNumber = `${numberParts[0]}.${numberParts[1].slice(0, -1)}`
        }

        let parentId = null
        Object.values(this.nodes).forEach(node => {
            if (node.properties.number === parentNumber) {
                parentId = node.id
            }
        })

        if (parentId === null) {
            // console.log(`No parent node exists for the number ${number}`)
        }

        return parentId
    }

    /*
    toJsonFile(filename) {
        let jsonContent = JSON.stringify(this.nodes, null, 2)
    
        fs.writeFile(filename, jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occurred while writing JSON object to file.")
                return console.log(err)
            }
            console.log("JSON file has been saved.")
        })
    } */

    /**
     * Gets nodes that match specified properties.
     * @param {Object} desiredProperties - Object containing properties to match.
     * @returns {Array<Node>} An array of Nodes that match the desired properties.
     */
    getNodesByProperties(desiredProperties) {
        let matchingNodes = []

        Object.values(this.nodes).forEach(node => {
            let matchesAll = true

            // Check if the node contains all properties from desiredProperties
            for (let property in desiredProperties) {
                if (node.properties[property] !== desiredProperties[property]) {
                    matchesAll = false
                    break
                }
            }

            // If the node matches all desired properties, add it to matchingNodes
            if (matchesAll) {
                matchingNodes.push(node)
            }
        })

        return matchingNodes
    }

    /**
     * Retrieves a sorted list of unique chapter numbers present in the nodes.
     *
     * @returns {number[]} - An array of sorted unique chapter numbers.
     *
     * @example
     * const chapters = getChapterNumbers()
     * console.log(chapters) // [1, 2, 3, ...]
     */
    getChapterNumbers() {
        let chapterNumbers = [...new Set(Object.values(this.nodes).map(node => Math.floor(parseFloat(node.properties.number))))]
        // sort the chapter numbers
        chapterNumbers.sort((a, b) => a - b)
        return chapterNumbers
    }

    /**
     * Plots nodes based on the provided chapter number and starting coordinates.
     * This method will also insert placeholders for missing nodes with a mantissa length of 1.
     * 
     * @param {number} chapter - The chapter number to be plotted.
     * @param {number} [startingX=0] - The starting X-coordinate for the plotting.
     * @param {number} [startingY=0] - The starting Y-coordinate for the plotting.
     * @returns {number} - Returns the largest X-coordinate value found during the plotting.
     * 
     * @example
     * plot(2)
     * plot(3, 150, 150)
     */
    plot(chapter, startingX = 0, startingY = 0, color) {
        //console.log(this.nodes)
        let maxX = 0
        let chapter_nodes = []
        // Filter nodes based on the given chapter
        for (let node of Object.values(this.nodes)) {
            if (node.properties.chapter === chapter.toString()) {
                chapter_nodes.push(node)
            }
        }

        // Extract nodes with a mantissa length of 1
        let primaryNodes = chapter_nodes.filter(node => {
            let mantissa = node.properties.number.split(".")[1]
            return mantissa && mantissa.length === 1
        })

        // Extract the actual mantissa values
        let mantissaValues = primaryNodes.map(node => node.properties.number.split(".")[1])

        // Find missing mantissa values
        for (let i = 0; i < 10; i++) {
            if (!mantissaValues.includes(i.toString())) {
                // Insert a placeholder node for the missing mantissa value
                chapter_nodes.push({
                    type: "node",
                    properties: {
                        number: chapter + "." + i,
                        isPlaceholder: true // Property to ensure it's not displayed
                    }
                })
            }
        }

        // Re-sort the nodes by their number property
        chapter_nodes.sort((a, b) => {
            let numA = parseFloat(a.properties.number)
            let numB = parseFloat(b.properties.number)
            return numA - numB || a.properties.number.localeCompare(b.properties.number)
        })
        let x = startingX
        let y = startingY
        let lastPrimaryNode = startingX
        let currentRootNodeNum = chapter

        for (let node of chapter_nodes) {
            node.rootNode = false
            let parts = node.properties.number.split(".")
            let mantissa = parts[1]
            let mantissaLength = mantissa ? mantissa.length : 0

            if (mantissaLength === 0) {
                node.x = x
                node.y = y
            } else if (mantissaLength === 1) {
                y += 50
                x = lastPrimaryNode
                node.x = x
                node.y = y
                node.rootNode = true
            } else if (mantissaLength === 2) {
                x += 50
                node.x = x
                node.y = y
                let lastRootNode = chapter_nodes.filter(n => n.rootNode && n.properties.number.split(".")[1][0] === mantissa[0]).pop()
                let rootNum
                if (lastRootNode) {
                    node.y = lastRootNode.y
                }
            } else if (mantissaLength === 3) {
                y += 50
                node.x = x
                node.y = y
            }

            if (node.properties.number === `25.1011`) {
                node.x = 8350
                node.y = 150
            }

            if (mantissa === '0') {
                lastPrimaryNode = x
            }

            if (node.x > maxX) {
                maxX = node.x
            }
        }
        return [chapter_nodes, maxX]
    }

    /**
     * Renders nodes to a canvas element.
     *
     * @param {Array<Object>} chapter_nodes - An array of node objects to be drawn. Each node object should have properties including 'x', 'y', and 'isPlaceholder'.
     * @param {string} color - The color to be used when drawing the nodes.
     */
    drawNodes(chapter_nodes, color) {
        chapter_nodes.forEach(node => {
            if (!node.properties.isPlaceholder) {
                new NodeVisualizer(node, node.x, node.y).draw("canvas", color)
            }
        })
    }
}

/**
 * D3Visualizer Class to create a D3 visualization.
 * 
 * @class
 * @param {string} [svgSelector='canvas'] - The CSS selector to attach the SVG element to.
 * @param {Object} data - The data to be visualized.
 * @param {Object} [options={}] - Additional options for customization.
 * @param {number} [options.xOffset=20] - X-offset for positioning elements.
 * @param {number} [options.yOffset=20] - Y-offset for positioning elements.
 * @param {number} [options.circleRadius=5] - The radius of circles in the visualization.
 * @param {string} [options.circleFill='blue'] - The fill color for circles.
 * @param {number} [options.textFontSize=12] - The font size for text labels.
 * @param {string} [options.textFill='black'] - The fill color for text.
 */
export class D3Visualizer {
    constructor(svgSelector = 'canvas', data, options = {}) {
        this.svg = d3.select(svgSelector)
        this.data = data
        this.xOffset = options.xOffset || 20
        this.yOffset = options.yOffset || 20
        this.circleRadius = options.circleRadius || 5
        this.circleFill = options.circleFill || 'blue'
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
        console.log(`minX: ${minX}, maxX: ${maxX}, minY: ${minY}, maxY: ${maxY}`);


        // Calculate SVG dimensions
        const svgWidth = maxX - minX + this.xOffset
        const svgHeight = maxY - minY + this.yOffset

        // Set SVG dimensions
        this.svg.attr('width', svgWidth)
            .attr('height', svgHeight)

        this.drawCircles(minX, minY)
        this.drawTextLabels(minX, minY)
    }

    /**
     * Draws circles on the SVG canvas.
     * 
     * @private
     * @param {number} minX - The minimum X-coordinate in the data.
     * @param {number} minY - The minimum Y-coordinate in the data.
     */
    drawCircles(minX, minY) {
        const circles = this.svg.selectAll('circle')
            .data(Object.values(this.data).flat())
            .enter()
            .append('circle')
            .filter(d => !d.properties.isPlaceholder)
            .attr('cx', d => d.x - minX + this.xOffset)
            .attr('cy', d => d.y - minY + this.yOffset)
            .attr('r', this.circleRadius)
            .attr('fill', this.circleFill)

        // Add click event handling for each circle
        circles.on('click', (event, d) => {
            console.log(`Clicked circle with data:`, d)
        })
    }

    /**
     * Draws text labels on the SVG canvas.
     * 
     * @private
     * @param {number} minX - The minimum X-coordinate in the data.
     * @param {number} minY - The minimum Y-coordinate in the data.
     */
    drawTextLabels(minX, minY) {
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
    }
}