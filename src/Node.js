

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