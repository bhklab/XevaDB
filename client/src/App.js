import React from 'react';
import { HeatMap, Oncoprint, TumorGrowthCurve, DonutTissue, DonutDrug } from './Components/index';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={HeatMap}></Route>
        <Route path="/" exact component={Oncoprint}></Route>
        <Switch>
          <Route path="/curve" exact component={TumorGrowthCurve}></Route>
          <Route path='/donut' exact component={DonutTissue}></Route>
          <Route path='/donut_drug' exact component={DonutDrug}></Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
