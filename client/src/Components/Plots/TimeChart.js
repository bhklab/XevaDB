/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

// creating the default margin in case not passed as props.
const defaultMargin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
};

// creating the default dimensions in case not passed as props.
const defaultDimensions = {
    width: 930 - defaultMargin.left - defaultMargin.right,
    height: 100 - defaultMargin.top - defaultMargin.bottom,
};

// this will create the svg element for the chart
const createSVGBody = (margin, dimensions) => {
    // make the svg element
    return d3.select('#timechart')
        .append('svg')
        .attr('id', 'timechartplot')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('width', dimensions.width + margin.left + margin.right)
        .attr('height', dimensions.height + margin.top + margin.bottom)
        .append('g');
    // .attr('transform', `translate(${margin.left},${margin.top})`);
};

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

// this function will create the circles in chart.
const createCircles = () => {

};

const createChart = (data, margin, dimensions) => {
    // create the svg body for the chart.
    const svg = createSVGBody(margin, dimensions);
    // this will create the outer rectangle for the chart.
    createReactangle(svg, dimensions.height, dimensions.width, margin.left, margin.top, 'none', 'black', 1);
    // this will create an inner rectangle for the chart.
    createReactangle(svg, dimensions.height / 4, dimensions.width, margin.left, dimensions.height * 0.375 + margin.top);

};

const TimeChart = ({ props }) => {
    const data = props;
    const margin = props || defaultMargin;
    const dimensions = props || defaultDimensions;

    // create the chart on the initial render or change of variable data.
    useEffect(() => {
        createChart(data, margin, dimensions);
    }, [data]);

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
};

export default TimeChart;
