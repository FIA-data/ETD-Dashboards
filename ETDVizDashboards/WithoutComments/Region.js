var chart = dc.lineChart("#test");
var selectField = dc.selectMenu('#menuselect');
var numberformat1 = d3.format(",");
var ndx;
var allDim;
var timeFormat1 = d3.time.format('%m/%d/%Y');
var timeFormat = d3.time.format('%Y-%m');
$(document).ready(function() {
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
function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.value !== 0;
            });
        }
    };
}
d3.csv("https://rawgit.com/ovik-chakraborty/Tutorial/master/region_092017.csv", function(error, spendData) {
spendData.forEach(function(d) {
    d.Report_Month = +d.Report_Month;
    d.Report_Year = +d.Report_Year;
    d.Report_Year_Month = timeFormat.parse(d.Report_Year_Month);
    d.Volume = +d.Volume;
    d.Open_Interest = +d.Open_Interest;
});
d3.select('#render1')
    .on('click', function() {
dc.filterAll();dc.redrawAll();
$('input:checkbox').removeAttr('checked');
});
var ndx = crossfilter(spendData);

    var monthDim1 = ndx.dimension(function(d) {return d.Report_Year_Month;}),
    parentDim1 = ndx.dimension(function(d) {return d.Region;}),
    parentSum1    = parentDim1.group().reduceSum(function(d) {return d.Volume;}),
    monthSum1    = monthDim1.group().reduceSum(function(d) {if (d.Region=='North America') {return d.Volume;}else{return 0;}}),
monthSum3    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Europe') {return d.Volume;}else{return 0;}}),
    monthSum5    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Asia') {return d.Volume;}else{return 0;}}),
monthSum6    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Latin America') {return d.Volume;}else{return 0;}}),
monthSum7    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Other') {return d.Volume;}else{return 0;}}),
   
    allDim = ndx.dimension(function(d) {return d.Volume;});

d3.select('#render')
    .on('click', function() {
var elect = d3.select("#meniselect");
elect.select('ul').remove();
dc.filterAll();dc.redrawAll();

if(d3.select('#download-type1 input:checked').node().value==='volume') {
var filteredData = spendData.filter(function (d) {
    return d.Volume != 0;
});
x(filteredData);

    var ndx = crossfilter(spendData);

    var monthDim1 = ndx.dimension(function(d) {return d.Report_Year_Month;}),
    parentDim1 = ndx.dimension(function(d) {return d.Region;}),
    parentSum1    = parentDim1.group().reduceSum(function(d) {return d.Volume;}),
    monthSum1    = monthDim1.group().reduceSum(function(d) {if (d.Region=='North America') {return d.Volume;}else{return 0;}}),
monthSum3    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Europe') {return d.Volume;}else{return 0;}}),
    monthSum5    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Asia') {return d.Volume;}else{return 0;}}),
monthSum6    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Latin America') {return d.Volume;}else{return 0;}}),
monthSum7    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Other') {return d.Volume;}else{return 0;}}),
   
    allDim = ndx.dimension(function(d) {return d.Volume;});


selectField
      .dimension(parentDim1)
      .group(parentSum1)
      .multiple(true);
selectField.title(function (d){
    return d.key;
});
var colorScale2 = d3.scale.ordinal().range(["#3BB34A", "#7750A0", "#E0C195", "#5970B5", "#CCDB65", "#4B7837"]);
selectField.render();
                    chart
              .width(1150)
              .height(400)
              .x(d3.time.scale().domain([new Date(1999,11,31), new Date(2017,8,31)]))
              .round(d3.time.month.round)
              .xUnits(d3.time.months)
              .margins({left: 10, top: 20, right: 100, bottom: 30})
              .renderArea(true)
              .transitionDuration(1000)
              .clipPadding(10)
.colors(colorScale2)
              .yAxisLabel("Volume")
              .dimension(monthDim1)
              .elasticY(true)
                 .useRightYAxis(true)
              .renderHorizontalGridLines(true)
.title(function(d) { return d.value; })
.on("renderlet", function(chart){
    var svg = chart.selectAll("circle.dot").each(function(d, i) {
  if(d3.select(this).select("title").text() == "Volume: 0") {
d3.select(this).remove();
  }
});

})
              
 .brushOn(false)
        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
        // legend.
        // The `.valueAccessor` will be used for the base layer
.legend(dc.legend().x(500).y(0).itemHeight(15).gap(5).horizontal(1).legendWidth(600).itemWidth(120))
        .group(monthSum1, "North America")
        .stack(monthSum3, "Europe")
.stack(monthSum5, "Asia")
.stack(monthSum6, "Latin America")
.stack(monthSum7, "Other")

.title(function(d) { return "Volume: " + d.value; })
        .valueAccessor(function (d) {
            return d.value;
        });
chart.yAxis().ticks(8);
          chart.render();

      }
if(d3.select('#download-type1 input:checked').node().value==='open') {
var filteredData = spendData.filter(function (d) {
    return d.Open_Interest != 0;
});

x(filteredData);
    var ndx = crossfilter(spendData);

    var monthDim1 = ndx.dimension(function(d) {return d.Report_Year_Month;}),
    parentDim1 = ndx.dimension(function(d) {return d.Region;}),
    parentSum1    = parentDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
    monthSum1    = monthDim1.group().reduceSum(function(d) {if (d.Region=='North America') {return d.Open_Interest;}else{return 0;}}),
monthSum3    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Europe') {return d.Open_Interest;}else{return 0;}}),
    monthSum5    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Asia') {return d.Open_Interest;}else{return 0;}}),
monthSum6    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Latin America') {return d.Open_Interest;}else{return 0;}}),
monthSum7    = monthDim1.group().reduceSum(function(d) {if (d.Region=='Other') {return d.Open_Interest;}else{return 0;}}),
    allDim = ndx.dimension(function(d) {return d.Open_Interest;});


selectField
      .dimension(parentDim1)
      .group(parentSum1)
      .multiple(true);
selectField.title(function (d){
    return d.key;
});

var colorScale2 = d3.scale.ordinal().range(["#3BB34A", "#7750A0", "#E0C195", "#5970B5", "#CCDB65", "#4B7837"]);
selectField.render();
               chart
              .width(1150)
              .height(400)
              .x(d3.time.scale().domain([new Date(1999,11,31), new Date(2017,8,31)]))
              .round(d3.time.month.round)
              .xUnits(d3.time.months)
              .margins({left: 10, top: 20, right: 100, bottom: 30})
              .renderArea(true)
.colors(colorScale2)
              .transitionDuration(1000)
              .clipPadding(10)
              .yAxisLabel("Open Interest")
              .dimension(monthDim1)
              .elasticY(true)
   .useRightYAxis(true)
              .renderHorizontalGridLines(true)
.on("renderlet", function(chart){
    var svg = chart.selectAll("circle.dot").each(function(d, i) {
  if(d3.select(this).select("title").text() == "Open Interest: 0") {
d3.select(this).remove();
  }
});

})
              
 .brushOn(false)
        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
        // legend.
        // The `.valueAccessor` will be used for the base layer
        .legend(dc.legend().x(500).y(0).itemHeight(15).gap(5).horizontal(1).legendWidth(600).itemWidth(120))
        .group(monthSum1, "North America")
        .stack(monthSum3, "Europe")
.stack(monthSum5, "Asia")
.stack(monthSum6, "Latin America")
.stack(monthSum7, "Other")
.title(function(d) { return "Open Interest: " + d.value; })

      .valueAccessor(function (d) {
            return d.value;
        });
chart.yAxis().ticks(8);
          chart.render();
} });

var filteredData = spendData.filter(function (d) {
    return d.Volume != 0;
});
x(filteredData);
function x(filteredData) {
var elect = d3.select("#meniselect");
elect.select('ul').remove();
var arrays = d3.map(filteredData, function(d){return d.Region;}).keys();
arrays.sort();
arrays.unshift('ALL');

    var select = d3.select("#meniselect")
      .append("ul")

    select
      .on("change", function(d) {
        var value = d3.select(this).property("value");
        
      });

    var inp = select.selectAll("li")
      .data(arrays)
      .enter()
        .append("li");
        

    inp.append("input")
	.attr("type", "checkbox")
	.attr("id", function (d) { return d; })
	.attr("value", function (d) { return d; });

    inp.append("b")
	.text(function (d) { return d; });
 $("#ALL").click(function () {
     $('#meniselect input:checkbox').not(this).prop('checked', this.checked);
 });    
}

selectField
      .dimension(parentDim1)
      .group(parentSum1)
      .multiple(true);
selectField.title(function (d){
    return d.key;
});
var colorScale2 = d3.scale.ordinal().range(["#3BB34A", "#7750A0", "#E0C195", "#5970B5", "#CCDB65", "#4B7837"]);
selectField.render();
               chart
              .width(1150)
              .height(400)
              .x(d3.time.scale().domain([new Date(1999,11,31), new Date(2017,8,31)]))
              .round(d3.time.month.round)
              .xUnits(d3.time.months)
              .margins({left: 10, top: 20, right: 100, bottom: 30})
              .renderArea(true)
              .transitionDuration(1000)
.colors(colorScale2)
              .clipPadding(10)
              .yAxisLabel("Volume")
              .dimension(monthDim1)
              .elasticY(true)
   .useRightYAxis(true)
              .renderHorizontalGridLines(true)
		.on("renderlet", function(chart){
    var svg = chart.selectAll("circle.dot").each(function(d, i) {
  if(d3.select(this).select("title").text() == "Volume: 0") {
d3.select(this).remove();
  }
});

})

		
              
 .brushOn(false)
        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
        // legend.
        // The `.valueAccessor` will be used for the base layer
        .legend(dc.legend().x(500).y(0).itemHeight(15).gap(5).horizontal(1).legendWidth(600).itemWidth(120))
        .group(monthSum1, "North America")
        .stack(monthSum3, "Europe")
.stack(monthSum5, "Asia")
.stack(monthSum6, "Latin America")
.stack(monthSum7, "Other")
.title(function(d) { return "Volume: " + d.value; })

.valueAccessor(function (d) {
            return d.value;
        });
chart.yAxis().ticks(8);
          
chart.render();      
d3.select('#perform1')
    .on('click', function() {
$(document).ready(function() {
dc.filterAll();
var checkedValues = $('#meniselect input:checkbox:checked').map(function() {
    return this.value;
}).get();

if (checkedValues === undefined || checkedValues.length == 0) {
    selectField.filter(['Null']);
}
        selectField.filter([checkedValues]);
selectField.redrawGroup();

dc.redrawAll();


});

});
    });

