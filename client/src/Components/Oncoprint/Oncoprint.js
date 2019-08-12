import React from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'

class Oncoprint extends React.Component {
    constructor(props) {
        super(props)
        this.Oncoprint = this.Oncoprint.bind(this);
    }

    componentDidMount() {
        //this.Oncoprint()
    }

    componentDidUpdate() {
        this.Oncoprint()
    }

    Oncoprint() {
        const node = this.node;
        let data = this.props.data;
        let genes = this.props.genes;
        let plotId = 'plots';
        let margin = this.props.margin;
        let dimensions = this.props.dimensions;
        let patient_id = this.props.patient_id;
        let hmap_patients = this.props.hmap_patients;
        this.makeOncoprint(data, genes, plotId, node, patient_id, hmap_patients, dimensions, margin)
    }


    makeOncoprint(data, genes, plotId, node, patient_id, hmap_patients, dimensions, margin) {
        this.node = node
        // height and width for the SVG based on the number of genes and patient/sample ids.
        // height and width of the rectangles in the main skeleton.
        let rect_height = dimensions.height;
        let rect_width = dimensions.width;
        // this height and width is used for setting the body.
        let height = genes.length * rect_height + 100;
        let width = hmap_patients.length * rect_width + 100;

        // adding this for rectangles on right side of oncoprint.
        let rect_alterations = [
            { value : 'Deep Deletion', color: '#0033CC' },
            { value: 'Amplification', color: '#1a9850' },
            { value: 'Mutation', color: '#e41a1c'},
            { value: 'Wild Type', color: "lightgray"},
            { value: 'Not Available', color: "none"}   
        ]

                                                    /** SETTING SVG ATTRIBUTES **/
    
        // make the svg element
        let svg = d3.select(node)
            .append('svg')
            .attr('id', 'oncoprint-' + plotId) // set an id so that I can remove+replace on refresh
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink') 
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform',
                    'translate(' + margin.left + ',' + (margin.top) + ')')


                                                    /** Oncoprint SKELETOON **/
        
        // skeleton of the oncoprint
        let skeleton = svg.append('g')
            .attr('id', 'skeleton')
    
        for (let i = 0; i < genes.length; i++) {
            for (let j = 0; j < hmap_patients.length; j++) {
                skeleton.append('rect')
                    .attr('class', 'bg-rect') 
                    .attr('width', rect_width - 2)
                    .attr('height', rect_height - 2)
                    .attr('fill', 'lightgrey')
                    .attr('x', j * (rect_width))
                    .attr('y', i * (rect_height ))
            }
        }
    
        let geneNames = skeleton.append('g')
            .attr('id', 'gene-names')
    
        // gene names on the y axis
        for (let i = 0; i < genes.length; i++) {
            geneNames.append('text')
                .attr('class', genes[i])
                .attr('dx', -20)
                .style('text-anchor', 'end')
                .style('font-size', '13px')
                .attr('dy', i * (rect_height) + 23)
                .attr('font-weight', '500')
                .text(genes[i])
                .on("mouseover", function() {
                    d3.selectAll(".oprint-hlight-" + genes[i])
                                .style("opacity", 0.2)

                  })
                  .on("mouseout", function() {
                    d3.selectAll(".oprint-hlight-" + genes[i])
                                .style("opacity", 0)
                  });
        }
    
                                                /** Setting Alterations **/

        // alterations: mutations are #1a9850 and a third, AMP/del are #e41a1c/#0033CC and full respectively
        let alterations = svg.append('g')
            .attr('id', 'alterations')

        let highlight = svg.append("g")
            .attr("id", "highlight")
    
        // collect info about alterations per gene/patient for plotting later
        let gene_alterations = {}
        for (let i = 0; i < genes.length; i++) {
            gene_alterations[genes[i]] = {'mut':0,'amp':0,'del':0}
        } 

        let patient_alterations = []
        for (let i = 0; i < hmap_patients.length; i++) {
            patient_alterations.push({'mut':0,'amp':0,'del':0})
        }

        // take the difference of patient_id from hmap_patients
        let diff = hmap_patients.filter(x => !patient_id.includes(x))
        console.log(diff)



