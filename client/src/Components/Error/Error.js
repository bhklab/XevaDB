import React from 'react';
import styled from 'styled-components';

const ErrorStyle = styled.h1`
    margin: 400px;
    color: #3453b0 !important;
    font-size: 60px !important;
`;

const Error = () => (
    <ErrorStyle>
        Page could not be found!!
    </ErrorStyle>
);

export default Error;
