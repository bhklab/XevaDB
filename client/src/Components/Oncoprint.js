import React, {Component} from 'react';
import * as d3 from 'd3';
import axios from 'axios';


class Oncoprint extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : [],
            genes : [],
            patient_id : []
        };
        this.Oncoprint = this.Oncoprint.bind(this);
        this.updateResults = this.updateResults.bind(this);
    }

    updateResults(result) {
        const dataset = result;
        let gene_id = [];
        let patient = [];
        
        patient = Object.keys(dataset[0]);
        patient.shift();

        dataset.map((data) => {
            gene_id.push(data["gene_id"]);
        })
        
        this.setState({
            data : dataset,
            genes : gene_id,
            patient_id : patient
        })
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/api/v1/mutation`)
             .then(response => {
                 this.updateResults(response.data);
             })
        this.Oncoprint()
    }

    componentDidUpdate() {
        this.Oncoprint()
    }

    Oncoprint() {
        const node = this.node;
        let data = this.state.data;
        let genes = this.state.genes;
        let plotId = "plots";
        let patient_id = this.state.patient_id;
        this.makeOncoprint(data, genes, plotId, node, patient_id)
    }


    makeOncoprint(data, genes, plotId, node, patient_id) {
        // height and width for the SVG based on the number of drugs and patient/sample ids.
        // height and width of the rectangles in the main skeleton.
        let rect_height = 40;
        let rect_width = 15;
        // this height and width is used for setting the body.
        let height = genes.length * (rect_height + 10)+ 200;
        let width = patient_id.length * (rect_width + 5) + 200;
        let margin = {
            top: 80,
            right: 200,
            bottom: 100,
            left: 250
        }

                                                    /** SETTING SVG ATTRIBUTES **/
    
        // make the svg element
        let svg = d3.select(node)
            .append("svg")
            .attr("id", "oncoprint-" + plotId) // set an id so that I can remove+replace on refresh
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink") 
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")")


                                                    /** Oncoprint SKELETOON **/
        
        // skeleton of the oncoprint
        let skeleton = svg.append("g")
            .attr("id", "skeleton")
    
        for (let i = 0; i < genes.length; i++) {
            for (let j = 0; j < patient_id.length; j++) {
                skeleton.append("rect")
                    .attr("class", "bg-rect")
                    .attr("width", rect_width - 2)
                    .attr("height", rect_height - 5)
                    .attr("fill", "lightgrey")
                    .attr("x", j * (rect_width + 5))
                    .attr("y", i * (rect_height + 10))
            }
        }
    
        let geneNames = skeleton.append("g")
            .attr("id", "gene-names")
    
        // gene names on the y axis
        for (let i = 0; i < genes.length; i++) {
            geneNames.append("text")
                .attr("class", genes[i])
                .attr("dx", -20)
                .style("text-anchor", "end")
                .style("font-size", "13px")
                .attr("dy", i * (rect_height + 10) + 23)
                .attr("font-weight", "500")
                .text(genes[i])
        }
    
                                                /** Setting Alterations **/

        // alterations: mutations are green and a third, AMP/del are red/blue and full respectively
        let alterations = svg.append("g")
            .attr("id", "alterations")
    
        // collect info about alterations per gene/patient for plotting later
        let gene_alterations = {}
        for (let i = 0; i < genes.length; i++) {
            gene_alterations[genes[i]] = {"mut":0,"amp":0,"del":0}
        } 

        let patient_alterations = []
        for (let i = 0; i < patient_id.length; i++) {
            patient_alterations.push({"mut":0,"amp":0,"del":0})
        }
        
        for (let i = 0; i < genes.length; i++) {
            for (let j = 0; j < patient_id.length; j++) {

                if (data[i][patient_id[j]] === "") {
                    // if no alterations
                } else {
                    if (data[i][patient_id[j]].includes("Del0.8")) {
                        gene_alterations[genes[i]]["del"]++;
                        patient_alterations[j]["del"]++;
                        alterations.append("rect")
                            .attr("class", "alter-rect del")
                            .attr("width", rect_width - 2)
                            .attr("height", rect_height - 5)
                            .attr("fill", "blue")
                            .attr("x", j * (rect_width + 5)) 
                            .attr("y", i * (rect_height + 10))
                    }
                    if (data[i][patient_id[j]].includes("Amp")) {
                        gene_alterations[genes[i]]["amp"]++;
                        patient_alterations[j]["amp"]++;
                        alterations.append("rect")
                            .attr("class", "alter-rect amp")
                            .attr("width", rect_width - 2)
                            .attr("height", rect_height - 5)
                            .attr("fill", "red")
                            .attr("x", j * (rect_width + 5)) 
                            .attr("y", i * (rect_height + 10))
                    }
                    if (data[i][patient_id[j]].includes("MutNovel")) {
                        gene_alterations[genes[i]]["mut"]++;
                        patient_alterations[j]["mut"]++;
                        alterations.append("rect")
                            .attr("class", "alter-rect mut")
                            .attr("width", rect_width - 2)
                            .attr("height", rect_height - 25)
                            .attr("fill", "green")
                            .attr("x", j * (rect_width + 5)) 
                            .attr("y", i * (rect_height + 10) + 10)
                    }
                    if (data[i][patient_id[j]].includes("NA")) {
                        alterations.append("rect")
                            .attr("class", "alter-rect amp")
                            .attr("width", rect_width - 2)
                            .attr("height", rect_height - 5)
                            .attr("fill", "white")
                            .style("stroke", "black")
                            .style("stroke-width", .5)
                            .attr("x", j * (rect_width + 5)) 
                            .attr("y", i * (rect_height + 10))
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
            maxPAmp.push(patient_alterations[i]["amp"])
            maxPHomdel.push(patient_alterations[i]["del"])
            maxPMut.push(patient_alterations[i]["mut"])
        }
        maxPAmp = d3.max(maxPAmp)
        maxPHomdel = d3.max(maxPHomdel)
        maxPMut = d3.max(maxPMut)
    
        // getting the maxes
        let maxGAmp = []; 
        let maxGMut = []; 
        let maxGHomdel = [];
        for (let i = 0; i < genes.length; i++) {
            maxGAmp.push(gene_alterations[genes[i]]["amp"])
            maxGHomdel.push(gene_alterations[genes[i]]["del"])
            maxGMut.push(gene_alterations[genes[i]]["mut"])
        }
        maxGAmp = d3.max(maxGAmp)
        maxGHomdel = d3.max(maxGHomdel)
        maxGMut = d3.max(maxGMut)
    
                                                        /** ALTERATION GRAPHS **/
        
                                                          /** Vertical Graph **/
        // calculating max width
        let max_width_arr = []
        for (let i = 0; i < genes.length; i++) { 
            max_width_arr.push(gene_alterations[genes[i]]["mut"] + gene_alterations[genes[i]]["amp"] + gene_alterations[genes[i]]["del"])
        }
    
        let max_width = d3.max(max_width_arr)

        let xrange_gene = d3.scaleLinear()
            .domain([0, d3.max([maxGAmp, maxGMut, maxGHomdel])])
            .range([0,50]);

        
        let gene_alter = svg.append("g")
            .attr("id", "gene-alter")
            .attr("transform", "translate(880,0)")

        let stroke_width = 1; // this will set the stroke width of the outer rectangle 

            // setting the outer rectangle.
            gene_alter.append("rect")
                    .attr("class", "patient_eval_rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", (genes.length) * 50 - 15)
                    .attr("width", 50 + stroke_width)
                    .attr("fill", "white")
                    .style("stroke", "black")
                    .style("stroke-width", stroke_width)
    
            for (let i = 0; i < genes.length; i++) {
                gene_alter.append("rect")
                    .attr("class", "gene-rect mut")
                    .attr("height", rect_height - 5)
                    .attr("width", xrange_gene(gene_alterations[genes[i]]["mut"]))
                    .attr("fill", "green")
                    .attr("y", (i * (rect_height + 10)))
                    .attr("x", stroke_width/2)
    
                gene_alter.append("rect")
                    .attr("class", "gene-rect amp")
                    .attr("height", rect_height - 5)
                    .attr("width", xrange_gene(gene_alterations[genes[i]]["amp"]))
                    .attr("fill", "red")
                    .attr("y", i * (rect_height + 10)) 
                    .attr("x", xrange_gene(gene_alterations[genes[i]]["mut"]) + stroke_width/2)
                     
                
                gene_alter.append("rect")
                    .attr("class", "gene-rect del")
                    .attr("height", rect_height - 5)
                    .attr("width", xrange_gene(gene_alterations[genes[i]]["del"]))
                    .attr("fill", "blue")
                    .attr("y", i * (rect_height + 10)) 
                    .attr("x", xrange_gene(gene_alterations[genes[i]]["amp"]) + xrange_gene(gene_alterations[genes[i]]["mut"]) + stroke_width/2)
                
            }
            
            // This will set the axis and scale.
            let xrange_axis = d3.scaleLinear() 
                .domain([0, max_width])
                .range([0, xrange_gene(max_width)]);
    
            let x_axis = d3.axisTop()
                .scale(xrange_axis)
                .ticks(4)
                .tickSize(3)
                .tickFormat(d3.format(".0f"));
    
                svg.append("g")
                    .attr("class", "x_axis")
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("transform", "translate(" + 880+ " -0 )")
                    .call(x_axis)
                    .selectAll("text")
                    .attr("fill", "black")
                    .style("font-size", 8)
                    .attr("stroke", "none");
            
                    svg.selectAll(".tick")
                    .select("text")
                    .attr("fill", "black")
                    .attr("stroke", "none")

            
                                                         /** Horizontal Graph **/

                                                         // calculating max height

        let max_height_arr = []
        for (let i = 0; i < patient_alterations.length; i++) { 
            max_height_arr.push(patient_alterations[i]["mut"] + patient_alterations[i]["amp"] + patient_alterations[i]["del"])
        }
    
        let max_height = d3.max(max_height_arr)

        let patient_alter = svg.append("g")
            .attr("id", "patient-alter")
    
        let yrange_patient = d3.scaleLinear() // #TODO: scale.linear
                .domain([0, d3.max([maxPAmp, maxPMut, maxPHomdel])])
                .range([35, 0]);
        
            for (let i = 0; i < patient_alterations.length; i++) {
                patient_alter.append("rect")
                    .attr("class", "patient-rect mut")
                    .attr("width", rect_width - 5)
                    .attr("height", 35 - yrange_patient(patient_alterations[i]["mut"]))
                    .attr("fill", "green")
                    .attr("x", i * 20 + 1) 
                    .attr("y", yrange_patient(patient_alterations[i]["mut"]))
                    .attr("transform", "translate(0,-40)")
    
                patient_alter.append("rect")
                    .attr("class", "patient-rect amp")
                    .attr("width", rect_width - 5)
                    .attr("height", 35 - yrange_patient(patient_alterations[i]["amp"]))
                    .attr("fill", "red")
                    .attr("x", i * 20 + 1) 
                    .attr("y", yrange_patient(patient_alterations[i]["amp"]) - (35 - yrange_patient(patient_alterations[i]["mut"])))
                    .attr("transform", "translate(0,-40)")
                
                patient_alter.append("rect")
                    .attr("class", "patient-rect del")
                    .attr("width", rect_width - 5)
                    .attr("height", 35 - yrange_patient(patient_alterations[i]["del"]))
                    .attr("fill", "blue")
                    .attr("x", i * 20 + 1) 
                    .attr("y", yrange_patient(patient_alterations[i]["del"]) - (35 - yrange_patient(patient_alterations[i]["mut"])) - (35 - yrange_patient(patient_alterations[i]["amp"])))
                    .attr("transform", "translate(0,-40)")
            }
    
            let yrange_axis = d3.scaleLinear() 
                .domain([0, max_height])
                .range([35 - yrange_patient(max_height), 0]).nice();
    
            let y_axis = d3.axisLeft()
                .scale(yrange_axis)
                .ticks(4)
                .tickSize(3)
                .tickFormat(d3.format(".0f"));
    
                svg.append("g")
                    .attr("class", "y_axis")
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("transform", "translate(-10," + (-(35 - yrange_patient(max_height))-5) + ")")
                    .call(y_axis)
                    .selectAll("text")
                    .attr("fill", "black")
                    .style("font-size", 8)
                    .attr("stroke", "none");
            
                    svg.selectAll(".tick")
                    .select("text")
                    .attr("fill", "black")
                    .attr("stroke", "none")
    
        // removing the 0 tick
        svg.selectAll(".y_axis .tick")
            .each(function (d) {
                if ( d === 0 ) {
                    this.remove();
                }
        });
                                        
                    
    }

    render() {
        return (
            <svg ref = {node => this.node = node} width={3500} height={1500}>
                
            </svg>
        )
    }
}


export default Oncoprint;