/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Oncoprint from './Oncoprint';
import Spinner from '../../Utils/Spinner';
import ErrorComponent from '../../Utils/Error';
import PatientContext from '../../Context/PatientContext';
import { OncoprintGenes } from '../../../utils/OncoprintGenes';
import { computePlotMargins } from '../../../utils/PlotMargins';

class OncoprintData extends React.Component {
    static contextType = PatientContext;
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
            dimensions: { height: 30, width: 14 },
            margin: computePlotMargins(props.drugList),
            drugs: [],
            loading: true,
            error: false,
            noData: false,
        };
        this.defaultGenomics = ['mutation', 'rnaseq', 'cnv'];

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

        if (Number(datasetIdProp) > 0) {
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
                        loading: false,
                    });
                });
        }

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

    componentDidUpdate(prevProps) {
        if (prevProps.drugList !== this.props.drugList) {
            const margin = computePlotMargins(this.state.drugs || this.props.drugList);
            this.setState({ margin }, () => this.computeDimensions());
        }
    }

    componentWillUnmount() {
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        if (this.ro) this.ro.disconnect();
    }

    computeDimensions = () => {
        if (this.context?.plotDimensions) {
            const { width, height } = this.context.plotDimensions;
            this.setState((prev) => {
                const same = prev.dimensions.width === width && prev.dimensions.height === height;
                return same ? null : { dimensions: { width, height } };
            });
            return;
        }

        const el = this.containerRef.current;
        const containerWidth = Math.max(1200, el ? el.clientWidth : 1200);
        const margin = this.context?.plotMargin || this.state.margin;
        const { hmap_patients } = this.state;
        const patientCount = Math.max(1, (hmap_patients?.length || 1));

        // Fixed right-side extras: legend (160px) + margins
        const fixedExtras = margin.left + margin.right + 160;
        const availableForCells = Math.max(100, containerWidth - fixedExtras);

        // base width per cell accounting for patient cells + right sidebar/legend offset (8.5 cells)
        const base = Math.floor(availableForCells / (patientCount + 8.5));

        // clamp: min keeps labels legible (page scrolls horizontally instead)
        const rectWidth = Math.max(18, Math.min(base, 28));

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

        // genomics types (mutation, cnv, rnaseq) that returned data for this dataset.
        const genomicsWithData = Object.keys(inputData).filter((value) => inputData[value].data.length > 0);

        // if none of them returned data, the dataset has no molecular data to show.
        if (genomicsWithData.length === 0) {
            this.setState({
                noData: true,
                loading: false,
            });
            return;
        }

        // setting patients genes and data for
        // each of mutation, cnv and rna (given they are present)
        const patient = {};
        const genes = {};
        const data = {};

        genomicsWithData.forEach((value) => {
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
            margin: computePlotMargins(drugs || this.props.drugList),
            loading: false,
        }, () => {
            // recompute dimensions now that patients are known
            this.computeDimensions();
        });
    }

    render() {
        const {
            genes_mut, genes_rna, genes_cnv,
            patient_mut, patient_rna, patient_cnv,
            data_mut, data_rna, data_cnv, drugs,
            dimensions: stateDimensions, margin: stateMargin, threshold,
            hmap_patients, loading, error, noData,
        } = this.state;

        const dimensions = this.context?.plotDimensions || stateDimensions;
        const margin = this.context?.plotMargin || stateMargin;

        const { datasetId: datasetIdProp } = this.props;
        const thresholdProp = this.props.threshold || threshold;

        function renderingData() {
            // if error occures render the error component!
            if (error) {
                return <ErrorComponent message="Page not found!!" />;
            }

            // if the dataset has no mutation, cnv or rna sequencing data.
            if (noData) {
                return (
                    <ErrorComponent message={`Molecular data unavailable for this dataset`} />
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
                        datasetId={datasetIdProp}
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
