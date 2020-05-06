import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';


const parseData = (data, response) => {
    const parsedData = {};

    data.forEach((element) => {
        Object.keys(element).forEach((patient) => {
            if (!parsedData[patient]) {
                parsedData[patient] = [];
            }
            parsedData[patient].push(element[patient][response]);
        });
    });

    return parsedData;
};

// initialize the dimensions and margins.
const initialize = () => {
    const margin = {
        // top: 10, right: 10, bottom: 10, left: 20,
        top: 1, right: 1, bottom: 1, left: 1,
    };
    const width = 20 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

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
        .attr('transform', 'translate(250, 150)')
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
        .domain([0, 24])
        .range([height, 0]);

    // svg.call(d3.axisLeft(y));

    return y;
};

// Compute summary statistics used for the box:
const computeStats = (data) => {
    const sortedData = data.sort(d3.ascending);
    const q1 = d3.quantile(sortedData, 0.25);
    const median = d3.quantile(sortedData, 0.5);
    const q3 = d3.quantile(sortedData, 0.75);
    const interQuantileRange = q3 - q1;
    // const min = q1 - 1.5 * interQuantileRange;
    // const max = q1 + 1.5 * interQuantileRange;
    const min = d3.min(data);
    const max = d3.max(data);

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
const verticalLine = (width, min, max, svg, y) => {
    svg
        .append('line')
        .attr('x1', width / 2)
        .attr('x2', width / 2)
        .attr('y1', y(min))
        .attr('y2', y(max))
        .attr('stroke', 'black');
};

// create box.
const createBox = (svg, margin, width, q3, q1, y) => {
    svg
        .append('rect')
        .attr('x', margin.left)
        .attr('y', y(q3))
        .attr('height', (y(q1) - y(q3)))
        .attr('width', width)
        .attr('stroke', 'black')
        .style('fill', '#69b3a2');
};

// create median, min and max horizontal lines
const createRest = (svg, min, median, max, width, y) => {
    svg
        .selectAll('total')
        .data([min, median, max])
        .enter()
        .append('line')
        .attr('x1', 1)
        .attr('x2', width)
        .attr('y1', (d) => (y(d)))
        .attr('y2', (d) => (y(d)))
        .attr('stroke', 'black');
};


const BoxPlot = (props) => {
    // destructuring the props.
    const { data, response, patients } = props;

    // initialize dimensions.
    const { width, height, margin } = initialize();
    const data1 = [12, 19, 11, 13, 12, 22, 13, 4, 15, 16, 18, 19, 20, 12, 11, 9];

    // parsing the data.
    const parsedData = parseData(data, response);

    // use effect function once the component is mounted/updated.
    useEffect(() => {
        // append svg.
        const svg = appendSvg(width, height, margin);
        // create axis.
        const yAxis = createAxis(width, height, svg);
        // compute stats.
        const {
            median, min, max,
            q1, q3,
        } = computeStats(data1);
            // create vertical line.
        verticalLine(width, min, max, svg, yAxis);
        // create box.
        createBox(svg, margin, width, q3, q1, yAxis);
        // create rest of the elements.
        createRest(svg, min, median, max, width, yAxis);
    });

    // return statement.
    return (
        <div>
            <div id="boxplot" />
        </div>
    );
};


BoxPlot.propTypes = {
    response: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    patients: PropTypes.arrayOf(PropTypes.string).isRequired,
};


export default BoxPlot;
