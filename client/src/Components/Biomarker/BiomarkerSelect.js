import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import { customStyles } from '../Search/SearchStyle';
import { StyledSelect } from './BiomarkerStyle';


/**
 * 
 * @param {Object} props 
 * @returns - Biomarker Select Component
 */
const BiomarkerSelect = (props) => {
    // props
    const { geneList: geneListProp } = props;
    const { selectedGene: selectedGeneProp } = props;
    const { drugList: drugListProp } = props;
    const { selectedDrug: selectedDrugProp } = props;
    const { dataTypes: dataTypesProp } = props;

    // component states
    const [drugs, setDrugs] = useState([]);
    const [genes, setGenes] = useState([]);
    const [dataTypes, setDataTypes] = useState([]);

    // function to prepare data type array for selection
    const updateDataTypes = function () {
        const updatedData = dataTypesProp.map(el => ({
            value: el,
            label: el,
        }));
        // setting the state
        setDataTypes(updatedData);
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
            const drugResponse = await axios.get('/api/v1/drugs', { headers: { Authorization: localStorage.getItem('user') } });
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
                await axios.get('/api/v1/genes', { headers: { Authorization: localStorage.getItem('user') } })
            ).data.data;

            geneSelectionData = geneList.map(gene => ({
                value: gene.gene_name,
                label: gene.gene_name,
            }));
        }

        // setting the gene state
        setGenes(geneSelectionData);
    };

    useEffect(() => {
        // calling getDrugs function
        getDrugs();
        // calling getGenes function
        getGenes();
        // update data types
        updateDataTypes();
    }, []);

    return (
        <StyledSelect className='biomarker-select' >
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
    genes: PropTypes.string,
    drug: PropTypes.string,
    dataTypes: PropTypes.arrayOf(PropTypes.string),
};
