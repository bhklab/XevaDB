import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';

class TumorGrowthCurve extends React.Component {

    constructor(props) {
        super(props)
        //setting states for the data.
        this.state = {
            data : []
        }
        //binding the functions declared.
        this.TumorGrowthCurve = this.TumorGrowthCurve.bind(this);
        this.getParams = this.getParams.bind(this)
        this.norm = this.norm.bind(this)
        this.dataParse = this.dataParse.bind(this)
        this.makeTumorGrowthCurve = this.makeTumorGrowthCurve.bind(this)
    }

    //get the parameters and set the values in the variables.
    getParams() {
        const params = new URLSearchParams(this.props.location.search)
        let patient_param = params.get('patient');
        let drugid_param = params.get('drug_id');

        return {patient_param: patient_param, drugid_param: drugid_param}
    }

    // unity normalization
    norm(value, first) {
        return (value/first) - 1 
    }

    // filters by batch - comment out the batch lines for full data
    // call this command to create a curve!!!
    dataParse(data) {
        let data_formatted = []
        let batch_select = data[1]["patient_id"]
        let batches = []

        String.prototype.replaceAll = String.prototype.replaceAll || function(s, r) {
            return this.replace(new RegExp(s, 'g'), r);
        };        

        // loop throuth the data and set the values in the variable.
        for (let i = 0; i < data.length; i++) {
            batches.push(data[i]["patient_id"])
            if (data[i]["patient_id"] === batch_select) {
                let exp_type = ""
                //this is used to set the value of exp_type to control or treatment.
                if(data[i]["drug"] === "untreated") { exp_type = "control" } 
                else { exp_type = "treatment" }

                if (data[i]["time"] === 0) {
                    var new_datapt = {
                        exp_type: exp_type,
                        batch: data[i]["patient_id"],
                        model: data[i]["model_id"],
                        drug: data[i]["drug"],
                        pdx_points: [{
                            times: [parseInt(data[i]["time"])],
                            volumes: [parseInt(data[i]["volume"])]
                        }],
                        pdx_json: [{
                            model: data[i]["model_id"].replace(/\./g,' ').replaceAll(" ", "-"),
                            batch: data[i]["patient_id"],
                            exp_type: exp_type,
                            time: parseInt(data[i]["time"]),
                            volume: parseInt(data[i]["volume"])
                        }]
                        
                    }
                    data_formatted.push(new_datapt)
                } else {
                    if (data[i]["time"] <= 170) {
                        data_formatted[data_formatted.length - 1].pdx_points[0].times.push(parseInt(data[i]["time"]))
                        data_formatted[data_formatted.length - 1].pdx_points[0].volumes.push(parseInt(data[i]["volume"]))
                        data_formatted[data_formatted.length - 1].pdx_json.push(
                            {
                                model: data[i]["model_id"],
                                batch: data[i]["patient_id"],
                                exp_type: exp_type,
                                time: parseInt(data[i]["time"]),
                                volume: parseInt(data[i]["volume"])
                            }
                        )
                    }
                }
            }
        }

        //normalizing
        for (var i = 0; i < data_formatted.length; i++) {
            var item = data_formatted[i]
            var first = item.pdx_points[0].volumes[0]
            for (var j = 0; j < item.pdx_points[0].volumes.length; j++) {
                data_formatted[i].pdx_points[0].volumes[j] = this.norm(item.pdx_points[0].volumes[j], first)
                data_formatted[i].pdx_json[j].volume = item.pdx_points[0].volumes[j]
            }
        }
        this.setState({ data: data_formatted })
    }

    // toggle if batches present
    //currently no batch in the data, so took patient id as the batch.
    batchToggle(plotId, batches) {
        var select = d3.select('#' + plotId)
                        .append('select')
                        .attr('class','select')
                        .on('change',onchange)
                
     
                  select.selectAll('option')
                        .data(batches).enter()
                        .append('option')
                        .text(function (d) { return d; });
                    
        function onchange() {
            d3.select('select').property('value')
            select("#pdxplot").remove()
        };
    }

    componentDidMount() {
        let patient_param = this.getParams().drugid_param
        let drugid_param = this.getParams().patient_param
        axios.get(`http://localhost:5000/api/v1/treatment?drug=${patient_param}&patient=${drugid_param}`)
             .then(response => {
                this.batchToggle("plot", patient_param);
                this.dataParse(response.data);
             })
       //this.TumorGrowthCurve()
    }

