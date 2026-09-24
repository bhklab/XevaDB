/* eslint-disable max-len */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable camelcase */
import React, { useEffect, useContext, useRef } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { mutationTypeMap, cnaMap, rnaMap } from '../../../utils/MutationViewsUtil';
import PatientContext from '../../Context/PatientContext';
import colors from '../../../styles/colors';
import createSvgCanvas from '../../../utils/CreateSvgCanvas';
import createToolTip from '../../../utils/ToolTip';
import convertToTitleCase from '../../../utils/ConvertToTitleCase';
import removeSomeSpecialCharacters from '../../../utils/RemoveSomeSpecialCharacters';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';

// aberration data
const aberration = [
    { value: 'missense', color: `${colors.green}` },
    { value: 'inframe', color: `${colors.brown}` },
    { value: 'truncating', color: `${colors.black}` },
    { value: 'other', color: `${colors.violet}` },
    { value: 'del', color: `${colors.blue}` },
    { value: 'amp', color: `${colors.red}` },
];

const OncoprintWrapper = styled.div`
    display: flex;
    flex-direction: column;
	width: 100%;
	overflow-x: auto;
`;

const ExportWrapper = styled.div`
	display: flex;
	justify-content: center;
	padding: 15px 0px;
	
	button {
		color: ${colors.white}
		background-color: ${colors['--bg-color']};
		border-radius: 5px;
		font-size: 0.8em;
		border: 0;
		padding: 15px 20px;
	}
`;

const cnvMapping = { del: 'Deletion', amp: 'Amplification' };

// NEW: extra right padding so legends/sidebars never get clipped
const computeRightExtrasOncoprint = (rect_width) => {
    const sidebarGeneAlter = rect_width * 5 + 30; // right stacked bars width + padding
    const legendBlock = rect_width * 10 + 160;    // legend + labels conservative
    return Math.max(sidebarGeneAlter, legendBlock) + 20;
};

/**
 * @param {Array} data - data input array
 * @returns {Array} - array of objects {value: '', color: ''}
 */
const normalizeMutationKey = (v) => String(v ?? '').trim().toLowerCase();

const getMutationMappingObject = (data) => {
	let mutations = [];
	Object.values(data).forEach((row) => {
		Object.entries(row).forEach(([key, value]) => {
		if (key !== 'gene_id' && value !== '0' && value !== '' && value != null) {
			mutations.push(
			...String(value).split(',').map(s => s.trim()).filter(Boolean)
			);
		}
		});
	});
	mutations = [...new Set(mutations)];

	const mutationObject = {};
	mutations.forEach((raw) => {
		const meta = mutationTypeMap[normalizeMutationKey(raw)] || mutationTypeMap.other; // fallback
		const style = meta.style;
		if (!mutationObject[style]) {
		mutationObject[style] = {
			value: convertToTitleCase(style, '_'),
			color: meta.color,
		};
		}
	});

	return Object.values(mutationObject);
};

/**
 * @param {Array} data - input data array
 * @returns {Array} - mapping of CNV data
 */
