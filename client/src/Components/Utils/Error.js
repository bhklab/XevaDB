import React from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';

const ErrorStyle = styled.h1`
    margin: 400px;
    color: ${colors.blue_header} !important;
    font-size: 2.5rem !important;
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
