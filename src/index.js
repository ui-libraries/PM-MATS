import { Graph, NodeVisualizer, GraphVisualizer } from './functions'
import { table } from './datatable.js'

const graph = new Graph()
const adjacencyList = graph.createAdjacencyList()  // Assuming you have this method in your graph class
const graphVisualizer = new GraphVisualizer(graph, adjacencyList)
graphVisualizer.visualize()


/*
let n = graph.getNodeById('12')
let v = new NodeVisualizer(n, 10, 10)
v.draw('canvas', 'red')

let nn2 = graph.getNodeById('19')
let v2 = new NodeVisualizer(nn2, 40, 10)
v2.draw('canvas', 'blue')
*/