const getCopyNumberVariationMapping = (data) => {
    const cnvObject = {};
    Object.values(data).forEach((obj) => {
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
    if (Object.keys(data_mut).length > 0) {
        rect_alterations_mut = getMutationMappingObject(data_mut);
    }
    // only if rnaseq data is available.
    let rect_alterations_rna = [];
    if (Object.keys(data_rna).length > 0) {
        rect_alterations_rna = [
            { value: 'Expression High', color: 'none' },
            { value: 'Expression Low', color: 'none' },
        ];
    }
    // only if the cnv data is present.
    let rect_alterations_cnv = [];
    if (Object.keys(data_cnv).length > 0) {
        rect_alterations_cnv = getCopyNumberVariationMapping(data_cnv);
    }

    // wild type only when cnv or mut data is available
    const remainingTypes = (Object.keys(data_cnv).length > 0 || Object.keys(data_mut).length > 0)
        ? [
            { value: 'Wild Type', color: 'lightgray' },
            { value: 'Not Available', color: 'none' },
        ]
        : [
            { value: 'Not Available', color: 'none' },
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
const createSortingLabel = (genes, svg, rect_height, tooltip) => {
    const sortingGroup = svg.append('g')
        .attr('id', 'sorting-label-group');

    genes.forEach((gene, i) => {
        sortingGroup
            .append('text')
            .text('🔺')
            .attr('x', -45)
            .attr('y', (i + 0.7) * rect_height)
            .attr('font-size', '1em')
            .attr('id', `sorting-label-for-gene-${removeSomeSpecialCharacters(gene)}`)
            .style('visibility', 'hidden')
            .on('mouseover', () => { // TODO: ADD SORTING LOGIC
                const tooltipDiv = tooltip
                    .style('visibility', 'visible')
                    .style('left', `${d3.event.pageX - 100}px`)
                    .style('top', `${d3.event.pageY + 15}px`);

                // add text to tooltip
                tooltipDiv
                    .append('text')
                    .attr('id', 'tooltip-biomarker')
                    .text('Click to sort');
            })
            .on('mouseout', () => {
                // hide the tooltip
                tooltip
                    .style('visibility', 'hidden');

                // remove the biomarker tooltip data
                d3.select('#tooltip-biomarker').remove();
            });
    });
};

const createGeneYAxis = (
    skeleton, genes, rect_height, rect_width, tooltip,
    data_mut, data_cnv, data_rna, props, context,
) => {
    // geneNames
    const geneNames = skeleton.append('g')
        .attr('id', 'gene-axis-group');

    // gene names on the y-axis
    for (let i = 0; i < genes.length; i++) {
        geneNames.append('text')
            .attr('class', genes[i])
            .attr('x', -10)
            .attr('y', (i + 0.5) * rect_height)
            .attr('dy', '0.35em')
            .style('text-anchor', 'end')
            .style('font-size', '11px')
            .attr('font-weight', '500')
            .attr('fill', `${colors['--main-font-color']}`)
            .text(genes[i])
            .on('mouseover', () => {
                d3.selectAll(`.oprint-hlight-${removeSomeSpecialCharacters(genes[i])}`)
                    .style('opacity', 0.2);

                // remove the biomarker and sorting labels
                // that are already selected (selected class!)
                d3.selectAll('text[id*="sorting-label"][class="selected"]')
                    .style('visibility', 'hidden')
                    .classed('selected', false);

                d3.selectAll('[id*="biomarker-label"][class="selected"]')
                    .style('visibility', 'hidden')
                    .classed('selected', false);

                // transforms the drug label group
                d3.select('#gene-axis-group')
                    .attr('transform', 'translate(-40, 0)');

                // change the visibility for the corresponding
                // biomarker and sorting label to visible.
                d3.select(`#biomarker-label-for-gene-${removeSomeSpecialCharacters(genes[i])}`)
                    .style('visibility', 'visible')
                    .classed('selected', true);

                d3.select(`#sorting-label-for-gene-${removeSomeSpecialCharacters(genes[i])}`)
                    .style('visibility', 'visible')
                    .classed('selected', true);
            })
            .on('mouseout', () => {
                // for highlight.
                d3.selectAll(`.oprint-hlight-${removeSomeSpecialCharacters(genes[i])}`)
                    .style('opacity', 0);
            })
            .on('click', () => {
                // TODO: Move it to the sorting label.
                // rankOncoprint(genes[i], [data_mut, data_cnv, data_rna], props, context);
            });
    }
};

// scales for patient label/axis on the top of the oncoprint
const createPatientLabelScale = (patientList, canvasWidth) => (
    d3.scaleBand()
        .domain(patientList)
        .range([0, canvasWidth])
);

const createPatientXAxis = (svg, patientScale, datasetId) => {
    const axis = d3.axisTop(patientScale);

    svg.append('g')
        .attr('id', 'patient-axis-group')
        .attr('stroke-width', '0')
        .style('text-anchor', (Number(datasetId) === 7 ? 'start' : 'middle'))
        .call(axis)
        .selectAll('text')
        .style('font-size', '11px')
        .attr('transform', 'rotate(-90)')
        .attr('font-weight', '550')
        .attr('fill', `${colors['--main-font-color']}`)
        .attr('x', (Number(datasetId) === 7 ? '10px' : '40px'))
        .attr('y', '.15em');
};

// creates the axes for the patient alteration bar plot
const createPatientBarPlotAxes = (
    svg, maxTotalValueInDataObject, barplotHeight,
) => {
    const scale = d3.scaleLinear()
        .domain([0, maxTotalValueInDataObject])
        .range([barplotHeight, 0]);

    const canvas = svg
        .append('g')
        .attr('id', 'patient-barplot-axis')
        .attr('transform', 'translate(-2, -195)');

    const axis = d3
        .axisLeft(scale)
        .ticks(3);

    canvas.call(axis);
};

// creates the stacked barplot for patient alterations matching HeatMap styling
const patientStackedBarplots = (
    svg, patient_alterations, aberrationList, rectWidth, mainPlotWidth,
) => {
    const max_height_arr = [];
    for (let i = 0; i < patient_alterations.length; i++) {
        let max = 0;
        for (let j = 0; j < aberrationList.length; j++) {
            max += patient_alterations[i][aberrationList[j].value];
        }
        max_height_arr.push(max);
    }
    const maxTotalValueInDataObject = d3.max(max_height_arr) || 1;

    const barplotHeight = 80;

    const scale = d3.scaleLinear()
        .domain([0, maxTotalValueInDataObject])
        .range([0, barplotHeight]);

    const plotGroupElement = svg.append('g')
        .attr('id', 'patient-barplot-group');

    // creates the outer box for the plot
    svg
        .append('g')
        .attr('id', 'patient-barplots-outliner')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', mainPlotWidth)
        .attr('height', barplotHeight)
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .attr('transform', 'translate(-2, -195)');

    // creates the individual stacked bar plot for each patient
    patient_alterations.forEach((patientAlterObj, patientObjectIndex) => {
        let currentY = 0;

        aberrationList.forEach((type) => {
            const responseValue = patientAlterObj[type.value];
            if (responseValue > 0) {
                plotGroupElement
                    .append('rect')
                    .attr('class', `patient-rect-${type.value}`)
                    .attr('x', (patientObjectIndex * rectWidth) - 2)
                    .attr('y', currentY - scale(responseValue))
                    .attr('width', rectWidth - 2)
                    .attr('height', scale(responseValue))
                    .attr('fill', type.color)
                    .attr('transform', 'translate(0, -115)');

                currentY -= scale(responseValue);
            }
        });
    });

    // creates an axes for the plot
    createPatientBarPlotAxes(svg, maxTotalValueInDataObject, barplotHeight);
};

const createBiomarkerImage = (skeleton, genes, drugs, rect_height, rect_width, tooltip) => {
    const biomarkerImage = skeleton
        .append('g')
        .attr('id', 'biomarker-image');

    biomarkerImage.selectAll('div')
        .data(genes)
        .join('a')
        .attr('xlink:href', (d) => (
            drugs
                ? `/biomarker?selectedGene=${d}&geneList=${genes.join(',')}&drugList=${drugs.join(',')}`
                : `/biomarker?selectedGene=${d}&geneList=${genes.join(',')}`
        ))
        .append('text')
        .text('⭕️')
        .attr('font-size', '0.8em')
        .attr('x', -20)
        .attr('y', (_, i) => (i + 0.7) * rect_height)
        .style('visibility', 'hidden')
        .attr('id', (d) => `biomarker-label-for-gene-${d}`)
        .on('mouseover', () => {
            const tooltipDiv = tooltip
                .style('visibility', 'visible')
                .style('left', `${d3.event.pageX - 100}px`)
                .style('top', `${d3.event.pageY + 15}px`);

            // add text to tooltip
            tooltipDiv
                .append('text')
                .attr('id', 'tooltip-biomarker')
                .text('Redirect to Biomarker Page');
        })
        .on('mouseout', () => {
        // hide the tooltip
            tooltip
                .style('visibility', 'hidden');

            // remove the biomarker tooltip data
            d3.select('#tooltip-biomarker').remove();
        });
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

// divide the expression data into 'High' or 'Low' expression
const lowOrHighExpression = (value, threshold) => {
    let expressionValue;

    if (value > threshold) {
        expressionValue = 'Expression High';
    }
    if (value < -threshold) {
        expressionValue = 'Expression Low';
    }

    return expressionValue;
};

/* ****************************************** Make Oncoprint ****************************************** */
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
    const {
        dimensions, margin, threshold, datasetId,
    } = props;
    const { data_mut, data_rna, data_cnv } = props;
    const { genes_mut, genes_rna, genes_cnv } = props;
    const { patient_mut, patient_rna, patient_cnv } = props;
    const { drugs } = props;

    // unique patients and genes.
    const genes = [...new Set([...genes_mut, ...genes_rna, ...genes_cnv])];
    const patients = [...new Set([...patient_mut, ...patient_rna, ...patient_cnv])];

    // data to plot the legends
    const rect_alterations = createAlterationData(data_mut, data_rna, data_cnv);

    // height and width for the SVG based on the number of genes_mut and patient/sample ids.
    // height and width of the rectangles in the main skeleton.
    const rect_height = dimensions.height;
    const rect_width = dimensions.width;

    // this height and width is used for setting the body.
    const height = genes.length * rect_height;
    const width = hmap_patients.length * rect_width;

    /** SETTING SVG ATTRIBUTES and Oncoprint SKELETON * */
    d3.select('#oncoprint').selectAll('*').remove();

    // make the svg element
    const svg = createSvgCanvas({
        height, width, margin, id: 'oncoprint', canvasId: `oncoprint-${plotId}`,
    });

    // making tooltips (appended after SVG so it naturally stacks on top and is not wiped by cleanup)
    const tooltip = createToolTip('oncoprint')
        .style('z-index', '1000')
        .style('pointer-events', 'none');

    // NEW: responsive SVG + safe right-side room so nothing is clipped
    const extraRight = computeRightExtrasOncoprint(rect_width);
    const totalW = width + margin.left + margin.right + extraRight;
    const totalH = height + margin.top + margin.bottom;

    d3.select(`#oncoprint-${plotId}`)
        .attr('viewBox', `0 0 ${totalW} ${totalH}`)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('width', '100%')
        .attr('height', 'auto');

    // skeleton of the oncoprint
    const skeleton = svg.append('g')
        .attr('id', 'skeleton');

    /** Appending Circle to the  Y-Axis */
    createSortingLabel(genes, svg, rect_height, tooltip);

    /* *  Gene Names on Y-Axis and Biomarker Image* */
    createGeneYAxis(skeleton, genes, rect_height, rect_width, tooltip, data_mut, data_cnv, data_rna, props, context);
    createBiomarkerImage(skeleton, genes, drugs, rect_height, rect_width, tooltip);

    // patient scale and axis
    const patientLabelScale = createPatientLabelScale(hmap_patients, width);
    createPatientXAxis(skeleton, patientLabelScale, datasetId);

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
    const colorRectangles = (value, color, i, j, mutationType) => {
        // setting the color based on value param.
        if (value !== 'empty' && value === 'mut') {
            gene_alterations[genes[i]][mutationType]++;
            patient_alterations[j][mutationType]++;
        } else if (value !== 'empty' && (value === 'amp' || value === 'del')) {
            gene_alterations[genes[i]][value]++;
            patient_alterations[j][value]++;
        }

        const cellW = rect_width - 2;
        const cellH = rect_height - 2;
        const cellX = j * rect_width;
        const cellY = i * rect_height;

        let rect;
        if (value === 'mut') {
            const mutHeight = Math.max(4, Math.round(cellH / 3));
            const mutY = cellY + Math.round((cellH - mutHeight) / 2);
            rect = alterations.append('rect')
                .attr('class', `alter-rect ${value}`)
                .attr('width', cellW)
                .attr('height', mutHeight)
                .attr('fill', color)
                .attr('x', cellX)
                .attr('y', mutY);
        } else {
            rect = alterations.append('rect')
                .attr('class', `alter-rect ${value}`)
                .attr('width', cellW)
                .attr('height', cellH)
                .attr('fill', color)
                .attr('x', cellX)
                .attr('y', cellY);
        }

        // setting the border high-rna and low-rna.
        if (value === 'Expression High') {
            rect.attr('stroke', 'red')
                .attr('stroke-width', '2.5px')
                .style('opacity', 0.75);
        } else if (value === 'Expression Low') {
            rect.attr('stroke', 'blue')
                .attr('stroke-width', '2.5px')
                .style('opacity', 0.75);
        }
    };

    // stroke for not sequenced patients.
    const colorNotSequenced = (i, j) => {
        alterations.append('rect')
            .attr('class', 'alter-rect nseq')
            .attr('width', rect_width - 2)
            .attr('height', rect_height - 2)
            .attr('fill', `${colors.white}`)
            .attr('stroke', 'lightgray')
            .attr('stroke-width', '1px')
            .attr('x', j * (rect_width))
            .attr('y', i * (rect_height));
    };

    // creates a layer of oncoprint.
    for (let i = 0; i < genes.length; i++) {
        for (let j = 0; j < hmap_patients.length; j++) {
            if (patients.includes(hmap_patients[j])) {
                colorRectangles('empty', 'lightgrey', i, j);
            } else {
                colorNotSequenced(i, j);
            }
        }
    }

    /** Coloring the rectangles borders based on mutation and cnv data * */
    for (let i = 0; i < genes.length; i++) {
        for (let j = 0; j < hmap_patients.length; j++) {
            /** Coloring the rectangles borders based on cnv data * */
            if (genes_cnv.includes(genes[i]) && data_cnv[genes[i]][hmap_patients[j]]) {
                const cnvType = cnaMap[data_cnv[genes[i]][hmap_patients[j]].toLowerCase()].xevalabel;
                const cnvColor = cnaMap[data_cnv[genes[i]][hmap_patients[j]].toLowerCase()].color;
                if (!isAlteration) {
                    isAlteration = (cnvType !== 'empty');
                }
                colorRectangles(cnvType, cnvColor, i, j);
            }

            /** Coloring the rectangles borders based on mutation data * */
            // if the gene from genes located in genes_mut.
            // mutation later because they are 1/3 the box.
            if (
                genes_mut.includes(genes[i]) && patient_mut.includes(hmap_patients[j])
                && data_mut[genes[i]][hmap_patients[j]] !== '0' && data_mut[genes[i]][hmap_patients[j]] !== ''
            ) {
                isAlteration = !isAlteration ? true : isAlteration;
                // based on the data gives different colors to the rectangle.
                data_mut[genes[i]][hmap_patients[j]].split(',').forEach((el) => {
					const key = String(el).trim().toLowerCase();
					const meta = mutationTypeMap[key] || mutationTypeMap.other; // fallback
					colorRectangles('mut', meta.color, i, j, meta.mainType);
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
                const expressionValue = Number(data_rna[genes[i]][hmap_patients[j]]);
                const updatedExpressionValue = lowOrHighExpression(expressionValue, threshold);

                colorRectangles(updatedExpressionValue, 'none', i, j);
                z++;
            }
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

        // function to calculate alterations.
        const geneAlterationRectangle = (iterator) => {
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
            geneAlterationRectangle(i);
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

        // append text to the top of the axis
        svg.append('g')
            .attr('id', 'gene-stacked-barplot-label-group')
            .append('text')
            .text('# of alterations')
            .attr('x', width + 10)
            .attr('y', -20)
            .attr('font-size', '10.5px')
            .style('fill', `${colors.red}`);
    }

    /** ******************************************* Horizontal Graph ******************************************* * */
    if ((genes_mut.length > 0 || genes_cnv.length > 0) && isAlteration) {
        patientStackedBarplots(svg, patient_alterations, aberration, rect_width, width);
    }

    // dotted lines space.
    const lines = svg.append('g')
        .attr('id', 'lines')
        .attr('transform', () => 'translate(2,-250)');
    const temp = hmap_patients.slice(0);
    temp.push('');

    lines.selectAll('rect.hlight-space')
        .data(hmap_patients)
        .enter()
        .append('rect')
        .attr('class', (d) => `hlight-space-${removeSomeSpecialCharacters(d)}`)
        .attr('width', rect_width - 2)
        .attr('height', 250)
        .attr('x', (d, i) => i * rect_width - 2)
        .attr('fill', 'rgb(0,0,0)')
        .attr('y', 0)
        .style('pointer-events', 'none')
        .style('opacity', 0);

    /** ******************************** SMALL RECTANGLES ON RIGHT SIDE OF Oncoprint ******************************** */
    // This will create rectangles on right side for alterations.
    // legends
    const target_rect = skeleton.append('g')
        .attr('id', 'small_rectangle');

    target_rect.selectAll('rect')
        .data(rect_alterations)
        .enter()
        .append('rect')
        .attr('x', ((hmap_patients.length + 8.5) * rect_width))
        .attr('y', (d, i) => (genes.length * 5 + (rect_width + 10) * i))
        .attr('height', rect_width)
        .attr('width', rect_width)
        .attr('fill', function fill(d) {
            if (d.color === 'none') {
                d3.select(this).attr('stroke', 'lightgray')
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
        .attr('x', ((hmap_patients.length + 10) * rect_width))
        .attr('y', (d, i) => (genes.length * 5 + (rect_width + 10) * i + rect_width * 0.75))
        .attr('height', rect_width)
        .attr('width', rect_width)
        .text((d) => d.value)
        .attr('font-size', '12px')
        .attr('fill', `${colors['--main-font-color']}`);

    /** ******************************************** Tooltip for oncoprint ******************************************** */

    const showToolTip = (x, y, gene, patient, mutation, cnv, expression) => {
        d3.selectAll('#tooltiptextonco').remove();

        // tooltip on mouseover setting the div to visible.
        tooltip
            .style('visibility', 'visible')
            .style('z-index', '1000')
            .style('pointer-events', 'none')
            .style('left', `${x + 10}px`)
            .style('top', `${y + 10}px`);

        // tooltip data.
        const tooltipData = [
            `Gene: ${gene}`, `Patient: ${patient}`,
        ];

        // pushing data into the tooltipData if mutation or cnv is not empty or null.
        if (mutation !== '0' && mutation) {
            tooltipData.push(`Mutation: ${mutation}`);
        }
        if (cnv !== '0' && cnv) {
            tooltipData.push(`Copy Number Variation: ${cnv}`);
        }
        if (expression !== '0' && expression) {
            tooltipData.push(`Expression: ${expression}`);
        }

        tooltip.selectAll('div.tooltip-row')
            .data(tooltipData)
            .enter()
            .append('div')
            .attr('class', 'tooltip-row')
            .attr('id', 'tooltiptextonco')
            .html((d) => {
                const data = d.split(':');
                return `<b>${data[0]}</b>: ${data.slice(1).join(':')}`;
            })
            .style('font-size', '12px');
    };

    // hiding tooltip.
    const hideToolTip = () => {
        // tooltip on mouseover setting the div to hidden.
        tooltip
            .style('visibility', 'hidden');
        // remove all the divs with id tooltiptext.
        d3.selectAll('#tooltiptextonco').remove();
    };

    // highlight layer raised to the top of the canvas so it receives all pointer events
    highlight.raise();
    for (let i = 0; i < genes.length; i++) {
        for (let j = 0; j < hmap_patients.length; j++) {
            const safePatient = removeSomeSpecialCharacters(hmap_patients[j]);
            const safeGene = removeSomeSpecialCharacters(genes[i]);

            highlight.append('rect')
                .attr('class', `oprint-hlight-${safePatient} oprint-hlight-${safeGene}`)
                .attr('width', rect_width - 2)
                .attr('height', rect_height - 2)
                .attr('fill', `${colors.black}`)
                .attr('x', j * (rect_width))
                .attr('y', i * (rect_height))
                .style('opacity', 0)
                .on('mouseover', () => {
                    // calling showToolTip function passing pageX and pageY
                    const mutationToolTip = data_mut[genes[i]]?.[hmap_patients[j]];
                    const cnvToolTip = data_cnv[genes[i]]?.[hmap_patients[j]];
                    const expressionToolTip = lowOrHighExpression(data_rna[genes[i]]?.[hmap_patients[j]], threshold);

                    showToolTip(
                        d3.event.pageX, d3.event.pageY, genes[i], hmap_patients[j],
                        mutationToolTip, cnvToolTip, expressionToolTip,
                    );

                    // highlight
                    d3.selectAll(`.oprint-hlight-${safePatient}`)
                        .style('opacity', 0.2);
                    d3.selectAll(`.hlight-space-${safePatient}`)
                        .style('opacity', 0.2);
                    d3.selectAll(`rect[id^='rectangle-highlight'][id$='${hmap_patients[j]}']`)
                        .attr('opacity', '0.5');
                })
                .on('mouseout', () => {
                    // hide tooltip
                    hideToolTip();

                    // highlight
                    d3.selectAll(`.oprint-hlight-${safePatient}`)
                        .style('opacity', 0);
                    d3.selectAll(`.hlight-space-${safePatient}`)
                        .style('opacity', 0);
                    d3.selectAll(`rect[id^='rectangle-highlight'][id$='${hmap_patients[j]}']`)
                        .attr('opacity', '0.0');
                });
        }
    }
};

/** ******************************** Rank Oncoprint ******************************** */
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
        Object.values(val).forEach((row) => {
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
 * **************************************************************************************
 * ****************************** Main Component (Oncoprint) ****************************
 * **************************************************************************************
 */
const Oncoprint = (props) => {
    // patient context.
    const context = useContext(PatientContext);

    // patients
    const { hmap_patients } = props;

	// Ref for chart downloads
	const oncoprintWrapRef = useRef(null);

    useEffect(() => {
        const patientsToUse = (context.globalPatients && context.globalPatients.length > 0)
            ? context.globalPatients
            : hmap_patients;
        makeOncoprint(patientsToUse, props, context);
    }, [props, hmap_patients, context.globalPatients]);

    // ranking the oncoprint based on the globalPatients passed from heatmap.
    const rankOncoprintBasedOnHeatMapChanges = (value) => {
        const { globalPatients } = value;
        const { className } = props;
        if (globalPatients.length > 0) {
            d3.select(`#oncoprint-${className}`).remove();
            makeOncoprint(globalPatients, props, context);
        }
    };

	async function capture(node, filename) {
		const dataUrl = await htmlToImage.toPng(node, {
			cacheBust: true,
			pixelRatio: Math.max(2, window.devicePixelRatio || 1),
			backgroundColor: 'white',
			skipFonts: true
		});
		saveAs(dataUrl, filename);
	}

	async function downloadCharts(){
		const onco = oncoprintWrapRef.current;
		if (onco) {
			await capture(onco, `oncoprint-chart.png`);
		}
	}



    return (
        // eslint-disable-next-line no-return-assign
        <div>
			<ExportWrapper>
				<button onClick={() => downloadCharts()}>
                    Download Oncograph
                </button>
            </ExportWrapper>
			<OncoprintWrapper ref={oncoprintWrapRef}>
				<div id='oncoprint' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
				<PatientContext.Consumer>
					{(value) => { rankOncoprintBasedOnHeatMapChanges(value); }}
				</PatientContext.Consumer>
			</OncoprintWrapper>
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
    threshold: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    hmap_patients: PropTypes.arrayOf(PropTypes.string).isRequired,
    genes_mut: PropTypes.arrayOf(PropTypes.string).isRequired,
    genes_rna: PropTypes.arrayOf(PropTypes.string).isRequired,
    genes_cnv: PropTypes.arrayOf(PropTypes.string).isRequired,
    patient_mut: PropTypes.arrayOf(PropTypes.string).isRequired,
    patient_rna: PropTypes.arrayOf(PropTypes.string).isRequired,
    patient_cnv: PropTypes.arrayOf(PropTypes.string).isRequired,
    data_mut: PropTypes.object.isRequired,
    data_rna: PropTypes.object.isRequired,
    data_cnv: PropTypes.object.isRequired,
    drugs: PropTypes.arrayOf(PropTypes.string),
    datasetId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

export default Oncoprint;
