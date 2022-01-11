/* eslint-disable max-len */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable camelcase */
import React, { useEffect, useContext } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { mutationTypeMap, cnaMap, rnaMap } from '../../../utils/MutationViewsUtil';
import PatientContext, { PatientConsumer } from '../../Context/PatientContext';
import colors from '../../../styles/colors';
import createSvgCanvas from '../../../utils/CreateSvgCanvas';
import createToolTip from '../../../utils/ToolTip';
import convertToTitleCase from '../../../utils/ConvertToTitleCase';

// aberration data
const aberration = [
    { value: 'missense', color: `${colors.green}` },
    { value: 'inframe', color: `${colors.brown}` },
    { value: 'truncating', color: `${colors.black}` },
    { value: 'other', color: `${colors.violet}` },
    { value: 'del', color: `${colors.blue}` },
    { value: 'amp', color: `${colors.red}` },
];

const cnvMapping = { del: 'Deletion', amp: 'Amplification' };

/**
 * @param {Array} data - data input array
 * @returns {Array} - array of objects {value: '', color: ''}
 */
const getMutationMappingObject = (data) => {
    // mutation array.
    let mutations = [];
    data.forEach((el) => {
        Object.keys(el).forEach((value) => {
            if (value !== 'gene_id' && el[value] !== '0') {
                mutations.push(...el[value].split(','));
            }
        });
    });
    // set of the unique mutations.
    mutations = [...new Set(mutations)];

    // mapping mutations to the mutationTypeMap object
    const mutationObject = {};
    mutations.forEach((mutation) => {
        const mutationStyle = mutationTypeMap[mutation.toLowerCase()].style;
        const mutationColor = mutationTypeMap[mutation.toLowerCase()].color;
        if (!mutationObject[mutationStyle]) {
            mutationObject[mutationStyle] = {
                value: convertToTitleCase(mutationStyle, '_'),
                color: mutationColor,
            };
        }
    });
    return Object.values(mutationObject);
};

/**
 * @param {Array} data - input data array
 * @returns {Array} - mapping of CNV data
 */
const getCopyNunberVariationMapping = (data) => {
    const cnvObject = {};
    data.forEach((obj) => {
        Object.entries(obj).forEach(([key, value]) => {
            if (key !== 'gene_id' && value !== '0' && !cnvObject[cnaMap[value.toLowerCase()].xevalabel]) {
                const xevaLabel = cnaMap[value.toLowerCase()].xevalabel;
                const { color } = cnaMap[value.toLowerCase()];
                // adding to cnv object
                cnvObject[xevaLabel] = {
                    value: cnvMapping[xevaLabel],
                    color,
                };
            }
        });
    });
    return Object.values(cnvObject);
};

/**
 * @param {Array} data_mut - array of mutation data
 * @param {Array} data_rna - array of rna data
 * @param {Array} data_cnv - array of cnv data
 */
const createAlterationData = (data_mut, data_rna, data_cnv) => {
    // adding this for rectangles on right side of oncoprint.
    // only if the mutation data is present.
    let rect_alterations_mut = [];
    if (data_mut.length > 0) {
        rect_alterations_mut = getMutationMappingObject(data_mut);
    }
    // only if rnaseq data is available.
    let rect_alterations_rna = [];
    if (data_rna.length > 0) {
        rect_alterations_rna = [
            { value: 'Expression High', color: 'none' },
            { value: 'Expression Low', color: 'none' },
        ];
    }
    // only if the cnv data is present.
    let rect_alterations_cnv = [];
    if (data_cnv.length > 0) {
        rect_alterations_cnv = getCopyNunberVariationMapping(data_cnv);
    }

    // wild type only when cnv or mut data is available
    const remainingTypes = (data_cnv.length > 0 || data_mut.length > 0)
        ? [
            { value: 'Wild Type', color: 'lightgray' },
            { value: 'Not Available', color: 'none' }
        ]
        : [
            { value: 'Not Available', color: 'none' }
        ];

    const rect_alterations = [
        ...rect_alterations_mut,
        ...rect_alterations_rna,
        ...rect_alterations_cnv,
        ...remainingTypes,
    ];

    return rect_alterations;
};

