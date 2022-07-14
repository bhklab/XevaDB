import React from 'react';
import styled from 'styled-components';
import { exportComponentAsPNG } from 'react-component-export-image';
import colors from '../../styles/colors';
import downloadIcon from '../../images/download.svg';

const StyledButton = styled.div`
    display: inline !important;
    // align-self: flex-end;
    margin-top: 40px;
    
    button {
        font-weight: 300;
        background-color: ${colors['--bg-color']} !important;
        color: ${colors['--white']} !important;
        padding: 10px 2px !important;
        margin-right: 5px;
        border-radius: 6px;
        border: none;
        font-size: 1em;
        width: 150px;
        :hover {
            opacity: 0.75;
            cursor: pointer;
        }
    }

    img {
        display: inline-block;
        height: 15px;
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
