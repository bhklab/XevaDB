/* eslint-disable func-names */
/* eslint-disable no-extend-native */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
/* eslint-disable radix */
/* eslint-disable no-plusplus */
import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { Link } from 'react-router-dom';
import GlobalStyles from '../../GlobalStyles';
import TopNav from '../TopNav/TopNav';
import StatTable from '../ResponseStat/ModelResponseStatTable';

class TumorGrowthCurve extends React.Component {
    constructor(props) {
        super(props);
        // setting states for the data.
        this.state = {
            data: [],
        };
        // binding the functions declared.
        // this.norm = this.norm.bind(this);
        this.dataParse = this.dataParse.bind(this);
        this.makeTumorGrowthCurve = this.makeTumorGrowthCurve.bind(this);
        this.batchToggle = this.batchToggle.bind(this);
    }

    componentDidMount() {
        const { patientParam, drugParam } = this.props;
        axios.get(`/api/v1/treatment?drug=${drugParam}&patient=${patientParam}`)
            .then((response) => {
                function unique(value, index, self) {
                    return self.indexOf(value) === index;
                }
                const batches = [];
                for (let i = 0; i < response.data.length; i++) {
                    batches.push(response.data[i].batch);
                }
                this.batchToggle('plot', batches.filter(unique));
                this.dataParse(response.data, batches[0]);
            });
    }

    componentDidUpdate() {
        const { node } = this;
        const plotId = 'plot';
        const { data } = this.state;
        if (data.length !== 0) {
            this.makeTumorGrowthCurve(data, plotId, node);
            d3.select('.no-graph').remove();
        } else {
            d3.select('svg').remove();
        }
    }

    // unity normalization
    norm(value, first) {
        return (value / first) - 1;
    }

    // filters by batch - comment out the batch lines for full data
    // call this command to create a curve!!!
    dataParse(data, batchSelect) {
        const dataFormatted = [];
        const batches = [];
        String.prototype.replaceAll = String.prototype.replaceAll || function (s, r) {
            return this.replace(new RegExp(s, 'g'), r);
        };

        // loop throuth the data and set the values in the variable.
        for (let i = 0; i < data.length; i++) {
            batches.push(data[i].batch);
            if (data[i].batch === batchSelect) {
                if (data[i].time === 0) {
                    const newDatapt = {
                        exp_type: data[i].type,
                        batch: data[i].patient_id,
                        model: data[i].model_id,
                        drug: data[i].drug,
                        pdx_points: [{
                            times: [parseInt(data[i].time)],
                            volumes: [parseFloat(data[i].volume)],
                            volume_normals: [parseFloat(data[i].volume_normal)],
                        }],
                        pdx_json: [{
                            model: data[i].model_id.replace(/\./g, ' ').replaceAll(' ', '-'),
                            batch: data[i].patient_id,
                            exp_type: data[i].type,
                            time: parseInt(data[i].time),
                            volume: parseFloat(data[i].volume),
                            volume_normal: parseFloat(data[i].volume_normal),
                        }],

                    };
                    dataFormatted.push(newDatapt);
                } else if (data[i].time <= 200) {
                    dataFormatted[dataFormatted.length - 1].pdx_points[0]
                        .times.push(parseInt(data[i].time));
                    dataFormatted[dataFormatted.length - 1].pdx_points[0]
                        .volumes.push(parseFloat(data[i].volume));
                    dataFormatted[dataFormatted.length - 1].pdx_points[0]
                        .volume_normals.push(parseFloat(data[i].volume_normal));
                    dataFormatted[dataFormatted.length - 1].pdx_json.push(
                        {
                            model: data[i].model_id,
                            batch: data[i].patient_id,
                            exp_type: data[i].type,
                            time: parseInt(data[i].time),
                            volume: parseFloat(data[i].volume),
                            volume_normal: parseFloat(data[i].volume_normal),
                        },
                    );
                }
            }
        }

        this.setState({ data: dataFormatted });
    }

