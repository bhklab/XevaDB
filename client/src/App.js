import React, {Fragment} from 'react'
import {  CounterNav,
          Documentation,
          DrugTable,
          Drug,
          DrugSearch,
          Footer,
          HeatMapData,
          Home,
          OncoprintData,
          Tissue,
          TopNav,
          TumorGrowthCurve } from './Components/index'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import bgImg from './images/bgImg7.png';
import { createGlobalStyle } from 'styled-components';



const GlobalStyles = createGlobalStyle`
  #root {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    background: linear-gradient(
      to right top,
      rgba(255, 255, 255, 0.3), 
      rgba(255, 255, 255, 0.3)
    ),url('${bgImg}');
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      font-family:'Raleway', sans-serif;
      font-weight:700;
      text-align:center;
      color: #3453b0;
    }
  }

  .heatmap-wrapper, .doc-wrapper {
    margin-top: 200px;
  }

  .oprint-wrapper {
    margin-bottom:100px;
  }

  .heatmap-wrapper, .oprint-wrapper, .curve-wrapper,
  .donut-wrapper, .doc-wrapper { //put all wrappers here and wrap them with wrapper
    background:white;
    font-family:Arial;
  }

  .donut-wrapper {
    margin-bottom:20px;
    min-width:1300px;
  }

  .heatmap, .oprint {
    height:700px;
    overflow:auto;
  }

  .curve-wrapper {
    min-width:1300px;

    a {
      text-decoration:none;
      font-size:16px;
      padding:20px;
      font-family: 'Raleway', sans-serif;
      color: #3453b0;
    }
  }
`

const Merge = () => {
    return (
      <Fragment>
        <HeatMapData/>
        <OncoprintData/>
        <Footer/>
      </Fragment>
    )
}


class App extends React.Component {
  render() {
    return (
      <Fragment>
        <Router>
          <GlobalStyles />
          <TopNav/>
          <Switch>
            <Route path='/' exact component={Home}></Route>
            <Route path="/curve" exact component={TumorGrowthCurve}></Route>
            <Route path='/doc' exact component={Documentation}></Route>
            <Route path='/drugs' exact component={Drug}></Route>
            <Route path="/drug/:id" exact component={DrugTable}></Route>
            <Route path='/home' exact component={CounterNav}></Route>
            <Route path="/maps" exact component={Merge}></Route>
            <Route path="/search" exact component={DrugSearch}></Route>
            <Route path='/tissues' exact component={Tissue}></Route>
            <Route render = { () => <h1> 404 Error </h1> } />
          </Switch>
        </Router>
      </Fragment>
    )
  }
}


export default App
