const svg = d3.select('#svg-container')

d3.json('pm_coordinates.json').then(data => {
  // Calculate the minimum and maximum x and y coordinates
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

  // Loop through the chapters and objects to collect x and y values
  Object.keys(data).forEach(chapter => {
    data[chapter].forEach(d => {
      if (!d.properties.isPlaceholder) {
        minX = Math.min(minX, d.x)
        maxX = Math.max(maxX, d.x)
        minY = Math.min(minY, d.y)
        maxY = Math.max(maxY, d.y)
      }
    })
  })

  // Define an offset to move the circles and text labels to the right and down
  const xOffset = 20
  const yOffset = 20

  // Calculate the width and height of the SVG based on the data
  const svgWidth = maxX - minX + xOffset
  const svgHeight = maxY - minY + yOffset

  // Set the SVG dimensions to fit the data
  svg.attr('width', svgWidth)
     .attr('height', svgHeight)

  // Create circles and filter out placeholders
  const circles = svg.selectAll('circle')
    .data(Object.values(data).flat())
    .enter()
    .append('circle')
    .filter(d => !d.properties.isPlaceholder)
    .attr('cx', d => d.x - minX + xOffset)
    .attr('cy', d => d.y - minY + yOffset)
    .attr('r', 5)
    .attr('fill', 'blue')

  // Add click event handling for each circle
  circles.on('click', (event, d) => {
    console.log(`Clicked circle with data:`, d)
  })

  // Create text labels and filter out placeholders
  const textLabels = svg.selectAll('text')
    .data(Object.values(data).flat())
    .enter()
    .append('text')
    .filter(d => !d.properties.isPlaceholder)
    .attr('x', d => d.x - minX + xOffset)
    .attr('y', d => d.y - minY - 10 + yOffset)
    .text(d => d.properties.number)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('fill', 'black')
})