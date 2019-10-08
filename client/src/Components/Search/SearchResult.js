import React, {Fragment} from 'react'
import SearchResultOncoprint from './SearchResultOncoprint'
import SearchResultHeatMap from './SearchResultHeatMap'

class SearchResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            drug_param : '',
            dataset_param : '',
            gene_param : '',
          //drug_param_for_onco : '',
            genomics_param : '',
            threshold : 0
        }
    }

    componentWillMount() {
        let params = new URLSearchParams(this.props.location.search);
        let genomics = params.get('genomics')
        let drug = params.get('drug')
        let dataset = params.get('dataset')
        let gene = params.get('genes')
        let threshold = params.get('threshold')
        //let drug_for_onco = drug.split(',')[0]
        console.log(threshold)
        this.setState({
            drug_param : drug,
            dataset_param : dataset,
            gene_param : gene,
            //drug_param_for_onco : drug_for_onco,
            genomics_param : genomics,
            threshold : threshold
        })
    }
       
    render() {
        return (
            <Fragment>
                <div className='wrapper' style={{margin:'auto', fontSize:'0'}}>
                    <SearchResultHeatMap 
                        drug_param = {this.state.drug_param} 
                        dataset_param = {this.state.dataset_param}
                    />
                    <SearchResultOncoprint 
                        gene_param = {this.state.gene_param} 
                        dataset_param = {this.state.dataset_param} 
                        //drug_for_onco = {this.state.drug_param_for_onco}
                        genomics_param = {this.state.genomics_param}
                        threshold = {this.state.threshold}
                    />
                </div>
            </Fragment>
        )
    }
}



export default SearchResult