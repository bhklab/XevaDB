import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';

class DonutChart extends React.Component {

    constructor(props) {
        super(props)
        this.DonutChart = this.DonutChart.bind(this);
        this.makeDonutChart = this.makeDonutChart.bind(this);
    }

    componentDidMount() {
        //this.DonutChart()
    }

    componentDidUpdate() {
        this.DonutChart()
    }

    DonutChart() {
        const node = this.node
        const data = this.props.data.data
        this.makeDonutChart(node, data)
    }

    makeDonutChart(node, data) {
        console.log(data)
        //this.node = node

                                                /** SETTING SVG ATTRIBUTES **/

        // make the SVG element.
        let svg = d3.select(node)
                    .append('svg')
                    .attr('id', 'donutchart-' + this.props.chartId)
                    .attr('xmlns', 'http://wwww.w3.org/2000/svg')
                    .attr('xmlns:xlink', 'http://wwww.w3.org/1999/xlink')
                    .attr('height',this.props.dimensions.height + this.props.margin.top + this.props.margin.bottom)
                    .attr('width',this.props.dimensions.width + this.props.margin.left + this.props.margin.right)
                    .append('g')
                    .attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')')
        
                                                /* Skeleton for the pie/donut chart */
        // structure of the chart
        let skeleton = svg.append('g')
                          .attr('id', 'skeleton')

                                                        /* Donut Chart */

        // color scheme for the pie/donut chart using the ordinal scale.                                              
        var color = d3.scaleOrdinal()
                    .domain(data)
                    .range(['#98abc5', '#8a89a6', '#7b6888', '#efedf5', '#bcbddc', '#756bb1']);


        // arc generator
        let arc = d3.arc()
                    .outerRadius(200)
                    .innerRadius(100)

        // this is used to set the labels
        let labelArc = d3.arc()
                         .outerRadius(180)
                         .innerRadius(110)

        // pie generator/layout
        let pie = d3.pie()
                    .sort(null)
                    .value((d) => {
                        console.log(d)
                        return d.total;
                    })
        
        // this will send the data to the pie generator and appending the class arc.
        let arcs = skeleton.selectAll('.arc')
                      .data(()=> {
                          return pie(data);
                      })
                      .enter()
                      .append('g')
                      .attr('class', (d) => {
                          return (d.data.tissue).replace(/\s/g,'_') + '_Arc'
                      })
        
        // here we are appending path and use of d element to create the path.
        let piearc = arcs.append('path')
                         .attr('d', arc)
                         .attr('fill', (d) => {
                             console.log(d)
                                 return color(d.data.total);
                         })
                         .attr("stroke", "black")
                         .style("stroke-width", ".5px")

        // transition while mouseover and mouseout on each slice.
                  piearc.on('mouseover', (d) => {
                           let selection = (d.data.tissue).replace(/\s/g, '_')
                            d3.select('.' + selection + '_Arc')
                              .transition()
                              .duration(300)
                              .style("opacity", 0.4)
                              .style("cursor", "pointer")
                       })
                       .on('mousemove', (d) => {
                            let selection = (d.data.tissue).replace(/\s/g, '_')
                            d3.select('.' + selection + '_Arc')
                            .transition()
                            .duration(300)
                            .style("opacity", 0.4)
                            .style("cursor", "pointer");
                       })
                       .on('mouseout', (d) => {
                            let selection = (d.data.tissue).replace(/\s/g, '_')
                            d3.select('.' + selection + '_Arc')
                              .transition()
                              .duration(300)
                              .style("opacity", 1)
                              .style("cursor", "pointer");
                       })
                
        // append the text labels.
                    arcs.append('text')
                        .attr('transform', (d) => {
                            return 'translate(' + labelArc.centroid(d) + ')'
                        })
                        .attr("dy", "0.35em")
                        .text(d => {
                            return d.data.tissue
                        })
                        .attr("font-weight", "bold")
                        .style("text-anchor", "middle")
                        .style("font-size", 7)

        // tooltip
        let Tooltip = d3.select('#donutchart-donut')
                        .append('div')
                        .attr('class', 'tooltip')
                        .style('opacity', 0)
                        
    }

    render() {
        return (
            <div ref = {node => this.node = node} className='donut-chart'>
            
            </div>
        )
    }
}

export default DonutChart;