        for (let i = 0; i < genes.length; i++) {
            for (let j = 0; j < hmap_patients.length; j++) {
                //data[i][hmap_patients[j]] === ''
                if (diff.indexOf(hmap_patients[j]) !== -1) {
                    // if not sequenced, make it white with a border
                    alterations.append('rect')
                    .attr('class', 'alter-rect del')
                    .attr('width', rect_width - 4)
                    .attr('height', rect_height - 4)
                    .attr('fill', 'white')
                    .attr("stroke", "lightgray")
                    .attr("stroke-width", "1px")
                    .attr('x', j * (rect_width)+1) 
                    .attr('y', i * (rect_height)+1)
                } else {
                    if (data[i][hmap_patients[j]].includes('Del0.8') || data[i][hmap_patients[j]].includes('Deletion')) {
                        gene_alterations[genes[i]]['del']++;
                        patient_alterations[j]['del']++;
                        alterations.append('rect')
                            .attr('class', 'alter-rect del')
                            .attr('width', rect_width - 2)
                            .attr('height', rect_height - 2)
                            .attr('fill', '#0033CC')
                            .attr('x', j * (rect_width)) 
                            .attr('y', i * (rect_height))
                    }
                    if (data[i][hmap_patients[j]].includes('Amp') || data[i][hmap_patients[j]].includes('Amplification')) {
                        gene_alterations[genes[i]]['amp']++;
                        patient_alterations[j]['amp']++;
                        alterations.append('rect')
                            .attr('class', 'alter-rect amp')
                            .attr('width', rect_width - 2)
                            .attr('height', rect_height - 2)
                            .attr('fill', '#1a9850')
                            .attr('x', j * (rect_width)) 
                            .attr('y', i * (rect_height))
                    }
                    if (data[i][hmap_patients[j]].includes('MutNovel') || data[i][hmap_patients[j]].includes('mutation')) {
                        gene_alterations[genes[i]]['mut']++;
                        patient_alterations[j]['mut']++;
                        alterations.append('rect')
                            .attr('class', 'alter-rect mut')
                            .attr('width', rect_width - 2)
                            .attr('height', rect_height - 25)
                            .attr('fill', '#e41a1c')
                            .attr('x', j * (rect_width)) 
                            .attr('y', i * (rect_height) + 12)
                    }
                    if (data[i][hmap_patients[j]].includes('NA')) {
                        alterations.append('rect')
                            .attr('class', 'alter-rect amp')
                            .attr('width', rect_width - 2)
                            .attr('height', rect_height - 5)
                            .attr('fill', 'white')
                            .style('stroke', 'black')
                            .style('stroke-width', .5)
                            .attr('x', j * (rect_width)) 
                            .attr('y', i * (rect_height))
                    }
                }
            }
        }   

        

                                                    /** Setting Maxes for the alterations **/
    
        // getting the maxes
        let maxPAmp = []; 
        let maxPMut = []; 
        let maxPHomdel = [];
        for (let i = 0; i < patient_alterations.length; i++) {
            maxPAmp.push(patient_alterations[i]['amp'])
            maxPHomdel.push(patient_alterations[i]['del'])
            maxPMut.push(patient_alterations[i]['mut'])
        }
        maxPAmp = d3.max(maxPAmp)
        maxPHomdel = d3.max(maxPHomdel)
        maxPMut = d3.max(maxPMut)
    
        // getting the maxes
        let maxGAmp = []; 
        let maxGMut = []; 
        let maxGHomdel = [];
        for (let i = 0; i < genes.length; i++) {
            maxGAmp.push(gene_alterations[genes[i]]['amp'])
            maxGHomdel.push(gene_alterations[genes[i]]['del'])
            maxGMut.push(gene_alterations[genes[i]]['mut'])
        }
        maxGAmp = d3.max(maxGAmp)
        maxGHomdel = d3.max(maxGHomdel)
        maxGMut = d3.max(maxGMut)
    
                                                        /** ALTERATION GRAPHS **/
        
                                                          /** Vertical Graph **/
        // calculating max width
        let max_width_arr = []
        for (let i = 0; i < genes.length; i++) { 
            max_width_arr.push(gene_alterations[genes[i]]['mut'] + gene_alterations[genes[i]]['amp'] + gene_alterations[genes[i]]['del'])
        }
    
        let max_width = d3.max(max_width_arr)

        let xrange_gene = d3.scaleLinear()
            .domain([0, d3.max([maxGAmp, maxGMut, maxGHomdel])])
            .range([0,40]);

        
        let gene_alter = svg.append('g')
            .attr('id', 'gene-alter')
            .attr('transform', 'translate(' + (hmap_patients.length * rect_width + 20) + ',0)')

        let stroke_width = 1; // this will set the stroke width of the outer rectangle 