d3.csv("https://rawgit.com/ovik-chakraborty/Tutorial/master/region_stats.csv", function(error, spendData) {
var ndx = crossfilter(spendData);
allDim = ndx.dimension(function(d) {return d.Volume;});
var dataTableOptions = {
                "lengthMenu": [[10], [10]],
                "retrieve": true,
		"paging": false,
		"searching": false,
        	"info":     false,
                columnDefs: [
                    {
                        "orderable": true,
                        targets: 0,
                       "width": "10%",
                        data: function (d) { return d.Region; }
                    },
                    {
                        "orderable": true,
                        targets: 1,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                       "width": "15%",
                        data: function (d) { return numberformat1(d.Volume); }
                    } ,
                    {
                        "orderable": true,
                        targets: 2,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                       "width": "15%",
                        data: function (d) { return d.Volume_M_Change; }
                    },
                    {
                        "orderable": true,
                         targets: 3,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                       "width": "15%",
                        data: function (d) { return d.Volume_Y_Change; }
                    },
                    {
                        "orderable": true,
                        targets: 4,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                       "width": "15%",
                        data: function (d) { return numberformat1(d.Open_Interest); }
                    },
					{
                        "orderable": true,
                        targets: 5,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                       "width": "15%",
                        data: function (d) { return d.Open_Interest_M_Change; }
                    },
		{
                        "orderable": true,
                        targets: 6,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                       "width": "15%",
                        data: function (d) { return d.Open_Interest_Y_Change; }
                    }		
                ]
            };

var data = $('#table').dataTable(dataTableOptions);
            function RefreshTable() {
                dc.events.trigger(function () {
                     data.api()
                      .clear()
                      .rows.add(allDim.top(10))
                      .draw();

                });
            }

            for (var i = 0; i < dc.chartRegistry.list().length; i++) {
                var chartI = dc.chartRegistry.list()[i];
                chartI.on("filtered", RefreshTable);
            }
RefreshTable();
});
    