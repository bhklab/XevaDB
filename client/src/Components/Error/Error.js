import React from 'react';
import styled from 'styled-components';

const ErrorStyle = styled.h1`
    margin: 400px;
    color: #3453b0 !important;
    font-size: 40px !important;
`;

const Error = ({ message }) => {
    // data variable if message is not defined.
    let data = '';
    if (!undefined) {
        data = 'Page not found!!';
    }
    // returing the data.
    return (
        <ErrorStyle>
            {message || data}
        </ErrorStyle>
    );
};

export default Error;
