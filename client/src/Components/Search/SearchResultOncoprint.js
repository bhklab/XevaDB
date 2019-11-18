/* eslint-disable no-shadow */
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
            hmapPatients: [],
            genesMut: [],
            genesRna: [],
            genesCnv: [],
            patientMut: [],
            patientRna: [],
            patientCnv: [],
            dataMut: [],
            dataRna: [],
            dataCnv: [],
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
        const queryData = [];

        // making get requests based on the genomics parameters.
        // sequence is important (first cnv or mutation) then rnaseq has to be pushed.
        if (genomicsParam.includes('CNV') || genomicsParam.includes('Mutation')) {
            queryData.push(axios.get(`/api/v1/mutation?genes=${geneParam}&dataset=${datasetParam}`));
        }
        if (genomicsParam.includes('RNASeq')) {
            queryData.push(axios.get(`/api/v1/rnaseq?genes=${geneParam}&dataset=${datasetParam}`));
        }

        Promise.all([...queryData])
            .then((response) => {
                this.updateResults(response, genomicsParam);
            });
    }

    updateResults(result, genomicsParam) {
        const genomicsValue = genomicsParam.split(',');
        const genomics = [];

        // temporary solution to remove cnv if everything is selected.
        if ((genomicsValue.includes('Mutation') || genomicsValue.includes('CNV'))) {
            genomics.push('Mutation');
        }
        if (genomicsValue.includes('RNASeq')) {
            genomics.push('RNASeq');
        }

        // grab the last array(patient array) from result[0]
        const dataset = result[0].data;

        // grabbing the total patients from hmap.
        const hmapPatients = dataset.pop();

        // removing last element from each array element of result
        if (result.length > 1) {
            result.forEach((value, i) => {
                if (i !== 0) {
                    value.data.pop();
                }
            });
        }

        // setting patients genes and data for each of mutation,
        // cnv and rna (given they are present)
        const patient = {};
        const genes = {};
        const data = {};

        genomics.forEach((value, i) => {
            const val = value.substring(0, 3).toLowerCase();

            // setting patients
            const patientId = Object.keys(result[i].data[0]).filter((value) => {
                let returnValue = '';
                if (value !== 'gene_id') {
                    returnValue = value;
                }
                return returnValue;
            });
            patient[`patient_${val}`] = patientId;

            // genes
            const geneId = result[i].data.map((data) => data.gene_id);
            genes[`genes_${val}`] = geneId;

            // data
            data[`data_${val}`] = result[i].data;
        });

        // destructuring the states and prop.
        const {
            dataMut, dataRna, dataCnv,
            genesMut, genesRna, genesCnv,
            patientMut, patientRna, patientCnv,
        } = this.state;
        const { threshold } = this.props;

        this.setState({
            threshold,
            hmapPatients,
            patientMut: patient.patient_mut === undefined ? patientMut : patient.patient_mut,
            patientRna: patient.patient_rna === undefined ? patientRna : patient.patient_rna,
            patientCnv: patient.patient_cnv === undefined ? patientCnv : patient.patient_cnv,
            genesMut: genes.genes_mut === undefined ? genesMut : genes.genes_mut,
            genesRna: genes.genes_rna === undefined ? genesRna : genes.genes_rna,
            genesCnv: genes.genes_cnv === undefined ? genesCnv : genes.genes_cnv,
            dataMut: data.data_mut === undefined ? dataMut : data.data_mut,
            dataRna: data.data_rna === undefined ? dataRna : data.data_rna,
            dataCnv: data.data_cnv === undefined ? dataCnv : data.data_cnv,
            dimensions: { height: 35, width: 20 },
            margin: {
                top: 50, right: 200, bottom: 100, left: 250,
            },
        });
    }


    render() {
        const {
            dimensions, margin, threshold, dataMut, dataRna, dataCnv, hmapPatients,
            genesMut, genesRna, genesCnv, patientMut, patientRna, patientCnv,
        } = this.state;
        return (
            <Oncoprint
                className="oprint_result"
                dimensions={dimensions}
                margin={margin}
                threshold={Number(threshold)}
                hmap_patients={hmapPatients}
                genes_mut={genesMut.length ? genesMut : genesCnv}
                genes_rna={genesRna}
                patient_mut={patientMut.length ? patientMut : patientCnv}
                patient_rna={patientRna}
                data_mut={dataMut.length ? dataMut : dataCnv}
                data_rna={dataRna}
            />
        );
    }
}


SearchResultOncoprint.propTypes = {
    datasetParam: PropTypes.string.isRequired,
    geneParam: PropTypes.string.isRequired,
    genomicsParam: PropTypes.string.isRequired,
    threshold: PropTypes.string.isRequired,
};


export default SearchResultOncoprint;
