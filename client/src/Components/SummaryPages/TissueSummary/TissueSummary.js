import React, { useEffect, useState } from 'react';
import axios from 'axios';
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


const TissueSummary = () => {
    const [tissueData, setTissueData] = useState([]);
    const [loading, setLoader] = useState(true);

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
            } else if (!tissue) {
                transformedData[element.tissue_name] = {
                    tissue: element.tissue_name,
                    tissue_id: element.tissue_id,
                    patients: [element.patient],
                    models: [element.model],
                    drugs: [element.drug_name],
                    patient_count: 1,
                    model_count: 1,
                    drug_count: 1,
                };
            }
        });

        return transformedData;
    };


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
    }, []);

    return (
        <div>
            <GlobalStyles />
            <div className="wrapper">
                <div className="tissue-wrapper">
                    <StyleComponent>
                        <h1> PDXs Per Tissue Type </h1>
                        <img src={HumanBody} alt="Human Body" />
                        <div>
                            <div>
                                <img src={Breast} alt="Breast" />
                            </div>
                            <div>
                                <img src={Skin} alt="Skin" />
                            </div>
                            <div>
                                <img src={Lung} alt="Lung" />
                            </div>
                            <div>
                                <img src={Liver} alt="Liver" />
                            </div>
                            <div>
                                <img src={Pancreas} alt="Pancreas" />
                            </div>
                            <div>
                                <img src={LargeIntestine} alt="LargeIntenstine" />
                            </div>
                        </div>
                    </StyleComponent>
                </div>
                <div className="summary-table">
                    {loading ? <Spinner loading={loading} /> : <TissueTable data={tissueData} />}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TissueSummary;
