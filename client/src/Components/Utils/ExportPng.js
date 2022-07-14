import React from 'react';
import styled from 'styled-components';
import { exportComponentAsPNG } from 'react-component-export-image';
import colors from '../../styles/colors';
import downloadIcon from '../../images/download.svg';

const StyledButton = styled.div`
    font-weight: 500;
    display: inline !important;
    // align-self: flex-end;
    margin-top: 40px;
    
    button {
        background-color: ${colors['--bg-color']} !important;
        color: ${colors['--white']} !important;
        padding: 8px !important;
        margin-right: 5px;
        border-radius: 6px;
        border: 1px;
        font-size: 1.05em;
        width: 170px;
        :hover {
            border: 1px solid ${colors['--bg-color']};
            color: ${colors['--bg-color']} !important;
            background-color: ${colors['--white']} !important;
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
