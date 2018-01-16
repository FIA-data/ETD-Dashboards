//Single filter
$('#meniselect input[type="checkbox"]').on('change', function() {

    $('input[type="checkbox"]').not(this).prop('checked', false);

});

$(document).ready(function() {
    //The following functions set up drop-down animation for navigation bar and filters.
    $("#654").on("click", function(e){


        if($(this).hasClass("change")) {
            $(this).removeClass("change");
            $(this).children("ul").slideUp("fast");
        } else {
            $(this).addClass("change");
            $(this).children("ul").slideDown("fast");
        }
    });

    $(".dropdown dt a").on('click', function() {
        $(".dropdown dd ul").slideToggle('fast');
        $(".dropdown dd button").slideToggle('fast');
    });

    $(".dropdown dd ul li a").on('click', function() {
        $(".dropdown dd ul").hide();
        $(".dropdown dd button").hide();
    });

    function getSelectedValue(id) {
        return $(id).find("dt a span.value").html();
    }

    $(document).bind('click', function(e) {
        var $clicked = $(e.target);
        if (!$clicked.parents().hasClass("dropdown")) { $(".dropdown dd ul").hide();$(".dropdown dd button").hide();}
    });


});
// Various accessors that specify all dimensions of data to visualize.
function x(d) { return d.Volchg; }
function y(d) { return d.Volume; }
function radius(d) { return d.Open_Interest; }
function color(d) { return d.Region; }
function key(d) { return d.Exchange_Name; }

// Chart dimensions.
var margin = {top: 59.5, right: 39.5, bottom: 250.5, left: 69.5},
    width = 960 - margin.right,
    height = 850 - margin.top - margin.bottom;

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scale.sqrt().domain([-100, 10000]).range([0, width]),
    yScale = d3.scale.sqrt().domain([1, 15000000000]).range([height, 0]),
    radiusScale = d3.scale.sqrt().domain([-1000, 1000000000]).range([0, 50]),
    colorScale = d3.scale.category20();


// The x & y axes.
var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(7, d3.format(",d")),
    yAxis = d3.svg.axis().orient("left").scale(yScale).ticks(7, d3.format(",d"));

// Create the SVG container and set the origin.
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "gRoot");

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
    .attr("y", height -6)
    .text("Open Interest (yearly)");

// Add a y-axis label.
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Volume (yearly)");

// Add the year label; the value is set on transition.
var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height + 180)
    .attr("x", width)
    .text(2000);

var variableLabel = svg.append("text")
    .attr("class", "country label")
    .attr("text-anchor", "start")
    .attr("y", 80)
    .attr("x", 20)
    .text(" ");

