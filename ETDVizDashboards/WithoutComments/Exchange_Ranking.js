
$(window).scroll(function(){
    if ($(window).scrollTop() >= 0) {
       $('.fix').addClass('fixed-header');
	$('.main-menu').css({top: '0px', position:'fixed'});
    }
    else {
       $('.fix').removeClass('fixed-header');
	$('.main-menu').css({top: '0px', position:'absolute'});
    }
});
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
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

var ndx;
var allDim;
var numberformat = d3.format(",");

var selectField3 = dc.pieChart("#chart-ring-year2");
var selectField1 = dc.selectMenu('#menu8select');
var selectField2 = dc.selectMenu('#menu9select');
var arange = "";

  
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

$(".dropdown3 dt a").on('click', function() {
  $(".dropdown3 dd ul").slideToggle('fast');
});

$(".dropdown3 dd select option a").on('click', function() {
  $(".dropdown3 dd ul").hide();
});

function getSelectedValue(id) {
  return $("#" + id).find(".dropdown3 dt a span.value").html();
}

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown3")) $(".dropdown3 dd ul").hide();
});
});
d3.csv("https://rawgit.com/ovik-chakraborty/Tutorial/master/exchange_ranking_stats.csv", function(error, spendData) {
spendData.forEach(function(d) {

    d.Volume = numberformat(+d.Volume);
    d.Open_Interest = numberformat(+d.Open_Interest);
});
var filteredData = spendData.filter(function (d) {
    return d.Volume != 0;
});
function x(filterdData){
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

var arrays1 = d3.map(filteredData, function(d){return d.Country;}).keys();
arrays1.sort();
arrays1.unshift('All-Country');

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
 $("#All-Country").click(function () {
     $('#menu1select input:checkbox').not(this).prop('checked', this.checked);
 });

var arrays2 = d3.map(filteredData, function(d){return d.Region;}).keys();
arrays2.sort();
arrays2.unshift('All-Region');

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
 $("#All-Region").click(function () {
     $('#menu2select input:checkbox').not(this).prop('checked', this.checked);
 });

var arrays3 = d3.map(filteredData, function(d){return d.Group_Name;}).keys();
arrays3.sort();
arrays3.unshift('Select_All');

    var select = d3.select("#menu3select")
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
 $("#Select_All").click(function () {
     $('#menu3select input:checkbox').not(this).prop('checked', this.checked);
 });
}
d3.select('#render1')
    .on('click', function() {
dc.filterAll();dc.redrawAll();
$('input:checkbox').removeAttr('checked');
});
var data;
ndx = crossfilter(spendData);
var parentDim  = ndx.dimension(function(d) {return d.Exchange_Name;}),
    exchangeDim1  = ndx.dimension(function(d) {return d.Country;}),
parentDim1  = ndx.dimension(function(d) {return d.Region;}),
    parentSum1    = parentDim1.group().reduceSum(function(d) {return d.Volume;}),
    parentSum    = parentDim.group().reduceSum(function(d) {return d.Volume;}),
    exchangeSum1    = exchangeDim1.group().reduceSum(function(d) {return d.Volume;}),
    allDim1 = ndx.dimension(function(d) {return d.Volume;}),
    eventGroup = allDim1.group().reduceSum(function(d) {return d.Volume;}),
    allDim = ndx.dimension(function(d) {return d.Volume;});
x(filteredData);

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
      .group(exchangeSum1)
      .multiple(true);
selectField1.title(function (d){
    return d.key;
})

selectField2
      .dimension(parentDim1)
      .group(parentSum1)
      .multiple(true);
selectField1.title(function (d){
    return d.key;
})      
           


d3.select('#perform1')
    .on('click', function() {
$(document).ready(function() {
selectField3.filter(null);
var checkedValues = $('#meniselect input:checkbox:checked').map(function() {
    return this.value;
}).get();
if (checkedValues === undefined || checkedValues.length == 0) {
    selectField3.filter(['Null']);
}
        selectField3.filter([checkedValues]);
selectField3.redrawGroup();

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

d3.select('#perform11')
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


  selectField3
    .width(270)
    .height(270)
    .dimension(parentDim)
    .group(parentSum)
    .innerRadius(40)
    .drawPaths(false)
    .controlsUseVisibility(true);


 
var dataTableOptions = {
                "lengthMenu": [[10,20,30], [10,20,30]],
                'destroy': true,
                "retrieve": true,
                colReorder: true,
                columnDefs: [
                    
                    {
                        "title": "Exchange Name",
                        "orderable": true,
                        targets: 0,
                        data: function (d) { return d.Exchange_Name; }
                    },
                    {
                        "title": "Country",
                        "orderable": true,
                        targets: 1,
                        data: function (d) { return d.Country; }
                    },
					{
                        "title": "Region",
                        "orderable": true,
                        targets: 2,
                        data: function (d) { return d.Region; }
                    },
					{
                        "title": "Volume",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 3,
                        "width": "10%",
                        data: function (d) { return d.Volume; }
                    },
{
                        "title": "Volume M/M Change",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 4,
                        "width": "5%",
                        data: function (d) { return d.Volume_M_Change; }
                    },
{
                        "title": "Volume Y/Y Change",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 5,
                        "width": "5%",
                        data: function (d) { return d.Volume_Y_Change; }
                    },
					{
                        "title": "Open Interest",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 6,
                        "width": "10%",
                        data: function (d) { return d.Open_Interest; }
                    },
                ]
            };
data = $('#table').dataTable(dataTableOptions);
            function RefreshTable() {
                dc.events.trigger(function () {
                     data.api()
                      .clear()
                      .rows.add(allDim.top(Infinity))
                      .draw();

                });
            }

            for (var i = 0; i < dc.chartRegistry.list().length; i++) {
                var chartI = dc.chartRegistry.list()[i];
                chartI.on("filtered", RefreshTable);
            }





                 


  

d3.select('#CSV')
    .on('click', function() {
        var data = nameDim.top(Infinity);
        
            
        
        var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
        saveAs(blob, 'data.csv');
    });
RefreshTable();

dc.renderAll();

d3.select('#render')
    .on('click', function() {
var elect = d3.select("#meniselect");
elect.select('ul').remove();
var elect1 = d3.select("#menu1select");
elect1.select('ul').remove();
var elect2 = d3.select("#menu2select");
elect2.select('ul').remove();


//var elect2 = d3.select("#table");
//elect2.select('thead').remove();
//elect2.select('tbody').remove();
dc.filterAll();dc.redrawAll();
$('#table').DataTable(dataTableOptions).clear().destroy();
//d3.select('#table').append('thead').attr('class','thead-inverse');
if(d3.select('#download-type1 input:checked').node().value==='volume') {
ndx = crossfilter(spendData);
var parentDim  = ndx.dimension(function(d) {return d.Exchange_Name;}),
    exchangeDim1  = ndx.dimension(function(d) {return d.Country;}),
parentDim1  = ndx.dimension(function(d) {return d.Region;}),
    parentSum1    = parentDim1.group().reduceSum(function(d) {return d.Volume;}),
    parentSum    = parentDim.group().reduceSum(function(d) {return d.Volume;}),
    exchangeSum1    = exchangeDim1.group().reduceSum(function(d) {return d.Volume;}),
    allDim1 = ndx.dimension(function(d) {return d.Volume;}),
    eventGroup = allDim1.group().reduceSum(function(d) {return d.Volume;}),
    allDim = ndx.dimension(function(d) {return d.Volume;});

var filteredData = spendData.filter(function (d) {
    return d.Volume != 0;
});
x(filteredData);

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
      .group(exchangeSum1)
      .multiple(true);
selectField1.title(function (d){
    return d.key;
})

selectField2
      .dimension(parentDim1)
      .group(parentSum1)
      .multiple(true);
selectField1.title(function (d){
    return d.key;
})

  selectField3
    .width(270)
    .height(270)
    .dimension(parentDim)
    .group(parentSum)
    .innerRadius(40)
    .drawPaths(false)
    .controlsUseVisibility(true);



   
dataTableOptions = {"lengthMenu": [[10,20,30], [10,20,30]],
                'destroy': true,
                "retrieve": true,
                colReorder: true,
                columnDefs: [
                    
                    {
                        "title": "Exchange Name",
                        "orderable": true,
                        targets: 0,
                        data: function (d) { return d.Exchange_Name; }
                    },
                    {
                        "title": "Country",
                        "orderable": true,
                        targets: 1,
                        data: function (d) { return d.Country; }
                    },
					{
                        "title": "Region",
                        "orderable": true,
                        targets: 2,
                        data: function (d) { return d.Region; }
                    },
					{
                        "title": "Volume",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 3,
                        "width": "10%",
                        data: function (d) { return d.Volume; }
                    },
{
                        "title": "Volume M/M Change",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 4,
                        "width": "5%",
                        data: function (d) { return d.Volume_M_Change; }
                    },
{
                        "title": "Volume Y/Y Change",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 5,
                        "width": "5%",
                        data: function (d) { return d.Volume_Y_Change; }
                    },
					{
                        "title": "Open Interest",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 6,
                        "width": "10%",
                        data: function (d) { return d.Open_Interest; }
                    },
                ]
            };
data = $('#table').dataTable(dataTableOptions);
            function RefreshTable1() {
                dc.events.trigger(function () {
                     data.api()
                      .clear()
                      .rows.add(allDim.top(Infinity))
                      .draw();

                });
            }

            for (var i = 0; i < dc.chartRegistry.list().length; i++) {
                var chartI = dc.chartRegistry.list()[i];
                chartI.on("filtered", RefreshTable1);
            }



RefreshTable1();

dc.renderAll();
}
if(d3.select('#download-type1 input:checked').node().value==='open') {
ndx = crossfilter(spendData);
var parentDim  = ndx.dimension(function(d) {return d.Exchange_Name;}),
    exchangeDim1  = ndx.dimension(function(d) {return d.Country;}),
parentDim1  = ndx.dimension(function(d) {return d.Region;}),
    parentSum1    = parentDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
    parentSum    = parentDim.group().reduceSum(function(d) {return d.Open_Interest;}),
    exchangeSum1    = exchangeDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
    allDim1 = ndx.dimension(function(d) {return d.Open_Interest;}),
    eventGroup = allDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
    allDim = ndx.dimension(function(d) {return d.Open_Interest;});

var filteredData = spendData.filter(function (d) {
    return d.Open_Interest != 0;
});
x(filteredData);

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
      .group(exchangeSum1)
      .multiple(true);
selectField1.title(function (d){
    return d.key;
})

selectField2
      .dimension(parentDim1)
      .group(parentSum1)
      .multiple(true);
selectField1.title(function (d){
    return d.key;
})


  selectField3
    .width(270)
    .height(270)
    .dimension(parentDim)
    .group(parentSum)
    .innerRadius(40)
    .drawPaths(false)
    .controlsUseVisibility(true);



   
dataTableOptions = {"lengthMenu": [[10,20,30], [10,20,30]],
                'destroy': true,
                "retrieve": true,
                colReorder: true,
                columnDefs: [
                    
                    {
                        "title": "Exchange Name",
                        "orderable": true,
                        targets: 0,
                        data: function (d) { return d.Exchange_Name; }
                    },
                    {
                        "title": "Country",
                        "orderable": true,
                        targets: 1,
                        data: function (d) { return d.Country; }
                    },
					{
                        "title": "Region",
                        "orderable": true,
                        targets: 2,
                        data: function (d) { return d.Region; }
                    },
					{
                        "title": "Open Interest",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 3,
                        "width": "10%",
                        data: function (d) { return d.Open_Interest; }
                    },
{
                        "title": "Open Interest M/M Change",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 4,
                        "width": "5%",
                        data: function (d) { return d.Open_Interest_M_Change; }
                    },
{
                        "title": "Open Interest Y/Y Change",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 5,
                        "width": "5%",
                        data: function (d) { return d.Open_Interest_Y_Change; }
                    },
					{
                        "title": "Volume",
                        "orderable": true,
                        "createdCell": function(cell)
                        {
                             $(cell).addClass('right1');
                        },
                        targets: 6,
                        "width": "10%",
                        data: function (d) { return d.Volume; }
                    },
                ]
            };
data = $('#table').dataTable(dataTableOptions);
            function RefreshTable2() {
                dc.events.trigger(function () {
                     data.api()
                      .clear()
                      .rows.add(allDim.top(Infinity))
                      .draw();

                });
            }

            for (var i = 0; i < dc.chartRegistry.list().length; i++) {
                var chartI = dc.chartRegistry.list()[i];
                chartI.on("filtered", RefreshTable2);
            }



RefreshTable2();


dc.renderAll();
}
});
    

$(document).ready(function() {
		
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

