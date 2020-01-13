/* eslint-disable radix */
/* eslint-disable no-extend-native */
/* eslint-disable react/no-deprecated */
/* eslint-disable no-plusplus */
import React from 'react';
import axios from 'axios';
import TumorGrowthCurve from './TumorGrowthCurve';

class GrowthCurveData extends React.Component {
    constructor(props) {
        super(props);
        // setting states.
        this.state = {
            dataFormatted: [],
            patientParam: '',
            drugParam: '',
        };
        // binding the function declarations.
        this.dataParse = this.dataParse.bind(this);
    }

    // get the parameters and set the values in the variables.
    componentWillMount() {
        const { location } = this.props;
        const params = new URLSearchParams(location.search);
        this.setState({
            patientParam: params.get('patient'),
            drugParam: params.get('drug'),
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
        String.prototype.replaceAll = String.prototype.replaceAll || function (s, r) {
            return this.replace(new RegExp(s, 'g'), r);
        };

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
                            model: data[i].model_id.replace(/\./g, ' ').replaceAll(' ', '-'),
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
    }

    render() {
        const { patientParam, drugParam, dataFormatted } = this.state;
        return (
            <div>
                <TumorGrowthCurve
                    patientParam={patientParam}
                    drugParam={drugParam}
                    data={dataFormatted}
                />
            </div>
        );
    }
}


export default GrowthCurveData;
