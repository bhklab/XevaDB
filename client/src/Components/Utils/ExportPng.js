import React from 'react';
import styled from 'styled-components';
import { exportComponentAsPNG } from 'react-component-export-image';
import colors from '../../styles/colors';
import downloadIcon from '../../images/download.svg';

const StyledButton = styled.div`
    font-weight: 500;
    display: inline !important;
    align-self: flex-end;
    margin-right: 70px;
    margin-bottom: 30px;
    
    button {
        background-color: ${colors.blue_header} !important;
        color: ${colors.white} !important;
        padding: 6px !important;
        padding-left: 10px !important;
        margin-right: 5px;
        border-radius: 6px;
        border: 1px;
        font-size: 1.0em;
        :hover {
        color: ${colors.blue_header} !important;
        background-color: ${colors.lightgray} !important;
        cursor: pointer;
        }
    }
    img {
        display: inline-block;
        height: 18px;
        width: 25px;
    }
`;

const ExportPng = (props) => {
    const { componentRef } = props;
    return (
        <StyledButton>
            <button onClick={() => exportComponentAsPNG(componentRef)} type="button">
                Export as PNG
                <img src={downloadIcon} alt="download icon" />
            </button>
        </StyledButton>
    );
};

export default ExportPng;
