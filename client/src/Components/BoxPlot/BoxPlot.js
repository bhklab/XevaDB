import React, { useEffect } from 'react';
import * as d3 from 'd3';

const initialize = () => {
    const margin = {
        top: 10, right: 30, bottom: 30, left: 40,
    };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    return {
        margin,
        height,
        width,
    };
};

// append svg to the div element.
const appendSvg = (width, height, margin) => {
    const svg = d3.select('#boxplot')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform',
            `translate(${margin.left},${margin.top})`)
        .style('background-color', 'grey')
        .attr('id', 'boxplotsvg');

    return svg;
};

// create y axis.
const createAxis = (width, height, svg) => {
    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 24]);
    svg.call(d3.axisLeft(y));

    return y;
};

// Compute summary statistics used for the box:
const computeStats = (data) => {
    const sortedData = data.sort(d3.ascending);
    const q1 = d3.quantile(sortedData, 0.25);
    const median = d3.quantile(sortedData, 0.5);
    const q3 = d3.quantile(sortedData, 0.75);
    const interQuantileRange = q3 - q1;
    const min = q1 - 1.5 * interQuantileRange;
    const max = q1 + 1.5 * interQuantileRange;

    return {
        sortedData,
        median,
        min,
        max,
        q1,
        q3,
    };
};

// create main vertical line.
const verticalLine = (center, min, max, svg, y) => {
    svg
        .append('line')
        .attr('x1', center)
        .attr('x2', center)
        .attr('y1', y(min))
        .attr('y2', y(max))
        .attr('stroke', 'black');
};

// create box.
const createBox = (svg, center, width, q3, q1, y) => {
    svg
        .append('rect')
        .attr('x', center - width / 2)
        .attr('y', y(q3))
        .attr('height', (y(q1) - y(q3)))
        .attr('width', width)
        .attr('stroke', 'black')
        .style('fill', '#69b3a2');
};

// create median, min and max horizontal lines
const createRest = (svg, min, median, max, center, width, y) => {
    svg
        .selectAll('toto')
        .data([min, median, max])
        .enter()
        .append('line')
        .attr('x1', center - width / 2)
        .attr('x2', center + width / 2)
        .attr('y1', (d) => (y(d)))
        .attr('y2', (d) => (y(d)))
        .attr('stroke', 'black');
};


const BoxPlot = () => {
    const a = 10;
    const data = [12, 19, 11, 13, 12, 22, 13, 4, 15, 16, 18, 19, 20, 12, 11, 9];
    const center = 200;
    useEffect(() => {
        // initialize variables.
        const { width, height, margin } = initialize();
        // append svg.
        const svg = appendSvg(width, height, margin);
        // create axis.
        const yAxis = createAxis(width, height, svg);
        // compute stats.
        const {
            sortedData, median, min, max,
            q1, q3,
        } = computeStats(data);
        // create vertical line.
        verticalLine(center, min, max, svg, yAxis);
        // create box.
        createBox(svg, center, 100, q3, q1, yAxis);
        // create rest of the elements.
        createRest(svg, min, median, max, center, 100, yAxis);
    });

    // return statement.
    return (
        <div>
            <h1> Hey its a density plot!! </h1>
            <div id="boxplot" />
        </div>
    );
};

export default BoxPlot;