/**
 * appending circles that allow sorting of the data.
 * @param {Array} genes - genes array.
 * @param {Object} svg - svg object.
 * @param {number} rect_height - height.
 */
const sortingCircles = (genes, svg, rect_height) => {
    genes.forEach((val, i) => {
        svg
            .append('circle')
            .attr('cx', -12)
            .attr('cy', i)
            .attr('r', 6)
            .attr('id', `circle-${val.replace(/\s/g, '').replace(/\+/g, '').replace('.', '')}`)
            .style('fill', `${colors.circle_green}`)
            .attr('transform', `translate(0,${i * (rect_height) + 15 - i})`)
            .style('visibility', 'hidden');
    });
};

const createGeneYAxis = (
    skeleton, genes, rect_height, rect_width, tooltip, data_mut, data_cnv, data_rna, props, context,
) => {
    // geneNames
    const geneNames = skeleton.append('g')
        .attr('id', 'gene_names');

    // gene names on the y axis
    for (let i = 0; i < genes.length; i++) {
        geneNames.append('text')
            .attr('class', genes[i])
            .attr('dx', -25)
            .style('text-anchor', 'end')
            .style('font-size', '11px')
            .attr('dy', i * (rect_height) + rect_width)
            .attr('font-weight', '550')
            .attr('fill', `${colors.blue_header}`)
            .text(genes[i])
            .on('mouseover', () => {
                // tooltip on mousever setting the div to visible.
                d3.select('#oncoprint')
                    .append('div')
                    .style('position', 'absolute')
                    .style('border', 'solid')
                    .style('visibility', 'visible')
                    .style('border-width', '1px')
                    .style('border-radius', '5px')
                    .style('padding', '5px')
                    .style('left', `${d3.event.pageX - 100}px`)
                    .style('top', `${d3.event.pageY + 15}px`)
                    .attr('id', 'tooltiptextgene')
                    .style('color', `${colors.black}`)
                    .style('background-color', `${colors.white}`)
                    .text('Click to Sort');

                d3.selectAll(`.oprint-hlight-${genes[i]}`)
                    .style('opacity', 0.2);
            })
            .on('mouseout', () => {
                // tooltip on mousever setting the div to hidden.
                tooltip
                    .style('visibility', 'hidden');
                // remove all the divs with id tooltiptext.
                d3.select('#tooltiptextgene').remove();
                // for highlight.
                d3.selectAll(`.oprint-hlight-${genes[i]}`)
                    .style('opacity', 0);
            })
            .on('click', () => {
                // tooltip on mousever setting the div to hidden.
                tooltip
                    .style('visibility', 'hidden');
                // remove all the divs with id tooltiptext.
                d3.select('#tooltiptextgene').remove();
                // ranking oncoprint.
                rankOncoprint(genes[i], [data_mut, data_cnv, data_rna], props, context);
            });
    }
};

/**
 * @param {Array} genes - array of genes.
 * @param {Array} genes_mut - array of genes for mutation.
 * @param {Array} genes_cnv - array of genes for cnv.
 */
const geneAlteration = (genes, genes_mut, genes_cnv) => {
    const gene_alterations = {};

    if (genes_mut.length > 0 || genes_cnv.length > 0) {
        for (let i = 0; i < genes.length; i++) {
            gene_alterations[genes[i]] = {
                missense: 0, amp: 0, del: 0, inframe: 0, truncating: 0, other: 0,
            };
        }
    }

    return gene_alterations;
};

/**
 * @param {Array} hmap_patients - patients array
 * @param {Array} genes_mut - array of genes for mutation.
 * @param {Array} genes_cnv - array of genes for cnv.
 */
const patientAlteration = (hmap_patients, genes_mut, genes_cnv) => {
    const patient_alterations = [];

    if (genes_mut.length > 0 || genes_cnv.length > 0) {
        for (let i = 0; i < hmap_patients.length; i++) {
            patient_alterations.push({
                missense: 0, amp: 0, del: 0, inframe: 0, truncating: 0, other: 0,
            });
        }
    }

    return patient_alterations;
};

