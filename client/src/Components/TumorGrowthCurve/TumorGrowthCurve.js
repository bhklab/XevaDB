/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable no-extend-native */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
import React from 'react';
import * as d3 from 'd3';
import { Link } from 'react-router-dom';
import GlobalStyles from '../../GlobalStyles';
import TopNav from '../TopNav/TopNav';
import StatTable from '../ResponseStat/ModelResponseStatTable';

class TumorGrowthCurve extends React.Component {
    constructor(props) {
        super(props);
        // binding the functions declared.
        this.makeTumorGrowthCurve = this.makeTumorGrowthCurve.bind(this);
    }

    componentDidUpdate() {
        this.Initialize();
    }

    // intiliazing the variables.
    Initialize() {
        const { node } = this;
        const plotId = 'plot';
        const { data } = this.props;

        // call the function only if there is data available.
        if (data.length !== 0) {
            this.makeTumorGrowthCurve(data, plotId, node);
            d3.select('.no-graph').remove();
        } else {
            d3.select('svg').remove();
        }
    }

    // This is the main function to create Growth curves.
    makeTumorGrowthCurve(data, plotId, node) {
        // this function will return all the unqiue time points for control and treatment.
        function getUnionOfTimepoints(data) {
            let control = [];
            let treatment = [];

            for (let i = 0; i < data.length; i++) {
                if (data[i].exp_type === 'control') {
                    const time = data[i].pdx_points[0].times;
                    control = [...control, ...time];
                } else if (data[i].exp_type === 'treatment') {
                    const time = data[i].pdx_points[0].times;
                    treatment = [...treatment, ...time];
                }
            }

            // unique sorted list of time points.
            const uniqueControl = [...new Set(control)].sort((a, b) => a - b);
            const uniqueTreatment = [...new Set(treatment)].sort((a, b) => a - b);

            // return the list.
            return [uniqueControl, uniqueTreatment];
        }


        // calculating the min max volume and time.
        function calculateMinMax(data) {
            // calculating max time, min/max volumes of all data
            const maxTimeArray = [];
            const minVolArray = [];
            const maxVolArray = [];
            const maxVolNormArray = [];
            const minVolNormArray = [];

            // looping through data to get max and min array.
            for (let i = 0; i < data.length; i++) {
                maxTimeArray.push(d3.max(data[i].pdx_points[0].times));
                minVolArray.push(d3.min(data[i].pdx_points[0].volumes));
                maxVolArray.push(d3.max(data[i].pdx_points[0].volumes));
                maxVolNormArray.push(d3.max(data[i].pdx_points[0].volume_normals));
                minVolNormArray.push(d3.min(data[i].pdx_points[0].volume_normals));
            }

            // max and min value.
            const maxTime = Math.max.apply(null, maxTimeArray);
            const minVolume = Math.min.apply(null, minVolArray);
            const maxVolume = Math.max.apply(null, maxVolArray);
            const maxVolNorm = Math.max.apply(null, maxVolNormArray);
            const minVolNorm = Math.min.apply(null, minVolNormArray);

            return {
                maxTime, minVolume, maxVolume, maxVolNorm, minVolNorm,
            };
        }

        // plotting the error bars.
        function plotErrorBars(exp, times, newVolume, meanVolume, svg, xrange, yrange, yStandardError) {
            const errorBars = svg.append('g')
                .attr('id', 'errorBars');

            const errorMidBar = errorBars.selectAll('line.error')
                .data(times);

            errorMidBar.enter()
                .append('line')
                .attr('class', 'error')
                .attr('stroke', () => {
                    if (exp === 'control') {
                        return '#cd5686';
                    }
                    return '#5974c4';
                })
                .attr('stroke-width', 2)
                .attr('x1', (d) => xrange(d))
                .attr('x2', (d) => xrange(d))
                .attr('y1', (d, i) => yrange(meanVolume[i] + yStandardError[i]))
                .attr('y2', (d, i) => yrange(meanVolume[i] - yStandardError[i]));

            const errorTopBar = errorBars.selectAll('line.errorTop')
                .data(times);

            errorTopBar.enter()
                .append('line')
                .attr('class', 'errorTop')
                .attr('stroke', () => {
                    if (exp === 'control') {
                        return '#cd5686';
                    }
                    return '#5974c4';
                })
                .attr('stroke-width', 2)
                .attr('x1', (d) => xrange(d) - 4)
                .attr('x2', (d) => xrange(d) + 4)
                .attr('y1', (d, i) => yrange(meanVolume[i] + yStandardError[i]))
                .attr('y2', (d, i) => yrange(meanVolume[i] + yStandardError[i]));

            const errorBotBar = errorBars.selectAll('line.errorBot')
                .data(times);

            errorBotBar.enter()
                .append('line')
                .attr('class', 'errorBot')
                .attr('stroke', () => {
                    if (exp === 'control') {
                        return '#cd5686';
                    }
                    return '#5974c4';
                })
                .attr('stroke-width', 2)
                .attr('x1', (d) => xrange(d) - 4)
                .attr('x2', (d) => xrange(d) + 4)
                .attr('y1', (d, i) => yrange(meanVolume[i] - yStandardError[i]))
                .attr('y2', (d, i) => yrange(meanVolume[i] - yStandardError[i]));
        }

        // plot the mean of each experiment type (control, treatment)
        function plotMeans(data, svg, xrange, yrange, isNormal) {
            console.log(data);
            // calling getUnionOfTimepoints to get all the timepoints.
            const timeUnion = getUnionOfTimepoints(data);
            console.log(timeUnion);
            let expTypes = [];
            const { batch } = data[0]; // TODO: fix the batch, it's the first one rn

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

            // object of the volume with number of occurences(control/treatment).
            const newVolumeControl = {};
            const newVolumeTreatment = {};

            data.forEach((val) => {
                let z = 0;
                const oldVolume = isNormal ? val.pdx_points[0].volume_normals : val.pdx_points[0].volumes;
                const oldTime = val.pdx_points[0].times;
                const newVolume = val.exp_type === 'control' ? newVolumeControl : newVolumeTreatment;
                const timeUnionData = val.exp_type === 'control' ? timeUnion[0] : timeUnion[1];
                timeUnionData.forEach((time) => {
                    if ((time === oldTime[z]) && !newVolume[time]) {
                        newVolume[time] = {};
                        newVolume[time].totalVolume = oldVolume[z];
                        newVolume[time].number = 1;
                        newVolume[time].minVol = oldVolume[z];
                        newVolume[time].maxVol = oldVolume[z];
                        newVolume[time].volume = [];
                        newVolume[time].volume.push(oldVolume[z]);
                        z++;
                    } else if ((time === oldTime[z]) && newVolume[time]) {
                        newVolume[time].totalVolume += oldVolume[z];
                        newVolume[time].number += 1;
                        newVolume[time].minVol = newVolume[time].minVol > oldVolume[z] ? oldVolume[z] : newVolume[time].minVol;
                        newVolume[time].maxVol = newVolume[time].maxVol < oldVolume[z] ? oldVolume[z] : newVolume[time].maxVol;
                        newVolume[time].volume.push(oldVolume[z]);
                        z++;
                    } else if (oldTime[z]) {
                        const current = oldVolume[z - 1] + ((oldVolume[z] - oldVolume[z - 1]) / (oldTime[z] - oldTime[z - 1])) * (time - oldTime[z - 1]);
                        if (!newVolume[time]) {
                            newVolume[time] = {};
                            newVolume[time].totalVolume = 0;
                            newVolume[time].minVol = 10000;
                            newVolume[time].maxVol = 0;
                            newVolume[time].volume = [];
                        }
                        newVolume[time].totalVolume += current;
                        newVolume[time].number = newVolume[time].number ? newVolume[time].number + 1 : 1;
                        newVolume[time].minVol = newVolume[time].minVol > current ? current : newVolume[time].minVol;
                        newVolume[time].maxVol = newVolume[time].maxVol < current ? current : newVolume[time].maxVol;
                        newVolume[time].volume.push(current);
                    }
                });
            });

            // median volume.
            // meanVolume = Object.keys(newVolume).map((element) => (d3.deviation(newVolume[element].volume) / (newVolume[element].volume.length)));

            for (let n = 0; n < expTypes.length; n++) {
                const exp = expTypes[n];
                // assigining the volume based on the control or treatment.
                const newVolume = expTypes[n] === 'control' ? newVolumeControl : newVolumeTreatment;
                // const times = timeUnion[n];

                // mean volume, standard error amd time points where there are more than one volume points.
                let meanVolume = [];
                let yStandardError = [];
                let times = [];
                Object.keys(newVolume).forEach((element) => {
                    if (newVolume[element].volume.length > 1) {
                        // volume.
                        meanVolume.push(d3.mean(newVolume[element].volume));
                        // standard error.
                        const deviation = d3.deviation(newVolume[element].volume);
                        const error = Math.sqrt(newVolume[element].volume.length - 1);
                        yStandardError.push(deviation / error);
                        // time.
                        times.push(element);
                    }
                });

                // plot error bars
                plotErrorBars(exp, times, newVolume, meanVolume, svg, xrange, yrange, yStandardError);

                // mean svg
                const meanSvg = svg.append('g')
                    .attr('id', `mean_${expTypes[n]}`);

                const meanDots = meanSvg.selectAll('.mean-dot')
                    .data(meanVolume)
                    .enter();

                meanDots.append('circle')
                    .attr('id', `mean-dot-${expTypes[n]}-${batch}`)
                    .attr('class', `mean-dot ${batch}`)
                    .attr('r', 4)
                    .attr('fill', () => {
                        if (expTypes[n] === 'control') {
                            return '#cd5686';
                        }
                        return '#5974c4';
                    })
                    .attr('cx', (d, i) => xrange(times[i]))
                    .attr('cy', (d, i) => yrange(meanVolume[i]));

                const meanPath = meanSvg.selectAll('.mean-path')
                    .data(meanVolume)
                    .enter();


                const linepath = d3.line()
                    .x((d, i) => xrange(timeUnion[n][i]))
                    .y((d, i) => yrange(meanVolume[i]));

                meanPath.append('path')
                    .attr('id', `mean-path-${expTypes[n]}-${batch}`)
                    .attr('class', `mean-path ${batch}`)
                    .attr('d', linepath(meanVolume))
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
                meanVolume = [];
                yStandardError = [];
                times = [];
            }
        }

        function plotBatch(data, graph, xrange, yrange, width, height, norm) {
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
                .style('min-width', '150px')
                .style('min-height', '80px')
                .attr('top', 10)
                .attr('left', 20);

            // appends dots.
            dots.append('circle')
                .attr('id', (d, i) => `dot-${d.model.replace(/\./g, ' ').replace(/\s/g, '-')}-${
                    d.exp_type}${i}`)
                .attr('class', (d) => `model-dot_${d.exp_type}`)
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

            // creating line.
            const createLine = (stroke, opacity, color = '#cd5686') => (
                paths.append('path')
                    .attr('id', (d) => `path-${d.model.replace(/\./g, ' ').replace(/\s/g, '-')}`)
                    .attr('class', (d) => `model-path_${d.exp_type}`)
                    .attr('d', (d) => linepath(d.pdx_json))
                    .attr('fill', 'none')
                    .style('opacity', opacity)
                    .attr('stroke', (d) => {
                        if (color === 'white') {
                            return color;
                        }
                        if (d.exp_type === 'control') {
                            return '#cd5686';
                        }
                        return '#5974c4';
                    })
                    .attr('stroke-width', stroke)
            );

            // selecting and unselecting the table data.
            const tableSelect = (d, stroke, opacity, tcolor, tback, acolor, aback) => {
                d3.select(`#path-${d.model.replace(/\./g, ' ').replace(/\s/g, '-')}`)
                    .attr('stroke-width', stroke)
                    .style('opacity', opacity);
                d3.selectAll(`.responsetable_${d.model.replace(/\./g, '_')}`)
                    .selectAll('td')
                    .style('color', tcolor)
                    .style('background', tback);
                d3.selectAll(`.responsetable_${d.model.replace(/\./g, '_')}`)
                    .selectAll('a')
                    .style('color', acolor)
                    .style('background', aback);
            };


            // add line
            createLine(3, 0.6)
                .attr('stroke-dasharray', ('3', '3'));

            // create a white line to let user hover over with opacity 0 and event listeners.
            createLine(4, 0, 'white')
                .on('mouseover', (d) => {
                    // tooltip on mousever setting the div to visible.
                    tooltip
                        .style('visibility', 'visible');

                    // tooltip grabbing event.pageX and event.pageY
                    // and set color according to the ordinal scale.
                    const tooltipDiv = tooltip
                        .style('left', `${d3.event.pageX + 10}px`)
                        .style('top', `${d3.event.pageY + 10}px`)
                        .style('color', '#000000')
                        .style('background-color', '#ffffff');

                    // tooltip data.
                    const tooltipData = [
                        `Batch: ${d.batch}`, `Drug: ${d.drug}`, `Exp_Type: ${d.exp_type}`, `Model: ${d.model}`,
                    ];
                    tooltipDiv.selectAll('textDiv')
                        .data(tooltipData)
                        .enter()
                        .append('div')
                        .attr('id', 'tooltiptext')
                        .html((d) => {
                            const data = d.split(':');
                            return `<b>${data[0]}</b>: ${data[1]}`;
                        })
                        .attr('x', `${d3.event.pageX + 10}px`)
                        .attr('y', (d, i) => (`${d3.event.pageY + 10 + i * 10}px`));

                    // changing attributes of the line on mouseover.
                    tableSelect(d, 5, 1.0, '#f5f5f5', '#5974c4', '#f5f5f5', '#5974c4');
                })
                .on('mouseout', (d) => {
                    // remove all the divs with id tooltiptext.
                    d3.selectAll('#tooltiptext').remove();

                    // tooltip on mousever setting the div to hidden.
                    tooltip
                        .style('visibility', 'hidden');

                    // changing attributes back to normal of the line on mouseout.
                    if (!(d3.select(`#path-${d.model.replace(/\./g, ' ').replace(/\s/g, '-')}`).classed('selected'))) {
                        tableSelect(d, 3, 0.6, '#cd5686', 'white', '#5974c4', 'white');
                    }
                })
                .on('click', (d) => {
                    d3.event.preventDefault();
                    let selectedCurve = false;
                    const selection = d3.select(`#path-${d.model.replace(/\./g, ' ').replace(/\s/g, '-')}`);
                    // select all the path elements and deselect them.
                    // multiple selections in case of ctrl or command key.
                    if (!(d3.event.ctrlKey || d3.event.metaKey)) {
                        d3.selectAll('path').nodes().forEach((val) => {
                            if (val.attributes[5] && val.style.opacity !== '0' && val.classList.contains('selected')) {
                                val.attributes[5].value = 3;
                                val.style.opacity = 0.6;
                                const previousSelection = d3.select(`.${val.classList[0]}`);
                                const model = previousSelection.data()[0];
                                previousSelection.classed('selected', false);
                                tableSelect(model, 3, 0.6, '#cd5686', 'white', '#5974c4', 'white');
                                if (val.classList[0] === selection.attr('class')) {
                                    selectedCurve = true;
                                }
                            }
                        });
                    }

                    // highlight and classed according to selection.
                    if (!(selection.classed('selected')) && !selectedCurve) {
                        selection.classed('selected', true);
                        tableSelect(d, 5, 1.0, '#f5f5f5', '#5974c4', '#f5f5f5', '#5974c4');
                    } else if (selection.classed('selected')) {
                        selection.classed('selected', false);
                        tableSelect(d, 3, 0.6, '#cd5686', 'white', '#5974c4', 'white');
                    }
                });
            // calling plotMeans to plot the mean function.
            plotMeans(data, graph, xrange, yrange, norm);
        }

        // toggle to show each model
        function volumeToggle(data, svg, xrange, yrange, yAxisAdd, yAxis, width, height, maxVolume, maxVolNorm, plotId, minVolNorm) {
            const toggleValues = ['volRaw', 'volNorm', 'volRawText', 'volNormText'];

            // to create the rectangle and
            function createReactangle(additionalHeight, color, id, val) {
                let rect = '';
                if (val === 'volRaw' || val === 'volNorm') {
                    rect = svg.append('rect')
                        .attr('x', width + 25)
                        .attr('y', height / 2 + additionalHeight)
                        .attr('width', 70)
                        .attr('height', 20)
                        .attr('fill', color)
                        .style('opacity', 0.8)
                        .attr('id', id);
                } else if (val === 'volRawText' || val === 'volNormText') {
                    rect = svg.append('text')
                        .attr('fill', 'black')
                        .style('font-size', '12px')
                        .attr('text-anchor', val === 'volRawText' ? 'middle' : 'null')
                        .attr('id', 'volNormText')
                        .attr('x', width + (val === 'volRawText' ? 60 : 29))
                        .attr('y', height / 2 + (val === 'volRawText' ? 64 : 84))
                        .text(val === 'volRawText' ? 'Raw' : 'Normalized');
                }
                return rect;
            }

            toggleValues.forEach((val) => {
                // setting the initial variables.
                let additionalHeight = 50;
                let color = '#cd5686';
                let id = '';
                let plot = false;
                let rawToggle = '#cd5686';
                let normToggle = 'lightgray';
                let minimum = 0;
                let maximum = maxVolume;

                // switching based on the toggle value.
                switch (val) {
                case 'volNorm':
                    additionalHeight = 70;
                    color = 'lightgray';
                    id = 'volNormToggle';
                    plot = true;
                    rawToggle = 'lightgray';
                    normToggle = '#cd5686';
                    minimum = minVolNorm - 1;
                    maximum = maxVolNorm + 1;
                    break;

                case 'volNormText':
                    additionalHeight = 70;
                    color = 'lightgray';
                    id = 'volNormText';
                    plot = true;
                    rawToggle = 'lightgray';
                    normToggle = '#cd5686';
                    minimum = minVolNorm - 1;
                    maximum = maxVolNorm + 1;
                    break;

                case 'volRaw':
                    id = 'volRawToggle';
                    break;

                case 'volRawText':
                    id = 'volRawText';
                    break;

                default:
                    id = 'Looking for what??';
                }

                // call to create toggle rectangle and text.
                const rect = createReactangle(additionalHeight, color, id, val);

                // on click handler.
                rect
                    .on('click', () => {
                        // y-axis change
                        const yrange = d3.scaleLinear()
                            .domain([minimum, maximum])
                            .range([height, 0])
                            .nice();

                        const yAxis = d3.axisLeft()
                            .scale(yrange)
                            .tickPadding(2);

                        d3.selectAll('g.y.axis').call(yAxis);

                        // setting ticks.
                        svg.selectAll('.tick').select('text')
                            .attr('fill', 'black')
                            .attr('stroke', 'none')
                            .attr('font-size', '14px');

                        // removing the other curve.
                        d3.select('#curves').remove();
                        const graph = svg.append('g')
                            .attr('id', 'curves');

                        // plot the toggle curve.
                        plotBatch(data, graph, xrange, yrange, width, height, plot);

                        // unselect the data from the table.
                        d3.selectAll('tr').nodes().forEach((val) => {
                            if (val.className) {
                                d3.select(`.${val.className}`)
                                    .selectAll('td')
                                    .style('color', '#cd5686')
                                    .style('background', 'white');
                                d3.select(`.${val.className}`)
                                    .selectAll('a')
                                    .style('color', '#5974c4')
                                    .style('background', 'white');
                            }
                        });

                        d3.select('#volRawToggle').attr('fill', rawToggle);
                        d3.select('#volNormToggle').attr('fill', normToggle);
                    });
            });
        }


        function tumorCurve(data, plotId, node) {
            // calling function to grab the min max values.
            const minmax = calculateMinMax(data);

            // expression types.
            const expTypes = ['control', 'treatment'];

            // positioning variables
            const width = 970;
            const height = 500;
            const margin = {
                top: 50,
                right: 260,
                bottom: 250,
                left: 130,
            };

            // make the svg element
            const svg = d3.select(node)
                .append('svg')
                .attr('id', `pdx${plotId}`)
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
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
                .domain([0, minmax.maxTime])
                .range([0, width])
                .nice();

            const yrange = d3.scaleLinear()
                .domain([0, minmax.maxVolume])
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
            svg.append('g')
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
                width, height, minmax.maxVolume, minmax.maxVolNorm, plotId, minmax.minVolNorm);
        }

        // calling tumorCurve function passing the data, PlotID and node reference.
        tumorCurve(data, plotId, node);
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
                            <span style={{ color: '#cd5686' }}>{drugParam.replace(/\s\s\s/g, ' + ').replace(/\s\s/g, ' + ')}</span>
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
