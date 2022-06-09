import React from 'react';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';

const override = css`
    display: block;
    margin: 200px;
`;

const SpinnerUtil = (props) => {
    const { loading } = props;
    return loading ? (
        <div>
            <ClipLoader
                css={override}
                sizeUnit="px"
                size={70}
                color={colors.pink_header}
            />
        </div>
    ) : (
        <div />
    );
};

SpinnerUtil.propTypes = {
    loading: PropTypes.bool.isRequired,
};

export default SpinnerUtil;
