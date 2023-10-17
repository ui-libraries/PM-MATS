// Assuming you have loaded D3.js

// Select the SVG container
const svg = d3.select('#svg-container');

// Load your JSON data
d3.json('pm_coordinates.json').then(data => {
    // Calculate the minimum and maximum x and y coordinates
    const xValues = [];
    const yValues = [];

    // Loop through the chapters and objects to collect x and y values
    Object.keys(data).forEach(chapter => {
        data[chapter].forEach(d => {
            if (!d.properties.isPlaceholder) { // Check if it's not a placeholder
                xValues.push(d.x);
                yValues.push(d.y);
            }
        });
    });

    // Calculate the minimum and maximum x and y values
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    // Define an offset to move the circles and text labels to the right and down
    const xOffset = 20; // Adjust this value as needed
    const yOffset = 20; // Adjust this value as needed

    // Calculate the width and height of the SVG based on the data
    const svgWidth = maxX - minX + xOffset;
    const svgHeight = maxY - minY + yOffset;

    // Set the SVG dimensions to fit the data
    svg.attr('width', svgWidth)
       .attr('height', svgHeight);

    // Create a selection of circles for each chapter's objects
    Object.keys(data).forEach(chapter => {
        const circles = svg.selectAll(`circle-chapter-${chapter}`)
            .data(data[chapter])
            .enter()
            .append('circle')
            .attr('cx', d => {
                if (!d.properties.isPlaceholder) {
                    return d.x - minX + xOffset; // Adjust x-coordinates with xOffset
                }
            })
            .attr('cy', d => {
                if (!d.properties.isPlaceholder) {
                    return d.y - minY + yOffset; // Adjust y-coordinates with yOffset
                }
            })
            .attr('r', 5) // Set the radius of the circles
            .attr('fill', 'blue'); // Set the fill color

        // Add text labels above the circles
        svg.selectAll(`text-chapter-${chapter}`)
            .data(data[chapter])
            .enter()
            .append('text')
            .attr('x', d => {
                if (!d.properties.isPlaceholder) {
                    return d.x - minX + xOffset; // Adjust x-coordinates with xOffset
                }
            })
            .attr('y', d => {
                if (!d.properties.isPlaceholder) {
                    return d.y - minY - 10 + yOffset; // Adjust y-coordinates with yOffset
                }
            })
            .text(d => {
                if (!d.properties.isPlaceholder) {
                    return d.properties.number; // Display the "number" property as text
                }
            })
            .attr('text-anchor', 'middle') // Center-align the text horizontally
            .attr('font-size', 12) // Set the font size of the text
            .attr('fill', 'black'); // Set the fill color of the text

        // Add click event handling for each circle in this chapter
        circles.on('click', (event, d) => {
            // Handle click event for each circle (d represents the data associated with the circle)
            console.log(`Clicked circle in chapter ${chapter} with data:`, d);
        });
    });
});
