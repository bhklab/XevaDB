import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { select, selectAll } from 'd3';
import StyleComponent from './TissueStyle';
import Spinner from '../../Utils/Spinner';
import Footer from '../../Footer/Footer';
import GlobalStyles from '../../../GlobalStyles';
import HumanBody from '../../../images/human.png';
import Breast from '../../../images/breast.png';
import LargeIntestine from '../../../images/largeintestine.png';
import Lung from '../../../images/lung.png';
import Liver from '../../../images/liver.png';
import Pancreas from '../../../images/pancreas.png';
import Skin from '../../../images/skin.png';
import TissueTable from './TissueTable';
import colors from '../../../styles/colors';
import createToolTip from '../../../utils/ToolTip';

// mouse over event on the images.
const imageMouseOverEvent = (event, data) => {
    const toolTip = select('#tooltip')
        .style('visibility', 'visible')
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY + 10}px`)
        .style('color', `${colors.black}`)
        .style('background-color', `${colors.white}`);

    const tooltipData = [
        `Tissue: ${data.tissue}`,
        `Dataset Count: ${data.dataset_count}`,
        `Patient Count: ${data.patient_count}`,
        `Model Count: ${data.model_count}`,
        `Drug Count: ${data.drug_count}`,
    ];
    toolTip.selectAll('textDiv')
        .data(tooltipData)
        .enter()
        .append('div')
        .attr('id', 'tooltiptext')
        .html((d) => {
            const text = d.split(':');
            return `<b>${text[0]}</b>: ${text[1]}`;
        })
        .attr('x', `${event.pageX + 10}px`)
        .attr('y', (d, i) => (`${event.pageY + 10 + i * 10}px`));
};

// text mouse out event.
const imageMouseOutEvent = () => {
    select('#tooltip')
        .style('visibility', 'hidden');
    // remove all the divs with id tooltiptext.
    selectAll('#tooltiptext').remove();
};

// transform data.
const transformData = (data) => {
    const transformedData = {};

    data.forEach((element) => {
        const tissue = transformedData[element.tissue_name];

        if (tissue && !tissue.patients.includes(element.patient)) {
            tissue.patient_count += 1;
            tissue.patients.push(element.patient);
        }
        if (tissue && !tissue.drugs.includes(element.drug_name)) {
            tissue.drug_count += 1;
            tissue.drugs.push(element.drug_name);
        }
        if (tissue && !tissue.models.includes(element.model)) {
            tissue.model_count += 1;
            tissue.models.push(element.model);
        } if (tissue && !tissue.datasets.includes(element.dataset_name)) {
            tissue.dataset_count += 1;
            tissue.datasets.push(element.dataset_name);
        } else if (!tissue) {
            transformedData[element.tissue_name] = {
                tissue: element.tissue_name,
                tissue_id: element.tissue_id,
                patients: [element.patient],
                models: [element.model],
                drugs: [element.drug_name],
                datasets: [element.dataset_name],
                patient_count: 1,
                model_count: 1,
                drug_count: 1,
                dataset_count: 1,
            };
        }
    });
    return transformedData;
};

// tissue summary component.
const TissueSummary = () => {
    const [tissueData, setTissueData] = useState([]);
    const [loading, setLoader] = useState(true);

    const fetchData = async () => {
        // api request to get the required data.
        const modelInformation = await axios.get('/api/v1/modelinformation', { headers: { Authorization: localStorage.getItem('user') } });
        // transforming data.
        transformData(modelInformation.data.data);
        setTissueData(Object.values(transformData(modelInformation.data.data)));
        setLoader(false);
    };

    useEffect(() => {
        fetchData();

        // create tooltip.
        createToolTip('tissue-summary-tooltip');
    }, []);

    return (
        <div>
            <GlobalStyles />
            <div className="wrapper">
                <div className="component-wrapper">
                    <StyleComponent>
                        <h1> PDXs Per Tissue Type </h1>
                        <img src={HumanBody} alt="Human Body" style={{ paddingBottom: '20px' }} />
                        <div>
                            <div>
                                <img
                                    src={Breast}
                                    alt="Breast"
                                    onMouseOver={(event) => imageMouseOverEvent(event, tissueData[0])}
                                    onFocus={(event) => imageMouseOverEvent(event, tissueData[0])}
                                    onMouseOut={() => imageMouseOutEvent()}
                                    onBlur={() => imageMouseOutEvent()}
                                />
                            </div>
                            <div>
                                <img
                                    src={Skin}
                                    alt="Skin"
                                    onMouseOver={(event) => imageMouseOverEvent(event, tissueData[2])}
                                    onFocus={(event) => imageMouseOverEvent(event, tissueData[2])}
                                    onMouseOut={() => imageMouseOutEvent()}
                                    onBlur={() => imageMouseOutEvent()}
                                />
                            </div>
                            <div>
                                <img
                                    src={Lung}
                                    alt="Lung"
                                    onMouseOver={(event) => imageMouseOverEvent(event, tissueData[4])}
                                    onFocus={(event) => imageMouseOverEvent(event, tissueData[4])}
                                    onMouseOut={() => imageMouseOutEvent()}
                                    onBlur={() => imageMouseOutEvent()}
                                />
                            </div>
                            <div>
                                <img
                                    src={Liver}
                                    alt="Liver"
                                    onMouseOver={(event) => imageMouseOverEvent(event, tissueData)}
                                    onFocus={(event) => imageMouseOverEvent(event, tissueData)}
                                    onMouseOut={() => imageMouseOutEvent()}
                                    onBlur={() => imageMouseOutEvent()}
                                />
                            </div>
                            <div>
                                <img
                                    src={Pancreas}
                                    alt="Pancreas"
                                    onMouseOver={(event) => imageMouseOverEvent(event, tissueData[5])}
                                    onFocus={(event) => imageMouseOverEvent(event, tissueData[5])}
                                    onMouseOut={() => imageMouseOutEvent()}
                                    onBlur={() => imageMouseOutEvent()}
                                />
                            </div>
                            <div>
                                <img
                                    src={LargeIntestine}
                                    alt="LargeIntenstine"
                                    onMouseOver={(event) => imageMouseOverEvent(event, tissueData[1])}
                                    onFocus={(event) => imageMouseOverEvent(event, tissueData[1])}
                                    onMouseOut={() => imageMouseOutEvent()}
                                    onBlur={() => imageMouseOutEvent()}
                                />
                            </div>
                        </div>
                    </StyleComponent>
                </div>
                <div className="component-wrapper">
                    <h1> List of Tissues </h1>
                    {
                        loading
                            ? (
                                <div className='center-component'>
                                    <Spinner loading={loading} />
                                </div>
                            )
                            : <TissueTable data={tissueData} />
                    }
                </div>
            </div>
            <div id="tissue-summary-tooltip" />
            <Footer />
        </div>
    );
};

export default TissueSummary;
