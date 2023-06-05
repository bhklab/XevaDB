import React from 'react';
import styled from 'styled-components';
import { exportComponentAsPNG } from 'react-component-export-image';
import colors from '../../styles/colors';
import downloadIcon from '../../images/download.png';

const StyledButton = styled.div`
    display: inline !important;
    margin-top: 30px;
    

    .export-png {
        font-weight: 500;
        border: 1px solid ${colors['--bg-color']};
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding: 5px;

        :hover {
            opacity: 0.75;
            cursor: pointer;
        }
    }
    
    img {
        display: inline-block;
        height: 25px;
        width: 30px;
    }
`;

const ExportPng = (props) => {
    const { componentRef, fileName } = props;
    
    return (
        <StyledButton>
            <div 
                className='export-png' 
                onClick={
                    () => exportComponentAsPNG(componentRef, {fileName})
                }
            >
                <span> Export Graph </span>
                <img src={downloadIcon} alt='download icon' />
            </div>
        </StyledButton>
    );
};

export default ExportPng;
