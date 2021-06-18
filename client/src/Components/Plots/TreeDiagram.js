/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import createToolTip from '../Utils/ToolTip';

// creating the default margin in case not passed as props.
const defaultMargin = {
    top: 50,
    right: 300,
    bottom: 50,
    left: 100,
};

// creating the default dimensions in case not passed as props.
const defaultDimensions = {
    width: 1100 - defaultMargin.left - defaultMargin.right,
    height: 600 - defaultMargin.top - defaultMargin.bottom,
};

// mouse over event for the tree diagram text.
const textMouseOverEvent = (data) => {
    // tooltip data only if data height is zero (it's a leaf node).
    if (data.height === 0) {
        const toolTip = d3.select('#tooltip')
            .style('visibility', 'visible')
            .style('left', `${d3.event.pageX + 10}px`)
            .style('top', `${d3.event.pageY + 10}px`)
            .style('color', `${colors.black}`)
            .style('background-color', `${colors.white}`);

        const tooltipData = [
            `Drug: ${data.parent.data.name}`, `Model: ${data.data.name}`,
        ];
        toolTip.selectAll('textDiv')
            .data(tooltipData)
            .enter()
            .append('div')
            .attr('id', 'tooltiptext')
            .html((d) => {
                const text = d.split(':');
                return `<b>${text[0]}</b>: ${text[1]}`;
            })
            .attr('x', `${d3.event.pageX + 10}px`)
            .attr('y', (d, i) => (`${d3.event.pageY + 10 + i * 10}px`));
    }
};

// text mouse out event.
const textMouseOutEvent = () => {
    d3.select('#tooltip')
        .style('visibility', 'hidden');
    // remove all the divs with id tooltiptext.
    d3.selectAll('#tooltiptext').remove();
};

// this will create the svg element for the chart
const createSVGBody = (margin, dimensions) => (
    // make the svg element
    d3.select('#treediagram')
        .append('svg')
        .attr('id', 'treediagramsvg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('width', dimensions.width + margin.left + margin.right)
        .attr('height', dimensions.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
);

// creates a tree with the give height and width.
const createTree = (data, { height, width }) => {
    const root = d3.hierarchy(data);
    root.dx = 10;
    root.dy = width / (root.height + 1);
    // return the tree.
    return d3.tree()
        .nodeSize([root.dx, root.dy])
        .size([height, width])(root);
};

// create the links for the tree.
const createLinks = (svg, root) => {
    svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', `${colors.pink_header}`)
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr('d', d3.linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x));
};

const createNodes = (svg, root) => {
    const node = svg.append('g')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', (d) => `translate(${d.y},${d.x})`);

    return node;
};

const createCircles = (node) => {
    node.append('circle')
        .attr('fill', (d) => (d.children ? `${colors.pink_header}` : `${colors.light_pink_header}`))
        .attr('r', 4.0);
};

const appendText = (node) => {
    node.append('text')
        .attr('dy', '0.28em')
        .attr('x', (d) => (d.children ? -10 : 10))
        .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
        .attr('font-size', '.85em')
        .text((d) => d.data.name)
        .on('mouseover', (d) => {
            textMouseOverEvent(d);
        })
        .on('mouseout', () => {
            textMouseOutEvent();
        })
        .attr('fill', `${colors.blue_header}`)
        .clone(true)
        .lower();
};

// main function that creates the tree diagram.
const createTreeDiagram = (margin, dimensions, data) => {
    // create the svg body for the chart.
    const svg = createSVGBody(margin, dimensions);
    // create tooltip.
    createToolTip('treediagram');
    // create tree.
    const tree = createTree(data, dimensions);
    // const links.
    createLinks(svg, tree);
    // create nodes.
    const node = createNodes(svg, tree);
    // create circles.
    createCircles(node);
    // appending the drug text.
    appendText(node);
};

// Tree Diagram component.
const TreeDiagram = (props) => {
    // margin and dimensions.
    const margin = props.margin || defaultMargin;
    const dimensions = props.dimensions || defaultDimensions;
    const { data } = props;

    // create the tree diagram.
    useEffect(() => {
        // creates the tree diagram.
        createTreeDiagram(margin, dimensions, data);
    }, []);

    return (
        <div className="curve-wrapper">
            <h1>
                Dataset =
                {' '}
                <span style={{ color: `${colors.pink_header}` }}>
                    {data.dataset}
                </span>
                {' '}
                and
                Patient =
                {' '}
                <span style={{ color: `${colors.pink_header}` }}>
                    {data.name}
                </span>
            </h1>
            <div id="treediagram" />
        </div>
    );
};

TreeDiagram.propTypes = {
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

export default TreeDiagram;
