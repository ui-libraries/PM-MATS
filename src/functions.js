import data from './pm.json'
import { SVG } from '@svgdotjs/svg.js'

/**
 * Class to visualize a Node object in 2D space.
 * It can calculate the position of a node based on its level, and draw it on a given SVG container.
 */
export class NodeVisualizer {
    /**
     * Creates a new NodeVisualizer object.
     * @param {Object} node - The Node object to visualize.
     * @param {number} [x=0] - The initial x-coordinate.
     * @param {number} [y=0] - The initial y-coordinate.
     */
    constructor(node, x = 0, y = 0) {
        this.node = node
        this.x = x
        this.y = y
    }

    /**
     * Get the level of the node based on the decimal part of its number property.
     * @return {number} The level of the node.
     */
    getLevel() {
        if (!this.node) {
            console.error("Node is undefined")
            return
        }
        const decimalPart = this.node.properties.number.split('.')[1]
        return decimalPart ? decimalPart.length : 0
    }

    /**
     * Calculate the position [x, y] of the node based on its level.
     * - Level 0 nodes remain at their initial position.
     * - Odd level nodes are positioned vertically.
     * - Even level nodes are positioned horizontally.
     * @return {Array.<number, number>} An array containing the new x and y coordinates.
     */
    getPosition() {
        const VERTICAL_SPACING = 50
        const HORIZONTAL_SPACING = 50

        const level = this.getLevel()

        if (level === 0) {
            return [this.x, this.y]
        } else if (level % 2 === 1) {
            return [this.x, this.y + VERTICAL_SPACING]
        } else {
            return [this.x + HORIZONTAL_SPACING, this.y]
        }
    }

    /**
     * Draw the node in the given SVG container.
     * - Creates a circle at the node's position.
     * - Adds a number label above the circle.
     * - Sets up a click event listener on the circle.
     * @param {string} containerId - The id of the SVG container where the node will be drawn.
     * @param {string} [color] - The color to fill the circle. Defaults to 'red'.
     */
    draw(containerId, color) {
        const [x, y] = this.getPosition()
        const circleRadius = 10

        const draw = SVG().addTo(`#${containerId}`).size('100%', '100%')
        const circle = draw.circle(circleRadius * 2).move(x, y).fill(color || 'red')
        const text = draw.text(this.node.properties.number.toString()).font({
            fill: 'black',
            family: 'Inconsolata',
            size: 12
        })

        const textBox = text.bbox()
        const textX = x + circleRadius - textBox.width / 2
        const textY = y - textBox.height

        text.move(textX, textY)

        circle.on('click', () => {
            console.log(`Node ${this.node.id} was clicked!`)
        })
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
        this.proves.push(node.id)
    }

    /**
     * Adds a Node ID to the 'provenBy' array, indicating a directed edge from another Node to this Node.
     * @param {Node} node - The Node that proves this Node.
     */
    addProofFor(node) {
        this.provenBy.push(node.id)
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
     * Creates an adjacency list for the graph based on node numbers.
     * Each node number is split into its integral and decimal parts to determine
     * horizontal and vertical neighbors.
     *
     * Horizontal neighbors share the same integral part and have the same number of
     * decimal places (always even), but differ in the last decimal digit.
     * For example, 2.01 and 2.02 are horizontal neighbors.
     *
     * Vertical neighbors also have the same integral part and have the same number
     * of decimal places (always even). The first decimal digit is different between them,
     * but the remaining digits match.
     * For example, 2.01 and 2.11 are vertical neighbors.
     * 
     * The resulting adjacency list is an object where keys are node numbers
     * and values are objects containing arrays of horizontal and vertical neighbors.
     *
     * @returns {Object} An adjacency list, keyed by node number, containing horizontal and vertical neighbors.
     */
    createAdjacencyList() {
        const adjList = {}
        const allNumbers = Object.values(this.nodes).map(node => node.properties.number)

        Object.values(this.nodes).forEach(node => {
            const nodeNumber = node.properties.number
            const horizontal = []
            const vertical = []

            const [nodeIntegral, nodeDecimal] = nodeNumber.split(".")
            const isNodeEvenDecimal = nodeDecimal.length % 2 === 0

            allNumbers.forEach(otherNumber => {
                if (nodeNumber === otherNumber) return // Skip self

                const [otherIntegral, otherDecimal] = otherNumber.split(".")
                const isOtherEvenDecimal = otherDecimal.length % 2 === 0

                if (isNodeEvenDecimal && isOtherEvenDecimal) {
                    // Check for horizontal neighbors
                    if (nodeIntegral === otherIntegral) {
                        const nodePrefix = nodeDecimal.slice(0, -1)
                        const otherPrefix = otherDecimal.slice(0, -1)

                        if (nodePrefix === otherPrefix && nodeDecimal !== otherDecimal) {
                            horizontal.push(otherNumber)
                        }
                    }

                    // Check for vertical neighbors
                    if (nodeIntegral === otherIntegral) {
                        const nodeFirstDigit = nodeDecimal.slice(0, 1)
                        const otherFirstDigit = otherDecimal.slice(0, 1)
                        const nodeSuffix = nodeDecimal.slice(1)
                        const otherSuffix = otherDecimal.slice(1)

                        if (nodeFirstDigit !== otherFirstDigit && nodeSuffix === otherSuffix) {
                            vertical.push(otherNumber)
                        }
                    }
                }
            })

            adjList[nodeNumber] = {
                horizontal,
                vertical
            }
        })

        return adjList
    }

    /**
     * Generates the lowest possible decimal number for each whole number in the graph.
     * Assumes all numbers in the graph have a decimal part (e.g., no "1", "2", "3", etc.).
     *
     * @returns {Object} An object mapping each whole number to its lowest possible decimal extension.
     */
    generateLowestNumbers() {
        const lowestNumbers = {}
        const allNumbers = Object.values(this.nodes).map(node => node.properties.number)

        allNumbers.forEach(number => {
            const [integral] = number.split(".")
            if (!lowestNumbers[integral]) {
                lowestNumbers[integral] = number
            } else {
                if (parseFloat(number) < parseFloat(lowestNumbers[integral])) {
                    lowestNumbers[integral] = number
                }
            }
        })

        return lowestNumbers
    } 

}