import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DonutChart from '../DonutChart/DonutChart';
import Footer from '../Footer/Footer';
import GlobalStyles from '../../GlobalStyles';
import TopNav from '../TopNav/TopNav';
import DatasetTable from '../Dataset/DatasetTable';
import colors from '../../styles/colors';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 200px;
    color: ${colors.blue_header};
    margin-bottom: 100px;

    h1 {
        font-family:'Raleway', sans-serif;
        font-weight:700;
        text-align:center;
    }
`;

class DatasetSummary extends React.Component {
    static parseDataset(dataset) {
        if (dataset === 'SU2C UHN (Breast Cancer)') {
            return 'UHN (Breast Cancer)';
        }
        if (dataset === 'SU2C McGill (Breast Cancer)') {
            return 'McGill (Breast Cancer)';
        }
        return dataset;
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dimensions: {},
            margin: {},
            arc: {},
        };
    }

    componentDidMount() {
        axios.get('/api/v1/dataset/models', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                const data = response.data.data.map((element) => ({
                    id: DatasetSummary.parseDataset(element.dataset_name),
                    value: element.patient_id,
                    parameter: element.dataset_id,
                    totalModels: element.totalModels,
                }));
                this.setState({
                    data,
                    dimensions: { width: 650, height: 250 },
                    margin: {
                        top: 320, right: 100, bottom: 100, left: 380,
                    },
                    arc: { outerRadius: 260, innerRadius: 150 },
                });
            });
    }

    render() {
        const {
            data, arc,
            dimensions, margin,
        } = this.state;
        return (
            <div>
                <TopNav />
                <GlobalStyles />
                <Wrapper>
                    <div className="donut-wrapper">
                        <h1> Number of Patients Per Dataset </h1>
                        <DonutChart
                            dimensions={dimensions}
                            margin={margin}
                            data={data}
                            arcRadius={arc}
                            chartId="donut_datasets"
                        />
                    </div>
                    <div className="donut-wrapper">
                        <DatasetTable
                            data={data}
                            dataLength={data.length}
                        />
                    </div>
                </Wrapper>
                <Footer />
            </div>
        );
    }
}

export default DatasetSummary;
