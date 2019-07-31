import React from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'

class HeatMap extends React.Component {

    constructor(props) {
        super(props)
        this.HeatMap = this.HeatMap.bind(this);
        this.makeHeatmap = this.makeHeatmap.bind(this);
    }

    componentDidMount() {
        //this.HeatMap()
    }

    componentDidUpdate() {
        this.HeatMap()
    }

    HeatMap() {
        const node = this.node;
        let data = this.props.data;
        let drug = this.props.drug_id;
        let patient_id = this.props.patient_id;
        let dimensions = this.props.dimensions;
        let margin = this.props.margin;
        let plotId = 'plots';
        this.makeHeatmap(data, patient_id, drug, plotId, dimensions, margin, node)
    }

// main heatmap function taking parameters as data, all the patient ids and drugs.
   makeHeatmap(data, patient, drug, plotId, dimensions, margin, node) {
    this.node = node
    // height and width for the SVG based on the number of drugs and patient/sample ids.
    // height and width of the rectangles in the main skeleton.
    let rect_height = dimensions.height;
    let rect_width = dimensions.width;
    // this height and width is used for setting the body.
    let height = drug.length * rect_height + 100;
    let width = patient.length * rect_width + 500;

    //'#1f77b4', '#2ca02c', '#ffbb78', '#d62728'
    //'#0033CC', '#1a9850', '#fed976', '#e41a1c'
    //'blue', 'green', 'yellow', 'red'
    let target_eval = [
                            { value : 'CR', color: '#0033CC' },
                            { value: 'PR', color: '#1a9850' },
                            { value : 'SD', color: '#fed976' },
                            { value: 'PD', color: '#e41a1c'}
    ]
    let target_color = ['#0033CC', '#1a9850', '#fed976', '#e41a1c', 'lightgray']

    //setting the query strings
    let drug_use = '' 
    let patient_use = patient

    // drug evaluations
    var max_drug = 0;
    var drug_evaluations = {}
    for(var i=0; i<drug.length; i++) {
        drug_evaluations[drug[i]] = {'CR':0, 'PR': 0, 'SD': 0, 'PD': 0, 'NA':0, 'empty': 0}
    }

    // patient evaluations
    let patient_evaluations = {}
    for(let j=0; j<patient.length; j++) {
        patient_evaluations[patient[j]] = {'CR':0, 'PR': 0, 'SD': 0, 'PD': 0, 'NA':0, 'empty': 0, 'total':0}
    }

    /* this code will add to the drug_evaluations and 
      patient_evaluations object the values for PD,SD,PR,CR 
      and also sets the value of the letiable max_drug. */
    function calculate_evaluations(d) {
            keys = Object.entries(d);
            let current_max_drug = 0;
            for(const key of keys) {
                if(key[0] === 'Drug') {
                        var drug_alt = key[1];
                } else {
                    if(key[1] === '') {key[1] = 'empty'}
                    drug_evaluations[drug_alt][key[1]]++
                    patient_evaluations[key[0]][key[1]]++
                    if(key[1] !== 'NA' || key[1] !== 'empty') { 
                        current_max_drug++;
                        patient_evaluations[key[0]].total++;
                    } 
                }
            }
            if (current_max_drug > max_drug) { max_drug = current_max_drug }
    }


    /* This code is used to produce the query strings */
    function querystring_value(d) {
        if(d.length > 2) {
            i = 0;
            drug_use = d.replace(/\s/g,'');
        }
        else { return `/curve?patient=${patient_use[i++]}&drug_id=${drug_use}` }
    }
    

                                    /** SCALE FOR MAIN SKELETON **/

    //defining the scale that we will use for our x-axis and y-axis for the skeleton.
    let yScale = d3.scaleBand()
                   .domain(drug)
                   .rangeRound([rect_height, drug.length * rect_height + rect_height])

    let xScale = d3.scaleBand()
                   .domain(patient)
                   .rangeRound([0, patient.length * rect_width])

    // defining the x-axis for the main skeleton and setting tick size to zero will remove the ticks.
    let yAxis = d3.axisLeft()
                  .scale(yScale)
                  .tickSize(0)
                  .tickPadding(15)
                  
    
    let xAxis = d3.axisTop()
                  .scale(xScale)
                  .tickSize(5)
                  
                                    /** SETTING SVG ATTRIBUTES **/

    // make the SVG element.
    let svg = d3.select(node)
                .append('svg')
                .attr('id', 'heatmap-' + plotId)
                .attr('xmlns', 'http://wwww.w3.org/2000/svg')
                .attr('xmlns:xlink', 'http://wwww.w3.org/1999/xlink')
                .attr('height',height + margin.bottom + margin.top) 
                .attr('width', width + margin.left + margin.right)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                
    

                                    /** HEATMAP SKELETON **/

    // structure of the heatmap
    let skeleton = svg.append('g')
                       .attr('id', 'skeleton')
    
                       
    // this will create g element for each of data row (equivalent to total number of row)
    let drug_response = skeleton.append('g')
                                .attr('id', 'targ_rect')

    

    let gskeleton =  drug_response.selectAll('g')
                                  .data(data)
                                  .enter()
                                  .append('g')
                                  .attr('transform', function(d,i) {
                                    return `translate(0,${i * rect_height})`
                                  })

    // let hmap_highlight = drug_response.selectAll("g#highlight")
    //                             .data(data)
    //                             .enter()
    //                             .append('g')
    //                             .attr("id", "highlight")
    //                             .attr('transform', function(d,i) {
    //                             return `translate(0,${i * rect_height})`
    //                             })


    let rectKeys;
    // this will append rect equivalent to number of patient ids.
    let drawrectangle = gskeleton.selectAll('rect.hmap-rect')
                                  .data(function(d) {  
                                    //calling the function and passing the data d as parameter.
                                    calculate_evaluations(d);
                                    //this returns the object values to next chaining method.
                                    rectKeys = Object.keys(d);
                                    return Object.values(d);
                                   })
                                  .enter()
                                  .append('a')
                                  .attr('xlink:href', function(d) {
                                    return querystring_value(d);
                                  })
                                  .filter(function(d) {
                                    if (d.length > 2 ) { return 0;}
                                    else if (d.length === 0) {return 'empty'}
                                    else { return d; }
                                  })
                                  .append('rect')
                                  .attr("class", function(d, i) {
                                    // i+1 because drug is included in there
                                    return "hmap-rect heatmap-" + rectKeys[i+1]
                                  })
                                  .attr('width', rect_width - 2)
                                  .attr('height', rect_height - 2)
                                  .attr('x', function(d,i) {
                                    return i * rect_width ;  
                                  })
                                  .attr('y', rect_height)

                                 
    // this will fill the rectangles with different color based on the data. 
            drawrectangle.attr('fill', function(d) {
                                    if (d === 'CR') {
                                        return target_color[0]
                                    } else if (d === 'PR') {
                                        return target_color[1]
                                    } else if (d === 'SD') {
                                        return target_color[2]
                                    } else if (d === 'PD') {
                                        return target_color[3]
                                    } else {
                                        return target_color[4]
                                    }
                                })     
                                
    //reset 
    drug_evaluations = {}
    for(var i=0; i<drug.length; i++) {
        drug_evaluations[drug[i]] = {'CR':0, 'PR': 0, 'SD': 0, 'PD': 0, 'NA':0, 'empty': 0}
    }

    // patient evaluations
    patient_evaluations = {}
    for(let j=0; j<patient.length; j++) {
        patient_evaluations[patient[j]] = {'CR':0, 'PR': 0, 'SD': 0, 'PD': 0, 'NA':0, 'empty': 0, 'total':0}
    }
    let p_count = 0;
    let highlight = gskeleton.selectAll('rect.hmap-hlight')
                        .data(function(d) { 
                            //calling the function and passing the data d as parameter.
                            calculate_evaluations(d);
                            //this returns the object values to next chaining method.
                            rectKeys = Object.keys(d);
                            return Object.values(d);
                        })
                        .enter()
                        .append('a')
                        .attr('xlink:href', function(d,i) {
                            return querystring_value(d);
                        })
                        .filter(function(d) {
                            if (d.length > 2 ) { return 0;}
                            else if (d.length === 0) {return 'empty'}
                            else { return d; }
                        })
                        .append('rect')
                        .attr("class", function(d, i) {
                            // i+1 because drug is included in there
                            let drug_class = drug[p_count].replace(/\s/g,'').replace(/[\+]/,'-')
                            if (i == (patient.length - 1)) {
                                p_count++
                            }
                            return "hmap-hlight-" + rectKeys[i+1] + " hmap-hlight-" + drug_class
                        })
                        .attr('width', rect_width - 2)
                        .attr('height', rect_height - 2)
                        .attr('x', function(d,i) {
                            return i * rect_width ;  
                        })
                        .attr("fill", "rgb(0,0,0)")
                        .attr('y', rect_height)
                        .style("opacity", 0)
                        .on("mouseover", function(d,i) {
                            // i+1 because drug is included in there
                            let drug_class = d3.select(this).attr("class").split(" ")[1]
                            d3.selectAll(".hmap-hlight-" + rectKeys[i+1])
                                .style("opacity", 0.2)
                            d3.selectAll(".oprint-hlight-" + rectKeys[i+1])
                                .style("opacity", 0.2)
                            d3.selectAll(".hlight-space-" + rectKeys[i+1])
                                .style("opacity", 0.2)
                        
                        })
                        .on("mouseout", function(d,i) {
                            // i+1 because drug is included in there
                            let drug_class = d3.select(this).attr("class").split(" ")[1]
                            d3.selectAll(".hmap-hlight-" + rectKeys[i+1])
                                .style("opacity", 0)
                            d3.selectAll(".oprint-hlight-" + rectKeys[i+1])
                                .style("opacity", 0)
                            d3.selectAll(".hlight-space-" + rectKeys[i+1])
                                .style("opacity", 0)
                            
                        })

    let lines = svg.append("g")
                                .attr("id", "lines")
                                .attr('transform', function(d,i) {
                                    return `translate(2,${height-62})`
                                })
    const temp = patient.slice(0)
    temp.push("")
    lines.selectAll("line.dashed-line")
            .data(temp)
            .enter()
                .append("line")
                .attr("class", "dashed-line")
                .attr("x1", function(d,i) {
                    return i * (rect_width) - 3;  
                })
                .attr("x2", function(d,i) {
                    return i * (rect_width) - 3;  
                })
                .attr("y1", 2)
                .attr("y2", 200)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .style("stroke-dasharray", "3 2")
                .style("opacity", .2)

    lines.selectAll("rect.hlight-space")
                .data(patient)
                .enter()
                .append('rect')
                .attr("class", function(d) {
                    return "hlight-space-" + d
                })
                .attr('width', rect_width - 2)
                .attr('height', 200)
                .attr('x', function(d,i) {
                    return i * rect_width - 2;  
                })
                .attr("fill", "rgb(0,0,0)")
                .attr('y', 0)
                .style("opacity", 0)            
                            /** X-AXIS AND Y-AXIS FOR THE SKELETON **/
                                                                        
    // calling the y-axis and removing the stroke.
    let drug_name = skeleton.append('g')
                    .attr('id', 'drug_name')

    drug_name.attr('stroke-width', '0')
              .style('font-size', '13px')
              .attr('font-weight', '500')
              .call(yAxis)
              .selectAll("text")
                  .on("mouseover", function() {
                    let drug_class = d3.select(this).text().replace(/\s/g,'').replace(/[\+]/,'-')
                    d3.selectAll(".hmap-hlight-" + drug_class)
                                .style("opacity", 0.2)
                    d3.select(this).attr("cursor", "default")
                  })
                  .on("mouseout", function() {
                    let drug_class = d3.select(this).text().replace(/\s/g,'').replace(/[\+]/,'-')
                    d3.selectAll(".hmap-hlight-" + drug_class)
                                .style("opacity", 0)
                  });

    // calling the x-axis to set the axis and we have also transformed the text.
    let patient_id = skeleton.append('g')
                             .attr('id', 'patient_id')
    
    patient_id.attr('stroke-width', '0')
              .style('font-size', '13px')
              .call(xAxis)
              .selectAll('text')
              .attr('transform', 'rotate(-90)')
              .attr('font-weight', '500')
              .attr('x','0.5em')
              .attr('y','.15em')


                                    /** SMALL RECTANGLES ON RIGHT SIDE OF HEATMAP **/

    // This will create four rectangles on right side for the Evaluation of target lesions.
    let target_rect = skeleton.append('g')
                              .attr('id', 'small_rect')

                      target_rect.selectAll('rect')
                                 .data(target_eval)
                                 .enter()
                                 .append('rect')
                                 .attr('x', 1040)
                                 .attr('y', function(d, i) {
                                    return 100 + i * 25;
                                 })
                                 .attr('height', '15')
                                 .attr('width', '15')
                                 .attr('fill', function(d) {
                                     return d.color;
                                 })
                        
                      target_rect.selectAll('text')
                                 .data(target_eval)
                                 .enter()
                                 .append('text')
                                 .attr('x', 1070)
                                 .attr('y', function(d,i) {
                                     return 112 + i * 25;
                                 })
                                 .text(function(d) {
                                     return d.value;
                                 })
                                 .attr('font-size', '14px')


                                            /** VERTICAL GRAPH ON RIGHT SIDE OF HEATMAP **/

    let stroke_width = 0.75;
    
    // This will make a right side vertical graph.
    let drug_eval = svg.append('g')
                      .attr('id', 'drug_eval')

    let drug_Scale = d3.scaleLinear()
                       .domain([0,max_drug])
                       .range([0,80])

    // This will set an x-axis for the vertical graph.
    let x_axis = d3.axisTop()
                    .scale(drug_Scale)
                    .ticks(4)
                    .tickSize(3)
                    .tickFormat(d3.format('.0f'));

                svg.append('g')
                    .attr('transform', 'translate(' + (patient.length * rect_width + 20) + ',' + 35 + ')')
                    .call(x_axis)
                    .selectAll('text')
                    .attr('fill', 'black')
                    .style('font-size', 8)
                    .attr('stroke', 'none');
            

    let  drug_height_Scale = d3.scaleLinear()
                               .domain([0, (44 + (drug.length - 1) * 40)])
                               .range([0, (rect_height * drug.length) + 10])

                            drug_eval.append('rect')
                               .attr('class', 'drug_eval_rect')
                               .attr('x', patient.length * rect_width + 20)
                               .attr('y', 35)
                               .attr('height', 40 * drug.length )
                               .attr('width', drug_Scale(max_drug))
                               .attr('fill', 'white')
                               .style('stroke', 'black')
                               .style('stroke-width', 1)

    for(let i=0; i<drug.length; i++) {
        drug_eval.append('rect')
                 .attr('class', 'drug_eval_cr')
                 .attr('height', 26)
                 .attr('width', drug_Scale(drug_evaluations[drug[i]]['CR']))
                 .attr('x',patient.length * rect_width + 20)
                 .attr('y',  drug_height_Scale(42 + i * 40))
                 .attr('fill', target_color[0])
                 .style('stroke', 'black')
                 .style('stroke-width', stroke_width)
        
        drug_eval.append('rect')
                 .attr('class', 'drug_eval_pr')
                 .attr('height', 26)
                 .attr('width', drug_Scale(drug_evaluations[drug[i]]['PR']))
                 .attr('x',patient.length * rect_width + 20 + drug_Scale(drug_evaluations[drug[i]]['CR']))
                 .attr('y',  drug_height_Scale(42 + i * 40))
                 .attr('fill', target_color[1])
                 .style('stroke', 'black')
                 .style('stroke-width', stroke_width)

        drug_eval.append('rect')
                 .attr('class', 'drug_eval_sd')
                 .attr('height', 26)
                 .attr('width', drug_Scale(drug_evaluations[drug[i]]['SD']))
                 .attr('x',patient.length * rect_width + 20 + drug_Scale(drug_evaluations[drug[i]]['CR']) + drug_Scale(drug_evaluations[drug[i]]['PR']))
                 .attr('y',  drug_height_Scale(42 + i * 40))
                 .attr('fill', target_color[2])
                 .style('stroke', 'black')
                 .style('stroke-width', stroke_width)

        drug_eval.append('rect')
                 .attr('class', 'drug_eval_pd')
                 .attr('height', 26)
                 .attr('width', drug_Scale(drug_evaluations[drug[i]]['PD']))
                 .attr('x',patient.length * rect_width + 20 + drug_Scale(drug_evaluations[drug[i]]['CR']) + drug_Scale(drug_evaluations[drug[i]]['PR']) + drug_Scale(drug_evaluations[drug[i]]['SD'])) 
                 .attr('y', drug_height_Scale(42 + i * 40))
                 .attr('fill', target_color[3])  
                 .style('stroke', 'black')
                 .style('stroke-width', stroke_width)  
    }


                                        /** HORIZONTAL GRAPH AT THE TOP OF HEATMAP **/

    let max_patientid_total = 0;
    let box_height = 80;

    // This will set the maximum number of total letiants.
    let keys = Object.entries(patient_evaluations);
    for(const key of keys) {
        let curent_max = key[1].total;
        if(curent_max > max_patientid_total) {
            max_patientid_total = curent_max;
        }
    }
    
    // appending 'g' element to the SVG.
    let patient_eval = svg.append('g')
                          .attr('id', 'patient_eval')


    // setting the outer rectangle.
                      patient_eval.append('rect')
                                  .attr('class', 'patient_eval_rect')
                                  .attr('x', 0)
                                  .attr('y', -120)
                                  .attr('height', box_height)
                                  .attr('width', patient.length * 20)
                                  .attr('fill', 'white')
                                  .style('stroke', 'black')
                                  .style('stroke-width', 1)

    // setting scale to map max patient_id value to range (height of the box.)
    let patient_Scale = d3.scaleLinear()
                       .domain([0,max_patientid_total])
                       .range([0,box_height])

    // This code will set y-axis of the graph at top
    if(max_patientid_total !== 0) {

        let patient_scales = d3.scaleLinear()
                                .domain([0,max_patientid_total])
                                .range([box_height,0]);
                        
        let y_axis = d3.axisLeft()
                        .scale(patient_scales)
                        .ticks(2)
                        .tickSize(0)
                        .tickFormat(d3.format('.0f'));

                      svg.append('g')
                        .attr('transform', 'translate(0,-120.5)')
                        .call(y_axis)
    }
                           

    for(let i=0; i<patient.length; i++) {
            patient_eval.append('rect')
                    .attr('class', 'patient_eval_cr')
                    .attr('height', patient_Scale(patient_evaluations[patient[i]]['CR']))
                    .attr('width', 16)
                    .attr('x', i * 20)
                    .attr('y', -120 + box_height - patient_Scale(patient_evaluations[patient[i]]['CR']))
                    .attr('fill', target_color[0])
                    .style('stroke', 'black')
                    .style('stroke-width', stroke_width)
            
            patient_eval.append('rect')
                    .attr('class', 'patient_eval_pr')
                    .attr('height', patient_Scale(patient_evaluations[patient[i]]['PR']))
                    .attr('width', 16)
                    .attr('x', i * 20)
                    .attr('y', -120 + box_height - patient_Scale(patient_evaluations[patient[i]]['CR']) - patient_Scale(patient_evaluations[patient[i]]['PR']))
                    .attr('fill', target_color[1])
                    .style('stroke', 'black')
                    .style('stroke-width', stroke_width)

            patient_eval.append('rect')
                    .attr('class', 'patient_eval_sd')
                    .attr('height', patient_Scale(patient_evaluations[patient[i]]['SD']))
                    .attr('width', 16)
                    .attr('x', i * 20)
                    .attr('y', -120 + box_height - patient_Scale(patient_evaluations[patient[i]]['CR']) - patient_Scale(patient_evaluations[patient[i]]['PR']) - patient_Scale(patient_evaluations[patient[i]]['SD']))
                    .attr('fill', target_color[2])
                    .style('stroke', 'black')
                    .style('stroke-width', stroke_width)

            patient_eval.append('rect')
                    .attr('class', 'patient_eval_pd')
                    .attr('height', patient_Scale(patient_evaluations[patient[i]]['PD']))
                    .attr('width', 16)
                    .attr('x', i * 20)
                    .attr('y', -120 + box_height - patient_Scale(patient_evaluations[patient[i]]['CR']) - patient_Scale(patient_evaluations[patient[i]]['PR']) - patient_Scale(patient_evaluations[patient[i]]['SD']) - patient_Scale(patient_evaluations[patient[i]]['PD']))
                    .attr('fill', target_color[3])
                    .style('stroke', 'black')
                    .style('stroke-width', stroke_width)
    }

}

    render() {
        return (
            <div 
                ref = {node => this.node = node} 
            >
            </div>
        )
    }
}


HeatMap.propTypes = {
    drug_id: PropTypes.array.isRequired,
    patient_id: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    dimensions: PropTypes.object.isRequired,
    margin: PropTypes.object.isRequired
}

export default HeatMap