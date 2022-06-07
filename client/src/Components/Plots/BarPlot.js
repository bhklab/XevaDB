/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import styled from 'styled-components';
import colors from '../../styles/colors';
import barPlotColors from '../../utils/ChartColors';

// bar plot styles
const StyledBarPlot = styled.div`
    width: 90%;
    margin: auto;
    overflow-x: scroll;

    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 10px;
        height: 10px;
    }
      
    ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: rgba(0, 0, 0, .5);
        box-shadow: 0 0 1px rgba(255, 255, 255, .5);
    }
`;

// defaul parameters.
const defaultMargin = { top: 50, right: 150, bottom: 200, left: 100 };
const defaultDimensions = { width: 850, height: 400 };
const defaultArc = { outerRadius: 260, innerRadius: 150 };
const minBarWidth = 60;

// create the svg canvas.
const createSvg = (width, height, left, right, top, bottom) => {
    const svg = d3.select('#barplot')
        .append('svg')
        .attr('width', width + left + right)
        .attr('height', height + top + bottom)
        .attr('id', 'barplotsvg')
        .append('g')
        .attr('transform', `translate(${left},${top})`);

    return svg;
};

// x scale for the plot
const createXScale = (width, data, isScatter) => {
    let scale = d3.scaleBand()
        .domain([...new Set(data.map((d) => d.id))])
        .range([0, width]);

    if (!isScatter) {
        scale = scale.padding([0.3]);
    };

    return scale;
};

// y scale for the plot
const createYScale = (height, max) => {
    const scale = d3.scaleLinear()
        .domain([0, max])
        .range([height, 0]);

    return scale;
};

// if the bar plot y axis need text discription
const createYScaleWithText = (height, yAxisTicks) => {
    const scale = d3.scalePoint()
        .domain(yAxisTicks)
        .range([height, 0])
        .padding(1);

    return scale;
};

// color scale
const colorScale = (data, colors) => {
    const values = data.map((element) => element.id);

    const scale = d3.scaleOrdinal()
        .domain(values)
        .range(colors);

    return scale;
};

// create the x axis for the chart
const createXAxis = (svg, xScale, height, isScatter) => {
    const bottomAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(7);

    let xAxis = svg.append('g')
        .call(bottomAxis)
        .attr('transform', `translate(0,${height})`)
        .selectAll('text')
        .style('font-size', 13);

    if (isScatter) {
        xAxis
            .attr('transform', 'translate(14,10) rotate(90)')
            .style('text-anchor', 'start')
    } else {
        xAxis
            .attr('transform', 'translate(-10,0) rotate(-45)')
            .style('text-anchor', 'end')
    }
};

// create y axis for the plot
const createYAxis = (svg, yScale) => {
    const axis = d3.axisLeft()
        .scale(yScale);
    // .ticks(7);

    svg.append('g')
        .call(axis)
        .style('font-size', 13);
};

// create bars
const createBars = (svg, data, xScale, yScale, height, color) => {
    svg.selectAll('bars')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.id))
        .attr('y', (d) => yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => height - yScale(d.value))
        .attr('id', (d) => `bar_${d.id}`)
        .attr('fill', (d) => d.color || color(d.id));
};

// create circles
const createCircles = (svg, data, xScale, yScale, height, color) => {
    svg.selectAll('bars')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.id) + (minBarWidth / 7))
        .attr('cy', (d) => yScale(d.value))
        .attr('r', 5)
        .attr('id', (d) => `circle_${d.id}`)
        .attr('fill', `${colors.pink_header}`)
        .attr('stroke', `${colors.pink_header}`)
        .attr('stroke-width', 1);
};

// append text with values on the top of bars
const appendBarText = (svg, data, xScale, yScale) => {
    data.forEach((element) => {
        svg.append('text')
            .attr('x', xScale(element.id) + (xScale.bandwidth() / 3))
            .attr('y', yScale(element.value) - 4)
            .attr('font-family', 'Open Sans')
            .attr('font-size', '12px')
            .style('text-anchor', 'start')
            .attr('fill', 'black')
            .text(element.value);
    });
};

// append label
const appendYAxisLabel = (svg, height, left, label) => {
    svg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('font-family', 'Open Sans')
        .attr('transform', `translate(${-left / 2}, ${height / 1.5})rotate(270)`)
        .attr('font-size', '14px')
        .style('text-anchor', 'start')
        .attr('fill', 'black')
        .text(`${label}`);
};

// main component function for the bar plot
const BarPlot = (props) => {
    // getting the prop data.
    const margin = props.margin || defaultMargin;
    let { data } = props;
    const { left, right, top, bottom } = margin;
    const yAxisLabel = props.label;
    const dimensions = props.dimensions || { ...defaultDimensions };
    const { yAxisTicks } = props;
    const { shouldAppendBarText, isScatter } = props;

    // update dimensions
    const dataLength = [...new Set(data.map(el => el.id))].length;
    if (minBarWidth * dataLength > dimensions.width) {
        dimensions.width = minBarWidth * dataLength;
    };
    if (isScatter) {
        dimensions.width = minBarWidth / 3.5 * dataLength;
    }
    const { width, height } = dimensions;


    // calulcates the max value in the data.
    let max = 0;
    data.forEach((val) => {
        if (val.value > max) {
            max = val.value;
        }
    });

    // sort data
    data = data.sort((b, a) => a.value - b.value);

    useEffect(() => {
        // remove the element if already present.
        d3.select('#barplotsvg').remove();

        // svg canvas.
        const svg = createSvg(width, height, left, right, top, bottom);

        // scales and axis.
        const xScale = createXScale(width, data, isScatter);
        const yScale = yAxisTicks ? createYScaleWithText(height, yAxisTicks) : createYScale(height, max);
        const color = colorScale(data, barPlotColors);

        createXAxis(svg, xScale, height, isScatter);
        createYAxis(svg, yScale);

        // append text.
        if (shouldAppendBarText) {
            appendBarText(svg, data, xScale, yScale);
        };

        // create bars.
        if (isScatter) {
            createCircles(svg, data, xScale, yScale, height, color);
        } else {
            createBars(svg, data, xScale, yScale, height, color);
        };

        // append y-axis test/label.
        appendYAxisLabel(svg, height, left, yAxisLabel);
    }, [data]);

    return (
        <StyledBarPlot>
            <div
                id="barplot"
                style={{ textAlign: 'center' }}
            />
        </StyledBarPlot>
    );
};

// proptypes
BarPlot.propTypes = {
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
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    label: PropTypes.string.isRequired,
    yAxisTicks: PropTypes.arrayOf(PropTypes.string),
    shouldAppendBarText: PropTypes.bool,
    isScatter: PropTypes.bool,
};

export default BarPlot;
