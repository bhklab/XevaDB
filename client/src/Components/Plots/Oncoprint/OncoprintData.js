/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Oncoprint from './Oncoprint';
import Spinner from '../../Utils/Spinner';
import Error from '../../Utils/Error';
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
            data_mut: [],
            data_rna: [],
            data_cnv: [],
            dimensions: {},
            margin: {},
            loading: true,
            error: false,
        };
        this.updateResults = this.updateResults.bind(this);
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
                    this.updateResults(response);
                })
                .catch((err) => {
                    if (err) {
                        this.setState({
                            error: true,
                        });
                    }
                });
        }
    }

    updateResults(onco) {
        // total patients for the dataset.
        let hmap_patients = onco[0].data.pop();

        // removing last element from each array element of result
        if (onco.length > 1) {
            onco.forEach((value, i) => {
                if (i !== 0) {
                    value.data.pop();
                }
            });
        }

        // this is according to the object and heatmap sequence.
        onco.forEach((value, i) => { // can't break in forEach use for if wanna break.
            const dataObject = {};
            if (value.data.length > 1) {
                hmap_patients.forEach((patient) => {
                    if (!onco[i].data[0][patient]) {
                        dataObject[patient] = '';
                    } else {
                        dataObject[patient] = onco[i].data[0][patient];
                    }
                });
                hmap_patients = Object.keys(dataObject);
            }
        });

        // setting patients genes and data for
        // each of mutation, cnv and rna (given they are present)
        const patient = {};
        const genes = {};
        const data = {};
        const genomics = onco[2].data.length > 1 ? ['Mutation', 'RNASeq', 'CNV'] : ['RNASeq'];

        genomics.forEach((value) => {
            let i = 0;
            if (value === 'Mutation') {
                i = 0;
            } else if (value === 'RNASeq') {
                i = 1;
            } else if (value === 'CNV') {
                i = 2;
            }
            const val = value.substring(0, 3).toLowerCase();

            // setting patients
            const patient_id = Object.keys(onco[i].data[0]).filter((value) => {
                let return_value = '';
                if (value !== 'gene_id') {
                    return_value = value;
                }
                return return_value;
            });

            patient[`patient_${val}`] = patient_id;

            // genes
            const gene_id = onco[i].data.map((data) => data.gene_id);
            genes[`genes_${val}`] = gene_id;

            // data
            data[`data_${val}`] = onco[i].data;
        });

        this.setState({
            hmap_patients,
            patient_mut: patient.patient_mut || [],
            patient_rna: patient.patient_rna || [],
            patient_cnv: patient.patient_cnv || [],
            genes_mut: genes.genes_mut || [],
            genes_rna: genes.genes_rna || [],
            genes_cnv: genes.genes_cnv || [],
            data_mut: data.data_mut || [],
            data_rna: data.data_rna || [],
            data_cnv: data.data_cnv || [],
            dimensions: { height: 30, width: 15 },
            margin: {
                top: 50, right: 200, bottom: 0, left: 250,
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
            if (data_mut.length || data_cnv.length || data_rna.length) {
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
            } else if (dataset === '4') {
                return <Error message="There is no data available for PDXE (Gastric Cancer)" />;
            } else if (error) {
                return <Error message="Page not found!!" />;
            } else {
                data = (<div className="oprint-wrapper"><Spinner loading={loading} /></div>);
            }
            return data;
        }

        return (
            <div className="wrapper" style={{ margin: 'auto' }}>
                {
                    renderingData()
                }
            </div>
        );
    }
}

OncoprintData.propTypes = {
    dataset: PropTypes.string.isRequired,
};

export default OncoprintData;
