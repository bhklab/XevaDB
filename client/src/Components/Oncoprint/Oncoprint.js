/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

class Oncoprint extends React.Component {
    constructor(props) {
        super(props);
        this.Oncoprint = this.Oncoprint.bind(this);
    }

    componentDidMount() {
    // this.Oncoprint()
    }

    componentDidUpdate() {
        this.Oncoprint();
    }

    Oncoprint() {
        const { node } = this;
        const { className } = this.props;
        const { dimensions } = this.props;
        const { margin } = this.props;
        const { threshold } = this.props;
        const { hmap_patients } = this.props;
        const { data_mut } = this.props;
        const { data_rna } = this.props;
        const { data_cnv } = this.props;
        const { genes_mut } = this.props;
        const { genes_rna } = this.props;
        const { genes_cnv } = this.props;
        const { patient_mut } = this.props;
        const { patient_rna } = this.props;
        const { patient_cnv } = this.props;

        this.makeOncoprint(node, className, dimensions, margin, threshold, hmap_patients,
            data_mut, data_rna, data_cnv, genes_mut, genes_rna, genes_cnv, patient_mut, patient_rna, patient_cnv);
    }


    makeOncoprint(node, plotId, dimensions, margin, threshold, hmap_patients, data_mut, data_rna, data_cnv, genes_mut, genes_rna, genes_cnv, patient_mut, patient_rna, patient_cnv) {
        // to merge two arrays and give the unique values.
        // eslint-disable-next-line no-extend-native
        Array.prototype.unique = function () {
            const a = this.concat();
            for (let i = 0; i < a.length; ++i) {
                for (let j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j]) { a.splice(j--, 1); }
                }
            }
            return a;
        };
        const genes = genes_mut.concat(genes_rna).concat(genes_cnv).unique();

        this.node = node;

        // height and width for the SVG based on the number of genes_mut and patient/sample ids.
        // height and width of the rectangles in the main skeleton.
        const rect_height = dimensions.height;
        const rect_width = dimensions.width;

        // this height and width is used for setting the body.
        const height = genes.length * rect_height + 100;
        const width = hmap_patients.length * rect_width + 100;

        // adding this for rectangles on right side of oncoprint.
        // only if the mutation data is present.
        let rect_alterations_mut = [];
        if (data_mut.length > 0) {
            rect_alterations_mut = [
                { value: 'Mutation', color: '#e41a1c' },
            ];
        }
        // only if rnaseq data is available.
        let rect_alterations_rna = [];
        if (data_rna.length > 0) {
            rect_alterations_rna = [
                { value: 'mRNA High', color: 'none' },
                { value: 'mRNA Low', color: 'none' },
            ];
        }
        // only if the cnv data is present.
        let rect_alterations_cnv = [];
        if (data_cnv.length > 0) {
            rect_alterations_cnv = [
                { value: 'Deep Deletion', color: '#0033CC' },
                { value: 'Amplification', color: '#1a9850' },
            ];
        }

        const rect_alterations = [
            ...rect_alterations_mut,
            ...rect_alterations_rna,
            ...rect_alterations_cnv,
            { value: 'Wild Type', color: 'lightgray' },
            { value: 'Not Available', color: 'none' },
        ];


        /** SETTING SVG ATTRIBUTES and Oncoprint SKELETON * */
        // make the svg element
        const svg = d3.select(node)
            .append('svg')
            .attr('id', `oncoprint-${plotId}`) // set an id so that I can remove+replace on refresh
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform',
                `translate(${margin.left},${margin.top})`);

        // skeleton of the oncoprint
        const skeleton = svg.append('g')
            .attr('id', 'skeleton');


        /**  Gene Names on Y-Axis * */

        // geneNames
        const geneNames = skeleton.append('g')
            .attr('id', 'gene-names');

        // gene names on the y axis
        const geneAxis = () => {
            for (let i = 0; i < genes.length; i++) {
                geneNames.append('text')
                    .attr('class', genes[i])
                    .attr('dx', -20)
                    .style('text-anchor', 'end')
                    .style('font-size', '13px')
                    .attr('dy', i * (rect_height) + 23)
                    .attr('font-weight', '500')
                    .text(genes[i])
                    .on('mouseover', () => {
                        d3.selectAll(`.oprint-hlight-${genes[i]}`)
                            .style('opacity', 0.2);
                    })
                    .on('mouseout', () => {
                        d3.selectAll(`.oprint-hlight-${genes[i]}`)
                            .style('opacity', 0);
                    });
            }
        };

        // create gene-name y-axis.
        geneAxis();


        /** Setting Alterations * */

        // alterations: mutations are #1a9850 and a third, AMP/del are #e41a1c/#0033CC and full respectively
        const alterations = svg.append('g')
            .attr('id', 'alterations');

        const highlight = svg.append('g')
            .attr('id', 'highlight');


        // collect info about alterations per gene/patient for plotting later
        const gene_alterations = {};
        const patient_alterations = [];

        if (genes_mut.length > 0 || genes_cnv.length > 0) {
            for (let i = 0; i < genes.length; i++) {
                gene_alterations[genes[i]] = { mut: 0, amp: 0, del: 0 };
            }

            for (let i = 0; i < hmap_patients.length; i++) {
                patient_alterations.push({ mut: 0, amp: 0, del: 0 });
            }
        }

        // take the difference of patient_mut/cnv/rna from hmap_patients
        let diff = [];
        if (patient_mut.length > 0) {
            diff = hmap_patients.filter((x) => !patient_mut.includes(x));
        } else if (patient_mut.length === 0 && patient_rna.length > 0) {
            diff = hmap_patients.filter((x) => !patient_rna.includes(x));
        } else {
            diff = hmap_patients.filter((x) => !patient_cnv.includes(x));
        }

        /** Coloring the rectangles based on mutation data * */

        // this will take four parameters and color the rectangle accordingly
        const colorReactangles = (value, color, i, j) => {
            // setting a = 12 if value is mut
            const a = value === 'mut' ? 12 : 0;
            // setting the color based on value param.
            if (value !== 'empty' && value === 'mut') {
                gene_alterations[genes[i]][value]++;
                patient_alterations[j][value]++;
            } else if (value !== 'empty' && (value === 'amp' || value === 'del')) {
                gene_alterations[genes[i]][value]++;
                patient_alterations[j][value]++;
            }

            // value !== 'highrna' && value !== 'lowrna' && value! == 'amp'
            // this is for mutation data and rnaseq.
            const rect = alterations.append('rect')
                .attr('class', `alter-rect ${value}`)
                .attr('width', rect_width - 6)
                .attr('height', rect_height - 6 - (2 * a))
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
                .attr('width', rect_width - 6)
                .attr('height', rect_height - 6)
                .attr('fill', 'white')
                .attr('stroke', 'lightgray')
                .attr('stroke-width', '1px')
                .attr('x', j * (rect_width) + 1)
                .attr('y', i * (rect_height) + 1);
        };


        /** Coloring the rectangles borders based on mutation data * */
        for (let i = 0; i < genes_mut.length; i++) {
            for (let j = 0; j < hmap_patients.length; j++) {
                if (diff.indexOf(hmap_patients[j]) !== -1) {
                    // if not sequenced, make it white with a border
                    colorNotSequenced(i, j);
                } else {
                    // complete layer of lightgrey rectangles.
                    colorReactangles('empty', 'lightgrey', i, j);
                    // based on the data gives different colors to the rectangle.
                    if (data_mut[i][hmap_patients[j]].includes('MutNovel') || data_mut[i][hmap_patients[j]].includes('mutation') || data_mut[i][hmap_patients[j]].includes('MutKnownFunctional')) {
                        colorReactangles('mut', '#e41a1c', i, j);
                    }
                }
            }
        }


        /** Coloring the rectangles borders based on cnv data * */
        for (let i = 0; i < genes.length; i++) {
            for (let j = 0; j < hmap_patients.length; j++) {
                if (genes_cnv.includes(genes[i])) {
                    if (diff.indexOf(hmap_patients[j]) !== -1) {
                        // if not sequenced, make it white with a border
                        colorNotSequenced(i, j);
                    } else {
                        // complete layer of lightgrey rectangles only if mutation data is not available.
                        if (data_mut.length === 0) {
                            colorReactangles('empty', 'lightgrey', i, j);
                        }
                        // based on the data gives different colors to the rectangle.
                        if (data_cnv[i][hmap_patients[j]].includes('Del0.8') || data_cnv[i][hmap_patients[j]].includes('Deletion')) {
                            colorReactangles('del', '#0033CC', i, j);
                        }
                        if (data_cnv[i][hmap_patients[j]].includes('Amp') || data_cnv[i][hmap_patients[j]].includes('Amplification')) {
                            colorReactangles('amp', '#1a9850', i, j);
                        }
                    }
                }
            }
        }

        /** Coloring the rectangles borders based on rna sequencing data * */
        // variable for taking care of rnaseq data sequence.
        let z = 0;
        for (let i = 0; i < genes.length; i++) {
            if (genes_rna.includes(genes[i])) {
                for (let j = 0; j < hmap_patients.length; j++) {
                    if (diff.indexOf(hmap_patients[j]) !== -1) {
                        // if not sequenced, make it white with a border
                        colorNotSequenced(i, j);
                    } else { // only if the element is not included
                        // complete layer of lightgrey rectangles only if mutation data is not available.
                        if (data_mut.length === 0 && data_cnv.length === 0) {
                            colorReactangles('empty', 'lightgrey', i, j);
                        }
                        if (Number(data_rna[z][hmap_patients[j]]) > threshold) {
                            colorReactangles('highrna', 'none', i, j);
                        } else if (Number(data_rna[z][hmap_patients[j]]) < -threshold) {
                            colorReactangles('lowrna', 'none', i, j);
                        }
                    }
                }
                z++;
            }
        }

        /** Setting Maxes for the alterations * */

        // getting the maxes
        let maxPAmp = [];
        let maxPMut = [];
        let maxPHomdel = [];

        if (genes_mut.length > 0 || genes_cnv.length > 0) {
            for (let i = 0; i < patient_alterations.length; i++) {
                maxPAmp.push(patient_alterations[i].amp);
                maxPHomdel.push(patient_alterations[i].del);
                maxPMut.push(patient_alterations[i].mut);
            }
            maxPAmp = d3.max(maxPAmp);
            maxPHomdel = d3.max(maxPHomdel);
            maxPMut = d3.max(maxPMut);
        }

        // getting the maxes
        let maxGAmp = [];
        let maxGMut = [];
        let maxGHomdel = [];

        if (genes_mut.length > 0 || genes_cnv.length > 0) {
            for (let i = 0; i < genes.length; i++) {
                maxGAmp.push(gene_alterations[genes[i]].amp);
                maxGHomdel.push(gene_alterations[genes[i]].del);
                maxGMut.push(gene_alterations[genes[i]].mut);
            }
            maxGAmp = d3.max(maxGAmp);
            maxGHomdel = d3.max(maxGHomdel);
            maxGMut = d3.max(maxGMut);
        }

        /** ALTERATION GRAPHS * */

        /** Vertical Graph * */

        if (genes_mut.length > 0 || genes_cnv.length > 0) {
            // calculating max width
            const max_width_arr = [];
            for (let i = 0; i < genes.length; i++) {
                max_width_arr.push(gene_alterations[genes[i]].mut + gene_alterations[genes[i]].amp + gene_alterations[genes[i]].del);
            }

            const max_width = d3.max(max_width_arr);

            const xrange_gene = d3.scaleLinear()
                .domain([0, d3.max([maxGAmp, maxGMut, maxGHomdel])])
                .range([0, 70]);


            const gene_alter = svg.append('g')
                .attr('id', 'gene-alter')
                .attr('transform', `translate(${hmap_patients.length * rect_width + 20},0)`);

            const stroke_width = 1; // this will set the stroke width of the outer rectangle

            // setting the outer rectangle.
            gene_alter.append('rect')
                .attr('class', 'patient_eval_rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', (rect_height) * (genes.length) - 6)
                .attr('width', xrange_gene(max_width))
                .attr('fill', 'white')
                .style('stroke', 'black')
                .style('stroke-width', stroke_width);


            // function to caculate alterations.
            const geneAlterationReactangle = (iterator) => {
                // variables.
                const gene_class = ['mut', 'amp', 'del'];
                const i = iterator;
                let x_range = stroke_width / 2;
                // loops through each type for each of the genes_mut.
                gene_class.forEach((type) => {
                    // color setting.
                    let color = '';
                    if (type === 'mut') {
                        color = '#e41a1c';
                    } else if (type === 'amp') {
                        color = '#1a9850';
                        x_range += xrange_gene(gene_alterations[genes[i]].mut);
                    } else if (type === 'del') {
                        color = '#0033CC';
                        x_range += xrange_gene(gene_alterations[genes[i]].amp);
                    }
                    // rectangle coloring.
                    gene_alter.append('rect')
                        .attr('class', `gene-rect ${type}`)
                        .attr('height', rect_height - 6)
                        .attr('width', xrange_gene(gene_alterations[genes[i]][type]))
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
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .attr('transform', `translate(${hmap_patients.length * rect_width + 20} -0 )`)
                .call(x_axis)
                .selectAll('text')
                .attr('fill', 'black')
                .style('font-size', 8)
                .attr('stroke', 'none');

            svg.selectAll('.tick')
                .select('text')
                .attr('fill', 'black')
                .attr('stroke', 'none');
        }


        /** Horizontal Graph * */

        // calculating max height

        if (genes_mut.length > 0 || genes_cnv.length > 0) {
            const max_height_arr = [];
            for (let i = 0; i < patient_alterations.length; i++) {
                max_height_arr.push(patient_alterations[i].mut + patient_alterations[i].amp + patient_alterations[i].del);
            }

            const max_height = d3.max(max_height_arr);

            const patient_alter = svg.append('g')
                .attr('id', 'patient-alter');

            const yrange_patient = d3.scaleLinear() // #TODO: scale.linear
                .domain([0, max_height])
                .range([35, 0]);

            // function to caculate alterations.
            const patientAlterationReactangle = (iterator) => {
                // variables.
                const patient_class = ['mut', 'amp', 'del'];
                const i = iterator;
                let y_range = 0;

                // loops through each type for each of the genes_mut.
                patient_class.forEach((type, j) => {
                    // set value to 1 if j is greater than 1.
                    j = j > 1 ? j / j : j;

                    // setting y range.
                    y_range = (yrange_patient(patient_alterations[i][type])) - ((35 * j) - y_range);

                    // color setting.
                    let color = '';
                    if (type === 'mut') {
                        color = '#e41a1c';
                    } else if (type === 'amp') {
                        color = '#1a9850';
                    } else if (type === 'del') {
                        color = '#0033CC';
                    }
                    // rectangle coloring.
                    patient_alter.append('rect')
                        .attr('class', `patient-rect${type}`)
                        .attr('height', 35 - yrange_patient(patient_alterations[i][type]))
                        .attr('width', rect_width - 5)
                        .attr('fill', color)
                        .attr('y', y_range)
                        .attr('x', i * 20 + 1)
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
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .attr('transform', `translate(-10,${-(35 - yrange_patient(max_height)) - 5})`)
                .call(y_axis)
                .selectAll('text')
                .attr('fill', 'black')
                .style('font-size', 8)
                .attr('stroke', 'none');

            svg.selectAll('.tick')
                .select('text')
                .attr('fill', 'black')
                .attr('stroke', 'none');

            // removing the 0 tick
            svg.selectAll('.y_axis .tick')
                .each(function (d) {
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
            .attr('stroke', 'black')
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
        /** SMALL RECTANGLES ON RIGHT SIDE OF Oncoprint * */

        // This will create rectangles on right side for alterations.
        // legends
        const target_rect = skeleton.append('g')
            .attr('id', 'small_rectangle');

        target_rect.selectAll('rect')
            .data(rect_alterations)
            .enter()
            .append('rect')
            .attr('x', (hmap_patients.length * rect_width + 120))
            .attr('y', (d, i) => (genes.length * 10) + i * 25)
            .attr('height', '15')
            .attr('width', '15')
            .attr('fill', function (d) {
                if (d.color === 'none') {
                    d3.select(this).attr('stroke', 'lightgray')
                        .attr('transform', 'translate(1,1)')
                        .attr('width', 14)
                        .attr('height', 14);
                    return 'white';
                }
                return d.color;
            })
            .attr('stroke', (d) => {
                let val = '';
                if (d.value === 'mRNA High') {
                    val = 'red';
                } if (d.value === 'mRNA Low') {
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
            .attr('x', (hmap_patients.length * rect_width + 140))
            .attr('y', (d, i) => (genes.length * 10 + 12) + i * 25)
            .text((d) => d.value)
            .attr('font-size', '14px');


        // highlight
        for (let i = 0; i < genes.length; i++) {
            for (let j = 0; j < hmap_patients.length; j++) {
                highlight.append('rect')
                    .attr('class', `oprint-hlight-${hmap_patients[j]} oprint-hlight-${genes[i]}`)
                    .attr('width', rect_width - 2)
                    .attr('height', rect_height - 2)
                    .attr('fill', 'black')
                    .attr('x', j * (rect_width))
                    .attr('y', i * (rect_height))
                    .style('opacity', 0)
                    .on('mouseover', () => {
                        d3.selectAll(`.hmap-hlight-${hmap_patients[j]}`)
                            .style('opacity', 0.2);
                        d3.selectAll(`.oprint-hlight-${hmap_patients[j]}`)
                            .style('opacity', 0.2);
                        d3.selectAll(`.hlight-space-${hmap_patients[j]}`)
                            .style('opacity', 0.2);
                    })
                    .on('mouseout', () => {
                        d3.selectAll(`.hmap-hlight-${hmap_patients[j]}`)
                            .style('opacity', 0);
                        d3.selectAll(`.oprint-hlight-${hmap_patients[j]}`)
                            .style('opacity', 0);
                        d3.selectAll(`.hlight-space-${hmap_patients[j]}`)
                            .style('opacity', 0);
                    });
            }
        }
    }

    render() {
        return (
            // eslint-disable-next-line no-return-assign
            <div ref={(node) => this.node = node} className="oprint-wrapper" />
        );
    }
}


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
