import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import createSvgCanvas from '../../utils/CreateSvgCanvas';
import colors from '../../styles/colors';
import createToolTip from '../../utils/ToolTip';
import styled from 'styled-components';

// style for forest plot.
const StyledForestPlot = styled.div`
    width: 80%;
    margin: auto;

    @media screen and (min-width: 1600px) {
        width: 65%;
    }
`;

// data length and multiplier variables.
const ADDITIONAL = 2;

// variable to calculate chart width relative to the svg width.
const CHART_WIDTH = 0.75;

// width & height of square/rectangle for legend.
const RECTANGLE_DIMENSIONS = 20;

// canvas id.
const CANVAS_ID = 'forestplot-canvas';

// tooltip ID.
const TOOLTIP_ID = 'forestplot-tooltip';

// legend variable.
const legend = [
    // { text: 'FDR < 0.05 and r > 0.7', color: `${colors.pink_header}` },
    { text: 'FDR < 0.05', color: `${colors.pink_header}` },
    { text: 'FDR > 0.05', color: `${colors.silver}` },
];

// margin for the svg element.
const margin = {
    top: 40,
    right: 20,
    bottom: 150,
    left: 20,
};

// width and height of the SVG canvas.
const width = 1300 - margin.left - margin.right;
const height = 550 - margin.top - margin.bottom;

/**
 * @param {Array} data - input data.
 */
const calculateMinMax = (data) => {
    // calculates the minimum and maximum estimate from the data.
    const minEstimate = Math.min(...data.map((val) => val.estimate));
    const maxEstimate = Math.max(...data.map((val) => val.estimate));

    // calculates the minimum and maximum analytic from the data.
    const min = Math.min(...data.map((val) => val.ci_lower));
    const max = Math.max(...data.map((val) => val.ci_upper));

    return {
        min,
        max,
    }
};

/**
 * @param {Array} data 
 */
const calculateMinMaxN = (data) => {
    const minN = Math.min(...data.map((val) => val.n));
    const maxN = Math.max(...data.map((val) => val.n));

    return { minN, maxN };
};

/**
 * mouseover event for horizontal line as well as the circle.
 * @param {Object} event 
 * @param {Object} element 
 * @param {boolean} isAnalytic
 */
const mouseOverEvent = (event, element) => {
    // make the visibility of the tool tip to visible.
    const toolTip = d3.select('#tooltip')
        .style('visibility', 'visible')
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY + 10}px`)
        .style('color', `${colors.black}`)
        .style('background-color', `${colors.white}`);

    // append text.
    // const fdr = isAnalytic ? element.fdr_analytic : element.fdr_permutation;
    // const pc = element.estimate;
    const text = element.fdr < 0.05 ? 'Strong Biomarker' : 'Weak Biomarker';

    toolTip.
        append('text')
        .attr('id', 'tooltiptext')
        .text(text);

    // show pearson correlation cofficient on mouse over.
    d3.select(`#estimate-${element.id}-x1`).attr('visibility', 'visible');
    d3.select(`#estimate-${element.id}-x2`).attr('visibility', 'visible');
};

/**
 * mouseout event handler for horizontal line as well as the circle.
 * @param {Object} event 
 * @param {Object} element 
 */
const mouseOutEvent = (event, element) => {
    // make visibility hidden.
    d3.select('#tooltip')
        .style('visibility', 'hidden');
    // remove all the divs with id tooltiptext.
    d3.selectAll('#tooltiptext').remove();
    // hide pearson correlation cofficient on mouse over.
    d3.select(`#estimate-${element.id}-x1`).attr('visibility', 'hidden');
    d3.select(`#estimate-${element.id}-x2`).attr('visibility', 'hidden');
};

/**
 * @returns - d3 linear scale for circles.
 * mapped the min and max values to a range.
 */
const circleScaling = (min, max) => d3.scaleLinear().domain([min, max]).range([5, 15]);

/**
 * 
 * @param {number} min - min value to be passed to the domain.
 * @param {number} max - max value to be passed to the domain.
 * @returns - d3 linear scale for x-axis.
 */