// Load the data.
d3.json("https://rawgit.com/ovik-chakraborty/Tutorial/master/anima_exch.json", function(nations) {

    // A bisector since many data is sparsely-defined.
    var bisect = d3.bisector(function(d) { return d[0]; });

    // Add a dot per exchange. Initialize the data at 2000, and set the colors.
    var dot = svg.append("g")
        .attr("class", "dots")
        .selectAll(".dot")
        .data(interpolateData(2000))
        .enter().append("circle")
        .attr("class", "dot")
        .style("fill", function(d) { return colorScale(color(d)); })
        .call(position)
        .on("mouseup", function(d, i) {
            dot.classed("selected", false);
            d3.select(this).classed("selected", !d3.select(this).classed("selected"));
            dragit.trajectory.display(d, i, "selected");
            //TODO: test if has been dragged
        })
        .on("mouseenter", function(d, i) {

            dragit.trajectory.display(d, i)
            dragit.utils.animateTrajectory(dragit.lineTrajectory, dragit.time.current, 2000)
            variableLabel.text(d.Exchange_Name);
            dot.style("opacity", .4)
            d3.select(this).style("opacity", 1)
            d3.selectAll(".selected").style("opacity", 1)

        })
        .on("mouseleave", function(d, i) {


            variableLabel.text("");
            dot.style("opacity", 1);

            dragit.trajectory.remove(d, i);


        })
        .call(dragit.object.activate)
        .sort(order);

    // Add a title.
    dot.append("title")
        .text(function(d) { return "Exchange: " + d.Exchange_Name; });


    // Add an overlay for the year label.
    var box = label.node().getBBox();

    var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height)
        .on("mouseover", enableInteraction);

    // Start a transition that interpolates the data based on year.
    svg.transition()
        .duration(10000)
        .ease("linear")
        .tween("year", tweenYear)
        .each("end", enableInteraction);

    // Positions the dots based on data.
    function position(dot) {
        dot .attr("cx", function(d) { return xScale(x(d)); })
            .attr("cy", function(d) { return yScale(y(d)); })
            .attr("r", function(d) { return radiusScale(radius(d)); });
    }

    // Defines a sort order so that the smallest dots are drawn on top.
    function order(a, b) {
        return radius(b) - radius(a);
    }

    // After the transition finishes, mouseover to change the year.
    function enableInteraction() {
        var yearScale = d3.scale.linear()
            .domain([2000, 2017])
            .range([box.x + 10, box.x + box.width - 10])
            .clamp(true);

        // Cancel the current transition, if any.
        svg.transition().duration(0);

        overlay
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .on("touchmove", mousemove);

        function mouseover() {
            label.classed("active", true);
        }

        function mouseout() {
            label.classed("active", false);
        }

        function mousemove() {
            displayYear(yearScale.invert(d3.mouse(this)[0]));
        }
    }

    // Tweens the entire chart by first tweening the year, and then the data.
    // For the interpolated data, the dots and label are redrawn.
    function tweenYear() {
        var year = d3.interpolateNumber(2000, 2017);
        return function(t) { displayYear(year(t)); };
    }

    // Updates the display to show the specified year.
    function displayYear(year) {
        dot.data(interpolateData(year), key).call(position).sort(order);
        label.text(Math.round(year));
    }

    // Interpolates the data-set for the given (fractional) year.
    function interpolateData(year) {
        return nations.map(function(d) {
            return {
                Exchange_Name: d.Exchange_Name,
                Region: d.Region,
                Volchg: interpolateValues(d.Volchg,year),
                Open_Interest: interpolateValues(d.Open_Interest,year),
                Volume: interpolateValues(d.Volume,year)
            };
        });
    }
    verticalLegend = d3.svg.legend().labelFormat("none").cellPadding(5).orientation("vertical").units("Regions").cellWidth(25).cellHeight(20).inputScale(colorScale).cellStepping(10);

    d3.select("svg").append("g").attr("transform", "translate(100,650)").attr("class", "legend").call(verticalLegend);

    // Finds (and possibly interpolates) the value for the specified year.
    function interpolateValues(values, year) {
        var i = bisect.left(values, year, 0, values.length - 1),
            a = values[i];
        if (i > 0) {
            var b = values[i - 1],
                t = (year - a[0]) / (b[0] - a[0]);
            return a[1] * (1 - t) + b[1] * t;
        }
        return a[1];
    }
    init();
    function init() {
        dragit.init(".gRoot");
        dragit.time = {min:2000, max:2017, step:1, current:2000}
        dragit.data = d3.range(nations.length).map(function() { return Array(); })
        for(var yy = 2000; yy<2017; yy++) {
            interpolateData(yy).filter(function(d, i) {
                dragit.data[i][yy-dragit.time.min] = [xScale(x(d)), yScale(y(d))];
            })
        }

    }
});

