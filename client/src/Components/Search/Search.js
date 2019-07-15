import React from 'react'
import styled from 'styled-components'


const StyleBar = styled.div`
   div {
        color: #bd0808;
        text-align: center;
        line-height: 0.4;
        margin-top: 150px;
   } 
`

class Search extends React.Component {
    render() {
        return (
            <StyleBar>
            <div>
                <h1> XevaDB </h1>
                <h2> A Database for PDX pharmacogenomic data </h2>
            </div>
            </StyleBar>
        )
    }
}

export default Search