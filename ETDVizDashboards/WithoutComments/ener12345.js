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

jQuery(document).ready(function(){
    jQuery('#Custom').on('click', function(event) {
        if ( $('#hid').css('visibility') == 'hidden' )
            $('#hid').css('visibility','visible');
        else
            $('#hid').css('visibility','hidden');
    });
});
function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.value != 0;
            });
        }
    };
}

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
var timeFormat1 = d3.time.format('%m/%d/%Y');
var timeFormat = d3.time.format('%Y-%m');
var country_chart = dc.geoChoroplethChart("#country_chart");
var region_chart   = dc.pieChart("#region_chart"),
    overall_chart  = dc.barChart("#overall_chart"),
    instr_chart = dc.barChart("#instr_chart");
var month_chart = dc.lineChart("#month_chart");
var exch_chart = dc.pieChart("#exch_chart");
var category_chart = dc.pieChart("#category_chart");
var subcategory_chart = dc.pieChart("#subcategory_chart");
var selectField = dc.selectMenu('#menuselect');
var selectField1 = dc.selectMenu('#menu2select');
var selectField2 = dc.selectMenu('#menu4select');
var contracts_chart = dc.rowChart("#contracts_chart");
var arange = "";

var projection = d3.geo.mercator()
    .center([0, 20])
    .scale(100)
    .rotate([-12,0])
    .translate([340, 260]);
$( function() {
    var dateFormat = "mm/01/yy",
        from = $( "#from" )
            .MonthPicker({
                defaultDate: "-2m",
                changeMonth: true,
                numberOfMonths: 1,
                changeYear: true
            })
            .on( "change", function() {

                to.MonthPicker( "option", "MinMonth", this.value );

            }),
        to = $( "#to" ).MonthPicker({
            defaultDate: "-2m",
            changeMonth: true,
            numberOfMonths: 1,
            changeYear: true
        })
            .on( "change", function() {

                from.MonthPicker( "option", "MaxMonth", this.value );

            });

    function getDate( element ) {
        var date;
        try {
            date = element.MonthPicker('GetSelectedMonth') + '/01/' + element.MonthPicker('GetSelectedYear');
        } catch( error ) {
            date = null;
        }

        return date;
    }
} );

