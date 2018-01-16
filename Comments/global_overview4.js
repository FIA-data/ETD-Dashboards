//The following function will reset every charts and filters.
d3.select('#render1')
    .on('click', function() {
dc.filterall();dc.redrawall();
$('input:checkbox').removeAttr('checked');
});
$(window).scroll(function(){
    if ($(window).scrollTop() >= 300) {
       $('.fix').addClass('fixed-header');
	$('.main-menu').css({top: '0px', position:'fixed'});
    }
    else {
       $('.fix').removeClass('fixed-header');
	$('.main-menu').css({top: '300px', position:'absolute'});
    }
});
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//The following function will hide or show additional info or chart when info button is clicked.
$('.info').click(function(ev) {
	ev.preventDefault();
	if($(this).hasClass('opened')){
		$(this).removeClass('opened');
		$(this).parents('.info_chart').find('p.desc').slideUp('fast')
	}else{
		closeAllInfos();
		$(this).addClass('opened');
		$(this).parents('.info_chart').find('p.desc').slideDown('fast')
	}
});

function closeAllInfos() {
	$('.info').removeClass('opened');
	$('p.desc').slideUp('fast');
}
//The following variables are setting up individual charts and filters based on id.
var ndx;
var allDim;
var timeFormat1 = d3.time.format('%m/%d/%Y');
var timeFormat = d3.time.format('%Y-%m');
    var country_chart = dc.geoChoroplethChart("#country_chart");
var region_chart   = dc.pieChart("#region_chart"),
    contract_chart = dc.barChart("#contract_chart");
var exchange_chart = dc.pieChart("#exchange_chart");
var group_chart = dc.pieChart("#group_chart");
var selectField = dc.selectMenu('#menuselect');
var selectField1 = dc.selectMenu('#menu3select');
var selectField2 = dc.selectMenu('#menu4select');
var arange = "";


var projection = d3.geo.mercator()
    .center([0, 50])
    .scale(100)
    .rotate([-12,0])
    .translate([340, 230]);
  
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
  return $("#" + id).find("dt a span.value").html();
}

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown")) { $(".dropdown dd ul").hide();$(".dropdown dd button").hide();}
});

$('#meniselect input[type="checkbox"]').on('click', function() {

  var title = $(this).closest('#meniselect').find('input[type="checkbox"]').val(),
    title = $(this).val() + ",";
arange = title;

  if ($(this).is(':checked')) {
    var html = '<span title="' + title + '">' + title + '</span>';
    $('.multiSel').append(html);
    $(".hida").hide();
  } else {
    $('span[title="' + title + '"]').remove();
    var ret = $(".hida");
    $('.dropdown dt a').append(ret);

  }
});


$(".dropdown1 dt a").on('click', function() {
  $(".dropdown1 dd ul").slideToggle('fast');
});

$(".dropdown1 dd select option a").on('click', function() {
  $(".dropdown1 dd ul").hide();
});

function getSelectedValue(id) {
  return $("#" + id).find(".dropdown1 dt a span.value").html();
}

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown1")) $(".dropdown1 dd ul").hide();
});

$(".dropdown2 dt a").on('click', function() {
  $(".dropdown2 dd ul").slideToggle('fast');
});

$(".dropdown2 dd select option a").on('click', function() {
  $(".dropdown2 dd ul").hide();
});

