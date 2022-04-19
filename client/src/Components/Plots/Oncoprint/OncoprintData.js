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
            dimensions: {},
            margin: {},
            loading: true,
            error: false,
        };
    }

    static getDerivedStateFromProps(props) {
        const { dataset } = props;
        return {
            dataset,
        };
    }

    componentDidMount() {
        if (this.state.dataset > 0) {
            const mutation_data = axios.get(`/api/v1/mutation?genes=${OncoprintGenes}&dataset=${this.state.dataset}`, { headers: { Authorization: localStorage.getItem('user') } });
            const rnaseq_data = axios.get(`/api/v1/rnaseq?genes=${OncoprintGenes}&dataset=${this.state.dataset}`, { headers: { Authorization: localStorage.getItem('user') } });
            const cnv_data = axios.get(`/api/v1/cnv?genes=${OncoprintGenes}&dataset=${this.state.dataset}`, { headers: { Authorization: localStorage.getItem('user') } });

            Promise.all([mutation_data, rnaseq_data, cnv_data])
                .then((response) => {
                    const updatedResponse = this.createObjectFromResponse(response);
                    this.updateResults(updatedResponse);
                })
                .catch((err) => {
                    this.setState({
                        error: true,
                    });
                });
        }
    }

    // creates an object from the data response mapping the data to the data types
    createObjectFromResponse = (response) => {
        return {
            mutation: response[0],
            rnaseq: response[1],
            cnv: response[2],
        }
    }

    // creates the updated data and sets the new state
    updateResults = (onco) => {
        // makes a copy of the data
        const inputData = JSON.parse(JSON.stringify(onco));

        // if the dataset id is equals to 4.
        if (this.state.dataset === '4') {
            this.setState({
                loading: false,
            });
        }

        // total patients for the dataset.
        let hmap_patients;

        // removes the patient array from each data array
        if (Object.keys(inputData).length > 1) {
            Object.values(inputData).forEach((value, i) => {
                if (i === 0) {
                    hmap_patients = value.data.pop();
                }
                else {
                    value.data.pop();
                }
            });
        }

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
            inputData[value].data.forEach(el => {
                data[`data_${val}`][el.gene_id] = el;
                // deletes the gene id from the data
                // delete el.gene_id;
            })
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
            dimensions: { height: 30, width: 14 },
            margin: {
                top: 50, right: 250, bottom: 50, left: 250,
            },
            loading: false,
        });
    }

    render() {
        const {
            genes_mut, genes_rna, genes_cnv,
            patient_mut, patient_rna, patient_cnv,
            data_mut, data_rna, data_cnv,
            dimensions, margin, threshold,
            hmap_patients, loading, error, dataset,
        } = this.state;

        function renderingData() {
            let data = '';
            if (
                Object.keys(data_mut).length > 0 ||
                Object.keys(data_cnv).length > 0 ||
                Object.keys(data_rna).length > 0
            ) {
                data = (
                    <Oncoprint
                        className="oprint"
                        dimensions={dimensions}
                        margin={margin}
                        threshold={threshold}
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
                    />
                );
            } else if (dataset === '4' || dataset === 4) {
                return <ErrorComponent message="There is no data available for PDXE (Gastric Cancer)" />;
            } else if (error) {
                return <ErrorComponent message="Page not found!!" />;
            }
            return data;
        }

        return (
            <div>
                {
                    loading ? <Spinner loading={loading} /> : renderingData()
                }
            </div>
        );
    }
}

OncoprintData.propTypes = {
    dataset: PropTypes.string.isRequired,
};

export default OncoprintData;
