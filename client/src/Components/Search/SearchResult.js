import React, {Fragment} from 'react'
import SearchResultOncoprint from './SearchResultOncoprint'
import SearchResultHeatMap from './SearchResultHeatMap'

class SearchResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            drug_param : '',
            dataset_param : '',
            gene_param : ''
        }
    }

    componentWillMount() {
        let params = new URLSearchParams(this.props.location.search);
        let drug = params.get('drug')
        let dataset = params.get('dataset')
        let gene = params.get('genes')
        this.setState({
            drug_param : drug,
            dataset_param : dataset,
            gene_param: gene
        })
    }
       
    render() {
        return (
            <Fragment>
                <div className="wrapper" style={{margin:"auto", fontSize:"0"}}>
                    <SearchResultHeatMap 
                        drug_param = {this.state.drug_param} 
                        dataset_param = {this.state.dataset_param}
                    />
                    <SearchResultOncoprint 
                        gene_param = {this.state.gene_param} 
                        dataset_param = {this.state.dataset_param} 
                    />
                </div>
            </Fragment>

        )
    }
}



export default SearchResult