            // setting the outer rectangle.
            gene_alter.append('rect')
                    .attr('class', 'patient_eval_rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('height', (rect_height) *(genes.length))
                    .attr('width', xrange_gene(max_width))
                    .attr('fill', 'white')
                    .style('stroke', 'black')
                    .style('stroke-width', stroke_width)
    
            for (let i = 0; i < genes.length; i++) {
                gene_alter.append('rect')
                    .attr('class', 'gene-rect mut')
                    .attr('height', rect_height - 2)
                    .attr('width', xrange_gene(gene_alterations[genes[i]]['mut']))
                    .attr('fill', '#e41a1c')
                    .attr('y', (i * (rect_height)))
                    .attr('x', stroke_width/2)
    
                gene_alter.append('rect')
                    .attr('class', 'gene-rect amp')
                    .attr('height', rect_height - 2)
                    .attr('width', xrange_gene(gene_alterations[genes[i]]['amp']))
                    .attr('fill', '#1a9850')
                    .attr('y', i * (rect_height) ) 
                    .attr('x', xrange_gene(gene_alterations[genes[i]]['mut']) + stroke_width/2)
                     
                
                gene_alter.append('rect')
                    .attr('class', 'gene-rect del')
                    .attr('height', rect_height - 2)
                    .attr('width', xrange_gene(gene_alterations[genes[i]]['del']))
                    .attr('fill', '#0033CC')
                    .attr('y', i * (rect_height)) 
                    .attr('x', xrange_gene(gene_alterations[genes[i]]['amp']) + xrange_gene(gene_alterations[genes[i]]['mut']) + stroke_width/2)
                
            }
            
            // This will set the axis and scale.
            let xrange_axis = d3.scaleLinear() 
                .domain([0, max_width])
                .range([0, xrange_gene(max_width)]);
    
            let x_axis = d3.axisTop()
                .scale(xrange_axis)
                .ticks(4)
                .tickSize(3)
                .tickFormat(d3.format('.0f'));
    
                svg.append('g')
                    .attr('class', 'x_axis')
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)
                    .attr('transform', 'translate(' + (hmap_patients.length * rect_width + 20) + ' -0 )')
                    .call(x_axis)
                    .selectAll('text')
                    .attr('fill', 'black')
                    .style('font-size', 8)
                    .attr('stroke', 'none');
            
                    svg.selectAll('.tick')
                    .select('text')
                    .attr('fill', 'black')
                    .attr('stroke', 'none')

            
                                                         /** Horizontal Graph **/

                                                         // calculating max height

        let max_height_arr = []
        for (let i = 0; i < patient_alterations.length; i++) { 
            max_height_arr.push(patient_alterations[i]['mut'] + patient_alterations[i]['amp'] + patient_alterations[i]['del'])
        }
    
        let max_height = d3.max(max_height_arr)

        let patient_alter = svg.append('g')
            .attr('id', 'patient-alter')
    
        let yrange_patient = d3.scaleLinear() // #TODO: scale.linear
                .domain([0, d3.max([maxPAmp, maxPMut, maxPHomdel])])
                .range([35, 0]);
        
            for (let i = 0; i < patient_alterations.length; i++) {
                patient_alter.append('rect')
                    .attr('class', 'patient-rect mut')
                    .attr('width', rect_width - 5)
                    .attr('height', 35 - yrange_patient(patient_alterations[i]['mut']))
                    .attr('fill', '#e41a1c')
                    .attr('x', i * 20 + 1) 
                    .attr('y', yrange_patient(patient_alterations[i]['mut']))
                    .attr('transform', 'translate(0,-40)')
    
                patient_alter.append('rect')
                    .attr('class', 'patient-rect amp')
                    .attr('width', rect_width - 5)
                    .attr('height', 35 - yrange_patient(patient_alterations[i]['amp']))
                    .attr('fill', '#1a9850')
                    .attr('x', i * 20 + 1) 
                    .attr('y', yrange_patient(patient_alterations[i]['amp']) - (35 - yrange_patient(patient_alterations[i]['mut'])))
                    .attr('transform', 'translate(0,-40)')
                
                patient_alter.append('rect')
                    .attr('class', 'patient-rect del')
                    .attr('width', rect_width - 5)
                    .attr('height', 35 - yrange_patient(patient_alterations[i]['del']))
                    .attr('fill', '#0033CC')
                    .attr('x', i * 20 + 1) 
                    .attr('y', yrange_patient(patient_alterations[i]['del']) - (35 - yrange_patient(patient_alterations[i]['mut'])) - (35 - yrange_patient(patient_alterations[i]['amp'])))
                    .attr('transform', 'translate(0,-40)')
            }
    