    // toggle if batches present
    // currently no batch in the data, so took patient id as the batch.
    batchToggle(plotId, batches) {
        const select = d3.select(`#pdx${plotId}`) // TODO: PLOT ID
            .append('select')
            .attr('class', 'select')
            .on('change', onchange);


        select.selectAll('option')
            .data(batches).enter()
            .append('option')
            .text((d) => d);

        function onchange() {
            d3.select('select').property('value');
            select('#pdxplot').remove();
        }
    }


    // This is the main function to create Growth curves.

    makeTumorGrowthCurve(data, plotId, node) {
        this.node = node;
        tumorCurve(data, plotId, node);

        String.prototype.replaceAll = String.prototype.replaceAll || function (s, r) {
            return this.replace(new RegExp(s, 'g'), r);
        };

        // unique function
        // usage: let a = [1,2,3,4]; unique = a.filter(unique);
        function unique(value, index, self) {
            return self.indexOf(value) === index;
        }

        // get the union set of all timepoints for the means
        // until the last timepoint of the shortest graph
        // returns [ [control] , [treatment] ]
        function getUnionOfTimepoints(data) {
            let control = [];
            let treatment = [];
            let minControl;
            let minTreatment;
            for (let i = 0; i < data.length; i++) {
                if (data[i].exp_type === 'control') {
                    minControl = data[i].pdx_points[0]
                        .times[data[i].pdx_points[0].times.length - 1];
                    break;
                }
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].exp_type === 'treatment') {
                    minTreatment = data[i].pdx_points[0]
                        .times[data[i].pdx_points[0].times.length - 1];
                    break;
                }
            }

            // merging time point arrays, and then unique
            for (let i = 0; i < data.length; i++) {
                const temp = data[i].pdx_points[0].times;
                if (data[i].exp_type === 'control') {
                    control = control.concat(temp);
                    minControl = temp[temp.length - 1] < minControl
                        ? temp[temp.length - 1] : minControl;
                } else {
                    treatment = treatment.concat(data[i].pdx_points[0].times);
                    minTreatment = temp[temp.length - 1] < minTreatment
                        ? temp[temp.length - 1] : minTreatment;
                }
            }
            // unique, sort, and cut off at the last timepoint of shortest graph
            control = control.filter(unique).sort((a, b) => a - b);
            let index = control.indexOf(minControl);
            control = control.slice(0, index + 1);

            treatment = treatment.filter(unique).sort((a, b) => a - b);
            index = treatment.indexOf(minTreatment);
            treatment = treatment.slice(0, index + 1);

