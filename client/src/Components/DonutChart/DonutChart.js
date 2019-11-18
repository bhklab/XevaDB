/* eslint-disable func-names */
import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';


class DonutChart extends React.Component {
    constructor(props) {
        super(props);
        this.DonutChart = this.DonutChart.bind(this);
        this.makeDonutChart = this.makeDonutChart.bind(this);
    }

    componentDidMount() {
        // this.DonutChart()
    }

    componentDidUpdate() {
        this.DonutChart();
    }

    DonutChart() {
        const { node } = this;
        const { data } = this.props;
        const { height } = this.props.dimensions;
        const { width } = this.props.dimensions;
        const { left } = this.props.margin;
        const { top } = this.props.margin;
        const { bottom } = this.props.margin;
        const { right } = this.props.margin;
        this.makeDonutChart(node, data, height, width, left, top, bottom, right);
    }

    // data should be like => {id: 'Gastric Cancer', value: 1007}
    makeDonutChart(node, data, height, width, left, top, bottom, right) {
        // console.log(data)
        const { chartId } = this.props;

        /** SETTING SVG ATTRIBUTES * */
        d3.select('svg').remove();
        // make the SVG element.
        const svg = d3.select(node)
            .append('svg')
            .attr('id', `donutchart-${this.props.chartId}`)
            .attr('xmlns', 'http://wwww.w3.org/2000/svg')
            .attr('xmlns:xlink', 'http://wwww.w3.org/1999/xlink')
            .attr('height', height + top + bottom)
            .attr('width', width + left + right)
            .append('g')
            .attr('transform', `translate(${left},${top})`);

        /* Skeleton for the pie/donut chart */
        // structure of the chart
        const skeleton = svg.append('g')
            .attr('id', 'skeleton');

        /* Donut Chart */

        // color scheme for the pie/donut chart using the ordinal scale.

        const colors = ['#E64B35FF', '#4DBBD5FF', '#00A087FF', '#3C5488FF', '#F39B7FFF', '#8491B4FF', '#91D1C2FF', '#B09C85FF',
            '#0073C2FF', '#868686FF', '#CD534CFF', '#7AA6DCFF', '#003C67FF', '#3B3B3BFF', '#A73030FF', '#4A6990FF',
            '#00468BBF', '#42B540BF', '#0099B4BF', '#925E9FBF', '#FDAF91BF', '#AD002ABF', '#ADB6B6BF',
        ];

        const color = d3.scaleOrdinal()
            .domain(data)
            .range(colors);


        /* div element for the tooltip */
        // create a tooltip
        const tooltip = d3.select(node)
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
        const arc = d3.arc()
            .outerRadius(this.props.arc.outerRadius)
            .innerRadius(this.props.arc.innerRadius);

        // this is used to set the labels
        const labelArc = d3.arc()
            .outerRadius(this.props.arc.outerRadius - 20)
            .innerRadius(this.props.arc.innerRadius + 10);

        /* Pie/Donut chart layout */

        // pie generator/layout
        const pie = d3.pie()
            .sort(null)
            .value((d) => d.value);

        // this will send the data to the pie generator and appending the class arc.
        const arcs = skeleton.selectAll('.arc')
            .data(() => pie(data))
            .enter()
            .append('a')
            .attr('xlink:href', (d, i) => {
                if (chartId === 'donut_datasets') {
                    return `/dataset/${data[i].parameter}`;
                }
            })
            .append('g')
            .attr('class', (d) => `${(d.data.id).replace(/\s/g, '').replace(/[(-)]/g, '')}_Arc`);

        // here we are appending path and use of d element to create the path.
        const piearc = arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d) => color(d.data.value))
            .attr('stroke', 'black')
            .style('stroke-width', '.5px');

        function pieTween(b) {
            b.innerRadius = 0;
            const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, b);
            return function (t) {
                return arc(i(t));
            };
        }
        // transition of the arcs for the pie chart itself.
        piearc.transition()
            .ease(d3.easeLinear)
            .duration(500)
            .attrTween('d', pieTween);

        // this is a very basic tooltip.
        /*
                piearc.append('title')
                    .text((d) => {
                        return 'value is ' + d.data.value
                    })
                */
        /* event listeners */

        const mouseover = function (d) {
            const selection = (d.data.id).replace(/\s/g, '').replace(/[(-)]/g, '');
            d3.select(`.${selection}_Arc`)
                .transition()
                .duration(300)
                .style('opacity', 0.4)
                .style('cursor', 'pointer');
            // tooltip on mousever setting the div to visible.
            tooltip
                .style('visibility', 'visible');
        };

        const mousemove = function (d) {
            const selection = (d.data.id).replace(/\s/g, '').replace(/[(-)]/g, '');
            d3.select(`.${selection}_Arc`)
                .transition()
                .duration(300)
                .style('opacity', 0.4)
                .style('cursor', 'pointer');
            // tooltip grabbing event.pageX and event.pageY and set color according to the ordinal scale.
            const value = ` (${d.data.value})`;
            tooltip
                .text([d.data.id + value])
                .style('left', `${d3.event.pageX + 10}px`)
                .style('top', `${d3.event.pageY + 10}px`)
                .style('color', 'white')
                .style('background-color', color(d.data.value));
        };

        const mouseout = function (d) {
            const selection = (d.data.id).replace(/\s/g, '').replace(/[(-)]/g, '');
            d3.select(`.${selection}_Arc`)
                .transition()
                .duration(300)
                .style('opacity', 1)
                .style('cursor', 'pointer');
            // tooltip on mouseout.
            tooltip
                .style('visibility', 'hidden')
                .style('background-color', 'black');
        };

        // transition while mouseover and mouseout on each slice.
        piearc.on('mouseover', (d) => {
            mouseover(d);
        })
            .on('mousemove', (d, i) => {
                mousemove(d);
            })
            .on('mouseout', (d) => {
                mouseout(d);
            });

        /* Label with event listeners */

        // append the text labels.
        if (this.props.chartId !== 'donut_drugs' && this.props.chartId !== 'donut_datasets' && this.props.chartId !== 'donut_tissues') {
            arcs.append('text')
                .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
                .attr('dy', '0.35em')
                .text((d) => {
                    if (d.data.id === 'Non-small Cell Lung Carcinoma') {
                        return 'NSCLC';
                    } return d.data.id;
                })
            // .attr('font-weight', 'bold')
                .style('text-anchor', 'middle')
                .style('font-size', 14)
                .attr('fill', 'white')
                .on('mouseover', (d) => {
                    mouseover(d);
                })
                .on('mousemove', (d) => {
                    mousemove(d);
                })
                .on('mouseout', (d) => {
                    mouseout(d);
                });
        }


        /**   Legends for the Donut Chart * */

        // small side rectangles or legends for the donut chart.
        const donut_rect = svg.append('g')
            .attr('id', 'donut_small_rect');


        donut_rect.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (width) - 240)
            .attr('y', (d, i) => (-20 * i + (data.length) * 10) - i * 8)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', (d) => color(d.value));

        donut_rect.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('x', (width) - 200)
            .attr('y', (d, i) => (-20 * i + (data.length) * 10) - i * 8 + 15)
            .attr('fill', (d) => color(d.value))
            .text((d) => d.id);
    }

    render() {
        return (
            <div
                ref={(node) => this.node = node}
                className="donut-chart"
            />
        );
    }
}


DonutChart.propTypes = {
    dimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
    }).isRequired,
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }).isRequired,
    chartId: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    arc: PropTypes.object.isRequired,
};

export default DonutChart;
