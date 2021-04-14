import React from 'react';
import axios from 'axios';
import DonutChart from '../Plots/DonutChart';
import Spinner from '../Utils/Spinner';
import Footer from '../Footer/Footer';
import GlobalStyles from '../../GlobalStyles';
import HumanBody from '../../images/human.png';

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
                    <div className="patient-wrapper">
                        <h1> PDXs Per Tissue Type </h1>
                        <img src={HumanBody} alt="Human Body" />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default TissueSummary;
