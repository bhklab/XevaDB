import React from 'react';
import styled from 'styled-components';


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
                    <tr>
                        <td> {key} </td>
                        <td> {value} </td>
                    </tr>
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
