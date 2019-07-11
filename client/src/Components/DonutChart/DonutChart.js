import React from 'react';
import * as d3 from 'd3';

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
        const data = this.props.data
        this.makeDonutChart(node, data)
    }

    // data should be like => {id: "Gastric Cancer", value: 1007}
    makeDonutChart(node, data) {
        console.log(data)

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
        
        let colors = ['#5254a3', '#7b6888', '#843c39', '#d6616b', '#a55194', '#393b79']

        let color = d3.scaleOrdinal()
                      .domain(data)
                      .range(colors);


                                                        /* div element for the tooltip */
        // create a tooltip
        let tooltip = d3.select(node)
                            .append('div')
                            .style('position', 'absolute')
                            .style('visibility', 'hidden')
                            .style('border', 'solid')
                            .style('border-width', '2px')
                            .style('border-radius', '5px')
                            .style('padding', '5px')
                            .attr('top', 10)
                            .attr('left', 20);


                                                        /* Arc for the main pie chart and label arc */

        // arc generator
        let arc = d3.arc()
                    .outerRadius(200)
                    .innerRadius(100)

        // this is used to set the labels
        let labelArc = d3.arc()
                         .outerRadius(180)
                         .innerRadius(110)

                                                             /* Pie/Donut chart layout */

        // pie generator/layout
        let pie = d3.pie()
                    .sort(null)
                    .value((d) => {
                        return d.value;
                    })
        
        // this will send the data to the pie generator and appending the class arc.
        let arcs = skeleton.selectAll('.arc')
                      .data(() => {
                          return pie(data);
                      })
                      .enter()
                      .append('g')
                      .attr('class', (d) => {
                          return (d.data.id).replace(/\s/g,'_') + '_Arc'
                      })
        
        // here we are appending path and use of d element to create the path.
        let piearc = arcs.append('path')
                         .attr('d', arc)
                         .attr('fill', (d) => {
                            return color(d.data.value);
                         })
                         .attr('stroke', 'black')
                         .style('stroke-width', '.5px')
              
        // transition of the arcs for the pie chart itself.
        piearc.transition()
                .ease(d3.easeLinear)
                .duration(500)
                .attrTween('d', pieTween);

        function pieTween(b) {
            b.innerRadius = 0;
            let i = d3.interpolate({startAngle: 0, endAngle:0}, b);
            return function(t) {
                return arc(i(t))
            }
        }
                       
        // this is a very basic tooltip.
                /*
                piearc.append('title')
                    .text((d) => {
                        return 'value is ' + d.data.value
                    })
                */    
                                                                        /* event listeners */

        let mouseover = function(d) {
            let selection = (d.data.id).replace(/\s/g, '_')
            d3.select('.' + selection + '_Arc')
                .transition()
                .duration(300)
                .style('opacity', 0.4)
                .style('cursor', 'pointer')
            // tooltip on mousever setting the div to visible.
            tooltip
                .style('visibility', 'visible')
        }

        let mousemove = function(d) {
            let selection = (d.data.id).replace(/\s/g, '_')
            d3.select('.' + selection + '_Arc')
                .transition()
                .duration(300)
                .style('opacity', 0.4)
                .style('cursor', 'pointer')
            // tooltip grabbing event.pageX and event.pageY and set color according to the ordinal scale.
            let value = ' (' + d.data.value + ')'
            tooltip
                .text([d.data.id + value])
                .style('left', d3.event.pageX + 10 + 'px')
                .style('top', d3.event.pageY + 10 + 'px')
                .style('color', 'white')
                .style('background-color', color(d.data.value))
        }

        let mouseout = function(d) {
            let selection = (d.data.id).replace(/\s/g, '_')
            d3.select('.' + selection + '_Arc')
                .transition()
                .duration(300)
                .style('opacity', 1)
                .style('cursor', 'pointer')
            // tooltip on mouseout.
            tooltip
                .style('visibility', 'hidden')
                .style('background-color', 'black')
        }

        // transition while mouseover and mouseout on each slice.
          piearc.on('mouseover', (d) => {
                       mouseover(d)
                    })
                    .on('mousemove', (d,i) => {
                        mousemove(d)
                    })
                    .on('mouseout', (d) => {
                       mouseout(d)
                    })
    
                                                                    /* Label with event listeners */

        // append the text labels.
            arcs.append('text')
                    .attr('transform', (d) => {
                        return 'translate(' + labelArc.centroid(d) + ')'
                    })
                    .attr('dy', '0.35em')
                    .text(d => {
                        if (d.data.id === "Non-small Cell Lung Carcinoma") {
                            return "NSCLC"
                        }
                        else { return d.data.id }
                    })
                    //.attr('font-weight', 'bold')
                    .style('text-anchor', 'middle')
                    .style('font-size', 10)
                    .attr('fill', 'white')
                    .on('mouseover', (d) => {
                        mouseover(d)
                    })
                    .on('mousemove', (d) => {
                        mousemove(d)
                    })
                    .on('mouseout', (d) => {
                        mouseout(d)
                    })
                            
    }

    render() {
        return (
            <div ref = {node => this.node = node} className='donut-chart'>
            
            </div>
        )
    }
}

export default DonutChart;