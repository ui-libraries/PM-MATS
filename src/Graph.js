import data from './pmdata.json'
import { Node } from './Node.js'
import { getDecimalLength, getDecimalPart } from './utils.js'

/**
 * Represents a Graph containing nodes and their relationships.
 * @class
 */
export class Graph {
    /**
     * Creates a new Graph and loads data into it.
     * @constructor
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
        let chapterNumbers = [...new Set(Object.values(this.nodes).map(node => node.properties.chapter))]   
        chapterNumbers.sort((a, b) => a - b)
        return chapterNumbers
    }

    /**
     * Fetches the nodes associated with a specific chapter, ensuring that there's a node for every primary decimalPart value from 0 to 9.
     * Missing nodes are represented as placeholders.
     *
     * @param {string|number} chapter - The chapter for which the nodes are to be fetched.
     * @returns {Object[]} An array of node objects associated with the chapter, sorted by their 'number' property.
     * @property {string} type - The type of the node. In this context, it's always "node".
     * @property {Object} properties - The properties associated with the node.
     * @property {string} properties.number - The node's unique identifier in the format "{chapter}.{decimalPart}".
     * @property {boolean} [properties.isPlaceholder=false] - Indicates if the node is a placeholder for a missing primary decimalPart value.
     * 
     * @example
     * // Assuming the instance has a nodes property populated as:
     * // {
     * //     node1: { properties: { chapter: '1', number: '1.0' } },
     * //     node2: { properties: { chapter: '1', number: '1.1' } },
     * //     ... other nodes
     * // }
     * getChapterNodes(1);
     * // Output: Array of nodes for chapter 1, with placeholders for missing primary decimalPart values.
     */
    getChapterNodes(chapter) {
        let chapter_nodes = []
        let volume, part, section
        // Filter nodes based on the given chapter
        for (let node of Object.values(this.nodes)) {
            if (node.properties.chapter === chapter.toString()) {
                volume = node.properties.volume
                part = node.properties.part
                section = node.properties.section
                chapter_nodes.push(node)
            }
        }

        // Extract nodes with a decimalPart length of 1
        let primaryNodes = chapter_nodes.filter(node => {
            let decimalPart = node.properties.number.split(".")[1]
            return decimalPart && decimalPart.length === 1
        })

        // Extract the actual decimalPart values
        let decimalPartValues = primaryNodes.map(node => node.properties.number.split(".")[1])

        // add ghost nodes for missing decimalPart values to maintain Graph structure
        for (let i = 0; i < 10; i++) {
            if (!decimalPartValues.includes(i.toString())) {
                chapter_nodes.push({
                    type: "node",
                    properties: {
                        number: chapter + "." + i,
                        isPlaceholder: true,
                        volume: volume,
                        part: part,
                        section: section,
                        chapter: chapter
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
        return chapter_nodes
    }

    /**
     * Plots nodes for a specified chapter on a 2D space. Nodes are positioned based on their 'number' property's decimalPart length.
     * 
     * Nodes with:
     * - A decimalPart length of 0 (like x.0) are treated as primary nodes.
     * - A decimalPart length of 1 are vertically aligned with primary nodes.
     * - A decimalPart length of 2 are horizontally displaced from the previous node.
     * - A decimalPart length of 3 are vertically aligned below their predecessor.
     * - A decimalPart length of 4 are horizontally displaced from the previous node.
     *
     * @param {string|number} chapter - The chapter for which the nodes are to be plotted.
     * @param {number} [startingX=0] - The initial x-coordinate for plotting.
     * @param {number} [startingY=0] - The initial y-coordinate for plotting.
     * @param {number} [PAD=50] - The padding between nodes.
     * @returns {[Object[], number]} A tuple where the first element is the array of plotted node objects and the second is the maximum x-coordinate value among the nodes.
     * 
     * @property {number} x - The x-coordinate of a node.
     * @property {number} y - The y-coordinate of a node.
     * 
     * @example
     * // Given nodes with properties {chapter: '1', number: '1.x'} etc.
     * plot(1, 0, 0);
     * // Output: Array of plotted nodes for chapter 1 and the maximum x-coordinate value.
     */
    plot(chapter, startingX = 0, startingY = 0, PAD = 50) {
        let maxX = 0
        let maxY = 0
        let x = startingX
        let y = startingY
        const chapter_nodes = this.getChapterNodes(chapter)
        
        for (let node of chapter_nodes) {
            let previousNode = chapter_nodes[chapter_nodes.indexOf(node) - 1]
            let decimalPart = getDecimalPart(node.properties.number)
            let decimalPartLength = getDecimalLength(node.properties.number)
    
            switch (decimalPartLength) {
                case 0:
                    node.x = x
                    node.y = y
                    break
    
                case 1:
                    y = Math.max(y + PAD, maxY + PAD)
                    x = startingX
                    node.x = x
                    node.y = y
                    break
    
                case 2:
                    x += PAD
                    node.x = x
                    node.y = y
                    let lastRootNode = chapter_nodes.find(n => getDecimalPart(n.properties.number) === decimalPart[0])
                    if (lastRootNode) {
                        node.y = lastRootNode.y
                    }
                    break
    
                case 3:
                    y += PAD
                    node.x = x
                    node.y = y
                    if (getDecimalLength(previousNode.properties.number) === 2) {
                        y = previousNode.y + PAD
                        node.y = y
                    }
                    break

                case 4:
                    x += PAD
                    node.x = x
                    node.y = y
                    if (getDecimalLength(previousNode.properties.number) === 3) {
                        x = previousNode.x + PAD
                        node.x = x
                    }
            }
            
            // store the x,y boundaries so we can properly space rows and columns
            if (node.x > maxX || node.y > maxY) {
                maxX = node.x > maxX ? node.x : maxX
                maxY = node.y > maxY ? node.y : maxY
            }
            
        }
        return [chapter_nodes, maxX]
    }
}