            return [control, treatment];
        }


        function tumorCurve(data, plotId, node) {
            // calculating max time, min/max volumes of all data
            const maxTimeArray = [];
            const minVolArray = [];
            const maxVolArray = [];
            const maxVolNormArray = [];
            for (let i = 0; i < data.length; i++) {
                maxTimeArray.push(d3.max(data[i].pdx_points[0].times));
                minVolArray.push(d3.min(data[i].pdx_points[0].volumes));
                maxVolArray.push(d3.max(data[i].pdx_points[0].volumes));
                maxVolNormArray.push(d3.max(data[i].pdx_points[0].volume_normals));
            }

            const maxTime = Math.max.apply(null, maxTimeArray);
            const minVolume = Math.min.apply(null, minVolArray);
            const maxVolume = Math.max.apply(null, maxVolArray);
            const maxVolNorm = Math.max.apply(null, maxVolNormArray);

            const expTypes = ['control', 'treatment'];

            // positioning variables
            const width = 970;
            const height = 500;
            const margin = {
                top: 50,
                right: 260,
                bottom: 200,
                left: 130,
            };
            // make the svg element
            const svg = d3.select(node)
                .append('svg')
                .attr('id', `pdx${plotId}`)
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink') // for downloading
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // legend
            const legend = svg.selectAll('.legend')
                .data(expTypes)
                .enter();

            legend.append('circle')
                .attr('id', (d, i) => `legend-dot-${expTypes[i]}`)
                .attr('class', 'legend')
                .attr('r', 5)
                .attr('fill', (d, i) => {
                    if (expTypes[i] === 'control') {
                        return '#cd5686';
                    }
                    return '#5974c4';
                })
                .attr('cx', width + 30)
                .attr('cy', (d, i) => height / 2 - 50 + (i * 50));

            legend.append('text')
                .attr('id', (d, i) => `legend-text-${expTypes[i]}`)
                .attr('class', 'legend')
                .attr('fill', 'black')
                .style('font-size', '16px')
                .attr('x', width + 40)
                .attr('y', (d, i) => height / 2 - 45 + (i * 50))
                .text((d, i) => expTypes[i]);


            // set domain and range scaling
            const xrange = d3.scaleLinear()
                .domain([0, maxTime])
                .range([0, width])
                .nice();

            const yrange = d3.scaleLinear()
                .domain([0, maxVolume])
                .range([height, 0])
                .nice();

            // set axes for graph
            const xAxis = d3.axisBottom()
                .scale(xrange)
                .tickPadding(2);

            const yAxis = d3.axisLeft()
                .scale(yrange)
                .tickPadding(2);

            // Add the X Axis
            const xAxisAdd = svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(0,${yrange(0)})`)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .call(xAxis);

            // X axis label
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('fill', 'black')
                .attr('transform', `translate(${width / 2},${height + 40})`)
                .text('Time (days)');

            // Add the Y Axis
            const yAxisAdd = svg.append('g')
                .attr('class', 'y axis')
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .call(yAxis);

            // Y axis label
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('fill', 'black')
                .attr('transform', `translate(${-60},${height / 2})rotate(-90)`)
                .text('Volume (mm³)');

            // remove strokes for all ticks
            svg.selectAll('.tick').select('text')
                .attr('fill', 'black')
                .attr('stroke', 'none')
                .attr('font-size', '14px');

            const graph = svg.append('g')
                .attr('id', 'curves');
            // plot each model
            plotBatch(data, graph, xrange, yrange, width, height, false);
            volumeToggle(data, svg, xrange, yrange, yAxis, yAxisAdd,
                width, height, maxVolume, maxVolNorm, plotId);
        }

        function plotBatch(data, graph, xrange, yrange, width, height, norm) {
            // when using d.model, use d.model.replace(/\./g,' ').replaceAll(' ', '-')
            // to replace all the periods with dashes because dots interfere with classes

            const models = graph.selectAll('g.model')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'model');

            // plotting the dots
            const dots = models.selectAll('.model-dot')
                .data((d) => d.pdx_json)
                .enter();

            const paths = graph.selectAll('.model-path')
                .data(() => data)
                .enter();

            // making tooltips
            const tooltip = d3.select('.wrapper')
                .append('div')
                .style('position', 'absolute')
                .style('visibility', 'hidden')
                .style('border', 'solid')
                .style('border-width', '1px')
                .style('border-radius', '5px')
                .style('padding', '5px')
                .attr('top', 10)
                .attr('left', 20);

            dots.append('circle')
                .attr('id', (d, i) => `dot-${d.model.replace(/\./g, ' ').replaceAll(' ', '-')}-${
                    d.exp_type}${i}`)
                .attr('class', (d) => `model-dot ${
                    d.model.replace(/\./g, ' ').replaceAll(' ', '-')} ${
                    d.batch}`)
                .attr('r', 4)
                .attr('fill', (d) => {
                    if (d.exp_type === 'control') {
                        return '#cd5686';
                    }
                    return '#5974c4';
                })
                .style('opacity', 0.6)
                .attr('cx', (d) => xrange(d.time))
                .attr('cy', (d) => {
                    if (norm) {
                        return yrange(d.volume_normal);
                    }
                    return yrange(d.volume);
                });


            // line function, to join dots
            const linepath = d3.line()
                .x((d) => xrange(d.time))
                .y((d) => {
                    if (norm) {
                        return yrange(d.volume_normal);
                    }
                    return yrange(d.volume);
                });


            // add line
            paths.append('path')
                .attr('id', (d) => `path-${d.model.replace(/\./g, ' ').replaceAll(' ', '-')}`)
                .attr('class', (d) => `model-path_${d.exp_type}_${
                    d.model.replace(/\./g, ' ').replaceAll(' ', '-')}_${
                    d.batch}`)
                .attr('d', (d) => linepath(d.pdx_json))
                .attr('fill', 'none')
                .style('opacity', 0.6)
                .attr('stroke', (d) => {
                    if (d.exp_type === 'control') {
                        return '#cd5686';
                    }
                    return '#5974c4';
                })
                .attr('stroke-width', 3)
                .attr('stroke-dasharray', ('3', '3'))
                // event listeners.
                .on('mouseover', (d) => {
                    console.log(d);
                    // tooltip on mousever setting the div to visible.
                    tooltip
                        .style('visibility', 'visible');

                    // tooltip grabbing event.pageX and event.pageY
                    // and set color according to the ordinal scale.
                    tooltip
                        .text([`Batch:${d.batch}`, ` Drug: ${d.drug}`, ` Exp. Type: ${d.exp_type}`, ` Model: ${d.model}`])
                        .style('left', `${d3.event.pageX + 10}px`)
                        .style('top', `${d3.event.pageY + 10}px`)
                        .style('color', '#000000')
                        .style('background-color', '#ffffff');

                    // changing attributes of the line on mouseover.
                    d3.select(`#path-${d.model.replace(/\./g, ' ').replaceAll(' ', '-')}`)
                        .attr('stroke-width', 5)
                        .style('opacity', 1.0);
                    d3.selectAll(`.responsetable_${d.model.replace(/\./g, '_')}`)
                        .selectAll('td')
                        .style('color', '#f5f5f5')
                        .style('background', '#5974c4');
                })
                .on('mouseout', (d) => {
                    // tooltip on mousever setting the div to hidden.
                    tooltip
                        .style('visibility', 'hidden');
                    // changing attributes back to normal of the line on mouseout.
                    if (!(d3.select(`.model-path_${d.exp_type}_${d.model.replace(/\./g, ' ').replaceAll(' ', '-')}_${d.batch}`).classed('selected'))) {
                        d3.select(`#path-${d.model.replace(/\./g, ' ').replaceAll(' ', '-')}`)
                            .attr('stroke-width', 3)
                            .style('opacity', 0.6);
                        d3.selectAll(`.responsetable_${d.model.replace(/\./g, '_')}`)
                            .selectAll('td')
                            .style('color', '#cd5686')
                            .style('background', 'white');
                    }
                })
                .on('click', function (d) {
                    if (!(d3.select(this).classed('selected'))) {
                        d3.select(this).classed('selected', true);
                        d3.select(`#path-${d.model.replace(/\./g, ' ').replaceAll(' ', '-')}`)
                            .attr('stroke-width', 5)
                            .style('opacity', 1.0);
                        d3.selectAll(`.responsetable_${d.model.replace(/\./g, '_')}`)
                            .selectAll('td')
                            .style('color', '#f5f5f5')
                            .style('background', '#5974c4');
                    } else if (d3.select(this).classed('selected')) {
                        d3.select(this).classed('selected', false);
                        d3.select(`#path-${d.model.replace(/\./g, ' ').replaceAll(' ', '-')}`)
                            .attr('stroke-width', 3)
                            .style('opacity', 0.6);
                        d3.selectAll(`.responsetable_${d.model.replace(/\./g, '_')}`)
                            .selectAll('td')
                            .style('color', '#cd5686')
                            .style('background', 'white');
                    }
                });
            // plotMeans(data, graph, xrange, yrange, width, height);
            // modelToggle(graph, width, height)
        }

        // plot the mean of each experiment type (control, treatment)
        function plotMeans(data, svg, xrange, yrange, width, height) {
            const timeUnion = getUnionOfTimepoints(data);
            let expTypes = [];

            // if there is no control
            if (timeUnion[0].length === 0) {
                expTypes = ['treatment'];
                timeUnion.shift();
            } else if (timeUnion[1].length === 0) { // no treatment
                expTypes = ['control'];
                timeUnion.pop();
            } else {
                expTypes = ['control', 'treatment'];
            }


            let ypointArr = []; // un-yranged
            let allYpoint = []; // for std devs

            // TODO: fix the batch, it's the first one rn
            const { batch } = data[0];

            for (let n = 0; n < expTypes.length; n++) {
                const exp = expTypes[n];
                const times = timeUnion[n];
                const selection = d3.selectAll(`.model-path.${expTypes[n]}`)._groups;
                // for each timepoint
                for (let i = 0; i < timeUnion[n].length; i++) {
                    const tempYcoord = [];

                    // for each path, get ycoord for each timepoint in union
                    for (let j = 0; j < selection.length; j++) {
                        const path = selection[j][0];
                        const ycoord = findY(path, xrange(timeUnion[n][i]));
                        tempYcoord.push(yrange.invert(ycoord));
                    }

                    // append array to allYpoint for std devs
                    allYpoint.push(tempYcoord);
                    // append mean to ypointArr
                    ypointArr.push(mean(tempYcoord));
                }
                // plot error bars
                // plotErrorBars(data, exp, times, allYpoint, ypointArr, svg, xrange, yrange)

                // mean svg
                const meanSvg = svg.append('g')
                    .attr('id', `mean_${expTypes[n]}`);

                // tooltips
                const tooltips = svg.selectAll(`.tooltip-mean-dot${exp}`)
                    .data(ypointArr)
                    .enter();

                // timepoint
                tooltips.append('text')
                    .attr('id', (d, i) => `tooltip-mean-t-${batch}-${exp}${i}`)
                    .attr('class', `tooltip-mean-dot${exp}`)
                    .attr('dx', width + 20)
                    .attr('dy', height / 2 + 30)
                    .attr('font-size', '14px')
                    .style('opacity', 0)
                    .attr('fill', 'black')
                    .html((d, i) => `Time: ${times[i]} days`);

                // volume
                tooltips.append('text')
                    .attr('id', (d, i) => `tooltip-mean-v-${batch}-${exp}${i}`)
                    .attr('class', 'tooltip-mean-dot')
                    .attr('dx', width + 20)
                    .attr('dy', height / 2 + 45)
                    .attr('font-size', '14px')
                    .style('opacity', 0)
                    .attr('fill', 'black')
                    .html((i) => `Volume: ${d3.format('.2f')(ypointArr[i])} mm³`);

                const meanDots = meanSvg.selectAll('.mean-dot')
                    .data(ypointArr)
                    .enter();
                meanDots.append('circle')
                    .attr('id', (d, i) => `mean-dot-${expTypes[n]}-${batch}`)
                    .attr('class', `mean-dot ${batch}`)
                    .attr('r', 4)
                    .attr('fill', () => {
                        if (expTypes[n] === 'control') {
                            return '#cd5686';
                        }
                        return '#5974c4';
                    })
                    .attr('cx', (i) => xrange(timeUnion[n][i]))
                    .attr('cy', (i) => yrange(ypointArr[i]))
                    .on({
                        mouseover(d, i) {
                            d3.select(`#tooltip-mean-t-${batch}-${exp}${i}`).transition().duration(300).style('opacity', 1);
                            d3.select(`#tooltip-mean-v-${batch}-${exp}${i}`).transition().duration(300).style('opacity', 1);
                        },
                        mouseout(d, i) {
                            d3.select(`#tooltip-mean-t-${batch}-${exp}${i}`).transition().duration(300).style('opacity', 0);
                            d3.select(`#tooltip-mean-v-${batch}-${exp}${i}`).transition().duration(300).style('opacity', 0);
                        },
                    });

                const meanPath = meanSvg.selectAll('.mean-path')
                    .data(ypointArr)
                    .enter();


                const linepath = d3.line()
                    .x((d, i) => xrange(timeUnion[n][i]))
                    .y((d, i) => yrange(ypointArr[i]));

                meanPath.append('path')
                    .attr('id', `mean-path-${expTypes[n]}-${batch}`)
                    .attr('class', `mean-path ${batch}`)
                    .attr('d', (d) => linepath(ypointArr))
                    .attr('fill', 'none')
                    .style('opacity', 0.2)
                    .attr('stroke', () => {
                        if (expTypes[n] === 'control') {
                            return '#cd5686';
                        }
                        return '#5974c4';
                    })
                    .attr('stroke-width', 2);


                // reset y arrs
                allYpoint = [];
                ypointArr = [];
            }
        }

        // toggle to show each model
        function modelToggle(svg, width, height) {
            const nest = d3.nest()
                .key((d) => d)
                .entries(['']);

            nest.forEach((d, i) => {
                const modelToggle = svg.append('rect')
                    .attr('x', width + 21)
                    .attr('y', height / 2 + 40)
                    .attr('id', 'modelToggle')
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('fill', 'black')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)
                    .on('click', () => {
                        const active = !d.active;
                        const newOpacity = active ? 0 : 1;
                        const newFill = active ? 'white' : 'black';

                        // Hide or show the elements
                        d3.selectAll('.model-dot').style('opacity', newOpacity);
                        d3.selectAll('.model-path').style('opacity', newOpacity);
                        d3.select('#modelToggle').attr('fill', newFill);

                        // Update whether or not the elements are active
                        d.active = active;
                    })
                    .on({
                        mouseover() {
                            d3.select(this).style('cursor', 'pointer');
                        },
                        mouseout() {
                            d3.select(this).style('cursor', 'default');
                        },
                    });

                const modelToggleText = svg.append('text')
                    .attr('dx', width + 35)
                    .attr('dy', height / 2 + 50)
                    .attr('fill', 'black')
                    .text('Show all curves')
                    .on('click', () => {
                        const active = !d.active;
                        const newOpacity = active ? 0 : 1;
                        const newFill = active ? 'white' : 'black';

                        // Hide or show the elements
                        d3.selectAll('.model-dot').style('opacity', newOpacity);
                        d3.selectAll('.model-path').style('opacity', newOpacity);
                        d3.select('#modelToggle').attr('fill', newFill);

                        // Update whether or not the elements are active
                        d.active = active;
                    })
                    .on({
                        mouseover() {
                            d3.select(this).style('cursor', 'pointer');
                        },
                        mouseout() {
                            d3.select(this).style('cursor', 'default');
                        },
                    });
            });
        }


        function mean(arr) {
            let total = 0;
            for (let i = 0; i < arr.length; i++) {
                total += arr[i];
            }
            return (total / arr.length);
        }

        // thank you stackoverflow user Wei
        // https://stackoverflow.com/questions/15578146/get-y-coordinate-of-point-along-svg-path-with-given-an-x-coordinate
        function findY(path, x) {
            const pathLength = path.getTotalLength();
            let start = 0;
            let end = pathLength;
            let target = (start + end) / 2;

            // Ensure that x is within the range of the path
            x = Math.max(x, path.getPointAtLength(0).x);
            x = Math.min(x, path.getPointAtLength(pathLength).x);

            // Walk along the path using binary search
            // to locate the point with the supplied x value
            while (target >= start && target <= pathLength) {
                const pos = path.getPointAtLength(target);

                // use a threshold instead of strict equality
                // to handle javascript floating point precision
                if (Math.abs(pos.x - x) < 0.001) {
                    return pos.y;
                } if (pos.x > x) {
                    end = target;
                } else {
                    start = target;
                }
                target = (start + end) / 2;
            }
        }

        // takes in an array of arrays and an array of means,
        // and returns array of std devs
        function stdDev(values, means) {
            const stdDevs = [];
            for (let i = 0; i < values.length; i++) {
                let temp = 0;
                for (let j = 0; j < values[i].length; j++) {
                    temp += Math.pow(values[i][j] - means[i], 2);
                }
                stdDevs.push(Math.sqrt(temp) / values[i].length);
            }
            return stdDevs;
        }

        function plotErrorBars(data, exp, times, allYpoint, ypointArr, svg, xrange, yrange) {
            const stdDevs = stdDev(allYpoint, ypointArr);

            const errorBars = svg.append('g')
                .attr('id', 'errorBars');

            const errorMidBar = errorBars.selectAll('line.error')
                .data(stdDevs);

            errorMidBar.enter()
                .append('line')
                .attr('class', 'error')
                .attr('stroke', () => {
                    if (exp === 'control') {
                        return '#3b9dd6';
                    }
                    return '#e0913c';
                })
                .attr('stroke-width', 2)
                .attr('x1', (d, i) => xrange(times[i]))
                .attr('x2', (d, i) => xrange(times[i]))
                .attr('y1', (d, i) => yrange(ypointArr[i] + stdDevs[i]))
                .attr('y2', (d, i) => yrange(ypointArr[i] - stdDevs[i]));

            const errorTopBar = errorBars.selectAll('line.errorTop')
                .data(stdDevs);

            errorTopBar.enter()
                .append('line')
                .attr('class', 'errorTop')
                .attr('stroke', () => {
                    if (exp === 'control') {
                        return '#3b9dd6';
                    }
                    return '#e0913c';
                })
                .attr('stroke-width', 2)
                .attr('x1', (d, i) => xrange(times[i]) - 3)
                .attr('x2', (d, i) => xrange(times[i]) + 3)
                .attr('y1', (d, i) => yrange(ypointArr[i] + stdDevs[i]))
                .attr('y2', (d, i) => yrange(ypointArr[i] + stdDevs[i]));

            const errorBotBar = errorBars.selectAll('line.errorBot')
                .data(stdDevs);

            errorBotBar.enter()
                .append('line')
                .attr('class', 'errorBot')
                .attr('stroke', () => {
                    if (exp === 'control') {
                        return '#3b9dd6';
                    }
                    return '#e0913c';
                })
                .attr('stroke-width', 2)
                .attr('x1', (d, i) => xrange(times[i]) - 3)
                .attr('x2', (d, i) => xrange(times[i]) + 3)
                .attr('y1', (d, i) => yrange(ypointArr[i] - stdDevs[i]))
                .attr('y2', (d, i) => yrange(ypointArr[i] - stdDevs[i]));
        }

        // toggle to show each model
        function volumeToggle(data, svg, xrange, yrange, yAxisAdd, yAxis, width, height, maxVolume, maxVolNorm, plotId) {
            const volRaw = svg.append('rect')
                .attr('x', width + 25)
                .attr('y', height / 2 + 50)
                .attr('width', 70)
                .attr('height', 20)
                .attr('fill', '#cd5686')
                .style('opacity', 0.8)
                .attr('id', 'volRawToggle')
                .on('click', () => {
                    yrange = d3.scaleLinear()
                        .domain([0, maxVolume])
                        .range([height, 0])
                        .nice();

                    yAxis = d3.axisLeft()
                        .scale(yrange)
                        .tickPadding(2);

                    d3.selectAll('g.y.axis').call(yAxis);
                    svg.selectAll('.tick').select('text')
                        .attr('fill', 'black')
                        .attr('stroke', 'none')
                        .attr('font-size', '14px');
                    d3.select('#curves').remove();
                    const graph = svg.append('g')
                        .attr('id', 'curves');
                    plotBatch(data, graph, xrange, yrange, width, height, false);

                    d3.select('#volRawToggle').attr('fill', '#cd5686');
                    d3.select('#volNormToggle').attr('fill', 'lightgray');
                });

            const volNorm = svg.append('rect')
                .attr('x', width + 25)
                .attr('y', height / 2 + 70)
                .attr('width', 70)
                .attr('height', 20)
                .style('opacity', 0.8)
                .attr('fill', 'lightgray')
                .attr('id', 'volNormToggle')
                .on('click', () => {
                    yrange = d3.scaleLinear()
                        .domain([0, maxVolNorm])
                        .range([height, 0])
                        .nice();

                    yAxis = d3.axisLeft()
                        .scale(yrange)
                        .tickPadding(2);

                    d3.selectAll('g.y.axis').call(yAxis);
                    svg.selectAll('.tick').select('text')
                        .attr('fill', 'black')
                        .attr('stroke', 'none')
                        .attr('font-size', '14px');
                    d3.select('#curves').remove();
                    const graph = svg.append('g')
                        .attr('id', 'curves');
                    plotBatch(data, graph, xrange, yrange, width, height, true);

                    d3.select('#volRawToggle').attr('fill', 'lightgray');
                    d3.select('#volNormToggle').attr('fill', '#cd5686');
                });

            const volRawText = svg.append('text')
                .attr('fill', 'black')
                .style('font-size', '12px')
                .attr('id', 'volRawText')
                .attr('text-anchor', 'middle')
                .attr('x', width + 60)
                .attr('y', height / 2 + 64)
                .text('Raw')
                .on('click', () => {
                    yrange = d3.scaleLinear()
                        .domain([0, maxVolume])
                        .range([height, 0])
                        .nice();

                    yAxis = d3.axisLeft()
                        .scale(yrange)
                        .tickPadding(2);

                    d3.selectAll('g.y.axis').call(yAxis);
                    svg.selectAll('.tick').select('text')
                        .attr('fill', 'black')
                        .attr('stroke', 'none')
                        .attr('font-size', '14px');
                    d3.select('#curves').remove();
                    const graph = svg.append('g')
                        .attr('id', 'curves');
                    plotBatch(data, graph, xrange, yrange, width, height, false);

                    d3.select('#volRawToggle').attr('fill', '#cd5686');
                    d3.select('#volNormToggle').attr('fill', 'lightgray');
                });

            const volNormText = svg.append('text')
                .attr('fill', 'black')
                .style('font-size', '12px')
                .attr('id', 'volNormText')
                .attr('x', width + 29)
                .attr('y', height / 2 + 84)
                .text('Normalized')
                .on('click', () => {
                    yrange = d3.scaleLinear()
                        .domain([0, maxVolNorm])
                        .range([height, 0])
                        .nice();

                    yAxis = d3.axisLeft()
                        .scale(yrange)
                        .tickPadding(2);

                    d3.selectAll('g.y.axis').call(yAxis);
                    svg.selectAll('.tick').select('text')
                        .attr('fill', 'black')
                        .attr('stroke', 'none')
                        .attr('font-size', '14px');
                    d3.select('#curves').remove();
                    const graph = svg.append('g')
                        .attr('id', 'curves');
                    plotBatch(data, graph, xrange, yrange, width, height, true);

                    d3.select('#volRawToggle').attr('fill', 'lightgray');
                    d3.select('#volNormToggle').attr('fill', '#cd5686');
                });
            // })
        }
    }

    render() {
        const { patientParam, drugParam } = this.props;
        return (
            <div>
                <TopNav />
                <GlobalStyles />
                <div className="wrapper" style={{ margin: 'auto', fontSize: '16px' }}>
                    <div className="curve-wrapper" style={{ marginTop: '100px' }}>
                        <h1>
Drug ID =
                            {' '}
                            <span style={{ color: '#cd5686' }}>{drugParam.replace(/\s\s\s/g, ' + ')}</span>
                            {' '}
and Patient ID =
                            {' '}
                            <span style={{ color: '#cd5686' }}>{patientParam}</span>
                        </h1>

                        <svg ref={(node) => this.node = node} width={1300} height={620} />

                        <div className="no-graph">There is no data for this graph.</div>


                    </div>
                    <StatTable patientParam={patientParam} drugParam={drugParam} />
                    <div className="curve-wrapper" style={{ marginTop: '20px', padding: '10px 0px' }}>
                        <Link to="/datasets"> ←&nbsp;&nbsp;Back to Datasets </Link>
                    </div>

                </div>
            </div>
        );
    }
}


export default TumorGrowthCurve;
