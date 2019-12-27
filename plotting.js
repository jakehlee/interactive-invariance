// Experiment vars
var model = "resnet50"
var layer = "fc"
var dataset = "berry"
var anchor = "tl"
var min = 0.965
var max = 1.0
var rows = 125
var cols = 125

var csvroot = "data/csv/";
var imgroot = "data/images/";


// Plotting vars
var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Plot 1 Initialization

var svg1 = d3.select("#pytorchVis")
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Plot 2 Initialization

var svg2 = d3.select("#pytorchAAVis")
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Color Initialization

var myColor1 = d3.scaleSequential()
    .domain([1.0, min])
    .interpolator(d3.interpolateYlOrRd);

var myColor2 = d3.scaleSequential()
    .domain([1.0, min])
    .interpolator(d3.interpolateYlOrRd);

// Plot 1 x-axis

var x1 = d3.scaleLinear()
    .range([ 0, width ])
    .domain([0, cols]);

var x1_axis = d3.axisBottom()
    .scale(x1);

svg1.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x")
    .call(x1_axis);

// Plot 1 y-axis

var y1 = d3.scaleLinear()
    .range([ height, 0 ])
    .domain([rows, 0]);

var y1_axis = d3.axisLeft()
    .scale(y1);

svg1.append("g")
    .attr("class", "y")
    .call(y1_axis);

// Plot 2 x-axis

var x2 = d3.scaleLinear()
    .range([ 0, width ])
    .domain([0, cols]);

var x2_axis = d3.axisBottom()
    .scale(x2);

svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x")
    .call(x2_axis);

// Plot 2 y-axis

var y2 = d3.scaleLinear()
    .range([ height, 0 ])
    .domain([rows, 0]);

var y2_axis = d3.axisLeft()
    .scale(y2);

svg2.append("g")
    .attr("class", "y")
    .call(y2_axis);

function updateAxes() {
    x1.domain([0, cols]);
    y1.domain([rows, 0]);
    x2.domain([0, cols]);
    y2.domain([rows, 0]);

    svg1.select(".x")
        .transition()
            .call(x1_axis);
    svg1.select(".y")
        .transition()
            .call(y1_axis);
    svg2.select(".x")
        .transition()
            .call(x2_axis);
    svg2.select(".y")
        .transition()
            .call(y2_axis);
}

function updateColorRange1(range_min) {
    myColor1 = d3.scaleSequential()
        .domain([1.0, range_min])
        .interpolator(d3.interpolateYlOrRd);
}

function updateColorRange2(range_min) {
    myColor2 = d3.scaleSequential()
        .domain([1.0, range_min])
        .interpolator(d3.interpolateYlOrRd);
}

function updatePlot1() {
    var path1 = csvroot+model+"-"+layer+"-"+dataset+"-"+anchor+"-d3.csv";
    d3.csv(path1).then(function(data) {
        var mouseover = function(d) {
            document.getElementById("cos").innerHTML = d.val;
            if (dataset == "berry") {
                // Patch shifting
                var hi = document.getElementById("hoverImage")
                var pi = document.getElementById("patchImage")
                hi.src = imgroot + "blank.png";
                cw = hi.clientWidth;
                ch = hi.clientHeight;
                pi.src = imgroot + "berry_transparent.png";
                pi.style.top = (cw / 224.0) * d.y + "px";
                pi.style.left = (ch / 224.0) * d.x + "px";
                pi.style.maxHeight = (100.0 / 224.0) * ch + "px";
                pi.style.maxWidth = (100.0 / 224.0) * cw + "px";
            }
            if (dataset == "plane") {
                // Cropping
                var hi = document.getElementById("hoverImage")
                var pi = document.getElementById("patchImage")
                hi.src = imgroot + "blank.png";
                cw = hi.clientWidth;
                ch = hi.clientHeight;
                pi.src = imgroot + "plane.png";
                pi.style.top = -(cw / 224.0) * d.y + "px";
                pi.style.left = -(ch / 224.0) * d.x + "px";
                pi.style.maxHeight = (356.0 / 224.0) * ch + "px";
                pi.style.maxWidth = (356.0 / 224.0) * cw + "px";
            }
        }

        var u = svg1.selectAll("rect")
            .data(data, function(d) {return d.x+":"+d.y;});
        u.exit().remove();
        u.enter()
            .append("rect")
            .attr("x", function(d) {return x1(d.x)})
            .attr("y", function(d) {return y1(d.y)})
            .attr("width", width / cols)
            .attr("height", height / rows)
            .style("fill", function(d) {return myColor1(d.val)})
            .on("mouseover", mouseover);
        u.transition().duration(500)
            .style("fill", function(d) {return myColor1(d.val)});
    });
}


