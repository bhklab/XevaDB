import React from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'


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
        const height = this.props.dimensions.height
        const width = this.props.dimensions.width
        const left = this.props.margin.left
        const top = this.props.margin.top
        const bottom = this.props.margin.bottom
        const right = this.props.margin.right
        this.makeDonutChart(node, data, height, width, left, top, bottom, right)
    }

    // data should be like => {id: 'Gastric Cancer', value: 1007}
    makeDonutChart(node, data, height, width, left, top, bottom, right) {
        //console.log(data)

                                                /** SETTING SVG ATTRIBUTES **/

        // make the SVG element.
        let svg = d3.select(node)
                    .append('svg')
                    .attr('id', 'donutchart-' + this.props.chartId)
                    .attr('xmlns', 'http://wwww.w3.org/2000/svg')
                    .attr('xmlns:xlink', 'http://wwww.w3.org/1999/xlink')
                    .attr('height',height + top + bottom)
                    .attr('width',width + left + right)
                    .append('g')
                    .attr('transform', 'translate(' + left + ',' + top + ')')
        
                                                /* Skeleton for the pie/donut chart */
        // structure of the chart
        let skeleton = svg.append('g')
                          .attr('id', 'skeleton')

                                                        /* Donut Chart */

        // color scheme for the pie/donut chart using the ordinal scale.     
        
        let colors = ["#E64B35FF" ,"#4DBBD5FF" ,"#00A087FF" ,"#3C5488FF" ,"#F39B7FFF"  ,"#8491B4FF" ,"#91D1C2FF" ,"#B09C85FF"
                        ,"#0073C2FF" ,"#868686FF" ,"#CD534CFF" ,"#7AA6DCFF" ,"#003C67FF" ,"#3B3B3BFF" ,"#A73030FF" ,"#4A6990FF"
                       ,"#00468BBF" ,"#42B540BF" ,"#0099B4BF" ,"#925E9FBF" ,"#FDAF91BF" ,"#AD002ABF" ,"#ADB6B6BF"
                     ]

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
                    .outerRadius(this.props.arc.outerRadius)
                    .innerRadius(this.props.arc.innerRadius)

        // this is used to set the labels
        let labelArc = d3.arc()
                         .outerRadius(this.props.arc.outerRadius - 20)
                         .innerRadius(this.props.arc.innerRadius + 10)

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
                          return (d.data.id).replace(/\s/g,'').replace(/[(-)]/g, '') + '_Arc'
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
            let selection = (d.data.id).replace(/\s/g, '').replace(/[(-)]/g, '')
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
            let selection = (d.data.id).replace(/\s/g, '').replace(/[(-)]/g, '')
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
            let selection = (d.data.id).replace(/\s/g, '').replace(/[(-)]/g, '')
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
        if(this.props.chartId !== 'donut_drug' && this.props.chartId !== 'donut_dataset') {
            arcs.append('text')
                    .attr('transform', (d) => {
                        return 'translate(' + labelArc.centroid(d) + ')'
                    })
                    .attr('dy', '0.35em')
                    .text(d => {
                        if (d.data.id === 'Non-small Cell Lung Carcinoma') {
                            return 'NSCLC'
                        }
                        else { return d.data.id }
                    })
                    //.attr('font-weight', 'bold')
                    .style('text-anchor', 'middle')
                    .style('font-size', 14)
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
            
                        

                                                                    /**   Legends for the Donut Chart **/

        // small side rectangles or legends for the donut chart.
            let donut_rect = svg.append('g')
                                     .attr('id', 'donut_small_rect')
                            
                            
                            donut_rect.selectAll('rect')
                                        .data(data)
                                        .enter()
                                        .append('rect')
                                        .attr('x', (width) - 240)
                                        .attr('y', function(d, i) {
                                            return (-20 * i + (data.length)*10) - i * 8
                                        })
                                        .attr('width', 20)
                                        .attr('height', 20)
                                        .attr('fill', (d) => {
                                            return color(d.value);
                                        })

                            donut_rect.selectAll('text')
                                        .data(data)
                                        .enter()
                                        .append('text')
                                        .attr('x', (width) - 200)
                                        .attr('y', function(d, i) {
                                            return (-20 * i + (data.length)*10) - i * 8 + 15
                                        })
                                        .attr('fill', (d) => {
                                            return color(d.value)
                                        })
                                        .text(d => {
                                            //console.log(d)
                                            return d.id;
                                        })              
    }

    render() {
        return (
            <div 
                ref = {node => this.node = node} 
                className = 'donut-chart'
            >
            </div>
        )
    }
}


DonutChart.propTypes = {
    dimensions: PropTypes.object.isRequired,
    margin: PropTypes.object.isRequired,
    chartId: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    arc: PropTypes.object.isRequired
}

export default DonutChart