const createXScale = (min, max, width) => {
    // set min to zero if it's greater than zero else it's a min.
    const updatedMin = (min > 0 || min === 0) ? -0.1 : min;

    return d3.scaleLinear()
        .domain([updatedMin, max])
        .range([300, (width * CHART_WIDTH)])
        .nice();
};


/**
 * Appends x-axis to the main svg element.
 * @param {Object} svg - svg selection.
 */
const createXAxis = (svg, scale, height, width, margin) => {
    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(scale));

    // append x-axis label.
    svg.append('g')
        .attr('id', 'x-axis-label')
        .append('text')
        .attr('font-weight', 500)
        .attr('x', (width * CHART_WIDTH * 0.55))
        .attr('y', height + margin.bottom / 5 + 10)
        .attr('fill', `${colors.blue_header}`)
        .text('pearson correlation coefficient (r)')
        .attr('font-size', '16px');

};

/**
 * Creates a vertical main line for the forest plot.
 * @param {Object} svg - svg selection for the global canvas.
 * @param {Object} scale - x axis scale.
 */
const createVerticalLine = (svg, scale, height) => {
    svg.append('g')
        .attr('id', 'vertical-line')
        .append('line')
        .style('stroke', `${colors.fade_blue}`)
        .attr('x1', scale(0))
        .attr('y1', 0)
        .attr('x2', scale(0))
        .attr('y2', height);
};

/**
 * Creates horizontal lines for the forest plot.
 * @param {Object} svg - svg selection for the global canvas.
 * @param {Object} scale - x axis scale.
 * @param {boolean} isAnalytic
 */
const createHorizontalLines = (svg, scale, data, height) => {
    const horizontal = svg.append('g')
        .attr('id', `horizontal-lines`)

    data.forEach((element, i) => {
        if (element.ci_lower && element.ci_upper) {
            horizontal
                .append('line')
                .attr('id', `horizontal-line-${element.dataset.name}`)
                .style('stroke', `${colors.fade_blue}`)
                .style('stroke-width', 1.25)
                .attr('x1', scale(element.ci_lower))
                .attr('y1', ((i + 1) * height) / (data.length + ADDITIONAL))
                .attr('x2', scale(element.ci_upper))
                .attr('y2', ((i + 1) * height) / (data.length + ADDITIONAL))
                .on('mouseover', (event) => {
                    mouseOverEvent(d3.event, element);
                })
                .on('mouseout', (event) => {
                    mouseOutEvent(d3.event, element);
                });
        }
    })

};

/**
 * Creates circles for the horizontal lines.
 * @param {Object} svg - svg selection for the global canvas.
 * @param {Object} xScale - x axis scale.
 * @param {Object} circleScale - scale to set the radius of the circle.
 * @param {Array} data - data array.
 */
const createCircles = (svg, xScale, circleScale, data, height) => {
    const circles = svg.append('g')
        .attr('id', 'cirlces');

    data.forEach((element, i) => {
        // fdr and pearson cofficient.
        const fdr = element.fdr;

        circles
            .append('circle')
            .attr('id', `cirlce-${element.dataset.name}`)
            .attr('cx', xScale(element.estimate))
            .attr('cy', ((i + 1) * height) / (data.length + ADDITIONAL))
            .attr('r', circleScale(element.n))
            // .attr('fill', (fdr < 0.05 && pc > 0.70) ? `${colors.pink_header}` : `${colors.silver}`)
            .attr('fill', fdr < 0.05 ? `${colors.pink_header}` : `${colors.silver}`)
            .on('mouseover', function () {
                mouseOverEvent(d3.event, element);
            })
            .on('mouseout', (event) => {
                mouseOutEvent(d3.event, element);
            });
    });
};

/**
 * Appends dataset name to the left of the forest plot.
 * @param {Object} svg
 * @param {Array} data - data array.
 */
