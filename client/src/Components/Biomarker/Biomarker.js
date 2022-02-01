import React from 'react';
import GlobalStyles from '../../GlobalStyles';
import ForestPlot from '../Plots/ForestPlot';
import data from './data';


const Biomarker = () => {
    return (
        <>
            <GlobalStyles />
            <div className='wrapper'>
                <div className="donut-wrapper">
                    <h1> Biomarker </h1>
                    <ForestPlot data={data.gctd} />
                </div>
            </div>
        </>
    )
};

export default Biomarker;
