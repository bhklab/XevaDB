/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import createToolTip from '../../utils/ToolTip';

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
    // initialize the tooltip
    const toolTip = d3.select('#tooltip')
        .style('visibility', 'visible')
        .style('left', `${d3.event.pageX + 10}px`)
        .style('top', `${d3.event.pageY + 10}px`)
        .style('color', `${colors.black}`)
        .style('background-color', `${colors.white}`);

    // tooltip data only if data height is zero (it's a leaf node).
    if (data.height === 0) { // if on the model name
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
            });
    } else if (data.height === 1) { // this is for the drug name
        const tooltipData = 'Redirect to Growth Curve';

        toolTip.append('text').text(tooltipData).attr('id', 'tooltiptext');
    }

    // add the x and y location for the tooltip!
    toolTip.attr('x', `${d3.event.pageX + 10}px`)
        .attr('y', (d, i) => (`${d3.event.pageY + 10 + i * 10}px`));
};

// text mouse out event.
const textMouseOutEvent = () => {
    d3.select('#tooltip')
        .style('visibility', 'hidden');
    // remove all the divs with id tooltiptext.
    d3.selectAll('#tooltiptext').remove();
};

// click event handler for drug name
const clickEventHandler = (d, history) => {
    const patient = d.parent.data.name;
    const { dataset } = d.parent.data;
    const drug = d.data.name;
    history.push(
        `/curve?patient=${patient}&drug=${drug}&dataset=${dataset}`,
    );
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
        .attr('stroke', `${colors.silver}`)
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr('d', d3.linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x));
};

// create nodes
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

// create circles for the node
const createCircles = (node) => {
    node.append('circle')
        .attr('fill', (d) => (d.children ? `${colors['--bg-color']}` : `${colors.fade_blue}`))
        .attr('r', 4.0);
};

// this will set the X axis of the text
const setTextXAxis = {
    0: -10,
    1: -25,
    2: 10,
};

// appends the text to the chart
const appendText = (node, history) => {
    node.append('text')
        .attr('dy', '0.28em')
        .attr('x', (d) => setTextXAxis[d.depth])
        .attr('y', (d) => (d.depth === 1 ? -12 : 0))
        .attr('text-anchor', (d) => (d.depth === 0 ? 'end' : 'start'))
        .attr('font-size', '.85em')
        .text((d) => d.data.name)
        .on('mouseover', (d) => {
            textMouseOverEvent(d);
        })
        .on('mouseout', () => {
            textMouseOutEvent();
        })
        .on('click', (d) => {
            clickEventHandler(d, history);
        })
        .attr('fill', (d) => (d.depth === 1 ? `${colors['--link-color']}` : `${colors['--main-font-color']}`))
        .clone(true)
        .lower();
};

// main function that creates the tree diagram.
const createTreeDiagram = (margin, dimensions, data, history) => {
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
    appendText(node, history);
};

// Tree Diagram component.
const TreeDiagram = (props) => {
    // grab history!
    const history = useHistory();

    // data from the props
    const { data } = props;

    // count the number of children
    const childrenCount = data.children.reduce(
        (previous, current, currentIndex) => previous + current.children.length, 0,
    );

    // margin and dimensions.
    const childrenDistance = 35;
    const margin = props.margin || defaultMargin;
    const dimensions = props.dimensions || defaultDimensions;
    dimensions.height = childrenCount * childrenDistance > dimensions.height
        ? childrenCount * childrenDistance
        : dimensions.height;

    // create the tree diagram.
    useEffect(() => {
        // creates the tree diagram.
        createTreeDiagram(margin, dimensions, data, history);
    }, []);

    return (
        <div id='treediagram' />
    );
};

TreeDiagram.propTypes = {
    data: PropTypes.object.isRequired,
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