/**
 * main function to create the oncoprint
 * @param {Array} hmap_patients - patient array
 * @param {Object} props - props object
 * @param {Object} context - context object
 */
const makeOncoprint = (hmap_patients, props, context) => {
    let isAlteration = false;

    // data from props.
    const { className: plotId } = props;
    const { dimensions, margin, threshold } = props;
    const { data_mut, data_rna, data_cnv } = props;
    const { genes_mut, genes_rna, genes_cnv } = props;
    const { patient_mut, patient_rna, patient_cnv } = props;

    // unique patients and genes.
    const genes = [...new Set([...genes_mut, ...genes_rna, ...genes_cnv])];
    const patients = [...new Set([...patient_mut, ...patient_rna, ...patient_cnv])];

    // abberation.
    const rect_alterations = createAlterationData(data_mut, data_rna, data_cnv);

    // height and width for the SVG based on the number of genes_mut and patient/sample ids.
    // height and width of the rectangles in the main skeleton.
    const rect_height = dimensions.height;
    const rect_width = dimensions.width;

    // this height and width is used for setting the body.
    const height = genes.length * rect_height;
    const width = hmap_patients.length * rect_width;

    // making tooltips
    const tooltip = createToolTip('oncoprint');

    /** SETTING SVG ATTRIBUTES and Oncoprint SKELETON * */
    // make the svg element
    const svg = createSvgCanvas({
        height, width, margin, id: 'oncoprint', canvasId: `oncoprint-${plotId}`,
    });

    // skeleton of the oncoprint
    const skeleton = svg.append('g')
        .attr('id', 'skeleton');

    /** Appending Circle to the  Y-Axis */
    sortingCircles(genes, svg, rect_height);

    /* *  Gene Names on Y-Axis * */
    createGeneYAxis(skeleton, genes, rect_height, rect_width, tooltip, data_mut, data_cnv, data_rna, props, context);

    /* ****************************************** Setting Alterations ****************************************** */
    // alterations: mutations are #1a9850 and a third, AMP/del are #e41a1c/#0033CC and full respectively
    const alterations = svg.append('g')
        .attr('id', 'alterations');

    const highlight = svg.append('g')
        .attr('id', 'highlight');

    // collect info about alterations per gene/patient for plotting later
    const gene_alterations = geneAlteration(genes, genes_mut, genes_cnv);
    const patient_alterations = patientAlteration(hmap_patients, genes_mut, genes_cnv);

    /** Coloring the rectangles based on mutation, cnv or rnaseq data * */
    // this will take four parameters and color the rectangle accordingly
    const colorReactangles = (value, color, i, j, mutationType) => {
        // setting a = 12 if value is mut
        const a = value === 'mut' ? 10 : 0;
        // setting the color based on value param.
        if (value !== 'empty' && value === 'mut') {
            gene_alterations[genes[i]][mutationType]++;
            patient_alterations[j][mutationType]++;
        } else if (value !== 'empty' && (value === 'amp' || value === 'del')) {
            gene_alterations[genes[i]][value]++;
            patient_alterations[j][value]++;
        }

        // value !== 'highrna' && value !== 'lowrna' && value! == 'amp'
        // this is for mutation data and rnaseq.
        const rect = alterations.append('rect')
            .attr('class', `alter-rect ${value}`)
            .attr('width', rect_width - rect_width / 2.5)
            .attr('height', rect_height - rect_width / 2.5 - (2 * a))
            .attr('fill', color)
            .attr('x', j * (rect_width))
            .attr('y', i * (rect_height) + 2 * (a / 2));

        // setting the boder high-rna and low-rna.
        if (value === 'highrna') {
            rect.attr('stroke', 'red')
                .style('opacity', 0.6);
        } else if (value === 'lowrna') {
            rect.attr('stroke', 'blue')
                .style('opacity', 0.6);
        }
    };

    // stroke for not sequenced patients.
    const colorNotSequenced = (i, j) => {
        alterations.append('rect')
            .attr('class', 'alter-rect nseq')
            .attr('width', rect_width - rect_width / 2.5)
            .attr('height', rect_height - rect_width / 2.5)
            .attr('fill', `${colors.white}`)
            .attr('stroke', 'lightgray')
            .attr('stroke-width', '1px')
            .attr('x', j * (rect_width) + 1)
            .attr('y', i * (rect_height) + 1);
    };

    // creates a layer of oncoprint.
    for (let i = 0; i < genes.length; i++) {
        for (let j = 0; j < hmap_patients.length; j++) {
            if (patients.includes(hmap_patients[j])) {
                colorReactangles('empty', 'lightgrey', i, j);
            } else {
                colorNotSequenced(i, j);
            }
        }
    }

    /** Coloring the rectangles borders based on mutation and cnv data * */
    for (let i = 0; i < genes.length; i++) {
        for (let j = 0; j < hmap_patients.length; j++) {
            /** Coloring the rectangles borders based on cnv data * */
            if (genes_cnv.includes(genes[i]) && data_cnv[i][hmap_patients[j]]) {
                const cnvType = cnaMap[data_cnv[i][hmap_patients[j]].toLowerCase()].xevalabel;
                const cnvColor = cnaMap[data_cnv[i][hmap_patients[j]].toLowerCase()].color;
                if (!isAlteration) {
                    isAlteration = (cnvType !== 'empty');
                }
                colorReactangles(cnvType, cnvColor, i, j);
            }

            /** Coloring the rectangles borders based on mutation data * */
            // if the gene from genes located in genes_mut.
            // mutation later because they are 1/3 the box.
            if (genes_mut.includes(genes[i]) && patient_mut.includes(hmap_patients[j]) && data_mut[i][hmap_patients[j]] !== '0' && data_mut[i][hmap_patients[j]] !== '') {
                isAlteration = !isAlteration ? true : isAlteration;
                // based on the data gives different colors to the rectangle.
                data_mut[i][hmap_patients[j]].split(',').forEach((el) => {
                    const { color } = mutationTypeMap[el.toLowerCase()];
                    const type = mutationTypeMap[el.toLowerCase()].mainType;
                    colorReactangles('mut', color, i, j, type);
                });
            }
        }
    }

    /** Coloring the rectangles borders based on rna sequencing data * */
    // variable for taking care of rnaseq data sequence.
    let z = 0;
    for (let i = 0; i < genes.length; i++) {
        if (genes_rna.includes(genes[i])) {
            for (let j = 0; j < hmap_patients.length; j++) {
                // only if the element is not included
                // complete layer of lightgrey rectangles only if mutation data is not available.
                if (Number(data_rna[z][hmap_patients[j]]) > threshold) {
                    colorReactangles('highrna', 'none', i, j);
                } else if (Number(data_rna[z][hmap_patients[j]]) < -threshold) {
                    colorReactangles('lowrna', 'none', i, j);
                }
            }
            z++;
        }
    }

    /** *******************************************ALTERATION GRAPHS******************************************* * */

    /** ******************************************* Vertical Graph  ******************************************** */
    if ((genes_mut.length > 0 || genes_cnv.length > 0) && isAlteration) {
        // calculating max width
        const max_width_arr = [];
        for (let i = 0; i < genes.length; i++) {
            let max = 0;
            for (let j = 0; j < aberration.length; j++) {
                max += gene_alterations[genes[i]][aberration[j].value];
            }
            max_width_arr.push(max);
        }
        const max_width = d3.max(max_width_arr);

        const xrange_gene = d3.scaleLinear()
            .domain([0, max_width])
            .range([0, rect_width * 5]);

        const gene_alter = svg.append('g')
            .attr('id', 'gene-alter')
            .attr('transform', `translate(${hmap_patients.length * rect_width + rect_width},0)`);

        const stroke_width = 1; // this will set the stroke width of the outer rectangle

        // setting the outer rectangle.
        gene_alter.append('rect')
            .attr('class', 'patient_eval_rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', (rect_height) * (genes.length) - 6)
            .attr('width', xrange_gene(max_width))
            .attr('fill', `${colors.white}`)
            .style('stroke', `${colors.black}`)
            .style('stroke-width', stroke_width);

        // function to caculate alterations.
        const geneAlterationReactangle = (iterator) => {
            // variables.
            const i = iterator;
            let x_range = stroke_width / 2;
            let aberration_type = '';
            // loops through each type for each of the genes_mut.
            aberration.forEach((type) => {
                const { color } = type;
                if (aberration_type !== '') {
                    x_range += xrange_gene(gene_alterations[genes[i]][aberration_type]);
                }
                aberration_type = type.value;

                // rectangle coloring.
                gene_alter.append('rect')
                    .attr('class', `gene-rect ${type}`)
                    .attr('height', rect_height - 6)
                    .attr('width', xrange_gene(gene_alterations[genes[i]][type.value]))
                    .attr('fill', color)
                    .attr('y', (i * (rect_height)))
                    .attr('x', x_range);
            });
        };

        // calculate alterations for each row.
        for (let i = 0; i < genes.length; i++) {
            geneAlterationReactangle(i);
        }

        // This will set the axis and scale.
        const xrange_scale = d3.scaleLinear()
            .domain([0, max_width])
            .range([0, xrange_gene(max_width)]);

        const x_axis = d3.axisTop()
            .scale(xrange_scale)
            .ticks(4)
            .tickSize(3)
            .tickFormat(d3.format('.0f'));

        svg.append('g')
            .attr('class', 'x_axis')
            .attr('fill', 'none')
            .attr('stroke', `${colors.black}`)
            .attr('stroke-width', 1)
            .attr('transform', `translate(${hmap_patients.length * rect_width + rect_width} -0 )`)
            .call(x_axis)
            .selectAll('text')
            .attr('fill', `${colors.black}`)
            .style('font-size', 8)
            .attr('stroke', 'none');

        svg.selectAll('.tick')
            .select('text')
            .attr('fill', `${colors.black}`)
            .attr('stroke', 'none');
    }

    /** ******************************************* Horizontal Graph ******************************************* * */

    // calculating max height
    if ((genes_mut.length > 0 || genes_cnv.length > 0) && isAlteration) {
        // calculating the max height.
        const max_height_arr = [];

        for (let i = 0; i < patient_alterations.length; i++) {
            let max = 0;
            for (let j = 0; j < aberration.length; j++) {
                max += patient_alterations[i][aberration[j].value];
                // max_height_arr.push(patient_alterations[i][aberration[j].value]);
            }
            max_height_arr.push(max);
        }

        const max_height = d3.max(max_height_arr);

        const patient_alter = svg.append('g')
            .attr('id', 'patient-alter');

        const yrange_patient = d3.scaleLinear() // #TODO: scale.linear
            .domain([0, max_height])
            .range([`${dimensions.height}`, 0]);

        // function to caculate alterations.
        const patientAlterationReactangle = (iterator) => {
            // variables.
            const i = iterator;
            let y_range = 0;

            // loops through each type for each of the genes_mut.
            aberration.forEach((type, index) => {
                // set value to 1 if j is greater than 1.
                const j = index > 1 ? index / index : index;

                // setting y range.
                y_range = (yrange_patient(patient_alterations[i][type.value])) - ((`${dimensions.height}` * j) - y_range);

                // color setting.
                const { color } = type;

                // rectangle coloring.
                patient_alter.append('rect')
                    .attr('class', `patient-rect${type}`)
                    .attr('height', `${dimensions.height}` - yrange_patient(patient_alterations[i][type.value]))
                    .attr('width', rect_width - 5)
                    .attr('fill', color)
                    .attr('y', y_range)
                    .attr('x', i * `${dimensions.width}` + 1)
                    .attr('transform', 'translate(0,-40)');
            });
        };

        for (let i = 0; i < patient_alterations.length; i++) {
            patientAlterationReactangle(i);
        }

        const yrange_axis = d3.scaleLinear()
            .domain([0, max_height])
            .range([35 - yrange_patient(max_height), 0]).nice();

        const y_axis = d3.axisLeft()
            .scale(yrange_axis)
            .ticks(4); // change to dynamic ticks.
        // .tickSize(2)
        // .tickFormat(d3.format('.0f'));

        svg.append('g')
            .attr('class', 'y_axis')
            .attr('fill', 'none')
            .attr('stroke', `${colors.black}`)
            .attr('stroke-width', 1)
            .attr('transform', `translate(-10,${-40 - yrange_patient(max_height)})`)
            .call(y_axis)
            .selectAll('text')
            .attr('fill', `${colors.black}`)
            .style('font-size', 8)
            .attr('stroke', 'none');

        svg.selectAll('.tick')
            .select('text')
            .attr('fill', `${colors.black}`)
            .attr('stroke', 'none');

        // removing the 0 tick
        svg.selectAll('.y_axis .tick')
            .each(function tick(d) {
                if (d === 0) {
                    this.remove();
                }
            });
    }
    // dotted lines.
    const lines = svg.append('g')
        .attr('id', 'lines')
        .attr('transform', () => 'translate(2,-200)');
    const temp = hmap_patients.slice(0);
    temp.push('');

    lines.selectAll('line.dashed-line')
        .data(temp)
        .enter()
        .append('line')
        .attr('class', 'dashed-line')
        .attr('x1', (d, i) => i * (rect_width) - 3)
        .attr('x2', (d, i) => i * (rect_width) - 3)
        .attr('y1', 0)
        .attr('y2', 200)
        .attr('stroke', `${colors.black}`)
        .attr('stroke-width', 1)
        .style('stroke-dasharray', '3 2')
        .style('opacity', 0.2);

    lines.selectAll('rect.hlight-space')
        .data(hmap_patients)
        .enter()
        .append('rect')
        .attr('class', (d) => `hlight-space-${d}`)
        .attr('width', rect_width - 2)
        .attr('height', 200)
        .attr('x', (d, i) => i * rect_width - 2)
        .attr('fill', 'rgb(0,0,0)')
        .attr('y', 0)
        .style('opacity', 0);
    // }

    /** ******************************** SMALL RECTANGLES ON RIGHT SIDE OF Oncoprint ******************************** */

    // This will create rectangles on right side for alterations.
    // legends
    const target_rect = skeleton.append('g')
        .attr('id', 'small_rectangle');

    target_rect.selectAll('rect')
        .data(rect_alterations)
        .enter()
        .append('rect')
        .attr('x', (hmap_patients.length * (rect_width + 3.2)))
        .attr('y', (d, i) => (genes.length * (5 + i * 1.2)))
        .attr('height', rect_width)
        .attr('width', rect_width)
        .attr('fill', function fill(d) {
            if (d.color === 'none') {
                d3.select(this).attr('stroke', 'lightgray')
                    .attr('transform', 'translate(1,1)')
                    .attr('width', rect_width)
                    .attr('height', rect_width);
                return `${colors.white}`;
            }
            return d.color;
        })
        .attr('stroke', (d) => {
            let val = '';
            if (d.value === 'Expression High') {
                val = 'red';
            } if (d.value === 'Expression Low') {
                val = 'blue';
            } if (d.value === 'Not Available') {
                val = 'lightgray';
            }
            return val;
        })
        .attr('stroke-width', '.5px');

    target_rect.selectAll('text')
        .data(rect_alterations)
        .enter()
        .append('text')
        .attr('x', (hmap_patients.length * (rect_width + 3.8)))
        .attr('y', (d, i) => (genes.length * (5.6 + i * 1.2)))
        .text((d) => d.value)
        .attr('font-size', '12px')
        .attr('fill', `${colors.blue_header}`);

    /** ******************************************** Tooltip for oncoprint ******************************************** */

    const showToolTip = (x, y, gene, patient, mutation, cnv) => {
        // tooltip on mousever setting the div to visible.
        tooltip
            .style('visibility', 'visible');

        // tooltip grabbing event.pageX and event.pageY
        // and set color according to the ordinal scale.
        const tooltipDiv = tooltip
            .style('left', `${x + 10}px`)
            .style('top', `${y + 10}px`)
            .style('color', `${colors.black}`)
            .style('background-color', `${colors.white}`);

        // tooltip data.
        const tooltipData = [
            `Gene: ${gene}`, `Patient: ${patient}`,
        ];
        // pushing data into the tooltipData if mutation or cnv is not empty or null.
        if (mutation !== '0' && mutation) { tooltipData.push(`Mutation: ${mutation}`); }
        if (cnv !== '0' && cnv) { tooltipData.push(`Copy Number Variation: ${cnv}`); }

        tooltipDiv.selectAll('textDiv')
            .data(tooltipData)
            .enter()
            .append('div')
            .attr('id', 'tooltiptextonco')
            .html((d) => {
                const data = d.split(':');
                return `<b>${data[0]}</b>: ${data[1]}`;
            })
            .attr('x', `${x + 10}px`)
            .attr('y', (d, i) => (`${y + 10 + i * 10}px`));
    };

    // hiding tooltip.
    const hideToolTip = () => {
        // tooltip on mousever setting the div to hidden.
        tooltip
            .style('visibility', 'hidden');
        // remove all the divs with id tooltiptext.
        d3.selectAll('#tooltiptextonco').remove();
    };

    // highlight
    for (let i = 0; i < genes.length; i++) {
        for (let j = 0; j < hmap_patients.length; j++) {
            highlight.append('rect')
                .attr('class', `oprint-hlight-${hmap_patients[j]} oprint-hlight-${genes[i]}`)
                .attr('width', rect_width - 2)
                .attr('height', rect_height - 2)
                .attr('fill', `${colors.black}`)
                .attr('x', j * (rect_width))
                .attr('y', i * (rect_height))
                .style('opacity', 0)
                .on('mouseover', () => {
                    // calling showToolTip function passing pageX and pageY
                    const mutationToolTip = (data_mut.length !== 0) && data_mut[i] !== undefined && data_mut[i][hmap_patients[j]];
                    const cnvToolTip = (data_cnv.length !== 0) && data_cnv[i] !== undefined && data_cnv[i][hmap_patients[j]];
                    showToolTip(d3.event.pageX, d3.event.pageY, genes[i], hmap_patients[j], mutationToolTip, cnvToolTip);

                    // highlight
                    d3.selectAll(`.hmap-hlight-${hmap_patients[j].replace('.', '')}`)
                        .style('opacity', 0.2);
                    d3.selectAll(`.oprint-hlight-${hmap_patients[j].replace('.', '')}`)
                        .style('opacity', 0.2);
                    d3.selectAll(`.hlight-space-${hmap_patients[j].replace('.', '')}`)
                        .style('opacity', 0.2);
                })
                .on('mouseout', () => {
                    // hide tooltip
                    hideToolTip();

                    // highlight
                    d3.selectAll(`.hmap-hlight-${hmap_patients[j].replace('.', '')}`)
                        .style('opacity', 0);
                    d3.selectAll(`.oprint-hlight-${hmap_patients[j].replace('.', '')}`)
                        .style('opacity', 0);
                    d3.selectAll(`.hlight-space-${hmap_patients[j].replace('.', '')}`)
                        .style('opacity', 0);
                });
        }
    }
};