$(document).ready(function() {

    $("#654").on("click", function(e){
        e.preventDefault();

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
d3.csv("https://rawgit.com/ovik-chakraborty/Tutorial/master/Updated_files_ETD/energy_ETD1.csv", function(error, spendData) {
    spendData.forEach(function(d) {
        d.Report_Month = +d.Month;
        d.Report_Year = +d.Year;
        d.Report_Year_Month = timeFormat.parse(d.Report_Year_Month);
        d.Volume = +d.Volume;
        d.Open_Interest = +d.Open_Interest;
    });
    var filteredData = spendData.filter(function (d) {
        return d.Volume != 0;
    });
    var arrays = d3.map(filteredData, function(d){return d.Country;}).keys();
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

    var arrays1 = d3.map(filteredData, function(d){return d.Exchange_Name;}).keys();
    arrays1.sort();
    arrays1.unshift('Select-All');

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
    $("#Select-All").click(function () {
        $('#menu1select input:checkbox').not(this).prop('checked', this.checked);
    });

    var arrays2 = d3.map(filteredData, function(d){return d.Category_Name;}).keys();
    arrays2.sort();
    arrays2.unshift('Select-ALL');

    var select = d3.select("#menu3select")
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
    $("#Select-ALL").click(function () {
        $('#menu3select input:checkbox').not(this).prop('checked', this.checked);
    });
    d3.select('#render1')
        .on('click', function() {
            $('input[type=checkbox]').each(function() { this.checked = false; });
            $('input[type="text"]').val('');
            dc.filterAll();
            dc.redrawAll();
        });
    d3.select('#render')
        .on('click', function() {
            $('input[type=checkbox]').each(function() { this.checked = false; });
            $('input[type="text"]').val('');
            dc.filterAll();
            dc.redrawAll();
            if(d3.select('#download-type1 input:checked').node().value==='volume') {
                var element = document.getElementById("header2");
                element.innerHTML = "Volume by Month-Year";
                var element = document.getElementById("header3");
                element.innerHTML = "Volume by Region";
                var element = document.getElementById("header4");
                element.innerHTML = "Volume by Country";
                var element = document.getElementById("header5");
                element.innerHTML = "Volume by Parent";
                var element = document.getElementById("header6");
                element.innerHTML = "Volume by Instrumnet Type";
                var element = document.getElementById("header7");
                element.innerHTML = "Volume by Exchange";
                var elect = d3.select("#meniselect");
                elect.select('ul').remove();
                var elect1 = d3.select("#menu1select");
                elect1.select('ul').remove();
                var elect2 = d3.select("#menu3select");
                elect2.select('ul').remove();
                var filteredData = spendData.filter(function (d) {
                    return d.Volume != 0;
                });
                var arrays = d3.map(filteredData, function(d){return d.Country;}).keys();
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

                var arrays1 = d3.map(filteredData, function(d){return d.Exchange_Name;}).keys();
                arrays1.sort();
                arrays1.unshift('Select-All');

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
                $("#Select-All").click(function () {
                    $('#menu1select input:checkbox').not(this).prop('checked', this.checked);
                });

                var arrays2 = d3.map(filteredData, function(d){return d.Category_Name;}).keys();
                arrays2.sort();
                arrays2.unshift('Select-ALL');

                var select = d3.select("#menu3select")
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
                $("#Select-ALL").click(function () {
                    $('#menu3select input:checkbox').not(this).prop('checked', this.checked);
                });
                var ndx = crossfilter(spendData);
                var regionDim  = ndx.dimension(function(d) {return d.Region;}),
                    countries  = ndx.dimension(function(d) {return d.Country;}),
                    monthDim = ndx.dimension(function(d) {return d.Report_Year_Month;}),
                    monthDim1 = ndx.dimension(function(d) {return d.Report_Year_Month;}),
                    nameDim  = ndx.dimension(function(d) {return d.Contract_Type;}),
                    exchangeDim  = ndx.dimension(function(d) {return d.Exchange_Name;}),
                    exchangeDim1  = ndx.dimension(function(d) {return d.Exchange_Name;}),
                    exchangeDim2  = ndx.dimension(function(d) {return d.Exchange_Name;}),
                    categoryDim  = ndx.dimension(function(d) {return d.Category_Name;}),
                    subcategoryDim  = ndx.dimension(function(d) {return d.SubCategory_Name;}),
                    categorySum = categoryDim.group().reduceSum(function(d) {return d.Volume;}),
                    subcategorysum = subcategoryDim.group().reduceSum(function(d) {return d.Volume;}),
                    countriesSum = countries.group().reduceSum(function(d) {return d.Volume;}),
                    regionSum = regionDim.group().reduceSum(function(d) {return d.Volume;}),
                    nameSum = nameDim.group().reduceSum(function(d) {return d.Volume;}),
                    monthSum    = monthDim.group().reduceSum(function(d) {return d.Volume;}),
                    monthSum1    = monthDim1.group().reduceSum(function(d) {return d.Volume;}),
                    exchSum1    = exchangeDim1.group().reduceSum(function(d) {return d.Volume;}),
                    exchSum2    = exchangeDim2.group().reduceSum(function(d) {return d.Volume;}),
                    exchSum    = exchangeDim.group().reduceSum(function(d) {return d.Volume;}),
                    allDim1 = ndx.dimension(function(d) {return d.Volume;}),
                    newDim1  = ndx.dimension(function(d) {return d.Country;}),
                    newgroup1    = newDim1.group().reduceSum(function(d) {return d.Volume;}),
                    eventGroup = allDim1.group().reduceSum(function(d) {return d.Volume;}),
                    RepDim  = ndx.dimension(function(d) {return d.Standardized_Contract;}),
                    repSum = RepDim.group().reduceSum(function(d) {return d.Volume;}),
                    allDim = ndx.dimension(function(d) {return d.Volume;});
                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d) { return "<span style='color: #f0027f'>" +  d.key + "</span> : "  + d.value; });

                // tooltips for pie chart
                var pieTip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d) { return "<span style='color: #f0027f'>" +  d.data.key + "</span> : "  + d.value; });
                d3.json("https://rawgit.com/ovik-chakraborty/Tutorial/master/countries1.geo.json", function (error, c) {
                    country_chart.width(800)
                        .height(400)
                        .dimension(countries)
                        .group(countriesSum)
                        .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
                        .colorDomain([0, 1000000])
                        .colorCalculator(function (d) { return d ? country_chart.colors()(d) : '#ccc'; })
                        .projection(projection)
                        .overlayGeoJson(c.features, "state", function (d) {
                            return d.properties.name;
                        })
                        .title(function (d) {
                            return "Country: " + d.key + "\nVolume: " + d.value;
                        });

                    selectField2
                        .dimension(categoryDim)
                        .group(categorySum)
                        .multiple(true);
                    selectField2.title(function (d){
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

                    selectField
                        .dimension(newDim1)
                        .group(newgroup1)
                        .multiple(true);
                    selectField.title(function (d){
                        return d.key;
                    })
                    region_chart
                        .width(350)
                        .height(350)
                        .dimension(regionDim)
                        .group(regionSum)
                        .innerRadius(40)
                        .minAngleForLabel(.35)
                        .externalRadiusPadding(80)
                        .externalLabels(40)
                        .drawPaths(false)
                        .controlsUseVisibility(true);

                    var xey1 = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var end5 = d3.max(d3.values(xey1));
                    end5.setDate(end5.getDate() + 1);
                    var end6 = d3.min(d3.values(xey1));

                    month_chart
                        .renderArea(true)
                        .width(1100)
                        .height(350)
                        .transitionDuration(1000)
                        .margins({left: 90, top: 10, right: 10, bottom: 30})
                        .dimension(monthDim1)

                        .x(d3.time.scale().domain([end6, end5]))
                        .round(d3.time.month.round)
                        .xUnits(d3.time.months)


                        .elasticY(true)

                        .renderHorizontalGridLines(true)

                        .rangeChart(overall_chart)




                        .brushOn(false)
                        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
                        // legend.
                        // The `.valueAccessor` will be used for the base layer
                        .group(monthSum1)

                        .valueAccessor(function (d) {
                            return d.value;
                        });







                    overall_chart
                        .width(1100)
                        .height(80)
                        .centerBar(true)
                        .gap(1)
                        .x(d3.time.scale().domain([timeFormat.parse('1992-01'), timeFormat.parse('2016-12')]))




                        .round(d3.time.month.round)
                        .alwaysUseRounding(true)
                        .xUnits(d3.time.months)



                        .dimension(monthDim1)
                        .group(monthSum1)
                        .on("renderlet", function(chart) {
                            // mix of dc API and d3 manipulation
                            chart.select('g.y').style('display', 'none');
                            // its a closure so you can also access other chart variable available in the closure scope

                        })


                        .margins({left: 90, top: 10, right: 10, bottom: 30});
                    overall_chart.yAxis().ticks(0);



                    var colorScale1 = d3.scale.ordinal().range(["#44C8F5"]);

                    instr_chart
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
                    instr_chart.yAxis().ticks(7);

                    var allDollars = ndx.groupAll().reduceSum(function(d) { return d.Volume; });



                    exch_chart
                        .width(350)
                        .height(350)
                        .dimension(exchangeDim)
                        .minAngleForLabel(.25)
                        .externalRadiusPadding(80)
                        .externalLabels(40)
                        .group(exchSum)
                        .innerRadius(40)
                        .drawPaths(false)
                        .controlsUseVisibility(true);

                    category_chart
                        .width(350)
                        .height(350)
                        .dimension(categoryDim)
                        .group(categorySum)
                        .innerRadius(40)
                        .minAngleForLabel(.35)
                        .externalRadiusPadding(80)
                        .externalLabels(40)
                        .drawPaths(false)
                        .controlsUseVisibility(true);

                    subcategory_chart
                        .width(350)
                        .height(350)
                        .dimension(subcategoryDim)
                        .group(subcategorysum)
                        .innerRadius(40)
                        .minAngleForLabel(.35)
                        .externalRadiusPadding(80)
                        .externalLabels(40)
                        .drawPaths(false)
                        .controlsUseVisibility(true);
                    var filtered_group = remove_empty_bins(repSum);

                    contracts_chart
                        .width(420)
                        .height(700)
                        .dimension(RepDim)
                        .group(filtered_group)
                        .elasticX(true)
                        .gap(5)
                        .ordering(function(d) { return -d.value })
                        .controlsUseVisibility(true)
                        .renderTitle(false)
                        .cap(20)
                        .othersGrouper(false)
                        .xAxis().ticks(4);







                    dc.renderAll();
                    var gs = $("#test svg g");
                    $(gs[0]).attr("transform", "translate(0,10)");
                    $(document).ready(function() {
                        d3.selectAll("g.row").call(tip);
                        d3.selectAll("g.row").on('mouseover', tip.show)
                            .on('mouseout', tip.hide);


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
            }
            if(d3.select('#download-type1 input:checked').node().value==='open') {
                var element = document.getElementById("header2");
                element.innerHTML = "OI by Month-Year";
                var element = document.getElementById("header3");
                element.innerHTML = "OI by Region";
                var element = document.getElementById("header4");
                element.innerHTML = "OI by Country";
                var element = document.getElementById("header5");
                element.innerHTML = "OI by Parent";
                var element = document.getElementById("header6");
                element.innerHTML = "OI by Instrumnet Type";
                var element = document.getElementById("header7");
                element.innerHTML = "OI by Exchange";
                var elect = d3.select("#meniselect");
                elect.select('ul').remove();
                var elect1 = d3.select("#menu1select");
                elect1.select('ul').remove();
                var elect2 = d3.select("#menu3select");
                elect2.select('ul').remove();
                var filteredData = spendData.filter(function (d) {
                    return d.Open_Interest != 0;
                });
                var arrays = d3.map(filteredData, function(d){return d.Country;}).keys();
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

                var arrays1 = d3.map(filteredData, function(d){return d.Exchange_Name;}).keys();
                arrays1.sort();
                arrays1.unshift('Select-All');

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
                $("#Select-All").click(function () {
                    $('#menu1select input:checkbox').not(this).prop('checked', this.checked);
                });

                var arrays2 = d3.map(filteredData, function(d){return d.Category_Name;}).keys();
                arrays2.sort();
                arrays2.unshift('Select-ALL');

                var select = d3.select("#menu3select")
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
                $("#Select-ALL").click(function () {
                    $('#menu3select input:checkbox').not(this).prop('checked', this.checked);
                });
                var ndx = crossfilter(spendData);
                var regionDim  = ndx.dimension(function(d) {return d.Region;}),
                    countries  = ndx.dimension(function(d) {return d.Country;}),
                    monthDim = ndx.dimension(function(d) {return d.Report_Year_Month;}),
                    monthDim1 = ndx.dimension(function(d) {return d.Report_Year_Month;}),
                    nameDim  = ndx.dimension(function(d) {return d.Contract_Type;}),
                    exchangeDim  = ndx.dimension(function(d) {return d.Exchange_Name;}),
                    exchangeDim1  = ndx.dimension(function(d) {return d.Exchange_Name;}),
                    exchangeDim2  = ndx.dimension(function(d) {return d.Exchange_Name;}),
                    categoryDim  = ndx.dimension(function(d) {return d.Category_Name;}),
                    subcategoryDim  = ndx.dimension(function(d) {return d.SubCategory_Name;}),
                    categorySum = categoryDim.group().reduceSum(function(d) {return d.Volume;}),
                    subcategorysum = subcategoryDim.group().reduceSum(function(d) {return d.Open_Interest;}),
                    countriesSum = countries.group().reduceSum(function(d) {return d.Open_Interest;}),
                    regionSum = regionDim.group().reduceSum(function(d) {return d.Open_Interest;}),
                    nameSum = nameDim.group().reduceSum(function(d) {return d.Open_Interest;}),
                    monthSum    = monthDim.group().reduceSum(function(d) {return d.Open_Interest;}),
                    monthSum1    = monthDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
                    exchSum    = exchangeDim.group().reduceSum(function(d) {return d.Open_Interest;}),
                    exchSum1    = exchangeDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
                    exchSum2    = exchangeDim2.group().reduceSum(function(d) {return d.Open_Interest;}),
                    newDim1  = ndx.dimension(function(d) {return d.Country;}),
                    newgroup1    = newDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
                    allDim1 = ndx.dimension(function(d) {return d.Open_Interest;}),
                    eventGroup = allDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
                    RepDim  = ndx.dimension(function(d) {return d.Standardized_Contract;}),
                    repSum = RepDim.group().reduceSum(function(d) {return d.Open_Interest;}),
                    allDim = ndx.dimension(function(d) {return d.Open_Interest;});
                selectField2
                    .dimension(categoryDim)
                    .group(categorySum)
                    .multiple(true);
                selectField2.title(function (d){
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

                selectField
                    .dimension(newDim1)
                    .group(newgroup1)
                    .multiple(true);
                selectField.title(function (d){
                    return d.key;
                })
                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d) { return "<span style='color: #f0027f'>" +  d.key + "</span> : "  + d.value; });

                // tooltips for pie chart
                var pieTip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d) { return "<span style='color: #f0027f'>" +  d.data.key + "</span> : "  + d.value; });
                d3.json("https://rawgit.com/ovik-chakraborty/Tutorial/master/countries1.geo.json", function (error, c) {
                    country_chart.width(800)
                        .height(400)
                        .dimension(countries)
                        .group(countriesSum)
                        .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
                        .colorDomain([0, 1000000])
                        .colorCalculator(function (d) { return d ? country_chart.colors()(d) : '#ccc'; })
                        .projection(projection)
                        .overlayGeoJson(c.features, "state", function (d) {
                            return d.properties.name;
                        })
                        .title(function (d) {
                            return "Country: " + d.key + "\nOpen Interest: " + d.value;
                        });
                    region_chart
                        .width(350)
                        .height(350)
                        .dimension(regionDim)
                        .group(regionSum)
                        .innerRadius(40)
                        .minAngleForLabel(.35)
                        .externalRadiusPadding(80)
                        .externalLabels(40)
                        .drawPaths(false)
                        .controlsUseVisibility(true);

                    var xey1 = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var end5 = d3.max(d3.values(xey1));
                    end5.setDate(end5.getDate() + 1);
                    var end6 = d3.min(d3.values(xey1));

                    month_chart
                        .renderArea(true)
                        .width(1100)
                        .height(350)
                        .transitionDuration(1000)
                        .margins({left: 90, top: 10, right: 10, bottom: 30})
                        .dimension(monthDim1)

                        .x(d3.time.scale().domain([end6, end5]))
                        .round(d3.time.month.round)
                        .xUnits(d3.time.months)


                        .elasticY(true)

                        .renderHorizontalGridLines(true)

                        .rangeChart(overall_chart)




                        .brushOn(false)
                        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
                        // legend.
                        // The `.valueAccessor` will be used for the base layer
                        .group(monthSum1)

                        .valueAccessor(function (d) {
                            return d.value;
                        });







                    overall_chart
                        .width(1100)
                        .height(80)
                        .centerBar(true)
                        .gap(1)
                        .x(d3.time.scale().domain([timeFormat.parse('1992-01'), timeFormat.parse('2016-12')]))




                        .round(d3.time.month.round)
                        .alwaysUseRounding(true)
                        .xUnits(d3.time.months)



                        .dimension(monthDim1)
                        .group(monthSum1)
                        .on("renderlet", function(chart) {
                            // mix of dc API and d3 manipulation
                            chart.select('g.y').style('display', 'none');
                            // its a closure so you can also access other chart variable available in the closure scope

                        })


                        .margins({left: 90, top: 10, right: 10, bottom: 30});
                    overall_chart.yAxis().ticks(0);




                    var colorScale1 = d3.scale.ordinal().range(["#44C8F5"]);

                    instr_chart
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
                    instr_chart.yAxis().ticks(7);

                    var allDollars = ndx.groupAll().reduceSum(function(d) { return d.Open_Interest; });



                    exch_chart
                        .width(350)
                        .height(350)
                        .dimension(exchangeDim)
                        .minAngleForLabel(.25)
                        .externalRadiusPadding(80)
                        .externalLabels(40)
                        .group(exchSum)
                        .innerRadius(40)
                        .drawPaths(false)
                        .controlsUseVisibility(true);

                    category_chart
                        .width(350)
                        .height(350)
                        .dimension(categoryDim)
                        .group(categorySum)
                        .innerRadius(40)
                        .minAngleForLabel(.35)
                        .externalRadiusPadding(80)
                        .externalLabels(40)
                        .drawPaths(false)
                        .controlsUseVisibility(true);

                    subcategory_chart
                        .width(350)
                        .height(350)
                        .dimension(subcategoryDim)
                        .group(subcategorysum)
                        .innerRadius(40)
                        .minAngleForLabel(.35)
                        .externalRadiusPadding(80)
                        .externalLabels(40)
                        .drawPaths(false)
                        .controlsUseVisibility(true);

                    var filtered_group = remove_empty_bins(repSum);

                    contracts_chart
                        .width(420)
                        .height(700)
                        .dimension(RepDim)
                        .group(filtered_group)
                        .elasticX(true)
                        .gap(5)
                        .ordering(function(d) { return -d.value })
                        .controlsUseVisibility(true)
                        .renderTitle(false)
                        .cap(20)
                        .othersGrouper(false)
                        .xAxis().ticks(4);









                    dc.renderAll();
                    var gs = $("#test svg g");
                    $(gs[0]).attr("transform", "translate(0,10)");
                    $(document).ready(function() {
                        d3.selectAll("g.row").call(tip);
                        d3.selectAll("g.row").on('mouseover', tip.show)
                            .on('mouseout', tip.hide);


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
            }
        });
    ndx = crossfilter(spendData);
    var regionDim  = ndx.dimension(function(d) {return d.Region;}),
        countries  = ndx.dimension(function(d) {return d.Country;}),
        monthDim = ndx.dimension(function(d) {return d.Report_Year_Month;}),
        monthDim1 = ndx.dimension(function(d) {return d.Report_Year_Month;}),
        nameDim  = ndx.dimension(function(d) {return d.Contract_Type;}),
        exchangeDim  = ndx.dimension(function(d) {return d.Exchange_Name;}),
        exchangeDim1  = ndx.dimension(function(d) {return d.Exchange_Name;}),
        exchangeDim2  = ndx.dimension(function(d) {return d.Exchange_Name;}),
        categoryDim  = ndx.dimension(function(d) {return d.Category_Name;}),
        subcategoryDim  = ndx.dimension(function(d) {return d.SubCategory_Name;}),
        categorySum = categoryDim.group().reduceSum(function(d) {return d.Volume;}),
        subcategorysum = subcategoryDim.group().reduceSum(function(d) {return d.Volume;}),
        countriesSum = countries.group().reduceSum(function(d) {return d.Volume;}),
        regionSum = regionDim.group().reduceSum(function(d) {return d.Volume;}),
        nameSum = nameDim.group().reduceSum(function(d) {return d.Volume;}),
        monthSum    = monthDim.group().reduceSum(function(d) {return d.Volume;}),
        monthSum1    = monthDim1.group().reduceSum(function(d) {return d.Volume;}),
        exchSum    = exchangeDim.group().reduceSum(function(d) {return d.Volume;}),
        exchSum1    = exchangeDim1.group().reduceSum(function(d) {return d.Volume;}),
        exchSum2    = exchangeDim2.group().reduceSum(function(d) {return d.Volume;}),
        allDim1 = ndx.dimension(function(d) {return d.Volume;}),
        newDim1  = ndx.dimension(function(d) {return d.Country;}),
        newgroup1    = newDim1.group().reduceSum(function(d) {return d.Volume;}),
        eventGroup = allDim1.group().reduceSum(function(d) {return d.Volume;}),
        RepDim  = ndx.dimension(function(d) {return d.Standardized_Contract;}),
        repSum = RepDim.group().reduceSum(function(d) {return d.Volume;}),
        allDim = ndx.dimension(function(d) {return d.Volume;});

    selectField2
        .dimension(categoryDim)
        .group(categorySum)
        .multiple(true);
    selectField2.title(function (d){
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

    selectField
        .dimension(newDim1)
        .group(newgroup1)
        .multiple(true);
    selectField.title(function (d){
        return d.key;
    })

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) { return "<span style='color: #f0027f'>" +  d.key + "</span> : "  + d.value; });

    // tooltips for pie chart
    var pieTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) { return "<span style='color: #f0027f'>" +  d.data.key + "</span> : "  + d.value; });
    d3.json("https://rawgit.com/ovik-chakraborty/Tutorial/master/countries1.geo.json", function (error, c) {
        country_chart.width(800)
            .height(400)
            .dimension(countries)
            .group(countriesSum)
            .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
            .colorDomain([0, 1000000])
            .colorCalculator(function (d) { return d ? country_chart.colors()(d) : '#ccc'; })
            .projection(projection)

            .overlayGeoJson(c.features, "state", function (d) {
                return d.properties.name;
            })
            .title(function (d) {
                return "Country: " + d.key + "\nVolume: " + d.value;
            });



        region_chart
            .width(350)
            .height(350)
            .dimension(regionDim)
            .group(regionSum)
            .innerRadius(40)
            .minAngleForLabel(.35)
            .externalRadiusPadding(80)
            .externalLabels(40)
            .drawPaths(false)
            .controlsUseVisibility(true);


        var xey1 = spendData.map(function(d) {
            return d.Report_Year_Month;
        });
        var end5 = d3.max(d3.values(xey1));
        end5.setDate(end5.getDate() + 1);
        var end6 = d3.min(d3.values(xey1));
        month_chart
            .renderArea(true)
            .width(1100)
            .height(350)
            .transitionDuration(1000)
            .margins({left: 90, top: 10, right: 10, bottom: 30})
            .dimension(monthDim1)

            .x(d3.time.scale().domain([end6, end5]))
            .round(d3.time.month.round)
            .xUnits(d3.time.months)


            .elasticY(true)

            .renderHorizontalGridLines(true)

            .rangeChart(overall_chart)




            .brushOn(false)
            // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
            // legend.
            // The `.valueAccessor` will be used for the base layer
            .group(monthSum1)

            .valueAccessor(function (d) {
                return d.value;
            });







        overall_chart
            .width(1100)
            .height(80)
            .centerBar(true)
            .gap(1)
            .x(d3.time.scale().domain([timeFormat.parse('1992-01'), timeFormat.parse('2016-12')]))
            .elasticX(true)
            .elasticY(true)


            .round(d3.time.month.round)
            .alwaysUseRounding(true)
            .xUnits(d3.time.months)



            .dimension(monthDim1)
            .group(monthSum1)
            .on("renderlet", function(chart) {
                // mix of dc API and d3 manipulation
                chart.select('g.y').style('display', 'none');
                // its a closure so you can also access other chart variable available in the closure scope

            })


            .margins({left: 90, top: 10, right: 10, bottom: 30});
        overall_chart.yAxis().ticks(0);


        d3.select('#YearTo')
            .on('click', function() {
                $(document).ready(function() {
                    overall_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
                    end1.setDate(end1.getDate() + 0);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setMonth(0);
                    CurrentDate.setDate(1);
                    overall_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#oneYear')
            .on('click', function() {
                $(document).ready(function() {
                    overall_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
//end1.setDate(end1.getDate() + 1);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setFullYear(CurrentDate.getFullYear() - 1);
                    CurrentDate.setDate(1);
                    overall_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#twoYear')
            .on('click', function() {
                $(document).ready(function() {
                    overall_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
//end1.setDate(end1.getDate() + 2);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setFullYear(CurrentDate.getFullYear() - 2);
                    CurrentDate.setDate(1);
                    overall_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#threeYear')
            .on('click', function() {
                $(document).ready(function() {
                    overall_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
//end1.setDate(end1.getDate() + 2);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setFullYear(CurrentDate.getFullYear() - 3);
                    CurrentDate.setDate(1);
                    overall_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#fiveYear')
            .on('click', function() {
                $(document).ready(function() {
                    overall_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
//end1.setDate(end1.getDate() + 2);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setFullYear(CurrentDate.getFullYear() - 5);
                    CurrentDate.setDate(1);
                    overall_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#tenYear')
            .on('click', function() {
                $(document).ready(function() {
                    overall_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
//end1.setDate(end1.getDate() + 2);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setFullYear(CurrentDate.getFullYear() - 10);
                    CurrentDate.setDate(1);
                    overall_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#All')
            .on('click', function() {
                $(document).ready(function() {
                    overall_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var endD = new Date(en);
                    endD.setDate(endD.getDate() + 30);
                    var CDate = d3.min(d3.values(xey));
//CDate.setDate(CDate.getDate() - 1);
                    var end_date = endD.getDate();
                    var end_month = endD.getMonth() + 1; //Months are zero based
                    var end_year = endD.getFullYear();
                    endD = end_year + "-" + end_month;
                    var curr_date = CDate.getDate();
                    var curr_month = CDate.getMonth() + 1; //Months are zero based
                    var curr_year = CDate.getFullYear();
                    CDate = curr_year + "-" + curr_month;
//monthDim1.filter([new Date((CDate)),new Date((endD))]);
                    overall_chart.filter(dc.filters.RangedFilter(new Date(CDate), new Date(endD)));

                    dc.redrawAll();
                });
            });
        d3.select('#perform')
            .on('click', function() {
                $(document).ready(function() {
                    overall_chart.filter(null);
                    var st = $("input[name='from']").val();
                    var end = $("input[name='to']").val();
                    if (st != undefined || end != undefined) {
                        var st2 = st.slice(0, 2) + '/01/' + st.slice(2);
                        var end2 = end.slice(0, 2) + '/01/' + end.slice(2);
                        overall_chart.filter(dc.filters.RangedFilter(new Date(st2), new Date(end2)));
                    }
                    dc.redrawAll();
                });
            });

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

        d3.select('#perform11')
            .on('click', function() {
                $(document).ready(function() {
                    selectField2.filter(null);
                    var checkedValues = $('#menu3select input:checkbox:checked').map(function() {
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

        instr_chart
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
        instr_chart.yAxis().ticks(7);

        var allDollars = ndx.groupAll().reduceSum(function(d) { return d.Volume; });


        exch_chart
            .width(350)
            .height(350)
            .dimension(exchangeDim)
            .minAngleForLabel(.25)
            .externalRadiusPadding(80)
            .externalLabels(40)
            .group(exchSum)
            .innerRadius(40)
            .drawPaths(false)
            .controlsUseVisibility(true);

        category_chart
            .width(350)
            .height(350)
            .dimension(categoryDim)
            .group(categorySum)
            .innerRadius(40)
            .minAngleForLabel(.35)
            .externalRadiusPadding(80)
            .externalLabels(40)
            .drawPaths(false)
            .controlsUseVisibility(true);

        subcategory_chart
            .width(350)
            .height(350)
            .dimension(subcategoryDim)
            .group(subcategorysum)
            .innerRadius(40)
            .minAngleForLabel(.35)
            .externalRadiusPadding(80)
            .externalLabels(40)
            .drawPaths(false)
            .controlsUseVisibility(true);

        var filtered_group = remove_empty_bins(repSum);

        contracts_chart
            .width(420)
            .height(700)
            .dimension(RepDim)
            .group(filtered_group)
            .elasticX(true)
            .gap(5)
            .ordering(function(d) { return -d.value })
            .controlsUseVisibility(true)
            .renderTitle(false)
            .cap(20)
            .othersGrouper(false)
            .xAxis().ticks(4);










        d3.select('#CSV')
            .on('click', function() {
                var data = nameDim.top(Infinity);



                var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
                saveAs(blob, 'data.csv');
            });


        dc.renderAll();
        var gs = $("#test svg g");
        $(gs[0]).attr("transform", "translate(0,10)");
        $(document).ready(function() {

            d3.selectAll("g.row").call(tip);
            d3.selectAll("g.row").on('mouseover', tip.show)
                .on('mouseout', tip.hide);


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
function genPDF1() {
    var svg_el = d3.select('svg').node();

    crowbar(svg_el, { // optional arguments
        filename: "awesome.png",
        width: 1000,
        height: 1000,
    });

}
function genPDF()
{

    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    var svg1 = document.body;
    var svg = document.getElementsByTagName('svg');
    var svg2 = d3.selectAll('svg').node();
    var serializer = new XMLSerializer();
//for (var i = 0; i < svg.length; i++) {
    var sv = svg[0].cloneNode(true);
    var sert = d3.select(sv).select('.line');
    sert.attr("stroke-width", 1)
        .attr("fill","none");
    var ret1= d3.select(sv).select('.axis.x').select('path')
    ret1.attr("fill","none").attr('stroke','black');
    var ret2= d3.select(sv).select('.axis.y').select('path')
    ret2.attr("fill","none").attr('stroke','black');
    var ret21= d3.select(sv).select('.axis.x').selectAll('line')
    ret21.attr("fill","none").attr('stroke','black');
    var ret22= d3.select(sv).select('.axis.y').selectAll('line')
    ret22.attr("fill","none").attr('stroke','black');
    var ret211= d3.select(sv).select('.axis.x').selectAll('text')
    ret211.attr("fill","none").attr('stroke','black').attr('stroke-width','1');
    var ret222= d3.select(sv).select('.axis.y').selectAll('text')
    ret222.attr("fill","none").attr('stroke','black').attr('stroke-width','1');

    var doctype = '<?xml version="1.0" standalone="yes"?>'+'<?xml-stylesheet type="text/css" href="https://rawgit.com/dc-js/dc.js/master/web/css/dc.css"?>';
    var source = serializer.serializeToString(sv);
    source = source.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    source = source.replace(/NS\d+:href/g, 'xlink:href');
    var blob = new Blob([doctype + source], { type: 'image/svg+xml' });
    var srte = 'data:image/svg+xml;base64,'+ btoa( doctype + source );
    var url = window.URL.createObjectURL(blob);
    var image = new Image;


    var pdf = new jsPDF('l');
    image.src = srte;
    image.onload = function () {
        setTimeout(function(){
            var canvas = document.createElement("canvas"),
                context = canvas.getContext("2d");
            canvas.width = 1100;
            canvas.height = 350;
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawSvg(doctype + source, 0,0, canvas.width, canvas.height);
            pdf.addImage(canvas, 0, 0);
            pdf.save("test.pdf");
            var a = document.createElement("a");
            a.download = "fallback1.png";
            a.href = canvas.toDataURL("image/png");
            a.click();
        },500);
    }
    image.onerror = function(){
        alert("Oops, bad stuff happened while loading this image.");
    };


//}

}