function updatePlot2() {
    var path2 = csvroot+model+"AA-"+layer+"-"+dataset+"-"+anchor+"-d3.csv";
    d3.csv(path2).then(function(data) {
        var mouseover = function(d) {
            document.getElementById("cos").innerHTML = d.val;
            if (dataset == "berry") {
                // Patch shifting
                var hi = document.getElementById("hoverImage")
                var pi = document.getElementById("patchImage")
                hi.src = imgroot + "blank.png";
                cw = hi.clientWidth;
                ch = hi.clientHeight;
                pi.src = imgroot + "berry_transparent.png";
                pi.style.top = (cw / 224.0) * d.y + "px";
                pi.style.left = (ch / 224.0) * d.x + "px";
                pi.style.maxHeight = (100.0 / 224.0) * ch + "px";
                pi.style.maxWidth = (100.0 / 224.0) * cw + "px";
            }
            if (dataset == "plane") {
                // Cropping
                var hi = document.getElementById("hoverImage")
                var pi = document.getElementById("patchImage")
                hi.src = imgroot + "blank.png";
                cw = hi.clientWidth;
                ch = hi.clientHeight;
                pi.src = imgroot + "plane.png";
                pi.style.top = -(cw / 224.0) * d.y + "px";
                pi.style.left = -(ch / 224.0) * d.x + "px";
                pi.style.maxHeight = (356.0 / 224.0) * ch + "px";
                pi.style.maxWidth = (356.0 / 224.0) * cw + "px";
            }
        }

        var u = svg2.selectAll("rect")
            .data(data, function(d) {return d.x+":"+d.y;});
        u.exit().remove();
        u.enter()
            .append("rect")
            .attr("x", function(d) {return x2(d.x)})
            .attr("y", function(d) {return y2(d.y)})
            .attr("width", width / cols)
            .attr("height", height / rows)
            .style("fill", function(d) {return myColor2(d.val)})
            .on("mouseover", mouseover);
        u.transition().duration(500)
            .style("fill", function(d) {return myColor2(d.val)});
        
    });
}

// UI hooks
window.onload = function() {
    // progbar
    function setProg(perc) {
        document.getElementById("globalProg").style.width = perc + "%";
    }

    // initial default draw
    updatePlot1();
    updatePlot2();
    
    // colorbar range input
    document.getElementById("plot1range").value = 93;
    document.getElementById("plot2range").value = 93;

    document.getElementById("plot1range").oninput = function() {
        var minval = (this.value * 0.01) / 2 + 0.5;
        document.getElementById("min1").innerHTML = minval.toFixed(3);
    }
    document.getElementById("plot1range").onmouseup = function() {
        var minval = (this.value * 0.01) / 2 + 0.5;
        updateColorRange1(minval);
        updatePlot1();
    }
    document.getElementById("plot2range").oninput = function() {
        var minval = (this.value * 0.01) / 2 + 0.5;
        document.getElementById("min2").innerHTML = minval.toFixed(3);
    }
    document.getElementById("plot2range").onmouseup = function() {
        var minval = (this.value * 0.01) / 2 + 0.5;
        updateColorRange2(minval);
        updatePlot2();
    }

    // model dropdown
    document.getElementById("selectModel").onchange = function() {
        model = this.value;
        updatePlot1();
        updatePlot2();
    }
    // layer dropdown
    document.getElementById("selectLayer").onchange = function() {
        if(this.value == "class") {
            anchor = "br";
            document.getElementById("selectAnchor").disabled = true;
            document.getElementById("anchorImage").src = imgroot+"blank.png";
            document.getElementById("metric").innerHTML = "class probability = "
            
        } else {
            anchor = document.getElementById("selectAnchor").value;
            document.getElementById("selectAnchor").disabled = false;
            document.getElementById("anchorImage").src = imgroot+dataset+"/"+anchor+".png";
            document.getElementById("metric").innerHTML = "cosine similarity = "
            
        }
        layer = this.value;
        updatePlot1();
        updatePlot2();
    }

    // dataset dropdown
    document.getElementById("selectData").onchange = function() {
        dataset = this.value;

        if(layer != "class") {
            document.getElementById("anchorImage").src = imgroot+dataset+"/"+anchor+".png";
        }

        var dataPromise = new Promise(function(resolve, reject) {
            var csvroot = "data/csv/";
            var path = csvroot+model+"-"+layer+"-"+dataset+"-"+anchor+"-d3.csv";
            d3.csv(path).then(function(data) {
                rows = d3.max(data, function(d) {return +d.y}) + 1;
                cols = d3.max(data, function(d) {return +d.x}) + 1;
                resolve(0);
            });
            
        });

        dataPromise.then(function(result) {
            updateAxes();
            updatePlot1();
            updatePlot2();
        });
        
    }

    // anchor dropdown
    document.getElementById("selectAnchor").onchange = function() {
        anchor = this.value;

        document.getElementById("anchorImage").src = imgroot+dataset+"/"+anchor+".png";
        updatePlot1();
        updatePlot2();
    }
}


