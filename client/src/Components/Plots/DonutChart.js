/* eslint-disable func-names */
import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import addOpacityToColor from '../../utils/AddOpacityToColor';
import createToolTip from '../../utils/ToolTip';
import donutColors from '../../utils/ChartColors';
import colors from '../../styles/colors';

class DonutChart extends React.Component {
    constructor(props) {
        super(props);
        this.dimensions = { width: 650, height: 250 };
        this.arc = { outerRadius: 260, innerRadius: 150 };
        this.margin = {
            top: 320, right: 100, bottom: 100, left: 380,
        };
    }

    componentDidMount() {
        this.DonutChart();
    }

    DonutChart = () => {
        const dimensions = this.props.dimensions || this.dimensions;
        const margin = this.props.margin || this.margin;
        const { height, width } = dimensions;
        const {
            left, top, bottom, right,
        } = margin;
        const { data } = this.props;
        const arcRadius = this.props.arcRadius || this.arc;
        const { tooltipMapper } = this.props;
        const { colorMapper } = this.props;
        const { opacity } = this.props;
        const { chartId } = this.props;
        const shouldDisplayLegend = this.props.shouldDisplayLegend ?? true;
        const shouldDisplayTextLabels = this.props.shouldDisplayTextLabels ?? false;
        const centerLegend = this.props.centerLegend ?? '';

        this.makeDonutChart(
            data, height, width, left, top, bottom, right, arcRadius,
            tooltipMapper, colorMapper, shouldDisplayLegend, opacity, chartId,
            shouldDisplayTextLabels, centerLegend,
        );
    }

