// Various accessors that specify the four dimensions of data to visualize.

$(function(){

  function x(d) { return d.date;}
  function y(d) { return parseFloat(d.money); }

  function convertYear(date){
    d = new Date(date);
    year = d.getYear();
    year += 1900;

    comp = new Date(year + "-01-01");
    days = (d - comp) / (3600 * 1000 * 24);
    return year + (days / 366);
  }
  // Chart dimensions.
  var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 50.5},
      width = 960 - margin.right,
      height = 500 - margin.top - margin.bottom;

  var mindate = new Date(2016,0,1)
  var maxdate = new Date(2016,11,31)
  
  // Various scales. These domains make assumptions of data, naturally.
  var xScale = d3.scaleTime().domain([mindate, maxdate]).range([25.5, width]),
      yScale = d3.scaleLinear().domain([1, 1000000]).range([height,19.5]);
      
  // The x & y axes.
  var xAxis = d3.axisBottom().scale(xScale).ticks(d3.timeMonth).tickFormat(d3.timeFormat("%B")),
      yAxis = d3.axisLeft().scale(yScale);

  // Define the div for the tooltip
  var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
  
  var realsvg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)   
  // Create the SVG container and set the origin.
  var svg = realsvg
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add the x-axis.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Add the y-axis.
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // Add an x-axis label.
  svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 6)
      .text("Date (since 1/1/2016)");

  // Add a y-axis label.
  svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Total amount of money (dollars)");

  // Load the data.
  d3.json("stocks", function(stocks) {

    var data = calculateData();
    console.log(data);
    // Add a dot per nation. Initialize the data at 1800, and set the colors.
var dot = svg.append("g")
        .attr("class", "dots")
      .selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .style("fill", "blue")
        .style("visibility", "hidden")
         .call(position)
        .on("mouseover", function(d) {
          div.transition()
              .duration(100)
              .style("opacity", .9);
          div.html("$" + parseFloat(d.money).toFixed(2) + "<br/>" +
                    d.date + "<br/>" + d. symbol + "<br/>" +
                    parseFloat(d.close).toFixed(2)  + " to " + parseFloat(d.open).toFixed(2))
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");
          })
        .on("mouseout", function(d) {		
          div.transition()		
              .duration(200)		
              .style("opacity", 0);	
        });

    // Add a title.
    dot.append("title")
        .text(function(d) { return d.symbol; });

    console.log(dot)

    var dur = 50

    dot.transition()
    .delay(function(d, i){return dur*i;})
    .duration(function(d, i){return dur*(i + 1);})
    .style("visibility", "visible");

    // Positions the dots based on data.
    function position(dot) {
      dot .attr("cx", function(d) { 
        return xScale(new Date(x(d))); })
          .attr("cy", function(d) { return yScale(y(d)); })
          .attr("r", function(d) { return 2 });
    }

  function printDict(d){
    for(var attr in d){
      console.log(attr + ":" + d[attr]);
    }
  }

    function calculateData() {
      var finalStocks = [];
      
      stocks.reduce(function(prev, cur, i, d){
        finalStocks[i] = {};
        for(var attr in d[i]){
          finalStocks[i][attr] = d[i][attr];
        }
        var p = parseFloat(finalStocks[i]["pct"]);
        var newMoney = prev * (1 + p);
        // console.log("prev: " + prev);
        // console.log("date: " + finalStocks[i]["date"] + "newMoney: " + newMoney);
        finalStocks[i]["money"] = prev * (1 + p);
        return finalStocks[i]["money"];
      }, 10000);
      // printDict(finalStocks[1]);
    return finalStocks;
    }
  });
});