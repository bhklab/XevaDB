import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import colors from '../../styles/colors';
import { customStyles } from '../Search/SearchStyle';
import styled from 'styled-components';

const StyledSelect = styled.div`
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 2% 5% 7.5% 10%;
    
    .drug-select, .gene-select, .genomics-select {
        width: 30%;
        margin: 15px;
    }

    span {
        margin-bottom: 5px;
        color: ${colors.pink_header};
        font-size: 1.15rem;
        font-weight: 600;
        display: inline-block;
    }
`;

const BiomarkerSelect = (props) => {
    const { genes: geneProp } = props;
    const { drug: drugProp } = props;
    const { dataTypes: dataTypesProp } = props;
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
        // API call to get the list of drugs
        const drugResponse = await axios.get('/api/v1/drugs', { headers: { Authorization: localStorage.getItem('user') } });

        // prepare data for drug selection
        const drugSelectionData = drugResponse.data.map(el => ({
            value: el.drug_id,
            label: el.drug_name,
        }));

        // setting the state
        setDrugs(drugSelectionData);
    };

    // function to get the gene data
    const getGenes = async function () {
        // API call to get the list of genes
        let geneList = [];
        let geneSelectionData = [];

        if (geneProp) {
            geneList = geneProp.split(',');

            geneSelectionData = geneList.map(gene => ({
                value: gene,
                label: gene,
            }));
        } else {
            geneList = await (await axios.get('/api/v1/genes', { headers: { Authorization: localStorage.getItem('user') } })).data.data;

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
                    defaultValue={drugProp ? { value: drugProp, label: drugProp } : ''}
                />
            </div>
            <div className='gene-select'>
                <span> Select Gene </span>
                <Select
                    styles={customStyles}
                    options={genes}
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
