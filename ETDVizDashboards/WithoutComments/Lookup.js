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
var month_chart  = dc.barChart("#month-chart"),
    volume_instr_chart = dc.pieChart("#volume-instr-chart");
var OI_instr_chart = dc.pieChart("#OI-instr-chart");
var volume_month_chart = dc.lineChart("#volume-month-chart");
var OI_month_chart = dc.lineChart("#OI-month-chart");
var OI_exchange_chart = dc.pieChart("#OI-exchange-chart");
var volume_exchange_chart = dc.pieChart("#volume-exchange-chart");
var selectField = dc.selectMenu('#menuselect');
var selectField1 = dc.selectMenu('#menu2select');
var arange = "";

var projection = d3.geo.mercator()
    .center([0, 49])
    .scale(117)
    .rotate([-12,0]);
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
});
d3.csv("https://rawgit.com/ovik-chakraborty/Tutorial/master/Updated_files_ETD/exchangelookup_ETD1.csv", function(error, spendData) {
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
    var arrays = d3.map(filteredData, function(d){return d.Category_Name;}).keys();
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
    $('#menu1select input[type="checkbox"]').on('change', function() {
        if($(this).val()!=="Select-All") {
            $('input[type="checkbox"]').not(this).prop('checked', false);
        }
    });
    d3.select('#render1')
        .on('click', function() {
            var tr = "x";
            $('span[id="'+tr+'"]').remove();
            $('input[type=checkbox]').each(function() { this.checked = false; });
            $('input[type="text"]').val('');
            dc.filterAll();
            dc.redrawAll();
        });

    ndx = crossfilter(spendData);
    var yearDim  = ndx.dimension(function(d) {return d.Region;}),
        monthDim = ndx.dimension(function(d) {return d.Report_Year_Month;}),
        monthDim1 = ndx.dimension(function(d) {return d.Report_Year_Month;}),
        nameDim  = ndx.dimension(function(d) {return d.Contract_Type;}),
        nameDim1  = ndx.dimension(function(d) {return d.Contract_Type;}),
        parentDim  = ndx.dimension(function(d) {return d.Parent_Name;}),
        categoryDim2  = ndx.dimension(function(d) {return d.Category_Name;}),
        exchangeDim  = ndx.dimension(function(d) {return d.Exchange_Name;}),
        exchangeDim1  = ndx.dimension(function(d) {return d.Exchange_Name;}),
        exchangeDim2  = ndx.dimension(function(d) {return d.Exchange_Name;}),
        categoryDim  = ndx.dimension(function(d) {return d.Category_Name;}),
        groupDim  = ndx.dimension(function(d) {return d.Group_Name;}),
        categoryDim1  = ndx.dimension(function(d) {return d.Category_Name;}),
        groupDim1  = ndx.dimension(function(d) {return d.Group_Name;}),
        categorySum = categoryDim.group().reduceSum(function(d) {return d.Volume;}),
        groupSum = groupDim.group().reduceSum(function(d) {return d.Volume;}),
        spendPerYear = yearDim.group().reduceSum(function(d) {return d.Volume;}),
        spendPerName = nameDim.group().reduceSum(function(d) {return d.Volume;}),
        spendPerName1 = nameDim1.group().reduceSum(function(d) {return d.Open_Interest;}),
        monthGroup    = monthDim.group().reduceSum(function(d) {return d.Volume;}),
        monthGroup1    = monthDim1.group().reduceSum(function(d) {if (d.Contract_Type=='Future') {return d.Volume;}else{return 0;}}),
        monthGroup3    = monthDim1.group().reduceSum(function(d) {if (d.Contract_Type=='Option') {return d.Volume;}else{return 0;}}),
        monthGroup2    = monthDim1.group().reduceSum(function(d) {if (d.Contract_Type=='Future') {return d.Open_Interest;}else{return 0;}}),
        monthGroup4    = monthDim1.group().reduceSum(function(d) {if (d.Contract_Type=='Option') {return d.Open_Interest;}else{return 0;}}),
        spendPart    = parentDim.group().reduceSum(function(d) {return d.Volume;}),
        categoryGroup2    = categoryDim2.group().reduceSum(function(d) {return d.Volume;}),
        spendExch    = exchangeDim.group().reduceSum(function(d) {return d.Volume;}),
        exchGroup1    = exchangeDim1.group().reduceSum(function(d) {return d.Volume;}),
        spendExch2    = exchangeDim2.group().reduceSum(function(d) {return d.Open_Interest;}),
        categorySum1 = categoryDim.group().reduceSum(function(d) {return d.Open_Interest;}),
        groupSum1 = groupDim.group().reduceSum(function(d) {return d.Open_Interest;}),
        allDim1 = ndx.dimension(function(d) {return d.Volume;}),
        eventGroup = allDim1.group().reduceSum(function(d) {return d.Volume;}),
        allDim = ndx.dimension(function(d) {return d.Volume;});

    selectField
        .dimension(categoryDim2)
        .group(categoryGroup2)
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
        .group(exchGroup1)
        .multiple(true);
    selectField1.title(function (d){
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


        volume_month_chart
            .renderArea(true)
            .width(1100)
            .height(300)
            .transitionDuration(1000)
            .yAxisLabel("Volume")
            .margins({left: 100, top: 10, right: 10, bottom: 30})
            .dimension(monthDim1)

            .x(d3.time.scale().domain([new Date(2000,01,01), new Date(2017,12,31)]))
            .round(d3.time.month.round)
            .xUnits(d3.time.months)


            .elasticY(true)

            .renderHorizontalGridLines(true)






            .brushOn(false)
            // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
            // legend.
            // The `.valueAccessor` will be used for the base layer
            .group(monthGroup1)
            .stack(monthGroup3)

            .valueAccessor(function (d) {
                return d.value;
            });

        OI_month_chart
            .renderArea(true)
            .width(1100)
            .height(300)
            .transitionDuration(1000)
            .yAxisLabel("Open Interest")
            .margins({left: 100, top: 10, right: 10, bottom: 30})
            .dimension(monthDim1)

            .x(d3.time.scale().domain([new Date(2000,01,01), new Date(2017,12,31)]))
            .round(d3.time.month.round)
            .xUnits(d3.time.months)


            .elasticY(true)

            .renderHorizontalGridLines(true)







            .brushOn(false)
            // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
            // legend.
            // The `.valueAccessor` will be used for the base layer
            .group(monthGroup2)
            .stack(monthGroup4)


            .valueAccessor(function (d) {
                return d.value;
            });


        month_chart
            .width(1100)
            .height(80)
            .centerBar(true)
            .gap(1)



            .x(d3.time.scale().domain([new Date(2000,01,01), new Date(2017,12,31)]))

            .round(d3.time.month.round)
            .alwaysUseRounding(true)
            .xUnits(d3.time.months)
            .on('renderlet', function(chart) {
                // smooth the rendering through event throttling
                chart.select('g.y').style('display', 'none');

            })


            .dimension(monthDim)
            .group(monthGroup)



            .margins({left: 100, top: 10, right: 10, bottom: 30});
        month_chart.yAxis().ticks(0);

        month_chart.focusCharts = function (chartlist) {
            if (!arguments.length) {
                return this._focusCharts;
            }
            this._focusCharts = chartlist; // only needed to support the getter above
            this.on('filtered', function (range_chart) {
                if (!range_chart.filter()) {
                    dc.events.trigger(function () {
                        chartlist.forEach(function(focus_chart) {
                            focus_chart.x().domain(focus_chart.xOriginalDomain());
                        });
                    });
                } else chartlist.forEach(function(focus_chart) {
                    if (!rangesEqual(range_chart.filter(), focus_chart.filter())) {
                        dc.events.trigger(function () {
                            focus_chart.focus(range_chart.filter());
                        });
                    }
                });
            });
            return this;
        };
        month_chart.focusCharts([volume_month_chart,OI_month_chart]);

        function rangesEqual(range1, range2) {
            if (!range1 && !range2) {
                return true;
            }
            else if (!range1 || !range2) {
                return false;
            }
            else if (range1.length === 0 && range2.length === 0) {
                return true;
            }
            else if (range1[0].valueOf() === range2[0].valueOf() &&
                range1[1].valueOf() === range2[1].valueOf()) {
                return true;
            }
            return false;
        }

        d3.select('#YearTo')
            .on('click', function() {
                $(document).ready(function() {
                    month_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
                    end1.setDate(end1.getDate() + 2);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setMonth(0);
                    CurrentDate.setDate(1);
                    month_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#oneYear')
            .on('click', function() {
                $(document).ready(function() {
                    month_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
                    end1.setDate(end1.getDate() + 2);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setFullYear(CurrentDate.getFullYear() - 1);
                    CurrentDate.setDate(CurrentDate.getDate() - 2);
                    month_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#twoYear')
            .on('click', function() {
                $(document).ready(function() {
                    month_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
                    end1.setDate(end1.getDate() + 2);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setFullYear(CurrentDate.getFullYear() - 2);
                    CurrentDate.setDate(CurrentDate.getDate() - 2);
                    month_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#threeYear')
            .on('click', function() {
                $(document).ready(function() {
                    month_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
                    end1.setDate(end1.getDate() + 2);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setFullYear(CurrentDate.getFullYear() - 3);
                    CurrentDate.setDate(CurrentDate.getDate() - 2);
                    month_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#fiveYear')
            .on('click', function() {
                $(document).ready(function() {
                    month_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
                    end1.setDate(end1.getDate() + 2);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setFullYear(CurrentDate.getFullYear() - 5);
                    CurrentDate.setDate(CurrentDate.getDate() - 2);
                    month_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#tenYear')
            .on('click', function() {
                $(document).ready(function() {
                    month_chart.filter(null);
                    var xey = spendData.map(function(d) {
                        return d.Report_Year_Month;
                    });
                    var en = d3.max(d3.values(xey));
                    var end1 = new Date(en);
                    end1.setDate(end1.getDate() + 2);
                    var CurrentDate = new Date(end1);
                    CurrentDate.setFullYear(CurrentDate.getFullYear() - 10);
                    CurrentDate.setDate(CurrentDate.getDate() - 2);
                    month_chart.filter(dc.filters.RangedFilter(new Date(CurrentDate), new Date(end1)));

                    dc.redrawAll();
                });
            });
        d3.select('#All')
            .on('click', function() {
                $(document).ready(function() {
                    month_chart.filter(null);
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
                    month_chart.filter(dc.filters.RangedFilter(new Date(CDate), new Date(endD)));

                    dc.redrawAll();
                });
            });
        d3.select('#perform')
            .on('click', function() {
                $(document).ready(function() {
                    month_chart.filter(null);
                    var st = $("input[name='from']").val();
                    var end = $("input[name='to']").val();
                    if (st == undefined || end == undefined) {
//month_chart.filter(dc.filters.RangedFilter(null, null));
                    }
                    var st2 = st.slice(0, 2) + '/01/' + st.slice(2);
                    var end2 = end.slice(0, 2) + '/01/' + end.slice(2);
                    st2 = new Date(st2);
                    end2 = new Date(end2);
                    var end_month = end2.getMonth() + 1; //Months are zero based
                    var end_year = end2.getFullYear();
                    end2 = end_year + "-" + end_month;

                    var curr_month = st2.getMonth() + 1; //Months are zero based
                    var curr_year = st2.getFullYear();
                    st2 = curr_year + "-" + curr_month;
//monthDim1.filter([new Date((st2)),new Date((end2))]);
                    month_chart.filter(dc.filters.RangedFilter(new Date(st2), new Date(end2)));
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
                    var title;
                    var tr = "x";
//arange = title;
                    if(checkedValues === undefined || checkedValues.length == 0 || checkedValues.includes("Select-All")) {
                        $('span[id="'+tr+'"]').remove();
                        var ret = $(".hida");
                        $('.dropdown9 dt a').append(ret);
                    } else {
                        title = checkedValues[0];
                        $('span[id="'+tr+'"]').remove();
                        var html = '<span id="'+tr+'" title="' + title + '">' + title + '</span>';
                        $('.multiSel3').append(html);
                        $(".hida").hide();
                    }
                    selectField1.filter([checkedValues]);
                    selectField1.redrawGroup();

                    dc.redrawAll();

                });
            });
        volume_instr_chart
            .width(350)
            .height(350)
            .dimension(groupDim)
            .minAngleForLabel(.25)
            .externalRadiusPadding(80)
            .externalLabels(40)
            .group(groupSum)
            .innerRadius(40)
            .drawPaths(false)
            .controlsUseVisibility(true);


        OI_instr_chart
            .width(350)
            .height(350)
            .dimension(categoryDim)
            .minAngleForLabel(.25)
            .externalRadiusPadding(80)
            .externalLabels(40)
            .group(categorySum)
            .innerRadius(40)
            .drawPaths(false)
            .controlsUseVisibility(true);



        OI_exchange_chart
            .width(350)
            .height(350)
            .dimension(groupDim1)
            .minAngleForLabel(.25)
            .externalRadiusPadding(80)
            .externalLabels(40)
            .group(groupSum1)
            .innerRadius(40)
            .drawPaths(false)
            .controlsUseVisibility(true);


        volume_exchange_chart
            .width(350)
            .height(350)
            .dimension(categoryDim1)
            .minAngleForLabel(.25)
            .externalRadiusPadding(80)
            .externalLabels(40)
            .group(categorySum1)
            .innerRadius(40)
            .drawPaths(false)
            .controlsUseVisibility(true);



        d3.select('#CSV')
            .on('click', function() {
                var data = nameDim.top(Infinity);



                var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
                saveAs(blob, 'data.csv');
            });


        d3.select('#CSV2')
            .on('click', function() {
                var data = nameDim.top(Infinity);



                var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
                saveAs(blob, 'data.xls');
            });







        dc.renderAll();


        $(document).ready(function() {




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
