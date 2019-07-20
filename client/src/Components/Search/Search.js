import React from 'react'
import StyleBar from './SearchStyle'


class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log(event.target.value)
        this.setState({value: event.target.value});
    }


    render() {
        return (
            <StyleBar>
            <div>
                <h1> XevaDB: A Database For PDX Pharmacogenomic Data </h1>
                <form>
                    <input type="text" onChange={this.handleChange} placeholder="Search..."></input>
                </form>
            </div>
            </StyleBar>
        )
    }
}

export default Search