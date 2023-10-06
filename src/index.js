import { Graph, NodeVisualizer, GraphVisualizer } from './functions'
import { table } from './datatable.js'

const graph = new Graph()
const adjacencyList = graph.createAdjacencyList()  // Assuming you have this method in your graph class
const graphVisualizer = new GraphVisualizer(graph, adjacencyList)
graphVisualizer.visualize()

/*
const width = 1200
const height = 800

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,40)")

function customTreeLayout(data) {
    return data.map(d => {
        let number = 0 // default to 0
        if (d.properties && d.properties.number) {
            number = parseFloat(d.properties.number.split('.')[1])
        }

        const mantissa = number % 1
        if (mantissa === 0) {
            d.x = Math.floor(number)
            d.y = 0
        } else {
            d.x = Math.floor(number) + 0.5
            d.y = mantissa % 2 === 0 ? -(mantissa * 10) : mantissa * 10
        }
        return d
    })
}
    
    

d3.json("pm.json").then(data => {
    const nodes = customTreeLayout(data)
    console.log(nodes.length)
    
    svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("cx", d => d.x * 100)
        .attr("cy", d => d.y * 100)
        .style("fill", d => {
            if (d.properties && d.properties.type) {
                switch(d.properties.type) {
                    case "Df": return "red"
                    // Add other cases if needed
                    default: return "black"
                }
            } else {
                // Default or error handling color
                return "grey" 
            }
        })
        
    
    // Add more rendering logic here for links or node labels as needed
})
*/

