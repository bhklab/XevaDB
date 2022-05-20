import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import { customStyles } from '../Search/SearchStyle';
import { StyledSelect } from './BiomarkerStyle';


/**
 * 
 * @param {Array} data - array of input data
 */
const getAllDataTypes = (data) => {
    // variable to store the different data types.
    const dataTypes = [];
    // looping through and storing the data type if it's not already present.
    data.forEach(el => {
        if (!dataTypes.includes(el.mDataType)) {
            dataTypes.push(el.mDataType);
        }
    });
    return dataTypes;
};

// get different data types present in the data
// const mDataTypes = getAllDataTypes(data.gctd);

/**
 * 
 * @param {Object} props 
 * @returns - Biomarker Select Component
 */
const BiomarkerSelect = (props) => {
    // props
    const { geneList: geneListProp } = props;
    const { drugList: drugListProp } = props;
    const { selectedGene: selectedGeneProp } = props;
    const { selectedDrug: selectedDrugProp } = props;

    // component states
    const [drugs, setDrugs] = useState([]);
    const [genes, setGenes] = useState([]);
    const [dataTypes, setDataTypes] = useState([]);
    const [biomarkerData, setBiomarkerData] = useState([]);

    // function to prepare data type array for selection
    const updateDataTypes = function (data) {
        const updatedData = data.map(el => ({
            value: el,
            label: el,
        }));

        return updatedData;
    };

    // function to get the drug data
    const getDrugs = async function () {
        // final data array
        let drugSelectionData = [];

        if (drugListProp) {
            drugSelectionData = drugListProp.split(',').map(drug => ({
                value: drug,
                label: drug,
            }));
        } else {
            // API call to get the list of drugs
            const drugResponse = await axios.get(
                '/api/v1/drugs',
                { headers: { Authorization: localStorage.getItem('user') } }
            );
            // prepare data for drug selection
            drugSelectionData = drugResponse.data.map(el => ({
                value: el.drug_id,
                label: el.drug_name,
            }));
        }

        // set the drug state with the data
        setDrugs(drugSelectionData);
    };

    // function to get the gene data
    const getGenes = async function () {
        // API call to get the list of genes
        let geneList = [];
        let geneSelectionData = [];

        if (geneListProp) {
            geneList = geneListProp.split(',');

            geneSelectionData = geneList.map(gene => ({
                value: gene,
                label: gene,
            }));
        } else {
            geneList = await (
                await axios.get(
                    '/api/v1/genes',
                    { headers: { Authorization: localStorage.getItem('user') } }
                )
            ).data.data;

            geneSelectionData = geneList.map(gene => ({
                value: gene.gene_name,
                label: gene.gene_name,
            }));
        }

        // setting the gene state
        setGenes(geneSelectionData);
    };

    // function call the biomarker API end point to get the biomarker data
    const getBiomarkerData = async function () {
        const { data } = await axios.get(
            `/api/v1/biomarkers?drug=BGJ398&gene=TP53`,
            { headers: { Authorization: localStorage.getItem('user') } }
        );
        return data;
    };

    useEffect(() => {
        // drug data function
        getDrugs();

        // gene data function
        getGenes();

        // get biomarker data 
        // and set the data types state
        getBiomarkerData()
            .then(biomarkers => {
                // update biomarker data state
                setBiomarkerData(biomarkers.data);

                // get the data types
                const datatypes = getAllDataTypes(biomarkers.data);
                // update data type state and set the data type state
                const datatypeObject = updateDataTypes(datatypes);
                setDataTypes(datatypeObject);
            })
            .catch(err => console.log('An error occurred', err));
    }, []);

    return (
        <StyledSelect className='biomarker-select'>
            <div className='drug-select'>
                <span> Select Drug </span>
                <Select
                    styles={customStyles}
                    options={drugs}
                    defaultValue={selectedDrugProp ? { value: selectedDrugProp, label: selectedDrugProp } : ''}
                />
            </div>
            <div className='gene-select'>
                <span> Select Gene </span>
                <Select
                    styles={customStyles}
                    options={genes}
                    defaultValue={selectedGeneProp ? { value: selectedGeneProp, label: selectedGeneProp } : ''}
                />
            </div>
            <div className='genomics-select'>
                <span> Select Genomics </span>
                <Select
                    styles={customStyles}
                    options={dataTypes}
                />
            </div>
        </StyledSelect >
    )
};

export default BiomarkerSelect;


BiomarkerSelect.propTypes = {
    geneList: PropTypes.string.isRequired,
    drugList: PropTypes.string.isRequired,
    selectedDrug: PropTypes.string,
    selectedGene: PropTypes.string,
};
