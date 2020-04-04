/* eslint-disable class-methods-use-this */
import React from 'react';
import * as d3 from 'd3';


class DensityPlot extends React.Component {
    constructor(props) {
        super(props);
        this.makeDensityPlot = this.makeDensityPlot.bind(this);
    }

    componentDidMount() {
        this.makeDensityPlot();
    }

    componentDidUpdate() {
        this.makeDensityPlot();
    }

    makeDensityPlot() {
        // set the dimensions and margins of the graph
        const margin = {
            top: 30, right: 30, bottom: 30, left: 50,
        };
        const width = 460 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select('#densityplot')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform',
                `translate(${margin.left},${margin.top})`);

        // get the data
        console.log(data);
        // add the x Axis
        const x = d3.scaleLinear()
            .domain([0, 1000])
            .range([0, width]);
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // add the y Axis
        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 0.01]);
        svg.append('g')
            .call(d3.axisLeft(y));

        // Compute kernel density estimation
        const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40));
        const density = kde(data.map((d) => d));

        // Plot the area
        svg.append('path')
            .attr('class', 'mypath')
            .datum(density)
            .attr('fill', '#69b3a2')
            .attr('opacity', '.8')
            .attr('stroke', '#000')
            .attr('stroke-width', 1)
            .attr('stroke-linejoin', 'round')
            .attr('d', d3.line()
                .curve(d3.curveBasis)
                .x((d) => x(d[0]))
                .y((d) => y(d[1])));


        // Function to compute density
        function kernelDensityEstimator(kernel, X) {
            return function (V) {
                return X.map((x) => [x, d3.mean(V, (v) => kernel(x - v))]);
            };
        }
        function kernelEpanechnikov(k) {
            return function (v) {
                return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
            };
        }
    }

    render() {
        return (
            <div id="densityplot" />
        );
    }
}

export default DensityPlot;
