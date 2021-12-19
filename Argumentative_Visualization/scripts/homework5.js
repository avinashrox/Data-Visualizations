
lineMargin = { top: 20, right: 60, bottom: 60, left: 100 };
 

// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  mapSvg = d3.select('#svg1');
  lineSvg = d3.select('#svg2');
  lineWidth = +lineSvg.style('width').replace('px','');
  lineHeight = +lineSvg.style('height').replace('px','');;
  lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
  lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;

  // Load both files before doing anything else
  Promise.all(
               [d3.csv('data/heat.csv')])
          .then(function(values){
    timeData = values[0];
    timeData.forEach(function(d){
      d["HIGH_TEMP"]=+d["HIGH_TEMP"]
      
    });
    
    drawMap();
    drawLineChart();
  })

});

// Get the min/max values for a year and return as an array
// of size=2. You shouldn't need to update this function.

// Draw the map in the #map svg
function drawMap() {
  mapSvg.select('g').remove();
  var xScale = d3.scaleTime()
                    .domain(d3.extent(timeData, function(d) { 
                      return new Date(d["REPORTING_DT"]); 
                    }))
                    .range([0,lineInnerWidth]);
  max_gdp =  d3.max(timeData, d => new Date(d["REPORTING_DT"]))                 
  var yScale = d3.scaleLinear()
                    .domain([80,120]) 
                    .range([lineInnerHeight, 0]);
 g = mapSvg.append('g')
                    .attr('transform',`translate(${lineMargin.left},${lineMargin.top})`);
 
 div = d3.select("body").append("div")
                    .attr("class", "tooltip-donut")
                    .style("opacity", 0);

  const singleLine2 = d3.line()
            .x(d => xScale(new Date(d["REPORTING_DT"])))
            .y(d => yScale(d["HIGH_TEMP"]));            
  g.append('path')
            .datum(timeData)  
            .attr('class','singleLine')      
            .style('fill','none')
            .style('stroke','blue')
            .style('stroke-width','2')
            .attr('d', singleLine2);
  g.selectAll("circles1")
            .data(timeData)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(new Date(d["REPORTING_DT"])))
            .attr('cy', d => yScale(d["HIGH_TEMP"]))
            .attr('r', 3.5)
            .style('fill', 'blue')
            .on('mouseover', function(d) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Temperature: '+ (d['HIGH_TEMP']);
              div.html(num)
                     .style("left", (d3.event.pageX + 20) + "px")
                     .style("top", (d3.event.pageY - 30) + "px");
            //console.log('mouseover on ' + country);
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            //console.log('mouseout on ' + country);
          })                    
  g.append('text')
            .attr('transform','rotate(-90)')
            .attr('y','-50px')
            .attr('text-anchor','middle')
            .attr('x',-lineInnerHeight/2)
            .style('font-size','18px')
            .style('fill','black')
            .text("Temperature(°F)");
  g.append('text')
            .attr('transform',`translate(${lineInnerWidth/2},${lineInnerHeight+40})`)
            .style('fill','black')
            .style('font-size','18px')
            .text('Date');
    g.append('g')
            .call(d3.axisLeft(yScale)
                  .ticks(10));      
    g.append('g')
          .attr('transform',`translate(0,${lineInnerHeight})`)
         .call(d3.axisBottom(xScale)); 
  }


// Draw the line chart in the #linechart svg for
// the country argument (e.g., `Egypt').
function drawLineChart() {
  lineSvg.select('g').remove();
  var xScale = d3.scaleTime()
                    .domain(d3.extent(timeData, function(d) { 
                      return new Date(d["REPORTING_DT"]); 
                    }))
                    .range([0,lineInnerWidth]);
  max_gdp =  d3.max(timeData, d => new Date(d["REPORTING_DT"]))                 
  var yScale = d3.scaleLinear()
                    .domain([0,400]) 
                    .range([lineInnerHeight, 0]);
 g = lineSvg.append('g')
                    .attr('transform',`translate(${lineMargin.left},${lineMargin.top})`);

  const singleLine = d3.line()
            .x(d => xScale(new Date(d["REPORTING_DT"])))
            .y(d => yScale(d["HIGH_TEMP"]));            
  g.append('path')
            .datum(timeData)  
            .attr('class','singleLine')      
            .style('fill','none')
            .style('stroke','blue')
            .style('stroke-width','2')
            .attr('d', singleLine);    
  g.selectAll("circles1")
            .data(timeData)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(new Date(d["REPORTING_DT"])))
            .attr('cy', d => yScale(d["HIGH_TEMP"]))
            .attr('r', 3.5)
            .style('fill', 'blue')
            .on('mouseover', function(d) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Temperature: '+ (d['HIGH_TEMP']);
              div.html(num)
                     .style("left", (d3.event.pageX + 20) + "px")
                     .style("top", (d3.event.pageY - 30) + "px");
            //console.log('mouseover on ' + country);
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            //console.log('mouseout on ' + country);
          })                
  g.append('text')
            .attr('transform','rotate(-90)')
            .attr('y','-50px')
            .attr('text-anchor','middle')
            .attr('x',-lineInnerHeight/2)
            .style('font-size','18px')
            .style('fill','black')
            .text("Temperature(°F)");
  g.append('text')
            .attr('transform',`translate(${lineInnerWidth/2},${lineInnerHeight+40})`)
            .style('fill','black')
            .style('font-size','18px')
            .text('Date');
    g.append('g')
            .call(d3.axisLeft(yScale)
                  .ticks(10));      
    g.append('g')
          .attr('transform',`translate(0,${lineInnerHeight})`)
         .call(d3.axisBottom(xScale));
}
