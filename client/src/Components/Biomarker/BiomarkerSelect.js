import React from 'react';
import Select from 'react-select';
import colors from '../../styles/colors';
import { customStyles } from '../Search/SearchStyle';
import styled from 'styled-components';

const StyledSelect = styled.div`
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 2% 5% 5% 10%;
    
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

const BiomarkerSelect = () => (
    <StyledSelect className='biomarker-select'>
        <div className='drug-select'>
            <span> Select Drug </span>
            <Select styles={customStyles} />
        </div>
        <div className='gene-select'>
            <span> Select Gene </span>
            <Select styles={customStyles} />
        </div>
    </StyledSelect>
);

export default BiomarkerSelect;
