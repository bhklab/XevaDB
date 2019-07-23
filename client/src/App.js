import React from 'react';
import { HeatMapData, OncoprintData, TumorGrowthCurve, DonutTissue, 
          DonutDrug, Home, CounterNav, Documentation} from './Components/index';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {

  render() {
    return (

      <Router>
        <Route path="/maps" exact component={HeatMapData}></Route>
        <Route path="/maps" exact component={OncoprintData}></Route>
        <Switch>
          <Route path="/curve" exact component={TumorGrowthCurve}></Route>
          <Route path="/documentation" exact component={Documentation}></Route>
          <Route path='/donut_tissue' exact component={DonutTissue}></Route>
          <Route path='/donut_drug' exact component={DonutDrug}></Route>
          <Route path='/' exact component={Home}></Route>
          <Route path='/home' exact component={CounterNav}></Route>
        </Switch>
      </Router>
      
    )
  }

}

export default App;
