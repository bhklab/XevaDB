/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Oncoprint from './Oncoprint';
import Spinner from '../../Utils/Spinner';
import ErrorComponent from '../../Utils/Error';
import { OncoprintGenes } from '../../../utils/OncoprintGenes';

class OncoprintData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: 0,
            threshold: 2,
            hmap_patients: [],
            genes_mut: [],
            genes_rna: [],
            genes_cnv: [],
            patient_mut: [],
            patient_rna: [],
            patient_cnv: [],
            data_mut: {},
            data_rna: {},
            data_cnv: {},
            dimensions: { height: 30, width: 14 }, // NEW: initialize with a sensible default
            margin: {
                top: 50, right: 250, bottom: 200, left: 250,
            },
            drugs: [],
            loading: true,
            error: false,
        };
        this.defaultGenomics = ['mutation', 'rnaseq', 'cnv'];

        // NEW: container + resize observer
        this.containerRef = React.createRef();
        this.ro = null;
        this.resizeTimer = null;
    }

    componentDidMount() {
        // dataset prop
        const { datasetId: datasetIdProp } = this.props;

        // drug list prop 'string` type convert to 'array'
        const drugListProp = this.props.drugList?.split(',');

        // setting the genomics prop and updating the list
        let genomicsListProp = this.props.genomicsList?.split(',') || this.defaultGenomics;
        genomicsListProp = genomicsListProp.map((genomics) => (genomics === 'Gene Expression' ? 'rnaseq' : genomics.toLowerCase()));

        // gene list prop
        const geneListProp = this.props.geneList || OncoprintGenes;

        // if the dataset id is equals to 4.
        if (datasetIdProp === '4' || datasetIdProp === 4) {
            this.setState({
                loading: false,
            });
        } else if (Number(datasetIdProp) > 0) {
            const queries = genomicsListProp.map((genomics) =>
                // return the API call
                axios.get(
                    `/api/v1/${genomics}?genes=${geneListProp}&dataset=${datasetIdProp}`,
                    { headers: { Authorization: localStorage.getItem('user') } },
                ));

            if (!drugListProp) {
                queries.push(
                    axios.get(
                        `/api/v1/datasets/detail/${datasetIdProp}`,
                        { headers: { Authorization: localStorage.getItem('user') } },
                    ),
                );
            }

            Promise.all([...queries])
                .then((response) => {
                    // updated response object
                    const updatedResponseObject = {};

                    // maps the genomics type to response
                    genomicsListProp.forEach((genomics, i) => {
                        updatedResponseObject[genomics] = response[i];
                    });

                    // add drug detail to the response object
                    updatedResponseObject.drugs = drugListProp || response.at(-1).data.datasets[0].drugs;

                    this.updateResults(updatedResponseObject);
                })
                .catch((err) => {
                    this.setState({
                        error: true,
                    });
                });
        }

        // NEW: observe container width changes (debounced)
        const node = this.containerRef.current;
        if (node) {
            this.ro = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const cw = Math.max(0, entry.contentRect?.width || 0);
                    if (cw > 0) {
                        if (this.resizeTimer) clearTimeout(this.resizeTimer);
                        this.resizeTimer = setTimeout(this.computeDimensions, 120);
                    }
                }
            });
            this.ro.observe(node);
        }
    }

    componentWillUnmount() {
        // NEW: cleanup
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        if (this.ro) this.ro.disconnect();
    }

    // NEW: compute dimensions from container width and patient count
    computeDimensions = () => {
        const el = this.containerRef.current;
        if (!el) return;

        const containerWidth = Math.max(0, el.clientWidth || 0);
        const { margin, hmap_patients } = this.state;
        const patientCount = Math.max(1, (hmap_patients?.length || 1));

        // usable width after margins
        const available = Math.max(200, containerWidth - (margin.left + margin.right));

        // base width per cell
        const base = Math.max(6, Math.floor(available / patientCount));

        // gentle breakpoints to avoid abrupt jumps
        let rectWidth;
        if (containerWidth < 480) rectWidth = Math.min(base, 8);
        else if (containerWidth < 640) rectWidth = Math.min(base, 9);
        else if (containerWidth < 768) rectWidth = Math.min(base, 11);
        else if (containerWidth < 1024) rectWidth = Math.min(base, 13);
        else if (containerWidth < 1400) rectWidth = Math.min(base, 17);
        else if (containerWidth < 1680) rectWidth = Math.min(base, 20);
        else rectWidth = base;

        // keep a proportional but bounded height
        const rectHeight = Math.max(18, Math.min(44, Math.round(rectWidth * 2)));

        // only setState if changed
        this.setState((prev) => {
            const same = prev.dimensions.width === rectWidth && prev.dimensions.height === rectHeight;
            return same ? null : { dimensions: { width: rectWidth, height: rectHeight } };
        });
    };

    // creates the updated data and sets the new state
    updateResults = (onco) => {
        // makes a copy of the data
        const inputData = JSON.parse(JSON.stringify(onco));

        // grab drugs
        const { drugs } = inputData;

        // delete the drug object from the inputData object
        delete inputData.drugs;

        // total patients for the dataset.
        let hmap_patients;

        // removes the patient array from each data array
        if (Object.keys(inputData).length > 0) {
            Object.values(inputData).forEach((value, i) => {
                if (i === 0) {
                    hmap_patients = value.data.pop();
                } else {
                    value.data.pop();
                }
            });
        }

        // this is according to the object and heatmap sequence.
        // inputData.forEach((value, i) => { // can't break in forEach use for if wanna break.
        //     const dataObject = {};
        //     if (value.data.length > 0) {
        //         hmapPatients.forEach((patient) => {
        //             if (!inputData[i].data[0][patient]) {
        //                 dataObject[patient] = '';
        //             } else {
        //                 dataObject[patient] = inputData[i].data[0][patient];
        //             }
        //         });
        //     }
        //     hmapPatients = Object.keys(dataObject);
        // });

        // setting patients genes and data for
        // each of mutation, cnv and rna (given they are present)
        const patient = {};
        const genes = {};
        const data = {};

        Object.keys(inputData).forEach((value) => {
            const val = value.substring(0, 3).toLowerCase();

            // setting patients
            const patient_id = Object.keys(inputData[value].data[0]).filter((value) => value !== 'gene_id');
            patient[`patient_${val}`] = patient_id;

            // genes
            const gene_id = inputData[value].data.map((data) => data.gene_id);
            genes[`genes_${val}`] = gene_id;

            // data
            data[`data_${val}`] = {};
            inputData[value].data.forEach((el) => {
                data[`data_${val}`][el.gene_id] = el;
                // deletes the gene id from the data
                // delete el.gene_id;
            });
        });

        this.setState({
            hmap_patients,
            patient_mut: patient.patient_mut || [],
            patient_rna: patient.patient_rna || [],
            patient_cnv: patient.patient_cnv || [],
            genes_mut: genes.genes_mut || [],
            genes_rna: genes.genes_rna || [],
            genes_cnv: genes.genes_cnv || [],
            data_mut: data.data_mut || {},
            data_rna: data.data_rna || {},
            data_cnv: data.data_cnv || {},
            drugs,
            // keep existing dimensions/margins; recompute cell sizes after state set
            loading: false,
        }, () => {
            // NEW: recompute dimensions now that patients are known
            this.computeDimensions();
        });
    }

    render() {
        const {
            genes_mut, genes_rna, genes_cnv,
            patient_mut, patient_rna, patient_cnv,
            data_mut, data_rna, data_cnv, drugs,
            dimensions, margin, threshold,
            hmap_patients, loading, error,
        } = this.state;

        const { datasetId: datasetIdProp } = this.props;
        const thresholdProp = this.props.threshold || threshold;

        function renderingData() {
            // if error occures render the error component!
            if (error) {
                return <ErrorComponent message="Page not found!!" />;
            }

            // if the dataset id is 4 then there is no data available!
            if (datasetIdProp === '4' || datasetIdProp === 4) {
                return (
                    <ErrorComponent message="Data unavailable for PDXE (Gastric Cancer)" />
                );
            }

            if (
                Object.keys(data_mut).length > 0
                || Object.keys(data_cnv).length > 0
                || Object.keys(data_rna).length > 0
            ) {
                return (
                    <Oncoprint
                        className="oprint"
                        dimensions={dimensions}
                        margin={margin}
                        threshold={thresholdProp}
                        hmap_patients={hmap_patients}
                        genes_mut={genes_mut}
                        genes_rna={genes_rna}
                        genes_cnv={genes_cnv}
                        patient_mut={patient_mut}
                        patient_rna={patient_rna}
                        patient_cnv={patient_cnv}
                        data_mut={data_mut}
                        data_rna={data_rna}
                        data_cnv={data_cnv}
                        drugs={drugs}
                    />
                );
            }
        }

        return (
            <div ref={this.containerRef} style={{ width: '100%' }}>
                {
                    loading ? <Spinner loading={loading} /> : renderingData()
                }
            </div>
        );
    }
}

OncoprintData.propTypes = {
    datasetId: PropTypes.string.isRequired,
    geneList: PropTypes.string,
    drugList: PropTypes.string,
    genomicsList: PropTypes.string,
    threshold: PropTypes.string,
};

export default OncoprintData;
