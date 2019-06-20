import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';

class TumorGrowthCurve extends React.Component {

    constructor(props) {
        super(props)
        //setting states for the data.
        this.state = {
            data : []
        }
        //binding the functions declared.
        this.TumorGrowthCurve = this.TumorGrowthCurve.bind(this);
        this.getParams = this.getParams.bind(this)
        this.norm = this.norm.bind(this)
        this.dataParse = this.dataParse.bind(this)
    }

    //get the parameters and set the values in the variables.
    getParams() {
        const params = new URLSearchParams(this.props.location.search)
        let patient_param = params.get('patient');
        let drugid_param = params.get('drug_id');

        return {patient_param: patient_param, drugid_param: drugid_param}
    }

    // unity normalization
    norm(value, first) {
        return (value/first) - 1 
    }

    // filters by batch - comment out the batch lines for full data
    // call this command to create a curve!!!
    dataParse(data) {
        let data_formatted = []
        let batch_select = data[1]["patient_id"]
        let batches = []

        // loop throuth the data and set the values in the variable.
        for (let i = 0; i < data.length; i++) {
            batches.push(data[i]["patient_id"])
            if (data[i]["patient_id"] === batch_select) {
                if (data[i]["time"] === 0) {
                    let exp_type = ""
                    //this is used to set the value of exp_type.
                    if(data[i]["drug"] === "untreated") { 
                        exp_type = "control" 
                    } 
                    else { 
                        exp_type = "treatment" 
                    }
                    var new_datapt = {
                        exp_type: exp_type,
                        batch: data[i]["patient_id"],
                        model: data[i]["model_id"],
                        drug: data[i]["drug"],
                        pdx_points: [{
                            times: [parseInt(data[i]["time"])],
                            volumes: [parseInt(data[i]["volume"])]
                        }],
                        pdx_json: [{
                            model: data[i]["model_id"].replace(/\./g,' ').replaceAll(" ", "-"),
                            batch: data[i]["patient_id"],
                            exp_type: exp_type,
                            time: parseInt(data[i]["time"]),
                            volume: parseInt(data[i]["volume"])
                        }]
                        
                    }
                    data_formatted.push(new_datapt)
                } 
                else {
                    if (data[i]["time"] <= 70) {
                        data_formatted[data_formatted.length - 1].pdx_points[0].times.push(parseInt(data[i]["time"]))
                        data_formatted[data_formatted.length - 1].pdx_points[0].volumes.push(parseInt(data[i]["volume"]))
                        data_formatted[data_formatted.length - 1].pdx_json.push(
                            {
                                model: data[i]["model_id"],
                                batch: data[i]["patient_id"],
                                exp_type: data[i]["exp.type"],
                                time: parseInt(data[i]["time"]),
                                volume: parseInt(data[i]["volume"])
                            }
                        )
                    }
                }
            }
        }

        //normalizing
        for (var i = 0; i < data_formatted.length; i++) {
            var item = data_formatted[i]
            var first = item.pdx_points[0].volumes[0]
            for (var j = 0; j < item.pdx_points[0].volumes.length; j++) {
                data_formatted[i].pdx_points[0].volumes[j] = this.norm(item.pdx_points[0].volumes[j], first)
                data_formatted[i].pdx_json[j].volume = item.pdx_points[0].volumes[j]
            }
        }
        this.setState({ data: data_formatted})
    }

    componentDidMount() {
        let patient_param = this.getParams().drugid_param
        let drugid_param = this.getParams().patient_param
        axios.get(`http://localhost:5000/api/v1/treatment?drug=${patient_param}&patient=${drugid_param}`)
             .then(response => {
                this.dataParse(response.data);
             })
        this.TumorGrowthCurve()
    }

    componentDidUpdate() {
        this.TumorGrowthCurve()
    }

    // Grab the states, node access and pass it to the main function.
    TumorGrowthCurve() {
        const node = this.node;
        let data = this.state.data
        this.makeTumorGrowthCurve(this.state.data, node)
    }

    // This is the main function to create Growth curves.

    makeTumorGrowthCurve(node) {
        this.node = node
        String.prototype.replaceAll = String.prototype.replaceAll || function(s, r) {
            return this.replace(new RegExp(s, 'g'), r);
        }

        // unique function
        // usage: var a = [1,2,3,4]; unique = a.filter(unique);
        function unique(value, index, self) { 
            return self.indexOf(value) === index;
        }

        // get the union set of all timepoints for the means
        // until the last timepoint of the shortest graph
        // returns [ [control] , [treatment] ]
        function getUnionOfTimepoints(data) {
            var control = []
            var treatment = []
            var minControl = data[0].pdx_points[0].times[data[0].pdx_points[0].times.length - 1]; 
            var minTreatment = data[0].pdx_points[0].times[data[0].pdx_points[0].times.length - 1]; 

            // merging time point arrays, and then unique
            for (var i = 0; i < data.length; i++) {
                var temp = data[i].pdx_points[0].times;
                if (data[i].exp_type == "control") {
                    control = control.concat(temp)
                    minControl = temp[temp.length - 1] < minControl ? temp[temp.length - 1] : minControl
                } else {
                    treatment = treatment.concat(data[i].pdx_points[0].times)
                    minTreatment = temp[temp.length - 1] < minTreatment ? temp[temp.length - 1] : minTreatment
                }
            }

            // unique, sort, and cut off at the last timepoint of shortest graph
            control = control.filter(unique).sort(function (a, b) {  return a - b;  });
            var index = control.indexOf(minControl)
            control = control.slice(0, index + 1)

            treatment = treatment.filter(unique).sort(function (a, b) {  return a - b;  });
            index = treatment.indexOf(minTreatment)
            treatment = treatment.slice(0, index + 1)

            return [control, treatment] 
        }

    }

    render() {
        return (
            <svg ref = {node => this.node = node} width={1500} height={1200}>
            </svg>
        )
    }
}

export default TumorGrowthCurve;