function updateData() {
    d3.selectAll("svg > g > *").remove();
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
        .attr("y", height -6)
        .text("Open Interest (yearly)");

// Add a y-axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Volume (yearly)");

// Add the year label; the value is set on transition.
    var label = svg.append("text")
        .attr("class", "year label")
        .attr("text-anchor", "end")
        .attr("y", height + 180)
        .attr("x", width)
        .text(2000);

    var variableLabel = svg.append("text")
        .attr("class", "country label")
        .attr("text-anchor", "start")
        .attr("y", 80)
        .attr("x", 20)
        .text(" ");

// Load the data.
    d3.json("https://rawgit.com/ovik-chakraborty/Tutorial/master/anima_exch.json", function(nations) {

        // A bisector since many data is sparsely-defined.
        var bisect = d3.bisector(function(d) { return d[0]; });

        // Add a dot per exchange. Initialize the data at 2000, and set the colors.
        var dot = svg.append("g")
            .attr("class", "dots")
            .selectAll(".dot")
            .data(interpolateData(2000))
            .enter().append("circle")
            .attr("class", "dot")
            .style("fill", function(d) { return colorScale(color(d)); })
            .call(position)
            .on("mouseup", function(d, i) {
                dot.classed("selected", false);
                d3.select(this).classed("selected", !d3.select(this).classed("selected"));
                dragit.trajectory.display(d, i, "selected");
                //TODO: test if has been dragged
            })
            .on("mouseenter", function(d, i) {

                dragit.trajectory.display(d, i)
                dragit.utils.animateTrajectory(dragit.lineTrajectory, dragit.time.current, 2000)
                variableLabel.text(d.Exchange_Name);
                dot.style("opacity", .4)
                d3.select(this).style("opacity", 1)
                d3.selectAll(".selected").style("opacity", 1)

            })
            .on("mouseleave", function(d, i) {


                variableLabel.text("");
                dot.style("opacity", 1);

                dragit.trajectory.remove(d, i);


            })
            .call(dragit.object.activate)
            .sort(order);

        // Add a title.
        dot.append("title")
            .text(function(d) { return "Exchange: " + d.Exchange_Name; });


        // Add an overlay for the year label.
        var box = label.node().getBBox();

        var overlay = svg.append("rect")
            .attr("class", "overlay")
            .attr("x", box.x)
            .attr("y", box.y)
            .attr("width", box.width)
            .attr("height", box.height)
            .on("mouseover", enableInteraction);

        // Start a transition that interpolates the data based on year.
        svg.transition()
            .duration(10000)
            .ease("linear")
            .tween("year", tweenYear)
            .each("end", enableInteraction);

        // Positions the dots based on data.
        function position(dot) {
            dot .attr("cx", function(d) { return xScale(x(d)); })
                .attr("cy", function(d) { return yScale(y(d)); })
                .attr("r", function(d) { return radiusScale(radius(d)); });
        }

        // Defines a sort order so that the smallest dots are drawn on top.
        function order(a, b) {
            return radius(b) - radius(a);
        }

        // After the transition finishes, mouseover to change the year.
        function enableInteraction() {
            var yearScale = d3.scale.linear()
                .domain([2000, 2017])
                .range([box.x + 10, box.x + box.width - 10])
                .clamp(true);

            // Cancel the current transition, if any.
            svg.transition().duration(0);

            overlay
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .on("mousemove", mousemove)
                .on("touchmove", mousemove);

            function mouseover() {
                label.classed("active", true);
            }

            function mouseout() {
                label.classed("active", false);
            }

            function mousemove() {
                displayYear(yearScale.invert(d3.mouse(this)[0]));
            }
        }

        // Tweens the entire chart by first tweening the year, and then the data.
        // For the interpolated data, the dots and label are redrawn.
        function tweenYear() {
            var year = d3.interpolateNumber(2000, 2017);
            return function(t) { displayYear(year(t)); };
        }

        // Updates the display to show the specified year.
        function displayYear(year) {
            dot.data(interpolateData(year), key).call(position).sort(order);
            label.text(Math.round(year));
        }

        // Interpolates the data-set for the given (fractional) year.
        function interpolateData(year) {
            return nations.map(function(d) {
                return {
                    Exchange_Name: d.Exchange_Name,
                    Region: d.Region,
                    Volchg: interpolateValues(d.Volchg,year),
                    Open_Interest: interpolateValues(d.Open_Interest,year),
                    Volume: interpolateValues(d.Volume,year)
                };
            });
        }
        verticalLegend = d3.svg.legend().labelFormat("none").cellPadding(5).orientation("vertical").units("Regions").cellWidth(25).cellHeight(20).inputScale(colorScale).cellStepping(10);

        d3.select("svg").append("g").attr("transform", "translate(100,650)").attr("class", "legend").call(verticalLegend);

        // Finds (and possibly interpolates) the value for the specified year.
        function interpolateValues(values, year) {
            var i = bisect.left(values, year, 0, values.length - 1),
                a = values[i];
            if (i > 0) {
                var b = values[i - 1],
                    t = (year - a[0]) / (b[0] - a[0]);
                return a[1] * (1 - t) + b[1] * t;
            }
            return a[1];
        }
        init();
        function init() {
            dragit.init(".gRoot");
            dragit.time = {min:2000, max:2017, step:1, current:2000}
            dragit.data = d3.range(nations.length).map(function() { return Array(); })
            for(var yy = 2000; yy<2017; yy++) {
                interpolateData(yy).filter(function(d, i) {
                    dragit.data[i][yy-dragit.time.min] = [xScale(x(d)), yScale(y(d))];
                })
            }

        }
    });

}

