import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


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
                        <tr>
                            <td> {key} </td>
                            <td> {value} </td>
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
        <>
            <h1> Annotations</h1>
            {createTable(data)}
        </>
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
