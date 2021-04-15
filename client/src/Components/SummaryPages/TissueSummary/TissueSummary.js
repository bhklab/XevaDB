import React from 'react';
import axios from 'axios';
import StyleComponent from './TissueStyle';
import Footer from '../../Footer/Footer';
import GlobalStyles from '../../../GlobalStyles';
import HumanBody from '../../../images/human.png';
import Breast from '../../../images/breast.png';
import LargeIntestine from '../../../images/largeintestine.png';
import Lung from '../../../images/lung.png';
import Liver from '../../../images/liver.png';
import Pancreas from '../../../images/pancreas.png';
import Skin from '../../../images/skin.png';


class TissueSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
        };
    }

    componentDidMount() {
        const newValues = [];
        axios.get('/api/v1/tissue/models', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                response.data.data.forEach((data) => {
                    const value = {};
                    value.id = data.tissue_name;
                    value.value = data.total;
                    newValues.push(value);
                });
                this.setState({
                    data: newValues,
                    loading: false,
                });
            });
    }


    render() {
        return (
            <div>
                <GlobalStyles />
                <div className="wrapper">
                    <div className="tissue-wrapper">
                        <StyleComponent>
                            <h1> PDXs Per Tissue Type </h1>
                            <img src={HumanBody} alt="Human Body" />
                            <div>
                                <img src={Breast} alt="Breast" />
                                <img src={Skin} alt="Skin" />
                                <img src={Lung} alt="Lung" />
                                <img src={Liver} alt="Liver" />
                                <img src={Pancreas} alt="Pancreas" />
                                <img src={LargeIntestine} alt="LargeIntenstine" />
                            </div>
                        </StyleComponent>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default TissueSummary;
