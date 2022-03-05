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

const BiomarkerSelect = (props) => {
    const { genes: geneProp } = props;
    const { drug: drugProp } = props;
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
        const geneList = geneProp.split(',');

        // prepare data for gene selection
        const geneSelectionData = geneList.map(gene => ({
            value: gene,
            label: gene,
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
                <Select
                    styles={customStyles}
                    options={drugs}
                    defaultValue={{ value: drugProp, label: drugProp }}
                />
            </div>
            <div className='gene-select'>
                <span> Select Gene </span>
                <Select
                    styles={customStyles}
                    options={genes}
                />
            </div>
        </StyledSelect >
    )
};

export default BiomarkerSelect;


BiomarkerSelect.propTypes = {
    genes: PropTypes.string.isRequired,
    drug: PropTypes.string.isRequired
};
