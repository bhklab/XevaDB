import React from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';

const ErrorStyle = styled.div`
    color: ${colors['--main-font-color']} !important;
    font-size: 1.75em;
    font-weight: 700;
    margin-top: 200px;
`;

const ErrorComponent = ({ message }) => {
    // data variable if message is not defined.
    let data = '';
    if (!message) {
        data = 'Page not found!!';
    }
    // returing the data.
    return (
        <ErrorStyle>
            {message || data}
        </ErrorStyle>
    );
};

export default ErrorComponent;
