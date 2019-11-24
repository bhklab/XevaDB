import React from 'react';
import { HashLoader } from 'react-spinners';
import { css } from '@emotion/core';


const override = css`
    display: block;
    margin: auto;
    margin-top: 300px;
`;


const SpinnerUtil = (props) => {
    const { loading } = props;
    return loading ? (
        <div style={{ height: '500px', width: '1300px' }}>
            <HashLoader
                css={override}
                sizeUnit="px"
                size={100}
                color="#cd5686"
            />
        </div>
    ) : (<div />);
};

export default SpinnerUtil;
