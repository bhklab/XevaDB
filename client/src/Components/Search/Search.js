import React from 'react'
import styled from 'styled-components'


const StyleBar = styled.div`
   div {
        color: #bd0808;
        text-align: center;
        line-height: 0.4;
        margin-top: 150px;
   } 

   input {
      width: 50%;
      padding: 14px;
      margin: 8px 0;
      box-sizing: border-box;
      border: 2px solid #bd0808;
      border-radius: 4px;
      outline: none;

        :focus {
            background-color: #f6eeee;
        }

        ::placeholder {
            color:  #bd0808;
            font-size: 14px;
        }   
   }

`

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
                <h2> XevaDB </h2>
                <h2> A database for PDX pharmacogenomic data </h2>
                <form>
                    <input type="text" onChange={this.handleChange} placeholder="Search..."></input>
                </form>
            </div>
            </StyleBar>
        )
    }
}

export default Search