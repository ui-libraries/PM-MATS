const width = 1200;
const height = 800;

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,40)");

function customTreeLayout(data) {
    let nodes = [];
    data.forEach(d => {
        let number = parseFloat(d.properties.number.split('.')[1]);
        let mantissa = number % 1;
        if (mantissa === 0) {
            d.x = Math.floor(number);
            d.y = 0;
        } else {
            d.x = Math.floor(number) + 0.5;
            d.y = mantissa % 2 === 0 ? -(mantissa * 10) : mantissa * 10;
        }
        nodes.push(d);
    });
    return nodes;
}

d3.json("/../pm.json").then(data => {
    const nodes = customTreeLayout(data);
    
    svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("cx", d => d.x * 100)  // multiply by a factor to space them out
        .attr("cy", d => d.y * 100)
        .style("fill", d => {
            switch(d.properties.type) {
                case "Df": return "red";
                // Add other cases if needed
                default: return "black";
            }
        });
    
    // Add more rendering logic here for links or node labels as needed.
});

    
