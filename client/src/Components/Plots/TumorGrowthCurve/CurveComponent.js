import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TumorGrowthCurve from './TumorGrowthCurve';
import Spinner from '../../Utils/Spinner';
import GlobalStyles from '../../../GlobalStyles';
import { StyledCurve } from './CurveStyle';
import colors from '../../../styles/colors';
import StatTable from '../../ResponseStat/ModelResponseStatTable';

class CurveComponent extends React.Component {
    constructor(props) {
        super(props);
        // setting states.
        this.state = {
            dataFormatted: [],
            patientParam: '',
            drugParam: '',
            loading: true,
        };
        // binding the function declarations.
        this.dataParse = this.dataParse.bind(this);
    }

    // get the parameters and set the values in the variables.
    static getDerivedStateFromProps(props) {
        const { location } = props;
        const params = new URLSearchParams(location.search);
        return ({
            patientParam: params.get('patient'),
            drugParam: params.get('drug'),
            datasetParam: params.get('dataset'),
        });
    }

    componentDidMount() {
        const { patientParam, drugParam } = this.state;
        axios.get(`/api/v1/treatment?drug=${drugParam}&patient=${patientParam}`, { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                const batches = [];
                for (let i = 0; i < response.data.length; i++) {
                    batches.push(response.data[i].batch);
                }
                this.dataParse(response.data, batches[0]);
            });
    }

    // filters by batch - comment out the batch lines for full data
    // call this command to create a curve!!!
    dataParse(data, batchSelect) {
        const dataFormatted = [];
        const batches = [];

        // loop throuth the data and set the values in the variable.
        for (let i = 0; i < data.length; i++) {
            batches.push(data[i].batch);
            if (data[i].batch === batchSelect) {
                if (data[i].time === 0) {
                    const newDatapt = {
                        exp_type: data[i].type,
                        batch: data[i].patient_id,
                        model: data[i].model_id,
                        drug: data[i].drug,
                        pdx_points: [{
                            times: [parseInt(data[i].time)],
                            volumes: [parseFloat(data[i].volume)],
                            volume_normals: [parseFloat(data[i].volume_normal)],
                        }],
                        pdx_json: [{
                            model: data[i].model_id.replace(/\./g, ' ').replace(/\s/g, '-'),
                            batch: data[i].patient_id,
                            exp_type: data[i].type,
                            time: parseInt(data[i].time),
                            volume: parseFloat(data[i].volume),
                            volume_normal: parseFloat(data[i].volume_normal),
                        }],

                    };
                    dataFormatted.push(newDatapt);
                } else if (data[i].time <= 200) {
                    dataFormatted[dataFormatted.length - 1].pdx_points[0]
                        .times.push(parseInt(data[i].time));
                    dataFormatted[dataFormatted.length - 1].pdx_points[0]
                        .volumes.push(parseFloat(data[i].volume));
                    dataFormatted[dataFormatted.length - 1].pdx_points[0]
                        .volume_normals.push(parseFloat(data[i].volume_normal));
                    dataFormatted[dataFormatted.length - 1].pdx_json.push(
                        {
                            model: data[i].model_id,
                            batch: data[i].patient_id,
                            exp_type: data[i].type,
                            time: parseInt(data[i].time),
                            volume: parseFloat(data[i].volume),
                            volume_normal: parseFloat(data[i].volume_normal),
                        },
                    );
                }
            }
        }
        this.setState({ dataFormatted });
        this.setState({ loading: false });
    }

    render() {
        const {
            patientParam, drugParam,
            dataFormatted, datasetParam,
            loading,
        } = this.state;
        return (
            <>
                <GlobalStyles />
                {
                    loading
                        ? (
                            <div className='wrapper center-component'>
                                <Spinner loading={loading} />
                            </div>
                        )
                        : (
                            <div className='wrapper'>
                                <StyledCurve>
                                    <div className='growth-curve-wrapper center-component'>
                                        <h1>
                                            Drug:
                                            {' '}
                                            <span>
                                                {' '}
                                                {drugParam.replace(/\s\s\s/g, ' + ').replace(/\s\s/g, ' + ')}
                                            </span>
                                            {' '}
                                            Patient:
                                            {' '}
                                            <span>{patientParam}</span>
                                        </h1>
                                        <TumorGrowthCurve
                                            patientParam={patientParam}
                                            drugParam={drugParam}
                                            datasetParam={datasetParam}
                                            data={dataFormatted}
                                        />
                                        <StatTable patientParam={patientParam} drugParam={drugParam} />
                                    </div>
                                    <div className='growth-curve-wrapper center-component' style={{ marginTop: '20px' }}>
                                        <Link to='/datasets'> ←&nbsp;&nbsp;Back to Datasets </Link>
                                    </div>
                                </StyledCurve>
                            </div>
                        )
                }
            </>
        );
    }
}

export default CurveComponent;