/**
 * ranking oncoprint based on the gene clicked.
 * @param {string} gene - gene name.
 * @param {Array} data - array of data.
 * @param {Object} props - prop object.
 * @param {Object} context - context object.
 */
const rankOncoprint = (gene, data, props, context) => {
    // array for new data.
    const newData = {};
    // function to return the type.
    const retunType = (i) => {
        let type = {};
        switch (i) {
            case 0:
                type = mutationTypeMap;
                break;
            case 1:
                type = cnaMap;
                break;
            case 2:
                type = rnaMap;
                break;
            default:
                type = mutationTypeMap;
        }
        return type;
    };
    // function to check if it's a negative number or not.
    const isNegativeCheck = (row) => {
        let val = '';
        const { threshold } = props;
        if (Number(row) > threshold) {
            val = 'positive';
        } else if (Number(row) < -threshold) {
            val = 'negative';
        } else {
            val = 'not available';
        }
        return val;
    };
    // this function will create/push data to the newData object.
    const createNewData = (patient, priority) => {
        if (!newData[patient] || (newData[patient] && newData[patient].priority === 16)) {
            const total = 1;
            newData[patient] = {
                priority,
                total,
            };
        } else if (newData[patient].priority < priority && priority !== 16) {
            const total = newData[patient].total + 1;
            newData[patient].total = total;
        } else if (newData[patient] && newData[patient].priority > priority && priority !== 16) {
            const total = newData[patient].total + 1;
            newData[patient].total = total;
            newData[patient].priority = priority;
        }
    };

    // loop through all the data types and push relevant data into the array.
    data.forEach((val, i) => {
        // type from the function.
        const type = retunType(i);
        // loop through each of the data value.
        val.forEach((row) => {
            // if the gene id matches the clicked gene.
            if (row.gene_id === gene) {
                Object.keys(row).forEach((patient) => {
                    if ((Number.isNaN(row[patient]) || i === 1) && patient !== 'gene_id') {
                        const { priority } = type[row[patient].toLowerCase()];
                        createNewData(patient, priority);
                    } else if (Number(row[patient])) {
                        // check for the value of the number.
                        const isNegative = isNegativeCheck(row[patient]);
                        const { priority } = type[isNegative];
                        createNewData(patient, priority);
                    } else if ((Number(row[patient]) === 0 || row[patient] === '') && typeof (newData[patient]) === 'undefined') {
                        newData[patient] = {
                            priority: 16,
                            total: 1,
                        };
                    }
                });
            }
        });
    });

    // sorting the array based on priority.
    const sortableArray = [];
    Object.keys(newData).forEach((val) => {
        sortableArray.push([val, newData[val].priority, newData[val].total]);
    });
    const sortedData = sortableArray.sort((a, b) => (a[1] - b[1]));

    // final list of the patients in the sorted order.
    const sortedPatients = sortedData.map((patient) => patient[0]);

    // grabbing the difference from the list of initial patients and sorted patients.
    // pushing it to the sortedPatients list.
    const { hmap_patients } = props;
    const diff = hmap_patients.filter((x) => !sortedPatients.includes(x));
    diff.forEach((val) => sortedPatients.push(val));

    // setting the patients in the context.
    const { setPatients } = context;
    setPatients(sortedPatients);

    // creating a new oncoprint based on the sorted patients list.
    const { className } = props;
    d3.select(`#oncoprint-${className}`).remove();
    makeOncoprint(sortedPatients, props, context);

    // making the circle visible on click of the drug.
    d3.select(`#circle-${gene.replace(/\s/g, '').replace(/\+/g, '')}`)
        .style('visibility', 'visible');
};

