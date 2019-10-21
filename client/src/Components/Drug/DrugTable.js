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
          accessor: 'drug_name',
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
          Header: 'Targets',
          accessor: 'class',
          minWidth: 150
        },
        {
          Header: 'Class',
          accessor: 'class_name',
          minWidth: 230
        },
        {
          Header: 'Source',
          accessor: '      row.ImgPath = "https://media4.s-nbcnews.com/j/newscms/2016_36/1685951/ss-160826-twip-05_8cf6d4cb83758449fd400c7c3d71aa1f.nbcnews-ux-2880-1000.jpg"          ',
        }
      ]
      
        return (
          <Fragment>
            <h1 style = {h1Style}> Drug Table </h1>
            <TableWrapper className='wrap'>
              <ReactTable
                data = {data}
                columns = {columns}
                className = '-highlight'
                defaultPageSize = {10}
                filterable
              /> 
            </TableWrapper>         
          </Fragment>
        )
    }

}
 
export default DrugTable