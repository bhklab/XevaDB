import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import colors from '../../../styles/colors';
import convertToTitleCase from '../../../utils/ConvertToTitleCase';
import pubchemURL from '../../../utils/PubChemURL';

// styles for annotation
const AnnotationStyle = styled.div`
    box-sizing: border-box;
    padding: 40px 20px 60px 20px;
    width: 85%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    h2 {
        color: ${colors['--bg-color']};
        font-size: 1.65em;
        margin: 0 0 5px 0;
    };
    
    .key {
        color: ${colors['--main-font-color']};
        font-size: 1em;
        font-weight: 600;
    }

    .value {
        color: ${colors['--main-font-color']};
        font-size: 0.9em;
    }

    table, .key, .value {
        border: 1.5px ${colors['--table-bg-color']} solid;
    }
    
    .key, .value {
        padding: 6px;
    }
    
    a {
        padding: 0px;
        color: ${colors['--link-color']};
    }
`;

/**
 * returns the value for table data
 * @param {string} key
 * @param {string | number} value
 */
const createTableValue = (key, value) => {
    if (key === 'pubchemid') {
        return (
            <a href={`${pubchemURL}${value}`} target='_blank' rel='noreferrer'>
                {' '}
                {value?.split(' ,').join(', ')}
                {' '}
            </a>
        );
    }
    return value;
};

/**
 *
 * @param {Object} data - input object
 * @returns {Object} - creates the table with the input data
 */
const createTable = (data) => (
    <table>
        {
            Object.entries(data).map(([key, value]) => (
                <tbody key={`${value}-${key}`}>
                    <tr className='table-row'>
                        <td className='key'>
                            {' '}
                            {convertToTitleCase(key, '_')}
                            {' '}
                        </td>
                        <td className='value'>
                            {' '}
                            {createTableValue(key, value)}
                            {' '}
                        </td>
                    </tr>
                </tbody>
            ))
        }
    </table>
);

// Annotation component
const Annotation = ({ data }) => (
    <AnnotationStyle>
        <h2> Annotations </h2>
        {createTable(data)}
    </AnnotationStyle>
);

export default Annotation;

// Annotation component propTypes
Annotation.propTypes = {
    data: PropTypes.shape({
        class: PropTypes.string,
        class_name: PropTypes.string,
        drug_id: PropTypes.number,
        drug_name: PropTypes.string,
        pubchemid: PropTypes.string,
        standard_name: PropTypes.string,
        targets: PropTypes.string,
        treatment_type: PropTypes.string,
    }),
};
