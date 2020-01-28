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
        const genomics = [];

        // making get requests based on the genomics parameters.
        // sequence is important (first cnv or mutation) then rnaseq has to be pushed.
        if (genomicsParam.includes('Mutation')) {
            queryData.push(axios.get(`/api/v1/mutation?genes=${geneParam}&dataset=${datasetParam}`));
            genomics.push('Mutation');
        }
        if (genomicsParam.includes('RNASeq') || genomicsParam.includes('Expression')) {
            queryData.push(axios.get(`/api/v1/rnaseq?genes=${geneParam}&dataset=${datasetParam}`));
            genomics.push('RNASeq');
        }
        if (genomicsParam.includes('CNV')) {
            queryData.push(axios.get(`/api/v1/cnv?genes=${geneParam}&dataset=${datasetParam}`));
            genomics.push('CNV');
        }

        Promise.all([...queryData])
            .then((response) => {
                this.updateResults(response, genomics);
            });
    }

    updateResults(result, genomics) {
        // grab the last array(patient array) from result[0]
        const dataset = result[0].data;

        // grabbing the total patients from hmap.
        let hmapPatients = dataset.pop();

        // removing last element from each array element of result
        if (result.length > 1) {
            result.forEach((value, i) => {
                if (i !== 0) {
                    value.data.pop();
                }
            });
        }

        // this is according to the object and heatmap sequence.
        result.forEach((value, i) => { // can't break in forEach use for if wanna break.
            const dataObject = {};
            if (value.data.length > 1) {
                hmapPatients.forEach((patient) => {
                    if (!result[i].data[0][patient]) {
                        dataObject[patient] = '';
                    } else {
                        dataObject[patient] = result[i].data[0][patient];
                    }
                });
            }
            hmapPatients = Object.keys(dataObject);
        });

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
            patientMut: patient.patient_mut ? patient.patient_mut : patientMut,
            patientRna: patient.patient_rna ? patient.patient_rna : patientRna,
            patientCnv: patient.patient_cnv ? patient.patient_cnv : patientCnv,
            genesMut: genes.genes_mut ? genes.genes_mut : genesMut,
            genesRna: genes.genes_rna ? genes.genes_rna : genesRna,
            genesCnv: genes.genes_cnv ? genes.genes_cnv : genesCnv,
            dataMut: data.data_mut ? data.data_mut : dataMut,
            dataRna: data.data_rna ? data.data_rna : dataRna,
            dataCnv: data.data_cnv ? data.data_cnv : dataCnv,
            dimensions: { height: 35, width: 20 },
            margin: {
                top: 75, right: 200, bottom: 100, left: 250,
            },
        });
    }


    render() {
        const {
            dimensions, margin, threshold, dataMut, dataRna, dataCnv, hmapPatients,
            genesMut, genesRna, genesCnv, patientMut, patientRna, patientCnv,
        } = this.state;
        return (
            (dataMut.length > 0 || dataCnv.length > 0 || dataRna.length > 0) ? (
                <Oncoprint
                    className="oprint_result"
                    dimensions={dimensions}
                    margin={margin}
                    threshold={Number(threshold)}
                    hmap_patients={hmapPatients}
                    genes_mut={genesMut}
                    genes_rna={genesRna}
                    genes_cnv={genesCnv}
                    patient_mut={patientMut}
                    patient_rna={patientRna}
                    patient_cnv={patientCnv}
                    data_mut={dataMut}
                    data_rna={dataRna}
                    data_cnv={dataCnv}
                />
            ) : ''
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
