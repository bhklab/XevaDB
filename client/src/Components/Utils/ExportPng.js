import React from 'react';
import styled from 'styled-components';
import { exportComponentAsPNG } from 'react-component-export-image';
import colors from '../../styles/colors';
import downloadIcon from '../../images/download.svg';

const StyledButton = styled.div`
    font-weight: 500;
    display: inline !important;
    // align-self: flex-end;
    margin: 40px 0px 0px 0px;
    
    button {
        background-color: ${colors.moderate_blue} !important;
        color: ${colors.white} !important;
        padding: 6px 6px 8px 8px !important;
        margin-right: 5px;
        border-radius: 6px;
        border: 1px;
        font-size: 1.1em;
        width: 170px;
        :hover {
        color: ${colors.moderate_blue} !important;
        background-color: ${colors.lightgray} !important;
        cursor: pointer;
        }
    }
    img {
        display: inline-block;
        height: 20px;
        width: 30px;
    }
`;

const ExportPng = (props) => {
    const { componentRef, fileName } = props;
    return (
        <StyledButton>
            <button onClick={() => exportComponentAsPNG(componentRef, { fileName })} type="button">
                Export Graph
                <img src={downloadIcon} alt="download icon" />
            </button>
        </StyledButton>
    );
};

export default ExportPng;
