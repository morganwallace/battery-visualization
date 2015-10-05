function ChartPerCycle(){
	var margin = {top: 20, right: 20, bottom: 50, left: 60},
	    width = 960 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10);

	var svg = d3.select("#viz-container").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("static/data/PerCycle.csv", function(error, data) {
	  if (error) throw error;
	  // console.log(data);

	  x.domain(data.map(function(d) { return d["Cycle Number"]; }));
	  y.domain([0, d3.max(data, function(d) { return d["Discharge Capacity"]; })]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append("text")
	      .attr("transform", " translate(0,0)")
	      .attr("y", 25)
	      .attr("x",width/2)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Cycle Number");;

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90) translate(0,-50)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Discharge Capacity");
	   
	   var title=svg.append('text')
	   		.attr('x',width/2 - 85)
	   		.attr('y',20)
	   	   .text("Hover over a cycle to update the lower graph")

	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d["Cycle Number"]); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d["Discharge Capacity"]); })
	      .attr("height", function(d) { return height - y(d["Discharge Capacity"]); })
	      .on("mouseover", function(d) {
	        // ChartTimeSeries()
	        $('#timeSeries').remove();
	        ChartTimeSeries(d["Cycle Number"]);
          });
	});

}
ChartPerCycle();

/////// Time Series

	var margin = {top: 20, right: 40, bottom: 50, left: 60},
	    width = 960 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	var x = d3.scale.linear()
	    .range([0, width]);

	var yScaleCurrent = d3.scale.linear()
	    .range([height, 0]);
	var yScalePotential = d3.scale.linear()
	    .range([height, 0]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxisCurrent = d3.svg.axis()
	    .scale(yScaleCurrent)
	    .orient("left");

   var yAxisPotential = d3.svg.axis()
	    .scale(yScalePotential)
	    .orient("left");

	var lineCurrent = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return x(d[0]); })
	    .y(function(d) { return yScaleCurrent(d[1]); });
	var linePotential = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return x(d[0]); })
	    .y(function(d) { return yScalePotential(d[1]); });

	
var tsdata=[];
d3.csv("static/data/TimeSeries.csv", function(error, data) {
  if (error) throw error;
  data.forEach(function(d) {
    d.Current = +d.Current;
    d.Potential = +d.Potential;
    d['Test Time']= +d['Test Time'];
  });

  tsdata=data;
  ChartTimeSeries(1);
});

var Currents={};
var Potentials={};
function ChartTimeSeries(hoveredCycleNumber){
	

	
	  data=tsdata.filter(function(d){return d["Cycle Number"]==hoveredCycleNumber;})
	  color.domain(["Current","Potential"]);

	  Currents =  data.map(function(d) {
	        return [d["Test Time"], d["Current"]];
	      });
	  Potentials=  data.map(function(d) {
	        return [d["Test Time"],d["Potential"]];
	      });

	  var svg = d3.select("#viz-container").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .attr('id','timeSeries')
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	  x.domain(d3.extent(data, function(d) { return d["Test Time"]; }));

	  yScaleCurrent.domain([
	    d3.min(data, function(d) { return d.Current; }),
	    d3.max(data, function(d) { return d.Current; })
	  ]);

	  yScalePotential.domain([
	    d3.min(data, function(d) { return d.Potential; }),
	    d3.max(data, function(d) { return d.Potential; })
	  ]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append('text')
	    	.attr('y',30)
	    	.attr('x',width/2-85)
	    	.text('Test Time (Range of Seconds)');

	  svg.append("g")
	      .attr("class", "y axis current")
	      .style('fill','steelblue')
	      .call(yAxisCurrent)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style({
	      	"text-anchor": "end",
	      	"fill":"steelblue"
		  })
	      .text("Current");
	   
	   svg.append("g")
	      .attr("class", "y axis potential")
	      .attr("transform", "translate(" + width + " ,0)")
	      .style('fill','red')
	      .call(yAxisPotential)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .attr('class','axis-label')
	      .style("text-anchor", "end")
	      .text("Potential");



	  svg.append("path")
	      .attr("class", "line current")
	      .attr("d", function(d) { return lineCurrent(Currents); } )
	      .style("stroke", 'steelblue');

	   svg.append("path")
	      .attr("class", "line potential")
	      .attr("d", function(d) { return linePotential(Potentials); } )
	      .style("stroke", 'red');

	   var title=svg.append('text')
	   		.attr('x',width/2 - 45)
	   		.attr('y',20)
	   	   .text("Cycle Number: "+hoveredCycleNumber)

}