const appendDatasetName = (svg, data, height) => {
    // append header (dataset)
    svg.append('g')
        .attr('id', 'dataset-header')
        .append('text')
        .attr('font-weight', 700)
        .attr('x', 0)
        .attr('y', -20)
        .attr('fill', `${colors.blue_header}`)
        .text('Dataset Name')
        .attr('font-size', '18px');

    const dataset = svg.append('g')
        .attr('id', 'dataset-names');

    // append dataset name.
    data.forEach((element, i) => {
        dataset
            .append('text')
            .attr('id', `dataset-${element.dataset.name}`)
            .attr('font-weight', 200)
            .attr('x', 0)
            .attr('y', ((i + 1) * height) / (data.length + ADDITIONAL))
            .attr('fill', `${colors.blue_header}`)
            .text(`${element.dataset.name}`)
            .attr('font-size', '14px');
    });
};


/**
 * Appends dataset name to the left of the forest plot.
 * @param {Object} svg
 * @param {Array} data - data array.
 */
const appendMetricName = (svg, data, height) => {
    // append header (dataset)
    svg.append('g')
        .attr('id', 'dataset-header')
        .append('text')
        .attr('font-weight', 700)
        .attr('x', 150)
        .attr('y', -20)
        .attr('fill', `${colors.blue_header}`)
        .text('Metric')
        .attr('font-size', '18px');

    const dataset = svg.append('g')
        .attr('id', 'dataset-names');

    // append dataset name.
    data.forEach((element, i) => {
        console.log(element);
        dataset
            .append('text')
            .attr('id', `dataset-${element.dataset.name}`)
            .attr('font-weight', 200)
            .attr('x', 150)
            .attr('y', ((i + 1) * height) / (data.length + ADDITIONAL))
            .attr('fill', `${colors.blue_header}`)
            .text(`${element.metric.replace(/\./g, ' ')}`)
            .attr('font-size', '14px');
    });
};

/**
 * Appends estimate text to the chart.
 * @param {Object} svg
 * @param {Array} data - data array.
 */
const appendEstimateText = (svg, data, height, width, scale) => {
    const estimate = svg.append('g')
        .attr('id', 'estimate');

    // append dataset name.
    data.forEach((element, i) => {

        if (element.ci_lower) {
            estimate
                .append('text')
                .attr('id', `estimate-${element.id}-x1`)
                .attr('font-weight', 200)
                .attr('x', scale(element.ci_lower) - 15)
                .attr('y', ((i + 1) * height) / (data.length + ADDITIONAL) - 10)
                .attr('fill', `${colors.blue_header}`)
                .text(`${(element.ci_lower)}`)
                .attr('visibility', 'hidden')
                .attr('font-size', '14px');
        }

        if (element.ci_upper) {
            estimate
                .append('text')
                .attr('id', `estimate-${element.id}-x2`)
                .attr('font-weight', 200)
                .attr('x', scale(element.ci_upper) - 15)
                .attr('y', ((i + 1) * height) / (data.length + ADDITIONAL) - 10)
                .attr('fill', `${colors.blue_header}`)
                .text(`${(element.ci_upper)}`)
                .attr('visibility', 'hidden')
                .attr('font-size', '14px');
        }
    });
};

/**
 * Appends estimate text to the chart.
 * @param {Object} svg
 * @param {Array} data - data array.
 */
const appendFdrText = (svg, data, height, width) => {
    // append header (dataset)
    svg.append('g')
        .attr('id', 'estimate-header')
        .append('text')
        .attr('font-weight', 700)
        .attr('x', (width * CHART_WIDTH) + 10)
        .attr('y', -20)
        .attr('fill', `${colors.blue_header}`)
        .text('FDR')
        .attr('font-size', '18px');

    const estimate = svg.append('g')
        .attr('id', 'estimate');

    // append dataset name.
    data.forEach((element, i) => {
        if (element.fdr) {
            estimate
                .append('text')
                .attr('id', `estimate-${element.dataset.name}`)
                .attr('font-weight', 200)
                .attr('x', (width * CHART_WIDTH) + 10)
                .attr('y', ((i + 1) * height) / (data.length + ADDITIONAL))
                .attr('fill', `${colors.blue_header}`)
                .text(`${element.fdr}`)
                .attr('font-size', '14px');
        }
    });
};

