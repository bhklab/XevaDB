import React, {Fragment} from 'react'
import { HeatMapData, OncoprintData, TumorGrowthCurve, DonutTissue, 
          Drug, Home, CounterNav, Documentation, DrugSearch, TopNav, Footer} from './Components/index'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'


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
        <TopNav/>
          <Switch>
            <Route path='/' exact component={Home}></Route>
            <Route path="/maps" exact component={Merge}></Route>
            <Route path="/curve" exact component={TumorGrowthCurve}></Route>
            <Route path="/drug/:id" exact component={DrugSearch}></Route>
            <Route path='/donut_tissue' exact component={DonutTissue}></Route>
            <Route path='/drug' exact component={Drug}></Route>
            <Route path='/home' exact component={CounterNav}></Route>
            <Route path='/doc' exact component={Documentation}></Route>
            <Route render = { () => <h1> 404 Error </h1> } />
          </Switch>
        </Router>
      </Fragment>
    )
  }
}


export default App
