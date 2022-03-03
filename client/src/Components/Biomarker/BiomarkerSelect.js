import React, { useEffect, useState } from 'react';
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
    
    .drug-select, .gene-select {
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

const BiomarkerSelect = () => {
    const [drugs, setDrugs] = useState([]);
    const [genes, setGenes] = useState([]);

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
        const geneResponse = await axios.get('/api/v1/genes', { headers: { Authorization: localStorage.getItem('user') } });

        // prepare data for gene selection
        const geneSelectionData = geneResponse.data.data.map(el => ({
            value: el.gene_id,
            label: el.gene_name,
        }));

        // setting the gene state
        setGenes(geneSelectionData);
    };

    useEffect(() => {
        // calling getDrugs function
        getDrugs();
        // calling getGenes function
        getGenes();
    }, []);

    return (
        <StyledSelect className='biomarker-select' >
            <div className='drug-select'>
                <span> Select Drug </span>
                <Select styles={customStyles} options={drugs} />
            </div>
            <div className='gene-select'>
                <span> Select Gene </span>
                <Select styles={customStyles} options={genes} />
            </div>
        </StyledSelect >
    )
};

export default BiomarkerSelect;
