import React from 'react';
import { HeatMap, Oncoprint, TumorGrowthCurve, DonutChart, AttributesDonut } from './Components/index';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={HeatMap}></Route>
        <Route path="/" exact component={Oncoprint}></Route>
        <Switch>
          <Route path="/curve" exact component={TumorGrowthCurve}></Route>
          <Route path='/donut' exact component={AttributesDonut}></Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
