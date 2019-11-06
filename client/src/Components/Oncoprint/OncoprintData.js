/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-deprecated */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Oncoprint from './Oncoprint';

class OncoprintData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: 0,
            threshold: 2,
            hmap_patients: [],
            genes_mut: [],
            genes_rna: [],
            patient_mut: [],
            patient_rna: [],
            data_mut: [],
            data_rna: [],
            dimensions: {},
            margin: {},
        };
        this.updateResults = this.updateResults.bind(this);
    }

    componentWillMount() {
        this.setState({
            dataset: this.props.dataset,
        });
    }

    componentDidMount() {
        if (this.state.dataset > 0) {
            const mutation_data = axios.get(`/api/v1/mutation/${this.state.dataset}`);
            const rnaseq_data = axios.get(`/api/v1/rnaseq/${this.state.dataset}`);

            Promise.all([mutation_data, rnaseq_data])
                .then((response) => {
                    this.updateResults(response);
                });
        } else { // this is basically useless else statement.
            axios.get('/api/v1/mutation')
                .then((response) => {
                    this.updateResults(response.data);
                });
        }
    }

    updateResults(onco) {
        // total patients.
        const dataset = onco[0].data;
        let hmap_patients = [];
        // grabbing the total patients from hmap.
        hmap_patients = dataset.pop();

        // setting patients genes and data for
        // each of mutation, cnv and rna (given they are present)
        const patient = {};
        const genes = {};
        const data = {};
        const genomics = ['Mutation', 'RNASeq'];

        genomics.forEach((value, i) => {
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
            patient_mut: patient.patient_mut,
            patient_rna: patient.patient_rna,
            genes_mut: genes.genes_mut,
            genes_rna: genes.genes_rna,
            data_mut: data.data_mut,
            data_rna: data.data_rna,
            dimensions: { height: 35, width: 20 },
            margin: {
                top: 100, right: 200, bottom: 0, left: 250,
            },
        });
    }


    render() {
        return (
            <div className="wrapper" style={{ margin: 'auto', fontSize: '0' }}>
                <Oncoprint
                    className="oprint"
                    dimensions={this.state.dimensions}
                    margin={this.state.margin}
                    threshold={this.state.threshold}
                    hmap_patients={this.state.hmap_patients}
                    genes_mut={this.state.genes_mut}
                    genes_rna={this.state.genes_rna}
                    patient_mut={this.state.patient_mut}
                    patient_rna={this.state.patient_rna}
                    data_mut={this.state.data_mut}
                    data_rna={this.state.data_rna}
                />
            </div>
        );
    }
}

OncoprintData.propTypes = {
    dataset: PropTypes.number.isRequired,
};


export default OncoprintData;
