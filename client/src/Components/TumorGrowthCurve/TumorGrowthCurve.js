import React, {Fragment} from 'react'
import * as d3 from 'd3'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { WSASERVICE_NOT_FOUND } from 'constants';

class TumorGrowthCurve extends React.Component {

    constructor(props) {
        super(props)
        //setting states for the data.
        this.state = {
            data : []
        }
        //binding the functions declared.
        this.getParams = this.getParams.bind(this)
        this.norm = this.norm.bind(this)
        this.dataParse = this.dataParse.bind(this)
        this.makeTumorGrowthCurve = this.makeTumorGrowthCurve.bind(this)
        this.batchToggle = this.batchToggle.bind(this)
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
    dataParse(data, batch_select) {
        let data_formatted = []
        let batches = []
        String.prototype.replaceAll = String.prototype.replaceAll || function(s, r) {
            return this.replace(new RegExp(s, 'g'), r);
        };        

        // loop throuth the data and set the values in the variable.
        for (let i = 0; i < data.length; i++) {
            batches.push(data[i]['batch'])
            if (data[i]['batch'] === batch_select) {
                // let exp_type = ''
                // //this is used to set the value of exp_type to control or treatment.
                // if(data[i]['drug'] === 'untreated') { exp_type = 'control' } 
                // else { exp_type = 'treatment' }

                if (data[i]['time'] === 0) {
                    var new_datapt = {
                        exp_type: data[i]["type"],
                        batch: data[i]['patient_id'],
                        model: data[i]['model_id'],
                        drug: data[i]['drug'],
                        pdx_points: [{
                            times: [parseInt(data[i]['time'])],
                            volumes: [parseFloat(data[i]['volume'])],
                            volume_normals: [parseFloat(data[i]['volume_normal'])]
                        }],
                        pdx_json: [{
                            model: data[i]['model_id'].replace(/\./g,' ').replaceAll(' ', '-'),
                            batch: data[i]['patient_id'],
                            exp_type: data[i]["type"],
                            time: parseInt(data[i]['time']),
                            volume: parseFloat(data[i]['volume']),
                            volume_normal: parseFloat(data[i]['volume_normal'])
                        }]
                        
                    }
                    data_formatted.push(new_datapt)
                } else {
                    if (data[i]['time'] <= 200) {
                        data_formatted[data_formatted.length - 1].pdx_points[0].times.push(parseInt(data[i]['time']))
                        data_formatted[data_formatted.length - 1].pdx_points[0].volumes.push(parseFloat(data[i]['volume']))
                        data_formatted[data_formatted.length - 1].pdx_points[0].volume_normals.push(parseFloat(data[i]['volume_normal']))
                        data_formatted[data_formatted.length - 1].pdx_json.push(
                            {
                                model: data[i]['model_id'],
                                batch: data[i]['patient_id'],
                                exp_type: data[i]["type"],
                                time: parseInt(data[i]['time']),
                                volume: parseFloat(data[i]['volume']),
                                volume_normal: parseFloat(data[i]['volume_normal'])
                            }
                        )
                    }
                }
            }
        }

        //normalizing
        // for (var i = 0; i < data_formatted.length; i++) {
        //     var item = data_formatted[i]
        //     var first = item.pdx_points[0].volumes[0]
        //     for (var j = 0; j < item.pdx_points[0].volumes.length; j++) {
        //         data_formatted[i].pdx_points[0].volumes[j] = this.norm(item.pdx_points[0].volumes[j], first)
        //         data_formatted[i].pdx_json[j].volume = item.pdx_points[0].volumes[j]
        //     }
        // }
        console.log(data_formatted)
        this.setState({ data: data_formatted })
    }

    // toggle if batches present
    // currently no batch in the data, so took patient id as the batch.
    batchToggle(plotId, batches) {
        var select = d3.select('#pdx' + plotId) // TODO: PLOT ID
                        .append('select')
                        .attr('class','select')
                        .on('change',onchange)
                
     
        select.selectAll('option')
                .data(batches).enter()
                .append('option')
                .text(function (d) { return d; });
                    
        function onchange() {
            d3.select('select').property('value')
            select('#pdxplot').remove()
        };
    } 


    componentDidMount() {
        let drugid_param = this.getParams().drugid_param
        let patient_param = this.getParams().patient_param
        axios.get(`http://localhost:5000/api/v1/treatment?drug=${drugid_param}&patient=${patient_param}`)
             .then(response => {
                function unique(value, index, self) { 
                    return self.indexOf(value) === index;
                }
                let batches = []
                for (let i = 0; i < response.data.length; i++) {
                    batches.push(response.data[i]["batch"])
                    
                }
                this.batchToggle("plot", batches.filter(unique))
                this.dataParse(response.data, batches[0]);
             })
    }

    componentDidUpdate() {
        const node = this.node;
        let plotId = 'plot'
        if (this.state.data.length != 0) {
            this.makeTumorGrowthCurve(this.state.data, plotId, node)
            d3.select(".no-graph").remove()
        } else {
            d3.select("svg").remove()
        }
        
    }

    // This is the main function to create Growth curves.

    makeTumorGrowthCurve(data, plotId, node) {
        this.node = node
        tumorCurve(data, plotId, node)

        String.prototype.replaceAll = String.prototype.replaceAll || function(s, r) {
            return this.replace(new RegExp(s, 'g'), r);
        };

        // unique function
        // usage: var a = [1,2,3,4]; unique = a.filter(unique);
        function unique(value, index, self) { 
            return self.indexOf(value) === index;
        }

        // get the union set of all timepoints for the means
        // until the last timepoint of the shortest graph
        // returns [ [control] , [treatment] ]
        function getUnionOfTimepoints(data) {
            var control = []
            var treatment = []
            // var c_ind = data[0].exp_type == "control" ? 0 : 1
            // var t_ind = data[0].exp_type == "treatment" ? 0 : 1
            let minControl, minTreatment;
            for (var i = 0; i < data.length; i++) {
                if (data[i].exp_type === "control") {
                    minControl = data[i].pdx_points[0].times[data[i].pdx_points[0].times.length - 1]; 
                    break;
                }
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].exp_type === "treatment") {
                    minTreatment = data[i].pdx_points[0].times[data[i].pdx_points[0].times.length - 1]; 
                    break;
                }
            }
             

            // merging time point arrays, and then unique
            for (var i = 0; i < data.length; i++) {
                var temp = data[i].pdx_points[0].times;
                if (data[i].exp_type === 'control') {
                    control = control.concat(temp)
                    minControl = temp[temp.length - 1] < minControl ? temp[temp.length - 1] : minControl
                } else {
                    treatment = treatment.concat(data[i].pdx_points[0].times)
                    minTreatment = temp[temp.length - 1] < minTreatment ? temp[temp.length - 1] : minTreatment
                }
            }
            // unique, sort, and cut off at the last timepoint of shortest graph
            control = control.filter(unique).sort(function (a, b) {  return a - b;  });
            var index = control.indexOf(minControl)
            control = control.slice(0, index + 1)

            treatment = treatment.filter(unique).sort(function (a, b) {  return a - b;  });
            index = treatment.indexOf(minTreatment)
            treatment = treatment.slice(0, index + 1)

            return [control, treatment]
          
            
             
        }