function update1Data() {
    d3.selectAll("svg > g > *").remove();
// Various accessors that specify the dimensions of data to visualize.
    function x(d) { return d.Volchg; }
    function y(d) { return d.Volume; }
    function radius(d) { return d.Open_Interest; }
    function color(d) { return d.Group_Name; }
    function key(d) { return d.Group_Name; }

// Chart dimensions.
    var margin = {top: 59.5, right: 39.5, bottom: 250.5, left: 69.5},
        width = 960 - margin.right,
        height = 850 - margin.top - margin.bottom;

// Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.sqrt().domain([-100, 18000]).range([0, width]),
        yScale = d3.scale.sqrt().domain([1, 18000000000]).range([height, 0]),
        radiusScale = d3.scale.sqrt().domain([1, 200000000]).range([0, 10]),
        colorScale = d3.scale.category20();

// The x & y axes.
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(7, d3.format(",d")),
        yAxis = d3.svg.axis().orient("left").scale(yScale).ticks(7, d3.format(",d"));


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
        .attr("y", height -6)
        .text("Open Interest (yearly)");

// Add a y-axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Volume (yearly)");

// Add the year label; the value is set on transition.
    var label = svg.append("text")
        .attr("class", "year label")
        .attr("text-anchor", "end")
        .attr("y", height + 180)
        .attr("x", width)
        .text(2000);

    var variableLabel = svg.append("text")
        .attr("class", "country label")
        .attr("text-anchor", "start")
        .attr("y", 80)
        .attr("x", 20)
        .text(" ");

// Load the data.
    d3.json("https://rawgit.com/ovik-chakraborty/Tutorial/master/anim2.json", function(nations) {

        // A bisector since many data is sparsely-defined.
        var bisect = d3.bisector(function(d) { return d[0]; });

        // Add the dots. Initialize the data at 2000, and set the colors.
        var dot = svg.append("g")
            .attr("class", "dots")
            .selectAll(".dot")
            .data(interpolateData(2000))
            .enter().append("circle")
            .attr("class", "dot")
            .style("fill", function(d) { return colorScale(color(d)); })
            .call(position)
            .on("mouseup", function(d, i) {
                dot.classed("selected", false);
                d3.select(this).classed("selected", !d3.select(this).classed("selected"));
                dragit.trajectory.display(d, i, "selected");
                //TODO: test if has been dragged
            })
            .on("mouseenter", function(d, i) {

                dragit.trajectory.display(d, i)
                dragit.utils.animateTrajectory(dragit.lineTrajectory, dragit.time.current, 2000)
                variableLabel.text(d.Group_Name);
                dot.style("opacity", .4)
                d3.select(this).style("opacity", 1)
                d3.selectAll(".selected").style("opacity", 1)

            })
            .on("mouseleave", function(d, i) {


                variableLabel.text("");
                dot.style("opacity", 1);

                dragit.trajectory.remove(d, i);


            })
            .call(dragit.object.activate)
            .sort(order);

        // Add a title.
        dot.append("title")
            .text(function(d) { return "Group: " + d.Group_Name; });


        // Add an overlay for the year label.
        var box = label.node().getBBox();

        var overlay = svg.append("rect")
            .attr("class", "overlay")
            .attr("x", box.x)
            .attr("y", box.y)
            .attr("width", box.width)
            .attr("height", box.height)
            .on("mouseover", enableInteraction);

        // Start a transition that interpolates the data based on year.
        svg.transition()
            .duration(10000)
            .ease("linear")
            .tween("year", tweenYear)
            .each("end", enableInteraction);

        // Positions the dots based on data.
        function position(dot) {
            dot .attr("cx", function(d) { return xScale(x(d)); })
                .attr("cy", function(d) { return yScale(y(d)); })
                .attr("r", function(d) { return radiusScale(radius(d)); });
        }

        // Defines a sort order so that the smallest dots are drawn on top.
        function order(a, b) {
            return radius(b) - radius(a);
        }

        // After the transition finishes, mouseover to change the year.
        function enableInteraction() {
            var yearScale = d3.scale.linear()
                .domain([2000, 2017])
                .range([box.x + 10, box.x + box.width - 10])
                .clamp(true);

            // Cancel the current transition, if any.
            svg.transition().duration(0);

            overlay
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .on("mousemove", mousemove)
                .on("touchmove", mousemove);

            function mouseover() {
                label.classed("active", true);
            }

            function mouseout() {
                label.classed("active", false);
            }

            function mousemove() {
                displayYear(yearScale.invert(d3.mouse(this)[0]));
            }
        }

        // Tweens the entire chart by first tweening the year, and then the data.
        // For the interpolated data, the dots and label are redrawn.
        function tweenYear() {
            var year = d3.interpolateNumber(2000, 2017);
            return function(t) { displayYear(year(t)); };
        }

        // Updates the display to show the specified year.
        function displayYear(year) {
            dot.data(interpolateData(year), key).call(position).sort(order);
            label.text(Math.round(year));
        }

        // Interpolates the dataset for the given (fractional) year.
        function interpolateData(year) {
            return nations.map(function(d) {
                return {
                    Group_Name: d.Group_Name,
                    Volchg: interpolateValues(d.Volchg,year),
                    Open_Interest: interpolateValues(d.Open_Interest,year),
                    Volume: interpolateValues(d.Volume,year)
                };
            });
        }
        verticalLegend = d3.svg.legend().labelFormat("none").cellPadding(5).orientation("vertical").units("Regions").cellWidth(25).cellHeight(20).inputScale(colorScale).cellStepping(10);

        d3.select("svg").append("g").attr("transform", "translate(100,650)").attr("class", "legend").call(verticalLegend);

        // Finds (and possibly interpolates) the value for the specified year.
        function interpolateValues(values, year) {
            var i = bisect.left(values, year, 0, values.length - 1),
                a = values[i];
            if (i > 0) {
                var b = values[i - 1],
                    t = (year - a[0]) / (b[0] - a[0]);
                return a[1] * (1 - t) + b[1] * t;
            }
            return a[1];
        }
        init();
        function init() {
            dragit.init(".gRoot");
            dragit.time = {min:2000, max:2017, step:1, current:2000}
            dragit.data = d3.range(nations.length).map(function() { return Array(); })
            for(var yy = 2000; yy<2017; yy++) {
                interpolateData(yy).filter(function(d, i) {
                    dragit.data[i][yy-dragit.time.min] = [xScale(x(d)), yScale(y(d))];
                })
            }

        }
    });


}

