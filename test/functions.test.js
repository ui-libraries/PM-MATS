import { expect } from 'chai'
import { NodeVisualizer, Node, Graph } from '../src/functions'

describe('NodeVisualizer', () => {
    describe('getLevel', () => {
        it('should return 0 for integer numbers', () => {
            const node = { properties: { number: '3' } }
            const visualizer = new NodeVisualizer(node)
            expect(visualizer.getLevel()).to.equal(0)
        })

        it('should return the number of digits in the decimal part for decimal numbers', () => {
            const node = { properties: { number: '2.36' } }
            const visualizer = new NodeVisualizer(node)
            expect(visualizer.getLevel()).to.equal(2)
        })
    })

    describe('getPosition', () => {
        it('should return initial coordinates for level 0', () => {
            const node = { properties: { number: '3' } }
            const visualizer = new NodeVisualizer(node, 10, 20)
            expect(visualizer.getPosition()).to.deep.equal([10, 20])
        })

        it('should return vertical position for odd levels', () => {
            const node = { properties: { number: '42.1' } }
            const visualizer = new NodeVisualizer(node, 10, 20)
            expect(visualizer.getPosition()).to.deep.equal([10, 70])
        })

        it('should return horizontal position for even levels', () => {
            const node = { properties: { number: '42.12' } }
            const visualizer = new NodeVisualizer(node, 10, 20)
            expect(visualizer.getPosition()).to.deep.equal([60, 20])
        })
    })
})

describe('Node', () => {
    let nodeA, nodeB

    beforeEach(() => {
        nodeA = new Node('A', { number: '42' })
        nodeB = new Node('B', { number: '43' })
    })

    describe('addProof', () => {
        it('should add a node ID to the proves array', () => {
            nodeA.addProof(nodeB)
            expect(nodeA.proves).to.deep.equal(['B'])
        })

        it('should not affect the provenBy array', () => {
            nodeA.addProof(nodeB)
            expect(nodeA.provenBy).to.deep.equal([])
        })
    })

    describe('addProofFor', () => {
        it('should add a node ID to the provenBy array', () => {
            nodeA.addProofFor(nodeB)
            expect(nodeA.provenBy).to.deep.equal(['B'])
        })

        it('should not affect the proves array', () => {
            nodeA.addProofFor(nodeB)
            expect(nodeA.proves).to.deep.equal([])
        })
    })
})

describe('Graph', () => {
  let graph

  beforeEach(() => {
    graph = new Graph()
  })

  describe('getNodeById', () => {
    it('should return the node with the specified id', () => {
      const node = graph.getNodeById("4")
      expect(node.id).to.equal('4')
      expect(node.properties.number).to.equal("1.3")
    })

    it('should return null if no node matches', () => {
      const node = graph.getNodeById("Z")
      expect(node).to.equal(null)
    })
  })

  describe('getChildrenIdsByNumber', () => {
    it('should return the children IDs for a given number', () => {
      const childrenIds = graph.getChildrenIdsByNumber("1.7")
      expect(childrenIds).to.deep.equal(['9', '10']) 
    })

    it('should return an empty array if no children are found', () => {
      const childrenIds = graph.getChildrenIdsByNumber("2.11")
      expect(childrenIds).to.deep.equal([])
    })
  })

  describe('getParentIdByNumber', () => {
    it('should return the parent ID for a given number', () => {
      const parentId = graph.getParentIdByNumber("1.71")
      expect(parentId).to.equal('8') 
    })

    it('should return null if no parent is found', () => {
      const parentId = graph.getParentIdByNumber("1.3")
      expect(parentId).to.equal(null)
    })
  })

  describe('getNodesByProperties', () => {
    it('should return nodes that match the given properties', () => {
      const nodes = graph.getNodesByProperties({ chapter: "1", part: "1" })
      expect(nodes).to.have.lengthOf(11)
      expect(nodes.map(n => n.id)).to.include('4')
    })

    it('should return an empty array if no matching nodes are found', () => {
      const nodes = graph.getNodesByProperties({ chapter: "999" })
      expect(nodes).to.have.lengthOf(0)
    })
  })
})