/**
 * main component
 * @param {Object} props - props object
 */
const Oncoprint = (props) => {
    // patient context.
    const context = useContext(PatientContext);

    // patients
    const { hmap_patients } = props;

    useEffect(() => {
        makeOncoprint(hmap_patients, props, context);
    }, []);

    // ranking the oncopring based on the globalPatients passed from heatmap.
    const rankOncoprintBasedOnHeatMapChanges = (value) => {
        const { globalPatients } = value;
        const { className } = props;
        if (globalPatients.length > 0) {
            d3.select(`#oncoprint-${className}`).remove();
            makeOncoprint(globalPatients, props, context);
        }
    };

    return (
        // eslint-disable-next-line no-return-assign
        <div>
            <div className="oprint-wrapper" id="oncoprint" />
            <PatientConsumer>
                {(value) => { rankOncoprintBasedOnHeatMapChanges(value); }}
            </PatientConsumer>
        </div>
    );
};

Oncoprint.propTypes = {
    className: PropTypes.string.isRequired,
    dimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
    }).isRequired,
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }).isRequired,
    threshold: PropTypes.number.isRequired,
    hmap_patients: PropTypes.arrayOf(PropTypes.string).isRequired,
    genes_mut: PropTypes.arrayOf(PropTypes.string).isRequired,
    genes_rna: PropTypes.arrayOf(PropTypes.string).isRequired,
    genes_cnv: PropTypes.arrayOf(PropTypes.string).isRequired,
    patient_mut: PropTypes.arrayOf(PropTypes.string).isRequired,
    patient_rna: PropTypes.arrayOf(PropTypes.string).isRequired,
    patient_cnv: PropTypes.arrayOf(PropTypes.string).isRequired,
    data_mut: PropTypes.arrayOf(PropTypes.object).isRequired,
    data_rna: PropTypes.arrayOf(PropTypes.object).isRequired,
    data_cnv: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Oncoprint;