function update2Data() {
    d3.selectAll("svg > g > *").remove();

// Various accessors that specify the dimensions of data to visualize.
    function x(d) { return d.Volchg; }
    function y(d) { return d.Volume; }
    function radius(d) { return d.Open_Interest; }
    function color(d) { return d.Region; }
    function key(d) { return d.Region; }

// Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.sqrt().domain([-100, 4000]).range([0, width]),
        yScale = d3.scale.sqrt().domain([1, 15000000000]).range([height, 0]),
        radiusScale = d3.scale.sqrt().domain([1, 200000000]).range([0, 10]),
        colorScale = d3.scale.category20();

// The x & y axes.
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(7, d3.format(",d")),
        yAxis = d3.svg.axis().orient("left").scale(yScale).ticks(7, d3.format(",d"));


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
        .attr("y", height -6)
        .text("Open Interest (yearly)");

// Add a y-axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Volume (yearly)");

// Add the year label; the value is set on transition.
    var label = svg.append("text")
        .attr("class", "year label")
        .attr("text-anchor", "end")
        .attr("y", height + 180)
        .attr("x", width)
        .text(2000);

    var variableLabel = svg.append("text")
        .attr("class", "country label")
        .attr("text-anchor", "start")
        .attr("y", 80)
        .attr("x", 20)
        .text(" ");

// Load the data.
    d3.json("https://rawgit.com/ovik-chakraborty/Tutorial/master/reganim.json", function(nations) {

        // A bisector since many data is sparsely-defined.
        var bisect = d3.bisector(function(d) { return d[0]; });

        // Add all the dots. Initialize the data at 2000, and set the colors.
        var dot = svg.append("g")
            .attr("class", "dots")
            .selectAll(".dot")
            .data(interpolateData(2000))
            .enter().append("circle")
            .attr("class", "dot")
            .style("fill", function(d) { return colorScale(color(d)); })
            .call(position)
            .on("mouseup", function(d, i) {
                dot.classed("selected", false);
                d3.select(this).classed("selected", !d3.select(this).classed("selected"));
                dragit.trajectory.display(d, i, "selected");
                //TODO: test if has been dragged
            })
            .on("mouseenter", function(d, i) {

                dragit.trajectory.display(d, i)
                dragit.utils.animateTrajectory(dragit.lineTrajectory, dragit.time.current, 2000)
                variableLabel.text(d.Region);
                dot.style("opacity", .4)
                d3.select(this).style("opacity", 1)
                d3.selectAll(".selected").style("opacity", 1)

            })
            .on("mouseleave", function(d, i) {


                variableLabel.text("");
                dot.style("opacity", 1);

                dragit.trajectory.remove(d, i);


            })
            .call(dragit.object.activate)
            .sort(order);

        // Add a title.
        dot.append("title")
            .text(function(d) { return "Region: " + d.Region; });


        // Add an overlay for the year label.
        var box = label.node().getBBox();

        var overlay = svg.append("rect")
            .attr("class", "overlay")
            .attr("x", box.x)
            .attr("y", box.y)
            .attr("width", box.width)
            .attr("height", box.height)
            .on("mouseover", enableInteraction);

        // Start a transition that interpolates the data based on year.
        svg.transition()
            .duration(10000)
            .ease("linear")
            .tween("year", tweenYear)
            .each("end", enableInteraction);

        // Positions the dots based on data.
        function position(dot) {
            dot .attr("cx", function(d) { return xScale(x(d)); })
                .attr("cy", function(d) { return yScale(y(d)); })
                .attr("r", function(d) { return radiusScale(radius(d)); });
        }

        // Defines a sort order so that the smallest dots are drawn on top.
        function order(a, b) {
            return radius(b) - radius(a);
        }

        // After the transition finishes, mouseover to change the year.
        function enableInteraction() {
            var yearScale = d3.scale.linear()
                .domain([2000, 2017])
                .range([box.x + 10, box.x + box.width - 10])
                .clamp(true);

            // Cancel the current transition, if any.
            svg.transition().duration(0);

            overlay
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .on("mousemove", mousemove)
                .on("touchmove", mousemove);

            function mouseover() {
                label.classed("active", true);
            }

            function mouseout() {
                label.classed("active", false);
            }

            function mousemove() {
                displayYear(yearScale.invert(d3.mouse(this)[0]));
            }
        }

        // Tweens the entire chart by first tweening the year, and then the data.
        // For the interpolated data, the dots and label are redrawn.
        function tweenYear() {
            var year = d3.interpolateNumber(2000, 2017);
            return function(t) { displayYear(year(t)); };
        }

        // Updates the display to show the specified year.
        function displayYear(year) {
            dot.data(interpolateData(year), key).call(position).sort(order);
            label.text(Math.round(year));
        }

        // Interpolates the dataset for the given (fractional) year.
        function interpolateData(year) {
            return nations.map(function(d) {
                return {
                    Region: d.Region,
                    Volchg: interpolateValues(d.Volchg,year),
                    Open_Interest: interpolateValues(d.Open_Interest,year),
                    Volume: interpolateValues(d.Volume,year)
                };
            });
        }
        verticalLegend = d3.svg.legend().labelFormat("none").cellPadding(5).orientation("vertical").units("Regions").cellWidth(25).cellHeight(20).inputScale(colorScale).cellStepping(10);

        d3.select("svg").append("g").attr("transform", "translate(100,650)").attr("class", "legend").call(verticalLegend);

        // Finds (and possibly interpolates) the value for the specified year.
        function interpolateValues(values, year) {
            var i = bisect.left(values, year, 0, values.length - 1),
                a = values[i];
            if (i > 0) {
                var b = values[i - 1],
                    t = (year - a[0]) / (b[0] - a[0]);
                return a[1] * (1 - t) + b[1] * t;
            }
            return a[1];
        }
        init();
        function init() {
            dragit.init(".gRoot");
            dragit.time = {min:2000, max:2017, step:1, current:2000}
            dragit.data = d3.range(nations.length).map(function() { return Array(); })
            for(var yy = 2000; yy<2017; yy++) {
                interpolateData(yy).filter(function(d, i) {
                    dragit.data[i][yy-dragit.time.min] = [xScale(x(d)), yScale(y(d))];
                })
            }

        }
    });
}

d3.select('#perform1')
    .on('click', function() {
        if ($('#Exchange').is(':checked')) {
            updateData();
        }
        if ($('#Group').is(':checked')) {
            update1Data();
        }
        if ($('#Region').is(':checked')) {
            update2Data();
        }

    });
