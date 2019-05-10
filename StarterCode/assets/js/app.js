// Define SVG area dimensions
var svgWidth = 760;
var svgHeight = 560;

// Define the chart's margins as an object
var chartMargin = {
  top: 45,
  right: 45,
  bottom: 100,
  left: 45
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.bottom})`);

d3.csv("assets/data/data.csv", function(error, stateData) {
    if (error) throw error;

    console.log(stateData);

    stateData.forEach(function(data) {
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    })

    var xScale = d3.scaleLinear()
        .domain([8, d3.max(stateData, d => d.smokes)])
        .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
        .domain([20, d3.max(stateData, d => d.obesity)])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.selectAll(".circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", d => xScale(d.smokes))
        .attr("cy", d => yScale(d.obesity))
        .attr("r", 15)
        .attr("fill", "aquamarine")
        .attr("opacity", ".5");

    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .selectAll("tspan")
        .data(stateData)
        .enter()
        .append("tspan")
            .attr("x", d => xScale(d.smokes))
            .attr("y", d => yScale(d.obesity - 0.2))
            .text(d => d.abbr);

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left - 4)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokers (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top - 4})`)
      .attr("class", "axisText")
      .text("Obesity (%)");

    toolTipCreator(stateData);
    
});