        function tumorCurve(data, plotId, node) {
            // let drug = data[0]['drug']

            //calculating max time, min/max volumes of all data
            var maxTimeArray = [];
            var minVolArray = [];
            var maxVolArray = [];
            var maxVolNormArray = [];
            for (var i = 0; i < data.length; i++) {
                maxTimeArray.push(d3.max(data[i].pdx_points[0].times));
                minVolArray.push(d3.min(data[i].pdx_points[0].volumes));
                maxVolArray.push(d3.max(data[i].pdx_points[0].volumes));
                maxVolNormArray.push(d3.max(data[i].pdx_points[0].volume_normals));
            }

            var maxTime = Math.max.apply(null, maxTimeArray);
            var minVolume = Math.min.apply(null, minVolArray);
            var maxVolume = Math.max.apply(null, maxVolArray);
            var maxVolNorm = Math.max.apply(null, maxVolNormArray);

            var exp_types = ['control', 'treatment']

            // positioning variables
            var width = 970;
            var height = 500;
            var margin = {
                top:50,
                right:260,
                bottom:200,
                left:130
            }
            // make the svg element
            var svg = d3.select(node)
                        .append('svg')
                        .attr('id', 'pdx' + plotId)
                        .attr('xmlns', 'http://www.w3.org/2000/svg')
                        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink') // for downloading
                        .attr('width', width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom)
                        .append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

            // legend
            var legend = svg.selectAll('.legend')
                            .data(exp_types)
                            .enter()

            legend.append('circle')
                    .attr('id', function(d,i) {
                        return 'legend-dot-' + exp_types[i]
                    })
                    .attr('class', 'legend')
                    .attr('r', 5)
                    .attr('fill',function(d,i) {
                        if (exp_types[i] === 'control') {
                            return '#cd5686';
                        } else {
                            return '#5974c4';
                        }
                    })
                    .attr('cx', width + 30)
                    .attr('cy', function(d,i) {return height/2 - 50 + (i*50);})

            legend.append('text')
                    .attr('id', function(d,i) {
                        return 'legend-text-' + exp_types[i]
                    })
                    .attr('class', 'legend')
                    .attr('fill','black')
                    .style('font-size', '16px')
                    .attr('x', width+40)
                    .attr('y', function(d,i) {return height/2 - 45 + (i*50);})
                    .text(function(d,i) {return exp_types[i]})


            // set domain and range scaling
            var xrange = d3.scaleLinear()
                            .domain([0, maxTime]) 
                            .range([0, width])
                            .nice();

            var yrange = d3.scaleLinear()
                            .domain([0, maxVolume])
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
            var xAxisAdd = svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + yrange(0) + ')')
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .call(xAxis);

