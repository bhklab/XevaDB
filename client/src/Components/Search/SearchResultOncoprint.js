/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Oncoprint from '../Oncoprint/Oncoprint';

class SearchResultOncoprint extends React.Component {
    constructor(props) {
        super(props);
        // setting the states for the data.
        this.state = {
            threshold: 0,
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
        };
        // binding the functions declared.
        this.updateResults = this.updateResults.bind(this);
    }


    componentDidMount() {
        const { datasetParam } = this.props;
        const { geneParam } = this.props;
        const { genomicsParam } = this.props;
        const query_data = [];

        // making get requests based on the genomics parameters.
        // sequence is important (first cnv or mutation) then rnaseq has to be pushed.
        if (genomicsParam.includes('CNV') || genomicsParam.includes('Mutation')) {
            query_data.push(axios.get(`/api/v1/mutation?genes=${geneParam}&dataset=${datasetParam}`));
        }
        if (genomicsParam.includes('RNASeq')) {
            query_data.push(axios.get(`/api/v1/rnaseq?genes=${geneParam}&dataset=${datasetParam}`));
        }

        Promise.all([...query_data])
            .then((response) => {
                this.updateResults(response, genomicsParam);
            });
    }

    updateResults(result, genomicsParam) {
        const genomics_value = genomicsParam.split(',');
        const genomics = [];

        // temporary solution to remove cnv if everything is selected.
        if ((genomics_value.includes('Mutation') || genomics_value.includes('CNV'))) {
            genomics.push('Mutation');
        }
        if (genomics_value.includes('RNASeq')) {
            genomics.push('RNASeq');
        }

        // grab the last array(patient array) from result[0]
        const dataset = result[0].data;
        let hmap_patients = [];
        // grabbing the total patients from hmap.
        hmap_patients = dataset.pop();

        // removing last element from each array element of result
        if (result.length > 1) {
            result.forEach((value, i) => {
                if (i !== 0) {
                    value.data.pop();
                }
            });
        }

        // setting patients genes and data for each of mutation, cnv and rna (given they are present)
        const patient = {};
        const genes = {};
        const data = {};

        genomics.forEach((value, i) => {
            const val = value.substring(0, 3).toLowerCase();

            // setting patients
            const patient_id = Object.keys(result[i].data[0]).filter((value) => {
                let return_value = '';
                if (value !== 'gene_id') {
                    return_value = value;
                }
                return return_value;
            });
            patient[`patient_${val}`] = patient_id;

            // genes
            const gene_id = result[i].data.map((data) => data.gene_id);
            genes[`genes_${val}`] = gene_id;

            // data
            data[`data_${val}`] = result[i].data;
        });

        this.setState({
            threshold: this.props.threshold,
            hmap_patients,
            patient_mut: patient.patient_mut === undefined ? this.state.patient_mut : patient.patient_mut,
            patient_rna: patient.patient_rna === undefined ? this.state.patient_rna : patient.patient_rna,
            patient_cnv: patient.patient_cnv === undefined ? this.state.patient_cnv : patient.patient_cnv,
            genes_mut: genes.genes_mut === undefined ? this.state.genes_mut : genes.genes_mut,
            genes_rna: genes.genes_rna === undefined ? this.state.genes_rna : genes.genes_rna,
            genes_cnv: genes.genes_cnv === undefined ? this.state.genes_cnv : genes.genes_cnv,
            data_mut: data.data_mut === undefined ? this.state.data_mut : data.data_mut,
            data_rna: data.data_rna === undefined ? this.state.data_rna : data.data_rna,
            data_cnv: data.data_cnv === undefined ? this.state.data_cnv : data.data_cnv,
            dimensions: { height: 35, width: 20 },
            margin: {
                top: 50, right: 200, bottom: 100, left: 250,
            },
        });
    }


    render() {
        const {
            dimensions, margin, threshold,
        } = this.state;
        return (
            <Oncoprint
                className="oprint_result"
                dimensions={dimensions}
                margin={margin}
                threshold={Number(threshold)}
                hmap_patients={this.state.hmap_patients}
                genes_mut={this.state.genes_mut.length ? this.state.genes_mut : this.state.genes_cnv}
                genes_rna={this.state.genes_rna}
                patient_mut={this.state.patient_mut.length ? this.state.patient_mut : this.state.patient_cnv}
                patient_rna={this.state.patient_rna}
                data_mut={this.state.data_mut.length ? this.state.data_mut : this.state.data_cnv}
                data_rna={this.state.data_rna}
            />
        );
    }
}


SearchResultOncoprint.propTypes = {
    datasetParam: PropTypes.string.isRequired,
    geneParam: PropTypes.string.isRequired,
    genomicsParam: PropTypes.string.isRequired,
    threshold: PropTypes.string.isRequired,
};


export default SearchResultOncoprint;
