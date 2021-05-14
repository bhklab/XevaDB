/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';

// creating the default margin in case not passed as props.
const defaultMargin = {
    top: 10,
    right: 20,
    bottom: 20,
    left: 50,
};

// creating the default dimensions in case not passed as props.
const defaultDimensions = {
    width: 1200 - defaultMargin.left - defaultMargin.right,
    height: 120 - defaultMargin.top - defaultMargin.bottom,
};

// this will create the svg element for the chart
const createSVGBody = (margin, dimensions) => (
    // make the svg element
    d3.select('#timechart')
        .append('svg')
        .attr('id', 'timechartplot')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('width', dimensions.width + margin.left + margin.right)
        .attr('height', dimensions.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
);

// this will create the outer triangle for the chart.
const createReactangle = (svg, height, width, x, y, color = 'black', stroke = 'black', strokeWidth = 1) => {
    svg.append('rect')
        .attr('height', height)
        .attr('width', width)
        .attr('x', x)
        .attr('y', y)
        .attr('fill', color)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth);
};

// this will create the axis for the chart.
const createAxis = (svg, maxTime, margin, dimensions) => {
    const scale = d3.scaleLinear()
        .domain([0, maxTime])
        .range([margin.left, dimensions.width / 1.25 + margin.left])
        .nice();

    const xAxis = d3.axisBottom()
        .scale(scale)
        .tickPadding(2);

    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${dimensions.height / 2 + margin.top})`)
        .style('font', '13px times')
        .call(xAxis);
};

// this will append text to the left of the chart.
const createText = (svg, margin, dimensions) => {
    svg.append('text')
        .attr('x', 0)
        .attr('y', dimensions.height / 2)
        .text('(0.5 MG/KG)');
};

// this function will create the circles in chart.
const createCircles = (svg, x, y, color) => {
    for (let i = 1; i < 11; i += 1) {
        svg.append('circle')
            .attr('cx', x * i)
            .attr('cy', y)
            .attr('r', 10)
            .attr('stroke', 'black')
            .attr('fill', color);
    }
};

const createChart = (data, margin, dimensions, maxTime) => {
    // create the svg body for the chart.
    const svg = createSVGBody(margin, dimensions);
    // appending text to the chart.
    createText(svg, margin, dimensions);
    // this will create the outer rectangle for the chart.
    createReactangle(svg, dimensions.height / 2, dimensions.width / 1.25, margin.left * 2, margin.top, 'none', 'black', 1);
    // this will create an inner rectangle for the chart.
    createReactangle(svg, dimensions.height / 7, dimensions.width / 1.25, margin.left * 2, (dimensions.height * 0.18 + margin.top), `${colors.soft_black}`);
    // creating the x-axes.
    createAxis(svg, maxTime, margin, dimensions);
    // create circles for the dose.
    createCircles(svg, margin.left * 2, dimensions.height * 0.25 + margin.top, `${colors.amber_gradient}`);
};

const TimeChart = (props) => {
    const { data } = '';
    const margin = props.margin || defaultMargin;
    const dimensions = props.dimensions || defaultDimensions;
    const { maxTime } = props;

    // create the chart on the initial render or change of variable data.
    useEffect(() => {
        if (maxTime > 0) {
            createChart(data, margin, dimensions, maxTime);
        }
    });

    return (
        <div className="curve-wrapper">
            <div id="timechart" />
        </div>
    );
};

TimeChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }),
    dimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    maxTime: PropTypes.number.isRequired,
};

export default TimeChart;