            // X axis label
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('fill','black')
                .attr('transform', 'translate('+ (width/2) +','+(height+40)+')')
                .text('Time (days)');

            // Add the Y Axis
            var yAxisAdd = svg.append('g')
                .attr('class', 'y axis')
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .call(yAxis);

            // Y axis label
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('fill','black')
                .attr('transform', 'translate(' + -60 +','+(height/2)+')rotate(-90)')
                .text('Volume (mm³)');

            // remove strokes for all ticks
            svg.selectAll('.tick').select('text')
                    .attr('fill', 'black')
                    .attr('stroke', 'none')
                    .attr("font-size", "14px")
            
            let graph = svg.append("g")
                            .attr("id", "curves")
            // plot each model
            plotBatch(data, graph, xrange, yrange, width, height, false)
            volumeToggle(data, svg, xrange, yrange, yAxis, yAxisAdd, width, height, maxVolume, maxVolNorm, plotId)
        }

        function plotBatch(data, graph, xrange, yrange, width, height, norm) {
            //when using d.model, use d.model.replace(/\./g,' ').replaceAll(' ', '-')
            //to replace all the periods with dashes because dots interfere with classes
        
            var models = graph.selectAll('g.model')
                .data(data)
                .enter()
                    .append('g')
                        .attr('class', 'model')
        
            // plotting the dots
            var dots = models.selectAll('.model-dot')
                .data(function(d) {return d.pdx_json})
                .enter();
        
            var paths = graph.selectAll('.model-path')
                .data(function(d) {return data})
                .enter();
        
            // making tooltips
            // var tooltips = models.selectAll('.tooltip-dot')
            //     .data(function(d) {return d.pdx_json})
            //     .enter();
        
            //     // timepoint
            //     tooltips.append('text')
            //         .attr('id', function(d,i) { return 'tooltip-t-' + d.model.replace(/\./g,' ').replaceAll(' ', '-') + '-' + d.exp_type + i})
            //         .attr('class', 'tooltip-dot')
            //         .attr('dx', width+20)
            //         .attr('dy', height/2 + 30)
            //         .attr('font-size', '14px')
            //         .style('opacity', 0)
            //         .attr('fill', 'black')
            //         .html(function(d) {return 'Time: ' + d.time + ' days'})
                
            //     // volume
            //     tooltips.append('text')
            //         .attr('id', function(d,i) { return 'tooltip-v-' + d.model.replace(/\./g,' ').replaceAll(' ', '-') + '-' + d.exp_type + i})
            //         .attr('class', 'tooltip-dot')
            //         .attr('dx', width+20)
            //         .attr('dy', height/2 + 45)
            //         .attr('font-size', '14px')
            //         .style('opacity', 0)
            //         .attr('fill', 'black')
            //         .html(function(d) {
            //             if (norm) {
            //                 return 'Volume: ' + d3.format('.2f')(d.volume_normal) + ' mm³'
            //             } else {
            //                 return 'Volume: ' + d3.format('.2f')(d.volume) + ' mm³'
            //             }
                        
            //         })
                
            dots.append('circle')
                .attr('id', function(d,i) {
                    return 'dot-' + d.model.replace(/\./g,' ').replaceAll(' ', '-') + '-' + 
                            d.exp_type + i
                })
                .attr('class', function(d) {
                    return 'model-dot ' + 
                            d.model.replace(/\./g,' ').replaceAll(' ', '-') + ' ' + 
                            d.batch
                })
                .attr('r', 4)
                .attr('fill', function(d,i) {
                    if (d.exp_type === 'control') {
                        return '#cd5686';
                    } else {
                        return '#5974c4';
                    }
                })
                .style('opacity', 0.6)
                .attr('cx', function(d) {return xrange(d.time);})
                .attr('cy', function(d) {
                    if (norm) {
                        return yrange(d.volume_normal);
                    } else {
                        return yrange(d.volume);
                    }
                    
                })

        
            // line function, to join dots
            var linepath = d3.line()
                .x(function(d) {return xrange(d.time);})
                .y(function(d) {
                    if (norm) {
                        return yrange(d.volume_normal);
                    } else {
                        return yrange(d.volume);
                    }
                })
                
        
            // add line
            paths.append('path')
                .attr('id', function(d) { return 'path-' + d.model.replace(/\./g,' ').replaceAll(' ', '-')})
                .attr('class', function(d) { 
                    return 'model-path ' + d.exp_type + ' ' +
                            d.model.replace(/\./g,' ').replaceAll(' ', '-') + ' ' + 
                            d.batch
                })
                .attr('d', function(d) {return linepath(d.pdx_json)})
                .attr('fill', 'none')
                .style('opacity', 0.6)
                .attr('stroke', function (d) {
                    if (d.exp_type === 'control') {
                        return '#cd5686';
                    } else {
                        return '#5974c4';
                    }
                })
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', ('3', '3'))

            plotMeans(data, graph, xrange, yrange, width, height)
            // modelToggle(graph, width, height)
        }

        // plot the mean of each experiment type (control, treatment)
        function plotMeans(data, svg, xrange, yrange, width, height) {
            var timeUnion = getUnionOfTimepoints(data)
            let exp_types = []

            // if there is no control
            if (timeUnion[0].length === 0) {
                exp_types = ["treatment"]
                timeUnion.shift()
            } else if (timeUnion[1].length === 0) { //no treatment
                exp_types = ["control"]
                timeUnion.pop()
            } else {
                exp_types = ['control', 'treatment']
            }
             
            
            var ypoint_arr = [] // un-yranged
            var all_ypoint = [] // for std devs

            //TODO: fix the batch, it's the first one rn
            var batch = data[0].batch

            for (var n = 0; n < exp_types.length; n++) {
                var exp = exp_types[n]
                var times = timeUnion[n]
                var selection = d3.selectAll('.model-path.' + exp_types[n])._groups     
                // for each timepoint
                for (var i = 0; i < timeUnion[n].length; i++) {
                    var temp_ycoord = []
                    
                    // for each path, get ycoord for each timepoint in union
                    for (var j = 0; j < selection.length; j++) {
                        var path = selection[j][0]
                        var ycoord = findY(path, xrange(timeUnion[n][i])) 
                        temp_ycoord.push(yrange.invert(ycoord))
                    }

                    // append array to all_ypoint for std devs
                    all_ypoint.push(temp_ycoord)
                    // append mean to ypoint_arr
                    ypoint_arr.push(mean(temp_ycoord))
                }
                // plot error bars
                // plotErrorBars(data, exp, times, all_ypoint, ypoint_arr, svg, xrange, yrange)

                // mean svg
                var mean_svg = svg.append('g')
                    .attr('id', 'mean_' + exp_types[n])

                //tooltips
                var tooltips = svg.selectAll('.tooltip-mean-dot' + exp)
                    .data(ypoint_arr)
                    .enter();

                // timepoint
                tooltips.append('text')
                    .attr('id', function(d,i) { return 'tooltip-mean-t-' + batch + '-' + exp + i})
                    .attr('class', 'tooltip-mean-dot' + exp)
                    .attr('dx', width+20)
                    .attr('dy', height/2 + 30)
                    .attr('font-size', '14px')
                    .style('opacity', 0)
                    .attr('fill', 'black')
                    .html(function(d,i) {return 'Time: ' + times[i] + ' days'})

                // volume
                tooltips.append('text')
                    .attr('id', function(d,i) { return 'tooltip-mean-v-' + batch + '-' + exp + i})
                    .attr('class', 'tooltip-mean-dot')
                    .attr('dx', width+20)
                    .attr('dy', height/2 + 45)
                    .attr('font-size', '14px')
                    .style('opacity', 0)
                    .attr('fill', 'black')
                    .html(function(d,i) {return 'Volume: ' + d3.format('.2f')(ypoint_arr[i]) + ' mm³'})
                
                var mean_dots = mean_svg.selectAll('.mean-dot')
                    .data(ypoint_arr)
                    .enter()
                mean_dots.append('circle')
                    .attr('id', function(d,i) {
                        return 'mean-dot-' + exp_types[n] + '-' + batch
                    })
                    .attr('class', 'mean-dot ' + batch)
                    .attr('r', 4)
                    .attr('fill',function() {
                        if (exp_types[n] == 'control') {
                            return '#cd5686'; 
                        } else {
                            return '#5974c4';
                        }
                    })
                    .attr('cx', function(d,i) {return xrange(timeUnion[n][i]);})
                    .attr('cy', function(d,i) {return yrange(ypoint_arr[i]);})
                    .on({
                        'mouseover': function(d,i) {
                            d3.select('#tooltip-mean-t-' + batch + '-' + exp + i).transition().duration(300).style('opacity', 1);
                            d3.select('#tooltip-mean-v-' + batch + '-' + exp + i).transition().duration(300).style('opacity', 1);
                        },
                        'mouseout': function(d,i) {
                            d3.select('#tooltip-mean-t-' + batch + '-' + exp + i).transition().duration(300).style('opacity', 0);
                            d3.select('#tooltip-mean-v-' + batch + '-' + exp + i).transition().duration(300).style('opacity', 0);
                        },
                    })

                var mean_path = mean_svg.selectAll('.mean-path')
                    .data(ypoint_arr)
                    .enter();

                
                var linepath = d3.line()
                    .x(function(d,i) {return xrange(timeUnion[n][i]);})
                    .y(function(d,i) {return yrange(ypoint_arr[i]);})

                mean_path.append('path')
                    .attr('id', 'mean-path-' + exp_types[n] + '-' + batch)
                    .attr('class',  'mean-path ' + batch)
                    .attr('d', function(d) {return linepath(ypoint_arr)})
                    .attr('fill', 'none')
                    .style('opacity', 0.2)
                    .attr('stroke', function() {
                        if (exp_types[n] == 'control') {
                            return '#cd5686'; 
                        } else {
                            return '#5974c4';
                        }
                    })
                    .attr('stroke-width', 2)

                

                // reset y arrs
                all_ypoint = []
                ypoint_arr = []
            }       
        }

        //toggle to show each model
        function modelToggle(svg, width, height) {
            var nest = d3.nest()
                .key(function(d) {return d;})
                .entries([''])
            
            nest.forEach(function(d,i) {
                var modelToggle = svg.append('rect')
                .attr('x', width + 21)
                .attr('y', height/2 + 40)
                .attr('id', 'modelToggle')
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', 'black')
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .on('click', function () {
                    var active = d.active ? false : true ,
                    newOpacity = active ? 0 : 1,
                    newFill = active? 'white' : 'black';

                    // Hide or show the elements
                    d3.selectAll('.model-dot').style('opacity', newOpacity);
                    d3.selectAll('.model-path').style('opacity', newOpacity);
                    d3.select('#modelToggle').attr('fill', newFill)

                    // Update whether or not the elements are active
                    d.active = active;
                })
                .on({
                    'mouseover': function() {
                        d3.select(this).style('cursor', 'pointer');
                    },
                    'mouseout': function() {
                        d3.select(this).style('cursor', 'default');
                    }
                })

                var modelToggleText = svg.append('text')
                    .attr('dx', width + 35)
                    .attr('dy', height/2 + 50)
                    .attr('fill', 'black')
                    .text('Show all curves')
                    .on('click', function () {
                        var active = d.active ? false : true ,
                        newOpacity = active ? 0 : 1,
                        newFill = active? 'white' : 'black';
            
                        // Hide or show the elements
                        d3.selectAll('.model-dot').style('opacity', newOpacity);
                        d3.selectAll('.model-path').style('opacity', newOpacity);
                        d3.select('#modelToggle').attr('fill', newFill)
            
                        // Update whether or not the elements are active
                        d.active = active;
                    })
                    .on({
                        'mouseover': function() {
                            d3.select(this).style('cursor', 'pointer');
                        },
                        'mouseout': function() {
                            d3.select(this).style('cursor', 'default');
                        }
                    })
            })
        } 


        function mean(arr) {
            var total = 0
            for (var i = 0; i < arr.length; i++) {
                total += arr[i]
            }
            return (total/arr.length)
        }

        // thank you stackoverflow user Wei
        // https://stackoverflow.com/questions/15578146/get-y-coordinate-of-point-along-svg-path-with-given-an-x-coordinate
        function findY(path, x) {
            var pathLength = path.getTotalLength()
            var start = 0
            var end = pathLength
            var target = (start + end) / 2
        
            // Ensure that x is within the range of the path
            x = Math.max(x, path.getPointAtLength(0).x)
            x = Math.min(x, path.getPointAtLength(pathLength).x)
        
            // Walk along the path using binary search 
            // to locate the point with the supplied x value
            while (target >= start && target <= pathLength) {
            var pos = path.getPointAtLength(target)
        
            // use a threshold instead of strict equality 
            // to handle javascript floating point precision
            if (Math.abs(pos.x - x) < 0.001) {
                return pos.y
            } else if (pos.x > x) {
                end = target
            } else {
                start = target
            }
            target = (start + end) / 2
            }
        }

        //takes in an array of arrays and an array of means,
        // and returns array of std devs
        function stdDev(values, means) {
            var stdDevs = []
            for (var i = 0; i < values.length; i++) {
            var temp = 0;
            for (var j = 0; j < values[i].length; j++) {
                temp += Math.pow(values[i][j] - means[i], 2);
            }
            stdDevs.push(Math.sqrt(temp)/values[i].length);
            }
            return stdDevs;
        }

        function plotErrorBars(data, exp, times, all_ypoint, ypoint_arr, svg, xrange, yrange) {
            var stdDevs = stdDev(all_ypoint, ypoint_arr)

            var errorBars = svg.append('g')
                .attr('id', 'errorBars')

            var errorMidBar = errorBars.selectAll('line.error')
                .data(stdDevs);

                errorMidBar.enter()
                    .append('line')
                    .attr('class', 'error')
                    .attr('stroke', function() {
                        if (exp === 'control') {
                            return '#3b9dd6'; 
                        } else {
                            return '#e0913c';
                        }
                    })
                    .attr('stroke-width', 2)
                    .attr('x1', function(d,i) { return xrange(times[i]); })
                    .attr('x2', function(d,i) { return xrange(times[i]); })
                    .attr('y1', function(d,i) { return yrange(ypoint_arr[i] + stdDevs[i]); })
                    .attr('y2', function(d,i) { return yrange(ypoint_arr[i] - stdDevs[i]); });

            var errorTopBar = errorBars.selectAll('line.errorTop')
                .data(stdDevs);

                errorTopBar.enter()
                    .append('line')
                    .attr('class', 'errorTop')
                    .attr('stroke', function() {
                        if (exp === 'control') {
                            return '#3b9dd6'; 
                        } else {
                            return '#e0913c';
                        }
                    })
                    .attr('stroke-width', 2)
                    .attr('x1', function(d,i) { return xrange(times[i]) - 3; })
                    .attr('x2', function(d,i) { return xrange(times[i]) + 3; })
                    .attr('y1', function(d,i) { return yrange(ypoint_arr[i] + stdDevs[i]);})
                    .attr('y2', function(d,i) { return yrange(ypoint_arr[i] + stdDevs[i]);});

            var errorBotBar = errorBars.selectAll('line.errorBot')
                .data(stdDevs);

                errorBotBar.enter()
                    .append('line')
                    .attr('class', 'errorBot')
                    .attr('stroke', function() {
                        if (exp === 'control') {
                            return '#3b9dd6'; 
                        } else {
                            return '#e0913c';
                        }
                    })
                    .attr('stroke-width', 2)
                    .attr('x1', function(d,i) { return xrange(times[i]) - 3; })
                    .attr('x2', function(d,i) { return xrange(times[i]) + 3; })
                    .attr('y1', function(d,i) { return yrange(ypoint_arr[i] - stdDevs[i]);})
                    .attr('y2', function(d,i) { return yrange(ypoint_arr[i] - stdDevs[i]);});
        }

        //toggle to show each model
        function volumeToggle(data, svg, xrange, yrange, yAxisAdd, yAxis, width, height, maxVolume, maxVolNorm, plotId) {
            // var nest = d3.nest()
            //     .key(function(d) {return d;})
            //     .entries([''])

            // nest.forEach(function(d,i) {
                

                var volRaw = svg.append("rect")
                    .attr('x', width+25)
                    .attr("y", height/2 + 50)
                    .attr("width", 70)
                    .attr("height", 20)
                    .attr("fill", "#cd5686")
                    .style("opacity", 0.8)
                    .attr('id', 'volRawToggle')
                    .on('click', function () {
                        yrange = d3.scaleLinear()
                                        .domain([0, maxVolume])
                                        .range([height, 0])
                                        .nice();

                        yAxis = d3.axisLeft()
                                        .scale(yrange)
                                        .tickPadding(2);

                        d3.selectAll("g.y.axis").call(yAxis)
                        svg.selectAll('.tick').select('text')
                            .attr('fill', 'black')
                            .attr('stroke', 'none')
                            .attr("font-size", "14px")
                        d3.select("#curves").remove()
                        let graph = svg.append("g")
                                        .attr("id", "curves")
                        plotBatch(data, graph, xrange, yrange, width, height, false)
                    
                        d3.select('#volRawToggle').attr('fill', "#cd5686")
                        d3.select('#volNormToggle').attr('fill', "lightgray")
                        
                    })

                var volNorm = svg.append("rect")
                    .attr('x', width+25)
                    .attr("y", height/2 + 70)
                    .attr("width", 70)
                    .attr("height", 20)
                    .style("opacity", 0.8)
                    .attr("fill", "lightgray")
                    .attr('id', 'volNormToggle')
                    .on('click', function () {
                        yrange = d3.scaleLinear()
                        .domain([0, maxVolNorm])
                        .range([height, 0])
                        .nice();

                        yAxis = d3.axisLeft()
                                        .scale(yrange)
                                        .tickPadding(2);

                        d3.selectAll("g.y.axis").call(yAxis)
                        svg.selectAll('.tick').select('text')
                            .attr('fill', 'black')
                            .attr('stroke', 'none')
                            .attr("font-size", "14px")
                        d3.select("#curves").remove()
                        let graph = svg.append("g")
                                        .attr("id", "curves")
                        plotBatch(data, graph, xrange, yrange, width, height, true)
                    
                        d3.select('#volRawToggle').attr('fill', "lightgray")
                        d3.select('#volNormToggle').attr('fill', "#cd5686")
                        
                    })

            var volRawText = svg.append("text")
                    .attr('fill','black')
                    .style('font-size', '12px')
                    .attr("id", "volRawText")
                    .attr("text-anchor", "middle")
                    .attr('x', width+60)
                    .attr("y", height/2 + 64)
                    .text("Raw")
                    .on('click', function () {
                        yrange = d3.scaleLinear()
                                        .domain([0, maxVolume])
                                        .range([height, 0])
                                        .nice();

                        yAxis = d3.axisLeft()
                                        .scale(yrange)
                                        .tickPadding(2);

                        d3.selectAll("g.y.axis").call(yAxis)
                        svg.selectAll('.tick').select('text')
                            .attr('fill', 'black')
                            .attr('stroke', 'none')
                            .attr("font-size", "14px")
                        d3.select("#curves").remove()
                        let graph = svg.append("g")
                                        .attr("id", "curves")
                        plotBatch(data, graph, xrange, yrange, width, height, false)
                    
                        d3.select('#volRawToggle').attr('fill', "#cd5686")
                        d3.select('#volNormToggle').attr('fill', "lightgray")
                       
                    })

            var volNormText = svg.append("text")
                    .attr('fill','black')
                    .style('font-size', '12px')
                    .attr("id", "volNormText")
                    .attr('x', width+29)
                    .attr("y", height/2 + 84)
                    .text("Normalized")
                    .on('click', function () {
                        yrange = d3.scaleLinear()
                        .domain([0, maxVolNorm])
                        .range([height, 0])
                        .nice();

                        yAxis = d3.axisLeft()
                                        .scale(yrange)
                                        .tickPadding(2);

                        d3.selectAll("g.y.axis").call(yAxis)
                        svg.selectAll('.tick').select('text')
                            .attr('fill', 'black')
                            .attr('stroke', 'none')
                            .attr("font-size", "14px")
                        d3.select("#curves").remove()
                        let graph = svg.append("g")
                                        .attr("id", "curves")
                        plotBatch(data, graph, xrange, yrange, width, height, true)
                    
                        d3.select('#volRawToggle').attr('fill', "lightgray")
                        d3.select('#volNormToggle').attr('fill', "#cd5686")
                        
                    })
            // })
        } 

    }

    render() {
        return (
            <Fragment>
            <div className="wrapper" style={{margin:"auto", fontSize:"16px"}}>
                <div className="curve-wrapper" style={{marginTop:"100px"}}>
                    <h1>Drug ID = <span style={{color:"#cd5686"}}>{this.getParams().drugid_param}</span> and Patient ID = <span style={{color:"#cd5686"}}>{this.getParams().patient_param}</span></h1>
                    
                    <svg ref = {node => this.node = node} width={1300} height={620} >
                    </svg>

                    <div className="no-graph">There is no data for this graph.</div>
                    
                    
                </div>
                <div className="curve-wrapper" style={{marginTop:"20px", padding:"10px 0px"}}>
                    <Link to='/datasets'> ←&nbsp;&nbsp;Back to Datasets </Link>
                </div>
                
               
            </div>
            </Fragment>
            
            
        )
    }
}

export default TumorGrowthCurve;