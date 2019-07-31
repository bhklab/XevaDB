import React from 'react'
import axios from 'axios'
import ReactTable from 'react-table'
import 'react-table/react-table.css'


class DrugTable extends React.Component {

    constructor(props) {
      super(props) 
      //setting the states for the data.
      this.state = {
        data: []
      }
    }

    componentDidMount() {
      axios.get(`http://localhost:5000/api/v1/drugtable`)
            .then(response => {
                this.setState ({
                  data: response.data
                })
            })
    }

    render() {
      const data = this.state.data

      const columns = [
        {
          Header: 'Drug',
          accessor: 'drug_id',
        }, 
        {
          Header: 'StandardName',
          accessor: 'standard_name',
        }, 
        {
          Header: 'Targets',
          accessor: 'targets',
        },
        {
          Header: 'TreatmentType',
          accessor: 'treatment_type',
        },
        {
          Header: 'PubchemID',
          accessor: 'pubchemId',
        },
        {
          Header: 'Class',
          accessor: 'class',
        },
        {
          Header: 'ClassName',
          accessor: 'class_name',
        },
        {
          Header: 'Source',
          accessor: 'source',
        }
      ]
      
        return (
          <ReactTable
            data={data}
            columns={columns}
          /> 
        )
    }

}
 
export default DrugTable