    // data should be like => {id: 'Gastric Cancer', value: 1007}
    makeDonutChart = (
        data, height, width, left, top, bottom, right, arcRadius,
        tooltipMapper, colorMapper, shouldDisplayLegend, opacity, chartId,
        shouldDisplayTextLabels, centerLegend,
    ) => {
        // make the SVG element.
        const svg = d3.select(`#donut-${chartId}`)
            .append('svg')
            .attr('id', `donutchart-${chartId}-svg`)
            .attr('xmlns', 'http://wwww.w3.org/2000/svg')
            .attr('xmlns:xlink', 'http://wwww.w3.org/1999/xlink')
            .attr('height', height + top + bottom)
            .attr('width', width + left + right)
            .append('g')
            .attr('transform', `translate(${left},${top})`);

        // structure of the chart
        const skeleton = svg.append('g')
            .attr('id', 'skeleton');

        // color scale
        const color = d3.scaleOrdinal()
            .domain(data.map((val) => val.id))
            .range(donutColors);

        // create a tooltip
        const tooltip = createToolTip('tooltip');

        /* Arc for the main pie chart and label arc */
        // arc generator
        const arc = d3.arc()
            .outerRadius(arcRadius.outerRadius)
            .innerRadius(arcRadius.innerRadius)
            .padAngle(0.02);

        // this is used to set the labels
        const labelArc = d3.arc()
            .outerRadius(arcRadius.outerRadius - 20)
            .innerRadius(arcRadius.innerRadius + 10);

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
            .attr('fill', (d) => (colorMapper && opacity
                ? addOpacityToColor(colorMapper?.[d.data.id], opacity)
                : color(d.data.id)));
        // .attr('stroke', 'black')
        // .style('stroke-width', '0.75px');

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

        /* event listeners */
        const mouseover = function (d) {
            const selection = (d.data.id).replace(/\s/g, '').replace(/[(-)]/g, '');
            d3.select(`.${selection}_Arc`)
                .transition()
                .duration(100)
                .style('opacity', opacity ? 1.0 : 0.5)
                .style('cursor', 'pointer');
            // tooltip on mousever setting the div to visible.
            tooltip
                .style('visibility', 'visible');
        };

        const mousemove = function (d, mapper) {
            const selection = (d.data.id).replace(/\s/g, '').replace(/[(-)]/g, '');
            d3.select(`.${selection}_Arc`)
                .transition()
                .duration(100)
                .style('opacity', opacity ? 1.0 : 0.5)
                .style('cursor', 'pointer');

            const value = Object.keys(mapper).map((key) => `${key}: ${d.data[mapper[key]]}`).join('<br/>');

            // tooltip grabbing event.pageX and event.pageY
            // and set color according to the ordinal scale.
            tooltip
                .html([value])
                .style('left', `${d3.event.layerX + 10}px`)
                .style('top', `${d3.event.layerY + 10}px`)
                .style('color', 'white')
                .style('background-color', colorMapper?.[d.data.id] ?? color(d.data.id))
                .style('font-size', '0.85em');
        };

        const mouseout = function (d) {
            const selection = (d.data.id).replace(/\s/g, '').replace(/[(-)]/g, '');
            d3.select(`.${selection}_Arc`)
                .transition()
                .duration(100)
                .style('opacity', 1)
                .style('cursor', 'pointer');
            // tooltip on mouseout.
            tooltip
                .style('visibility', 'hidden')
                .style('background-color', 'black');
        };

        // transition while mouseover and mouseout on each slice.
        piearc
            .on('mouseover', (d) => {
                mouseover(d);
            })
            .on('mousemove', (d) => {
                mousemove(d, tooltipMapper);
            })
            .on('mouseout', (d) => {
                mouseout(d);
            });

        /* Label with event listeners */
        // append the text labels.
        if (shouldDisplayTextLabels) {
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
                .style('font-size', 12)
                .attr('fill', 'black')
                .style('opacity', 0.75)
                .style('font-weight', 700)
                .on('mouseover', (d) => {
                    mouseover(d);
                })
                .on('mousemove', (d) => {
                    mousemove(d, tooltipMapper);
                })
                .on('mouseout', (d) => {
                    mouseout(d);
                });
        }

        /**   Legends for the Donut Chart * */

        // small side rectangles or legends for the donut chart.
        if (shouldDisplayLegend) {
            const donutRect = svg.append('g')
                .attr('id', 'donut_legend');

            donutRect.selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('x', (width) - 290)
                .attr('y', (d, i) => ((30 * i) - (data.length * 15)))
                .attr('width', 20)
                .attr('height', 20)
                .attr('fill', (d) => colorMapper?.[d.id] ?? color(d.id));

            donutRect.selectAll('text')
                .data(data)
                .enter()
                .append('a')
                .attr('xlink:href', (d, i) => {
                    if (chartId === 'donut_datasets') {
                        return `/dataset/${data[i].parameter}`;
                    }
                })
                .append('text')
                .attr('x', (width) - 250)
                .attr('y', (d, i) => ((30 * i) - (data.length * 15)) + 15)
                .attr('fill', (d) => colorMapper?.[d.id] ?? color(d.id))
                .text((d) => `${d.id.charAt(0).toUpperCase() + d.id.slice(1)}`)
                .style('font-size', '0.9em');
        }

        // append center legend it it's available
        if (centerLegend) {
            d3.select('#skeleton').append('text')
                .attr('x', -37.5)
                .attr('y', 5)
                .text(`${centerLegend}`)
                .style('font-weight', 700)
                .style('font-size', '1em')
                .style('fill', `${colors['--main-font-color']}`);
        }
    }

    render() {
        return (
            <>
                <div id='tooltip' />
                <div
                    id={`donut-${this.props.chartId}`}
                    className='donut-chart'
                />
            </>
        );
    }
}

DonutChart.propTypes = {
    dimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
    }),
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }),
    chartId: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        value: PropTypes.number,
        parameter: PropTypes.number,
    })).isRequired,
    arcRadius: PropTypes.shape({
        innerRadius: PropTypes.number,
        outerRadius: PropTypes.number,
    }),
    tooltipMapper: PropTypes.object.isRequired,
    colorMapper: PropTypes.object,
    shouldDisplayLegend: PropTypes.bool,
    shouldDisplayTextLabels: PropTypes.bool,
    centerLegend: PropTypes.string,
    opacity: PropTypes.number,
};

export default DonutChart;
