import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import colors from '../../../styles/colors';
import convertToTitleCase from '../../../utils/ConvertToTitleCase';
import pubchemURL from '../../../utils/PubChemURL';


// styles for annotation
const AnnotationStyle = styled.div`
    box-sizing: border-box;
    margin: 100px;
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    h2 {
        color: ${colors.pink_header};
        font-size: 1.75rem;
        margin: 0 0 5px 0;
    };
    
    .key {
        color: ${colors.blue_header};
        font-size: 1.20rem;
        font-weight: 600;
    }

    .value {
        color: ${colors.moderate_blue};
        font-size: 1.1rem;
    }

    table, .key, .value {
        border: 1.5px ${colors.fade_blue} solid;
    }
    
    .key, .value {
        padding: 6px;
    }
`;


/**
 * 
 * @param {Object} data - input object 
 * @returns {Object} - creates the table with the input data
 */
const createTable = (data) => {
    return (
        <table>
            {
                Object.entries(data).map(([key, value]) => (
                    <tbody key={value}>
                        <tr className='table-row'>
                            <td className='key'> {convertToTitleCase(key, '_')} </td>
                            <td className='value'> {value} </td>
                        </tr>
                    </tbody>
                ))
            }
        </table >
    )
};

// Annotation component
const Annotation = ({ data }) => {
    return (
        <AnnotationStyle>
            <h2> Annotations </h2>
            {createTable(data)}
        </AnnotationStyle>
    )
};


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
    })
};
