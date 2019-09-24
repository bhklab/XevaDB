import React, {Fragment} from 'react'
import axios from 'axios'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import TableWrapper from './DrugTableStyle'


var h1Style = {
  color: '#3453b0',
  margin: '50px'
}

class DrugTable extends React.Component {

    constructor(props) {
      super(props) 
      //setting the states for the data.
      this.state = {
        data: []
      }
    }

    componentDidMount() {
      axios.get(`/api/v1/drugs`)
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
          minWidth: 180,
          //Cell: props => props.value.toUpperCase(),
          sortable: true
        }, 
        //{
        //  Header: 'StandardName',
        //  accessor: 'standard_name',
        //  minWidth: 180,
        //  Cell: props => props.value.toUpperCase()
        //}, 
        {
          Header: 'TreatmentType',
          accessor: 'treatment_type',
          minWidth: 150
        },
        //{
        //  Header: 'PubchemID',
        //  accessor: 'pubchemId',
        //},
        //{
        //  Header: 'Class',
        //  accessor: 'class',
        //  minWidth: 230
        //},
        {
          Header: 'Class',
          accessor: 'class_name',
          minWidth: 230
        },
        {
          Header: 'Targets',
          accessor: 'targets',
          minWidth: 150
        },
        {
          Header: 'Source',
          accessor: 'source',
        }
      ]
      
        return (
          <Fragment>
            <h1 style = {h1Style}> Drug Table </h1>
            <TableWrapper className='wrap'>
              <ReactTable
                data = {data}
                columns = {columns}
                className = "-highlight"
                defaultPageSize = {10}
                filterable
              /> 
            </TableWrapper>         
          </Fragment>
        )
    }

}
 
export default DrugTable