/**
 * Creates legend text and label.
 * @param {Object} svg - svg element
 * @param {number} height - height of the graph
 * @param {number} width - width of the graph
 */
const createLegend = (svg, height, width) => {
    // append legends.
    const legends = svg.append('g')
        .attr('id', 'legends');

    legend.forEach((el, i) => {
        legends.append('rect')
            .attr('x', width * CHART_WIDTH + 100)
            .attr('y', ((height * 0.2) + ((i + 1) * RECTANGLE_DIMENSIONS)))
            .attr('width', RECTANGLE_DIMENSIONS)
            .attr('height', RECTANGLE_DIMENSIONS)
            .attr('stroke', 'none')
            .attr('fill', `${el.color}`);
    });

    // append legend text.
    const legendText = svg.append('g')
        .attr('id', 'legend-text');

    legend.forEach((el, i) => {
        legendText
            .append('text')
            .attr('id', `legend-${el}`)
            .attr('x', width * CHART_WIDTH + 125)
            .attr('y', ((height * 0.2) + (((i + 1) * RECTANGLE_DIMENSIONS) + (0.75 * RECTANGLE_DIMENSIONS))))
            .text(`${el.text}`)
            .attr('font-size', '12px')
            .attr('fill', `${colors.blue_header}`);
    });
};

/**
 * Main function to create the forest plot.
 * @param {Object} margin - margin for the svg canavas.
 * @param {number} height - height of the svg canvas.
 * @param {number} width - width of the svg canvas.
 * @param {Array} data - array of data.
 */
const createForestPlot = (margin, heightInput, width, data) => {
    // calculate the height based on the data size.
    const height = data.length * 50 - margin.top - margin.bottom > heightInput
        ? data.length * 50 - margin.top - margin.bottom
        : heightInput;

    // creating the svg canvas.
    const svg = createSvgCanvas({ id: 'forestplot', width, height, margin, canvasId: CANVAS_ID });

    // min and max.
    const { min, max } = calculateMinMax(data);

    // min and max n value.
    const { minN, maxN } = calculateMinMaxN(data);

    // scale for x-axis.
    const xScale = createXScale(min, max, width);

    // scale for circles.
    const circleScale = circleScaling(minN, maxN);

    // creating x axis.
    createXAxis(svg, xScale, height, width, margin);

    // create vertical line at 0 on x-axis.
    createVerticalLine(svg, xScale, height);

    // create horizontal lines for the plot.
    createHorizontalLines(svg, xScale, data, height);

    // create the circles for the plot.
    createCircles(svg, xScale, circleScale, data, height);

    // create polygon/rhombus.
    // createPolygon(svg, xScale);

    // append the estimate text along the horizontal lines.
    appendEstimateText(svg, data, height, width, xScale);

    // append the dataset names corresponding to each horizontal line.
    appendDatasetName(svg, data, height);

    // append metric names
    appendMetricName(svg, data, height);

    // append estimate as text to the svg.
    appendFdrText(svg, data, height, width);

    // create legend.
    createLegend(svg, height, width);
};

/**
 * @returns {component} - returns the forest plot component.
 */
const ForestPlot = ({ height, width, margin, data }) => {

    useEffect(() => {
        // remove the svg canvas.
        d3.select('#forestplot-canvas').remove();

        // create tooltip.
        createToolTip(`${TOOLTIP_ID}`);

        // create forest plot.
        createForestPlot(margin, height, width, data);
    }, [data]);

    return (
        <StyledForestPlot>
            <div id='forestplot' />
            <div id='forestplot-tooltip' />
        </StyledForestPlot>
    );
};

// default props.
ForestPlot.defaultProps = {
    height,
    width,
    margin,
};

// proptypes for the forest plot component.
ForestPlot.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }),
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ForestPlot;