function getSelectedValue(id) {
  return $("#" + id).find(".dropdown2 dt a span.value").html();
}

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown2")) $(".dropdown2 dd ul").hide();
});
});
//The following function gets the data and parses to JSON format.
d3.csv("https://rawgit.com/ovik-chakraborty/Tutorial/master/global-overview_092017_2.csv", function(error, spendData) {
//Data for country chart coordinates.
d3.json("https://rawgit.com/ovik-chakraborty/Tutorial/master/countries1.geo.json", function (error, c) {
spendData.forEach(function(d) {
    d.Report_Year_Month = timeFormat.parse(d.Report_Year_Month);
    d.Volume = +d.Volume;
    d.Open_Interest = +d.Open_Interest;
});
//The following functions will populate the elements for individual filters.
var filteredData = spendData.filter(function (d) {
    return d.Volume != 0;
});
var arrays = d3.map(filteredData, function(d){return d.Exchange_Name;}).keys();
arrays.sort();
arrays.unshift('All-Exchange');

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
 $("#All-Exchange").click(function () {
     $('#meniselect input:checkbox').not(this).prop('checked', this.checked);
 });

var arrays1 = d3.map(filteredData, function(d){return d.Group_Name;}).keys();
arrays1.sort();
arrays1.unshift('All-Group');

    var select = d3.select("#menu1select")
      .append("ul")

    select
      .on("change", function(d) {
        var value = d3.select(this).property("value");
        
      });

    var inp = select.selectAll("li")
      .data(arrays1)
      .enter()
        .append("li");
        

    inp.append("input")
	.attr("type", "checkbox")
	.attr("id", function (d) { return d; })
	.attr("value", function (d) { return d; });

    inp.append("b")
	.text(function (d) { return d; });
 $("#All-Group").click(function () {
     $('#menu1select input:checkbox').not(this).prop('checked', this.checked);
 });

var arrays2 = d3.map(filteredData, function(d){return d.Country;}).keys();
arrays2.sort();
arrays2.unshift('All-Country');

    var select = d3.select("#menu2select")
      .append("ul")

    select
      .on("change", function(d) {
        var value = d3.select(this).property("value");
        
      });

    var inp = select.selectAll("li")
      .data(arrays2)
      .enter()
        .append("li");
        

    inp.append("input")
	.attr("type", "checkbox")
	.attr("id", function (d) { return d; })
	.attr("value", function (d) { return d; });

    inp.append("b")
	.text(function (d) { return d; });
 $("#All-Country").click(function () {
     $('#menu2select input:checkbox').not(this).prop('checked', this.checked);
 });
d3.select('#render1')
    .on('click', function() {
dc.filterAll();dc.redrawAll();
$('input:checkbox').removeAttr('checked');
});
//The following function will reset every charts and filters and re-render charts based on volume or OI.
d3.select('#render')
    .on('click', function() {
var elect = d3.select("#meniselect");
elect.select('ul').remove();
var elect1 = d3.select("#menu1select");
elect1.select('ul').remove();
var elect2 = d3.select("#menu2select");
elect2.select('ul').remove();
country_chart.filterAll();dc.redrawAll();
region_chart.filterAll();dc.redrawAll();
exchange_chart.filterAll();dc.redrawAll();
contract_chart.filterAll();dc.redrawAll();
group_chart.filterAll();dc.redrawAll();
selectField.filterAll();dc.redrawAll();
selectField1.filterAll();dc.redrawAll();
selectField2.filterAll();dc.redrawAll();
if(d3.select('#download-type1 input:checked').node().value==='volume') {

var filteredData = spendData.filter(function (d) {
    return d.Volume != 0;
});
var arrays = d3.map(filteredData, function(d){return d.Exchange_Name;}).keys();
arrays.sort();
arrays.unshift('All-Exchange');

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
 $("#All-Exchange").click(function () {
     $('#meniselect input:checkbox').not(this).prop('checked', this.checked);
 });

var arrays1 = d3.map(filteredData, function(d){return d.Group_Name;}).keys();
arrays1.sort();
arrays1.unshift('All-Group');

    var select = d3.select("#menu1select")
      .append("ul")

    select
      .on("change", function(d) {
        var value = d3.select(this).property("value");
        
      });

    var inp = select.selectAll("li")
      .data(arrays1)
      .enter()
        .append("li");
        

    inp.append("input")
	.attr("type", "checkbox")
	.attr("id", function (d) { return d; })
	.attr("value", function (d) { return d; });

    inp.append("b")
	.text(function (d) { return d; });
 $("#All-Group").click(function () {
     $('#menu1select input:checkbox').not(this).prop('checked', this.checked);
 });
var arrays2 = d3.map(filteredData, function(d){return d.Country;}).keys();
arrays2.sort();
arrays2.unshift('All-Country');

    var select = d3.select("#menu2select")
      .append("ul")

    select
      .on("change", function(d) {
        var value = d3.select(this).property("value");
        
      });

    var inp = select.selectAll("li")
      .data(arrays2)
      .enter()
        .append("li");
        

    inp.append("input")
	.attr("type", "checkbox")
	.attr("id", function (d) { return d; })
	.attr("value", function (d) { return d; });

    inp.append("b")
	.text(function (d) { return d; });
 $("#All-Country").click(function () {
     $('#menu2select input:checkbox').not(this).prop('checked', this.checked);
 });
    var element = document.getElementById("header");
	element.innerHTML = "Volume";
    var element = document.getElementById("header1");
	element.innerHTML = "Volume";

    var element = document.getElementById("header3");
	element.innerHTML = "Volume by Region";
    var element = document.getElementById("header4");
	element.innerHTML = "Volume by Country";
    var element = document.getElementById("header5");
	element.innerHTML = "Volume by Exchange";
    var element = document.getElementById("header6");
	element.innerHTML = "Volume by Contract Type";
    var element = document.getElementById("header7");
	element.innerHTML = "Volume by Group";
    document.getElementById("p1").innerHTML = "<font size=\"6\">2.23B</font>";
document.getElementById("p2").innerHTML = "<font size=\"2\">NA: 715.5M <br /> \
        Europe: 431.1M<br />\
        Asia:817.5M<br />\
         LA:190.9M<br />\
         Other:79.3M</font>";
document.getElementById("p3").innerHTML = "<font size=\"6\">0.0%</font>";
document.getElementById("p4").innerHTML = "<font size=\"2\">NA: -10.5% <br /> \
	Europe: 15.4%<br />\
        Asia:-3.2%<br />\
         LA:4.2%<br />\
         Other:134.4%</font>";
document.getElementById("p5").innerHTML = "<font size=\"6\">8.1%</font>";
document.getElementById("p6").innerHTML = "<font size=\"2\">NA: -1.3% <br /> \
	Europe: -5.9%<br />\
        Asia:22.7%<br />\
         LA:33.9%<br />\
         Other:6.4%</font>";
document.getElementById("p7").innerHTML = "<font size=\"6\">18.8B</font>";
document.getElementById("p8").innerHTML = "<font size=\"2\">NA: 6.7B <br /> \
	Europe: 3.7B<br />\
        Asia:6.5B<br />\
         LA:1.4B<br />\
         Other:452.5M</font>";
document.getElementById("p9").innerHTML = "<font size=\"6\">-0.8%</font";
document.getElementById("p10").innerHTML = "<font size=\"2\">NA: 4.2% <br /> \
	Europe: -4.5%<br />\
        Asia:-6.8%<br />\
         LA:23.0%<br />\
         Other:-8.0%</font>";

    ndx = crossfilter(spendData);
var regionDim  = ndx.dimension(function(d) {return d.Region;}),
    countries  = ndx.dimension(function(d) {return d.Country;}),
    countries1  = ndx.dimension(function(d) {return d.Country;}),
    nameDim  = ndx.dimension(function(d) {return d.Contract_Type;}),
    parentDim  = ndx.dimension(function(d) {return d.Exchange_Name;}),
    parentDim1  = ndx.dimension(function(d) {return d.Exchange_Name;}),
    parentDim2  = ndx.dimension(function(d) {return d.Abbreviated_Name;}),
    exchangeDim  = ndx.dimension(function(d) {return d.Group_Name;}),
    exchangeDim1  = ndx.dimension(function(d) {return d.Group_Name;}),
    countries1  = ndx.dimension(function(d) {return d.Country;}),
    countrieSum1 = countries1.group().reduceSum(function(d) {return d.Volume;}),
    countrieSum = countries.group().reduceSum(function(d) {return d.Volume;}),
    regionSum = regionDim.group().reduceSum(function(d) {return d.Volume;}),
    nameSum = nameDim.group().reduceSum(function(d) {return d.Volume;}),
    parentSum    = parentDim.group().reduceSum(function(d) {return d.Volume;}),
    parentSum1    = parentDim1.group().reduceSum(function(d) {return d.Volume;}),
    parentSum2    = parentDim2.group().reduceSum(function(d) {return d.Volume;}),
    exchSum1    = exchangeDim1.group().reduceSum(function(d) {return d.Volume;}),
    exchSum    = exchangeDim.group().reduceSum(function(d) {return d.Volume;}),
    allDim1 = ndx.dimension(function(d) {return d.Volume;}),
    eventGroup = allDim1.group().reduceSum(function(d) {return d.Volume;}),
    allDim = ndx.dimension(function(d) {return d.Volume;});
            var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #fff'>" +  d.data.key + "</span> : "  + d.data.value; });

            var tip1 = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #fff'>" +  d3.select(this).select("title").text() + "</span>"});

            // tooltips for pie chart
            var pieTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #fff'>" +  d.data.key + "</span> : "  + d.value; });

            country_chart.width(850)
                    .height(500)
                    .dimension(countries)
                    .group(countrieSum)
                    .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
                    .colorDomain([0, 100000000])
                    .colorCalculator(function (d) { return d ? country_chart.colors()(d) : '#ccc'; })
		    .projection(projection)
                    .overlayGeoJson(c.features, "state", function (d) {
                        return d.properties.name;
                    })
                    .title(function (d) {
                        return d.key + ": " + d.value;
                    });

  selectField
      .dimension(parentDim1)
      .group(parentSum1)
      .multiple(true);
selectField.title(function (d){
    return d.key;
})
var activities=0;
var count =  dc.dataCount(".dc-data-count")
    .dimension(eventGroup)
    .group({value: function() { activities=0; 
    return eventGroup.all().filter(function(kv) { if (kv.value>0) {				  
				  activities += +kv.value;
				} return kv.value>0; }).length;
} })
.on("renderlet.all", function(c) {
			$(".nbaccredited").html(numberWithCommas(activities));
});
  selectField1
      .dimension(exchangeDim1)
      .group(exchSum1)
      .multiple(true);
selectField1.title(function (d){
    return d.key;
})

  selectField2
      .dimension(countries1)
      .group(countrieSum1)
      .multiple(true);
selectField2.title(function (d){
    return d.key;
})

var colorScale2 = d3.scale.ordinal().range(["#3BB34A", "#7750A0", "#E0C195", "#5970B5", "#CCDB65", "#4B7837"]);
  region_chart
    .width(350)
    .height(350)
    .dimension(regionDim)
    .group(regionSum)
    .innerRadius(40)
.colors(colorScale2)
.minAngleForLabel(.8)
.externalRadiusPadding(80)
          .externalLabels(40)
          .drawPaths(false)

    .controlsUseVisibility(true);


d3.select('#perform1')
    .on('click', function() {
$(document).ready(function() {
selectField.filter(null);
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

d3.select('#perform10')
    .on('click', function() {
$(document).ready(function() {
selectField1.filter(null);
var checkedValues = $('#menu1select input:checkbox:checked').map(function() {
    return this.value;
}).get();

if (checkedValues === undefined || checkedValues.length == 0) {
    selectField1.filter(['Null']);
}
        selectField1.filter([checkedValues]);
selectField1.redrawGroup();

dc.redrawAll();

});
    });

d3.select('#perform12')
    .on('click', function() {
$(document).ready(function() {
selectField2.filter(null);
var checkedValues = $('#menu2select input:checkbox:checked').map(function() {
    return this.value;
}).get();

if (checkedValues === undefined || checkedValues.length == 0) {
    selectField2.filter(['Null']);
}
        selectField2.filter([checkedValues]);
selectField2.redrawGroup();

dc.redrawAll();

});
    });

var colorScale1 = d3.scale.ordinal().range(["#44C8F5"]);
contract_chart
    .width(300)
    .height(400)
    .dimension(nameDim)
    .group(nameSum)
    .elasticX(true)
.elasticY(true)
.x(d3.scale.ordinal())
          .xUnits(dc.units.ordinal)
    .gap(10)
.margins({left: 80, top: 30, right: 30, bottom: 20})
    .controlsUseVisibility(true)
    .renderTitle(true)
.colors(colorScale1)
          .barPadding(0.3)
          .outerPadding(0.3);
     contract_chart.yAxis().ticks(7);

var allDollars = ndx.groupAll().reduceSum(function(d) { return d.Volume; });


  exchange_chart
    .width(350)
    .height(350)
    .dimension(parentDim2)
.minAngleForLabel(.25)
.externalRadiusPadding(80)
          .externalLabels(40)
    .group(parentSum2)
    .innerRadius(40)
    .drawPaths(false)
    .controlsUseVisibility(true);


var colorScale = d3.scale.ordinal().range(["#D2232A", "#FFCD00", "#F68928", "#85C441", "#CCDB65", "#A8DEF5", "#00A4E7","#75787B","#4B4F54"]);
  group_chart
    .width(350)
    .height(350)
    .dimension(exchangeDim)
    .group(exchSum)
    .innerRadius(40)
.colors(colorScale)
.minAngleForLabel(.35)
.externalRadiusPadding(80)
          .externalLabels(40)
    .drawPaths(false)
    .controlsUseVisibility(true);





       
  

d3.select('#CSV')
    .on('click', function() {
        var data = nameDim.top(Infinity);
        
        var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
        saveAs(blob, 'data.csv');
    });

dc.renderAll();
$(document).ready(function() {
                d3.selectAll(".bar").call(tip);
                d3.selectAll(".bar").on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
d3.selectAll(".state").call(tip1);
                d3.selectAll(".state").on('mouseover', tip1.show)
                    .on('mouseout', tip1.hide);

                d3.selectAll(".pie-slice").call(pieTip);
                d3.selectAll(".pie-slice").on('mouseover', pieTip.show)
                    .on('mouseout', pieTip.hide);
var changed;
$('select').change(function(e) {
    var select = $(this);
    var list = select.data('prevstate');
    var val = select.val();
    if (list == null) {
        list = val;
    } else if (val.length == 1) {
        val = val.pop();
        var pos = list.indexOf(val);
        if (pos == -1)
            list.push(val);
        else
            list.splice(pos, 1);
    } else {
        list = val;
    }
    select.val(list);
    select.data('prevstate', list);
    changed = true;
}).find('option').click(function() {
    if (!changed){
        $(this).parent().change();
    }
    changed = false;
});
});

}
if(d3.select('#download-type1 input:checked').node().value==='open') {
var elect = d3.select("#meniselect");
elect.select('ul').remove();
var filteredData = spendData.filter(function (d) {
    return d.Open_Interest != 0;
});
var arrays = d3.map(filteredData, function(d){return d.Exchange_Name;}).keys();
arrays.sort();
arrays.unshift('All-Exchange');

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
 $("#All-Exchange").click(function () {
     $('#meniselect input:checkbox').not(this).prop('checked', this.checked);
 });

var arrays1 = d3.map(filteredData, function(d){return d.Group_Name;}).keys();
arrays1.sort();
arrays1.unshift('All-Group');

    var select = d3.select("#menu1select")
      .append("ul")

    select
      .on("change", function(d) {
        var value = d3.select(this).property("value");
        
      });

    var inp = select.selectAll("li")
      .data(arrays1)
      .enter()
        .append("li");
        

    inp.append("input")
	.attr("type", "checkbox")
	.attr("id", function (d) { return d; })
	.attr("value", function (d) { return d; });

    inp.append("b")
	.text(function (d) { return d; });
 $("#All-Group").click(function () {
     $('#menu1select input:checkbox').not(this).prop('checked', this.checked);
 });
var arrays2 = d3.map(filteredData, function(d){return d.Country;}).keys();
arrays2.sort();
arrays2.unshift('All-Country');

    var select = d3.select("#menu2select")
      .append("ul")

    select
      .on("change", function(d) {
        var value = d3.select(this).property("value");
        
      });

    var inp = select.selectAll("li")
      .data(arrays2)
      .enter()
        .append("li");
        

    inp.append("input")
	.attr("type", "checkbox")
	.attr("id", function (d) { return d; })
	.attr("value", function (d) { return d; });

    inp.append("b")
	.text(function (d) { return d; });
 $("#All-Country").click(function () {
     $('#menu2select input:checkbox').not(this).prop('checked', this.checked);
 });
    var element = document.getElementById("header");
	element.innerHTML = "Open Interest";
    var element = document.getElementById("header1");
	element.innerHTML = "Open Interest";
    var element = document.getElementById("header3");
	element.innerHTML = "OI by Region";
    var element = document.getElementById("header4");
	element.innerHTML = "Open Interest by Country";
    var element = document.getElementById("header5");
	element.innerHTML = "OI by Exchange/CCP";
    var element = document.getElementById("header6");
	element.innerHTML = "OI by Contract Type";
    var element = document.getElementById("header7");
	element.innerHTML = "OI by Group";
    document.getElementById("p1").innerHTML = "<font size=\"6\">874.4M</font>";
document.getElementById("p2").innerHTML = "<font size=\"2\">NA: 456.9M <br /> \
	Europe: 219.1M<br />\
        Asia:74.1M<br />\
         LA:82.9M<br />\
         Other:41.3M</font>";
document.getElementById("p3").innerHTML = "<font size=\"6\">-2.7%</font>";
document.getElementById("p4").innerHTML = "<font size=\"2\">NA: -2.2% <br /> \
	Europe: -6.5%<br />\
        Asia:-5.8%<br />\
         LA:9.6%<br />\
         Other:-2.7%</font>";
document.getElementById("p5").innerHTML = "<font size=\"6\">5.4%</font>";
document.getElementById("p6").innerHTML = "<font size=\"2\">NA: 4.7% <br /> \
	Europe: 5.2%<br />\
        Asia:14.9%<br />\
         LA:19.5%<br />\
         Other:-19.0%</font>";
document.getElementById("p7").innerHTML = "<font size=\"6\">7.59B</font>";
document.getElementById("p8").innerHTML = "<font size=\"2\">NA: 3.89B <br /> \
	Europe: 2.03B<br />\
        Asia:649.9M<br />\
         LA:624.9M<br />\
         Other:390.2M</font>";
document.getElementById("p9").innerHTML = "<font size=\"6\">3.0%</font";
document.getElementById("p10").innerHTML = "<font size=\"2\">NA: 3.7% <br /> \
	Europe: 7.7%<br />\
        Asia:12.5%<br />\
         LA:1.9%<br />\
         Other:-27.4%</font>";


    ndx = crossfilter(spendData);
var regionDim  = ndx.dimension(function(d) {return d.Region;}),
    countries  = ndx.dimension(function(d) {return d.Country;}),
    nameDim  = ndx.dimension(function(d) {return d.Contract_Type;}),
    parentDim  = ndx.dimension(function(d) {return d.Exchange_Name;}),
    parentDim1  = ndx.dimension(function(d) {return d.Exchange_Name;}),
    parentDim2  = ndx.dimension(function(d) {return d.Abbreviated_Name;}),
    exchangeDim  = ndx.dimension(function(d) {return d.Group_Name;}),
    exchangeDim1  = ndx.dimension(function(d) {return d.Group_Name;}),
    countries1  = ndx.dimension(function(d) {return d.Country;}),
    countrieSum1 = countries1.group().reduceSum(function(d) {return d.Open_Interest;}),
    countrieSum = countries.group().reduceSum(function(d) {return d.Open_Interest;}),
    regionSum = regionDim.group().reduceSum(function(d) {return d.Open_Interest;}),
    nameSum = nameDim.group().reduceSum(function(d) {return d.Open_Interest;}),
    parentSum    = parentDim.group().reduceSum(function(d) {return d.Open_Interest;}),
    parentSum1    = parentDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
    parentSum2    = parentDim2.group().reduceSum(function(d) {return d.Open_Interest;}),
    exchSum    = exchangeDim.group().reduceSum(function(d) {return d.Open_Interest;}),
    exchSum1    = exchangeDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
    allDim1 = ndx.dimension(function(d) {return d.Open_Interest;}),
    eventGroup = allDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
    allDim = ndx.dimension(function(d) {return d.Open_Interest;});
selectField
      .dimension(parentDim1)
      .group(parentSum1)
      .multiple(true);
selectField.title(function (d){
    return d.key;
})
var activities=0;
var count =  dc.dataCount(".dc-data-count")
    .dimension(eventGroup)
    .group({value: function() { activities=0; 
    return eventGroup.all().filter(function(kv) { if (kv.value>0) {				  
				  activities += +kv.value;
				} return kv.value>0; }).length;
} })
.on("renderlet.all", function(c) {
			$(".nbaccredited").html(numberWithCommas(activities));
});
  selectField1
      .dimension(exchangeDim1)
      .group(exchSum1)
      .multiple(true);
selectField1.title(function (d){
    return d.key;
})

  selectField2
      .dimension(countries1)
      .group(countrieSum1)
      .multiple(true);
selectField2.title(function (d){
    return d.key;
})
            var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #fff'>" +  d.data.key + "</span> : "  + d.data.value; });

            var tip1 = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #fff'>" +  d3.select(this).select("title").text() + "</span>"});

            // tooltips for pie chart
            var pieTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #fff'>" +  d.data.key + "</span> : "  + d.value; });

            country_chart.width(850)
                    .height(500)
                    .dimension(countries)
                    .group(countrieSum)
                    .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
                    .colorDomain([0, 50000000])
                    .colorCalculator(function (d) { return d ? country_chart.colors()(d) : '#ccc'; })
		    .projection(projection)
                    .overlayGeoJson(c.features, "state", function (d) {
                        return d.properties.name;
                    })
                    .title(function (d) {
                        return d.key + ": " + d.value;
                    });
var colorScale2 = d3.scale.ordinal().range(["#3BB34A", "#7750A0", "#E0C195", "#5970B5", "#CCDB65", "#4B7837"]);
  region_chart
    .width(350)
    .height(350)
    .dimension(regionDim)
    .group(regionSum)
    .innerRadius(40)
.colors(colorScale2)
.minAngleForLabel(.4)
.externalRadiusPadding(80)
          .externalLabels(40)
          .drawPaths(false)

    .controlsUseVisibility(true);


d3.select('#perform1')
    .on('click', function() {
$(document).ready(function() {
selectField.filter(null);
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

d3.select('#perform10')
    .on('click', function() {
$(document).ready(function() {
selectField1.filter(null);
var checkedValues = $('#menu1select input:checkbox:checked').map(function() {
    return this.value;
}).get();

if (checkedValues === undefined || checkedValues.length == 0) {
    selectField1.filter(['Null']);
}
        selectField1.filter([checkedValues]);
selectField1.redrawGroup();

dc.redrawAll();

});
    });
d3.select('#perform12')
    .on('click', function() {
$(document).ready(function() {
selectField2.filter(null);
var checkedValues = $('#menu2select input:checkbox:checked').map(function() {
    return this.value;
}).get();

if (checkedValues === undefined || checkedValues.length == 0) {
    selectField2.filter(['Null']);
}
        selectField2.filter([checkedValues]);
selectField2.redrawGroup();

dc.redrawAll();

});
    });
var colorScale1 = d3.scale.ordinal().range(["#44C8F5"]);
contract_chart
    .width(300)
    .height(400)
    .dimension(nameDim)
    .group(nameSum)
    .elasticX(true)
.elasticY(true)
.x(d3.scale.ordinal())
          .xUnits(dc.units.ordinal)
    .gap(10)
.margins({left: 80, top: 30, right: 30, bottom: 20})
    .controlsUseVisibility(true)
    .renderTitle(true)
.colors(colorScale1)
          .barPadding(0.3)
          .outerPadding(0.3);
     contract_chart.yAxis().ticks(7);


var allDollars = ndx.groupAll().reduceSum(function(d) { return d.Open_Interest; });


  exchange_chart
    .width(350)
    .height(350)
    .dimension(parentDim2)
.minAngleForLabel(.2)
.externalRadiusPadding(80)
          .externalLabels(40)
    .group(parentSum2)
    .innerRadius(40)
    .drawPaths(false)
    .controlsUseVisibility(true);



var colorScale = d3.scale.ordinal().range(["#D2232A", "#FFCD00", "#F68928", "#85C441", "#CCDB65", "#A8DEF5", "#00A4E7","#75787B","#4B4F54"]);
  group_chart
    .width(350)
    .height(350)
    .dimension(exchangeDim)
    .group(exchSum)
    .innerRadius(40)
.colors(colorScale)
.minAngleForLabel(.2)
.externalRadiusPadding(80)
          .externalLabels(40)
    .drawPaths(false)
    .controlsUseVisibility(true);





       

  

d3.select('#CSV')
    .on('click', function() {
        var data = nameDim.top(Infinity);
        
        var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
        saveAs(blob, 'data.csv');
    });

dc.renderAll();
$(document).ready(function() {
                d3.selectAll(".bar").call(tip);
                d3.selectAll(".bar").on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
d3.selectAll(".state").call(tip1);
                d3.selectAll(".state").on('mouseover', tip1.show)
                    .on('mouseout', tip1.hide);

                d3.selectAll(".pie-slice").call(pieTip);
                d3.selectAll(".pie-slice").on('mouseover', pieTip.show)
                    .on('mouseout', pieTip.hide);
var changed;
$('select').change(function(e) {
    var select = $(this);
    var list = select.data('prevstate');
    var val = select.val();
    if (list == null) {
        list = val;
    } else if (val.length == 1) {
        val = val.pop();
        var pos = list.indexOf(val);
        if (pos == -1)
            list.push(val);
        else
            list.splice(pos, 1);
    } else {
        list = val;
    }
    select.val(list);
    select.data('prevstate', list);
    changed = true;
}).find('option').click(function() {
    if (!changed){
        $(this).parent().change();
    }
    changed = false;
});
});

}
});
//The following variables set up all the dimensions and groups that are used by the crossfilter.
    ndx = crossfilter(spendData);
var regionDim  = ndx.dimension(function(d) {return d.Region;}),
    countries  = ndx.dimension(function(d) {return d.Country;}),
    nameDim  = ndx.dimension(function(d) {return d.Contract_Type;}),
    parentDim  = ndx.dimension(function(d) {return d.Exchange_Name;}),
    parentDim1  = ndx.dimension(function(d) {return d.Exchange_Name;}),
    parentDim2  = ndx.dimension(function(d) {return d.Abbreviated_Name;}),
    exchangeDim  = ndx.dimension(function(d) {return d.Group_Name;}),
    exchangeDim1  = ndx.dimension(function(d) {return d.Group_Name;}),
    countries1  = ndx.dimension(function(d) {return d.Country;}),
    countrieSum1 = countries1.group().reduceSum(function(d) {return d.Volume;}),
    countrieSum = countries.group().reduceSum(function(d) {return d.Volume;}),
    regionSum = regionDim.group().reduceSum(function(d) {return d.Volume;}),
    nameSum = nameDim.group().reduceSum(function(d) {return d.Volume;}),
    parentSum    = parentDim.group().reduceSum(function(d) {return d.Volume;}),
    parentSum1    = parentDim1.group().reduceSum(function(d) {return d.Volume;}),
    parentSum2    = parentDim2.group().reduceSum(function(d) {return d.Volume;}),
    exchSum    = exchangeDim.group().reduceSum(function(d) {return d.Volume;}),
    exchSum1    = exchangeDim1.group().reduceSum(function(d) {return d.Volume;}),
    allDim1 = ndx.dimension(function(d) {return d.Volume;}),
    eventGroup = allDim1.group().reduceSum(function(d) {return d.Volume;}),
    allDim = ndx.dimension(function(d) {return d.Volume;});
//The following set of dc.js functions will be initialized with the dimensions and groups given as parameters.
// They will generate the svg elements of the charts.
selectField
      .dimension(parentDim1)
      .group(parentSum1)
      .multiple(true);	
selectField.title(function (d){
    return d.key;
})
var activities=0;
var count =  dc.dataCount(".dc-data-count")
    .dimension(eventGroup)
    .group({value: function() { activities=0; 
    return eventGroup.all().filter(function(kv) { if (kv.value>0) {				  
				  activities += +kv.value;
				} return kv.value>0; }).length;
} })
.on("renderlet.all", function(c) {
			$(".nbaccredited").html(numberWithCommas(activities));
});
  selectField1
      .dimension(exchangeDim1)
      .group(exchSum1)
      .multiple(true);
selectField1.title(function (d){
    return d.key;
})
  selectField2
      .dimension(countries1)
      .group(countrieSum1)
      .multiple(true);
selectField2.title(function (d){
    return d.key;
})
      
            var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #fff'>" +  d.data.key + "</span> : "  + d.data.value; });

            var tip1 = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #fff'>" +  d3.select(this).select("title").text() + "</span>"});

            // tooltips for pie chart
            var pieTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #fff'>" +  d.data.key + "</span> : "  + d.value; });

            country_chart.width(850)
                    .height(500)
                    .dimension(countries)
                    .group(countrieSum)
                    .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
                    .colorDomain([0, 100000000])
                    .colorCalculator(function (d) { return d ? country_chart.colors()(d) : '#ccc'; })
		    .projection(projection)

                    .overlayGeoJson(c.features, "state", function (d) {
                        return d.properties.name;
                    })
		    .title(function (d) {
                        return d.key + ": " + d.value;
                    });



var colorScale2 = d3.scale.ordinal().range(["#3BB34A", "#7750A0", "#E0C195", "#5970B5", "#CCDB65", "#4B7837"]);
  region_chart
    .width(350)
    .height(350)
    .dimension(regionDim)
    .group(regionSum)
    .innerRadius(40)
.colors(colorScale2)
.minAngleForLabel(.8)
.externalRadiusPadding(80)
          .externalLabels(40)
          .drawPaths(false)

    .controlsUseVisibility(true);

//The following set of functions are for setting filters.
d3.select('#perform1')
    .on('click', function() {
$(document).ready(function() {
selectField.filter(null);
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

d3.select('#perform10')
    .on('click', function() {
$(document).ready(function() {
selectField1.filter(null);
var checkedValues = $('#menu1select input:checkbox:checked').map(function() {
    return this.value;
}).get();

if (checkedValues === undefined || checkedValues.length == 0) {
    selectField1.filter(['Null']);
}
        selectField1.filter([checkedValues]);
selectField1.redrawGroup();

dc.redrawAll();

});
    });
d3.select('#perform12')
    .on('click', function() {
$(document).ready(function() {
selectField2.filter(null);
var checkedValues = $('#menu2select input:checkbox:checked').map(function() {
    return this.value;
}).get();

if (checkedValues === undefined || checkedValues.length == 0) {
    selectField2.filter(['Null']);
}
        selectField2.filter([checkedValues]);
selectField2.redrawGroup();

dc.redrawAll();

});
    });
var colorScale1 = d3.scale.ordinal().range(["#44C8F5"]);
contract_chart
    .width(300)
    .height(400)
    .dimension(nameDim)
    .group(nameSum)
    .elasticX(true)
.elasticY(true)
.x(d3.scale.ordinal())
          .xUnits(dc.units.ordinal)
    .gap(10)
.margins({left: 80, top: 30, right: 30, bottom: 20})
    .controlsUseVisibility(true)
    .renderTitle(true)
.colors(colorScale1)
          .barPadding(0.3)
          .outerPadding(0.3);
     contract_chart.yAxis().ticks(7);
var allDollars = ndx.groupAll().reduceSum(function(d) { return d.Volume; });



  exchange_chart
    .width(350)
    .height(350)
    .dimension(parentDim2)
.minAngleForLabel(.25)
.externalRadiusPadding(80)
          .externalLabels(40)
    .group(parentSum2)
    .innerRadius(40)
    .drawPaths(false)
    .controlsUseVisibility(true);


var colorScale = d3.scale.ordinal().range(["#D2232A", "#FFCD00", "#F68928", "#85C441", "#CCDB65", "#A8DEF5", "#00A4E7","#75787B","#4B4F54"]);
  group_chart
    .width(350)
    .height(350)
    .dimension(exchangeDim)
    .group(exchSum)
    .innerRadius(40)
.colors(colorScale)
.minAngleForLabel(.35)
.externalRadiusPadding(80)
          .externalLabels(40)
    .drawPaths(false)
    .controlsUseVisibility(true);
   


                 


  

d3.select('#CSV')
    .on('click', function() {
        var data = nameDim.top(Infinity);
        
            
        
        var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
        saveAs(blob, 'data.csv');
    });



//The following set of functions are for setting up reset for individual charts.
d3.select("#countryreset")
    .on('click', function() {
       country_chart.filterAll();dc.redrawAll();

    });
d3.select("#instrumentreset")
    .on('click', function() {
       contract_chart.filterAll();dc.redrawAll();

    });
d3.select("#regionreset")
    .on('click', function() {
       region_chart.filterAll();dc.redrawAll();

    });
d3.select("#exchangereset")
    .on('click', function() {
       exchange_chart.filterAll();dc.redrawAll();

    });
d3.select("#groupreset")
    .on('click', function() {
       group_chart.filterAll();dc.redrawAll();
    });
	


dc.renderAll();


$(document).ready(function() {
                d3.selectAll(".bar").call(tip);
                d3.selectAll(".bar").on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
d3.selectAll(".state").call(tip1);
                d3.selectAll(".state").on('mouseover', tip1.show)
                    .on('mouseout', tip1.hide);

                d3.selectAll(".pie-slice").call(pieTip);
                d3.selectAll(".pie-slice").on('mouseover', pieTip.show)
                    .on('mouseout', pieTip.hide);		
var changed;
$('select').change(function(e) {
    var select = $(this);
    var list = select.data('prevstate');
    var val = select.val();
    if (list == null) {
        list = val;
    } else if (val.length == 1) {
        val = val.pop();
        var pos = list.indexOf(val);
        if (pos == -1)
            list.push(val);
        else
            list.splice(pos, 1);
    } else {
        list = val;
    }
    select.val(list);
    select.data('prevstate', list);
    changed = true;
}).find('option').click(function() {
    if (!changed){
        $(this).parent().change();
    }
    changed = false;
});
});
});
 });