            let yrange_axis = d3.scaleLinear() 
                .domain([0, max_height])
                .range([35 - yrange_patient(max_height), 0]).nice();
    
            let y_axis = d3.axisLeft()
                .scale(yrange_axis)
                .ticks(4)
                .tickSize(3)
                .tickFormat(d3.format('.0f'));
    
                svg.append('g')
                    .attr('class', 'y_axis')
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)
                    .attr('transform', 'translate(-10,' + (-(35 - yrange_patient(max_height))-5) + ')')
                    .call(y_axis)
                    .selectAll('text')
                    .attr('fill', 'black')
                    .style('font-size', 8)
                    .attr('stroke', 'none');
            
                    svg.selectAll('.tick')
                    .select('text')
                    .attr('fill', 'black')
                    .attr('stroke', 'none')
    
        // removing the 0 tick
        svg.selectAll('.y_axis .tick')
            .each(function (d) {
                if ( d === 0 ) {
                    this.remove();
                }
        });

        let lines = svg.append("g")
                                .attr("id", "lines")
                                .attr('transform', function(d,i) {
                                    return `translate(2,-200)`
                                })
        const temp = hmap_patients.slice(0)
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
                    .attr("y1", 0)
                    .attr("y2", 200)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .style("stroke-dasharray", "3 2")
                    .style("opacity", 0.2)

        lines.selectAll("rect.hlight-space")
                    .data(hmap_patients)
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

                                                                                         /** SMALL RECTANGLES ON RIGHT SIDE OF Oncoprint **/
        // This will create four rectangles on right side for alterations.
        let target_rect = skeleton.append('g')
                                    .attr('id', 'small_rectangle')

                        target_rect.selectAll('rect')
                            .data(rect_alterations)
                            .enter()
                            .append('rect')
                            .attr('x', (hmap_patients.length * rect_width + 120))
                            .attr('y', function(d, i) {
                                return 200 + i * 25;
                            })
                            .attr('height', '15')
                            .attr('width', '15')
                            .attr('fill', function(d) {
                                if (d.color === "none") {
                                    d3.select(this).attr("stroke",'lightgray')
                                                .attr("transform", "translate(1,1)")
                                                .attr("width", 14)
                                                .attr("height", 14)
                                    return "white"
                                }
                                return d.color;
                            })

                        target_rect.selectAll('text')
                            .data(rect_alterations)
                            .enter()
                            .append('text')
                            .attr('x', (hmap_patients.length * rect_width + 140))
                            .attr('y', function(d,i) {
                                return 212 + i * 25;
                            })
                            .text(function(d) {
                                return d.value;
                            })
                            .attr('font-size', '14px')


        // highlight
        for (let i = 0; i < genes.length; i++) {
            for (let j = 0; j < hmap_patients.length; j++) {
                highlight.append('rect')
                    .attr('class', 'oprint-hlight-' + hmap_patients[j] + " oprint-hlight-" + genes[i])
                    .attr('width', rect_width - 2)
                    .attr('height', rect_height - 2)
                    .attr('fill', 'black')
                    .attr('x', j * (rect_width))
                    .attr('y', i * (rect_height ))
                    .style("opacity", 0)
                        .on("mouseover", function(d,x) {
                            d3.selectAll(".hmap-hlight-" + hmap_patients[j])
                                .style("opacity", 0.2)
                            d3.selectAll(".oprint-hlight-" + hmap_patients[j])
                                .style("opacity", 0.2)
                            d3.selectAll(".hlight-space-" + hmap_patients[j])
                                .style("opacity", 0.2)
                        
                        })
                        .on("mouseout", function(d,x) {
                            d3.selectAll(".hmap-hlight-" + hmap_patients[j])
                                .style("opacity", 0)
                            d3.selectAll(".oprint-hlight-" + hmap_patients[j])
                                .style("opacity", 0)
                            d3.selectAll(".hlight-space-" + hmap_patients[j])
                                .style("opacity", 0)
                        })
            }
        }                           
                            
    }

    render() {
        return (
            <div ref = {node => this.node = node} className="oprint-wrapper">
            </div>
        )
    }
}


Oncoprint.propTypes = {
    genes: PropTypes.array.isRequired,
    patient_id: PropTypes.array.isRequired,
    hmap_patients: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired
}


export default Oncoprint