    componentDidUpdate() {
        this.TumorGrowthCurve()
    }

    // Grab the states, node access and pass it to the main function.
    TumorGrowthCurve() {
        const node = this.node;
        let plotId = "plot"
        this.makeTumorGrowthCurve(this.state.data, plotId, node)
    }

    // This is the main function to create Growth curves.

    makeTumorGrowthCurve(data, plotId, node) {
        this.node = node
        tumorCurve(data, plotId, node)

        function tumorCurve(data, plotId, node) {
            console.log(data)
            console.log(plotId)

            //calculating max time, min/max volumes of all data
            var maxTimeArray = [];
            var minVolArray = [];
            var maxVolArray = [];
            for (var i = 0; i < data.length; i++) {
                maxTimeArray.push(d3.max(data[i].pdx_points[0].times));
                minVolArray.push(d3.min(data[i].pdx_points[0].volumes));
                maxVolArray.push(d3.max(data[i].pdx_points[0].volumes));
            }

            var maxTime = Math.max.apply(null, maxTimeArray);
            var minVolume = Math.min.apply(null, minVolArray);
            var maxVolume = Math.max.apply(null, maxVolArray);

            var exp_types = ["control", "treatment"]

            // positioning variables
            var width = 600;
            var height = 500;
            var margin = {
                top:200,
                right:250,
                bottom:150,
                left:200
            }
            // make the svg element
            var svg = d3.select(node)
                        .append("svg")
                        .attr("id", "pdx" + plotId)
                        .attr("xmlns", "http://www.w3.org/2000/svg")
                        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink") // for downloading
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

            // plot title
                            svg.append("text")
                                .attr("text-anchor", "middle")
                                .attr("id", "pdxTitle")
                                .style("font-size", "20px")
                                .attr("transform", "translate("+ (width/2) +","+ -20 +")")
                                .style("fill","black")
                                .text()

            // legend
            var legend = svg.selectAll(".legend")
                            .data(exp_types)
                            .enter()

            legend.append("circle")
                    .attr("id", function(d,i) {
                        return "legend-dot-" + exp_types[i]
                    })
                    .attr("class", ".legend")
                    .attr("r", 4)
                    .attr("fill",function(d,i) {
                        if (exp_types[i] == "control") {
                            return "#3b9dd6"; 
                        } else {
                            return "#e0913c";
                        }
                    })
                    .attr("cx", width + 30)
                    .attr("cy", function(d,i) {return height/2 - 50 + (i*50);})

            legend.append("text")
                    .attr("id", function(d,i) {
                        return "legend-text-" + exp_types[i]
                    })
                    .attr("class", ".legend")
                    .attr("fill","black")
                    .attr("dx", width + 40)
                    .attr("dy", function(d,i) {return height/2 - 46 + (i*50);})
                    .text(function(d,i) {return exp_types[i]})


            // set domain and range scaling
            var xrange = d3.scaleLinear()
                            .domain([0, maxTime]) 
                            .range([0, width])
                            .nice();

            var yrange = d3.scaleLinear()
                            .domain([minVolume, maxVolume])
                            .range([height, 0])
                            .nice();

            //set axes for graph
            var xAxis = d3.axisBottom()
                            .scale(xrange)
                            .tickPadding(2);

            var yAxis = d3.axisLeft()
                            .scale(yrange)
                            .tickPadding(2);

            // Add the X Axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + yrange(0) + ")")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .call(xAxis);

            // X axis label
            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("fill","black")
                .attr("transform", "translate("+ (width/2) +","+(height+40)+")")
                .text("Time (days)");

            // Add the Y Axis
            var yAxisAdd = svg.append("g")
                .attr("class", "y axis")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .call(yAxis);

            // Y axis label
            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("fill","black")
                .attr("transform", "translate(" + -60 +","+(height/2)+")rotate(-90)")
                .text("Volume (mm³)");

            // remove strokes for all ticks
            svg.selectAll(".tick").select("text").attr("fill", "black").attr("stroke", "none")

        }
    }

    render() {
        return (
            <svg ref = {node => this.node = node} width={1500} height={1200}>
            </svg>
        )
    }
}

export default TumorGrowthCurve;