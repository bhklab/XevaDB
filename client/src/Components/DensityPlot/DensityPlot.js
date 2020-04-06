/* eslint-disable class-methods-use-this */
import React from 'react';
import * as d3 from 'd3';

class DensityPlot extends React.Component {
    constructor(props) {
        super(props);
        this.makeDensityPlot = this.makeDensityPlot.bind(this);
    }

    componentDidMount() {
        const { data } = this.props;
        const { response } = this.props;
        const parsedData = {};
        // creating new data object.
        data.forEach((row) => {
            Object.keys(row).forEach((val) => {
                if (!parsedData[val]) {
                    parsedData[val] = [];
                }
                parsedData[val].push(row[val][response]);
            });
        });
        this.makeDensityPlot(parsedData['X-1004']);
    }

    makeDensityPlot(data) {
        // set the dimensions and margins of the graph
        const margin = {
            top: 30, right: 30, bottom: 30, left: 50,
        };
        const width = 120 - margin.left - margin.right;
        const height = 90 - margin.top - margin.bottom;

        // Function to compute density
        function kernelDensityEstimator(kernel, X) {
            return (V) => X.map((x) => [x, d3.mean(V, (v) => kernel(x - v))]);
        }
        function kernelEpanechnikov(k) {
            return (v) => (Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0);
        }

        // append the svg object to the body of the page
        const svg = d3.select('#densityplot')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform',
                `translate(${margin.left},${margin.top})`);

        // add the x Axis
        const x = d3.scaleLinear()
            .domain([-100, 100])
            .range([0, width]);
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSize(0).tickFormat(''))
            .selectAll('path')
            .attr('stroke', '#f03b20');

        // add the y Axis
        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 0.1]);
        // svg.append('g')
        //     .call(d3.axisLeft(y).tickSize(0).tickFormat(''));

        // Compute kernel density estimation
        const bandwidth = 7;
        const kde = kernelDensityEstimator(kernelEpanechnikov(bandwidth), x.ticks(20));
        const density = kde(data.map((d) => d));

        // Plot the area
        svg.append('path')
            .attr('class', 'mypath')
            .datum(density)
            .attr('fill', '#ffffff')
            .attr('opacity', '.8')
            .attr('stroke', '#f03b20')
            .attr('stroke-width', 1)
            .attr('stroke-linejoin', 'round')
            .attr('d', d3.line()
                .curve(d3.curveBasis)
                .x((d) => x(d[0]))
                .y((d) => y(d[1])));
    }

    render() {
        return (
            <div id="densityplot" />
        );
    }
}

export default DensityPlot;
