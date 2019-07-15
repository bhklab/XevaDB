import React from 'react';
import { HeatMap, Oncoprint, TumorGrowthCurve, DonutTissue, DonutDrug, Home} from './Components/index';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/maps" exact component={HeatMap}></Route>
        <Route path="/maps" exact component={Oncoprint}></Route>
        <Switch>
          <Route path="/curve" exact component={TumorGrowthCurve}></Route>
          <Route path='/donut_tissue' exact component={DonutTissue}></Route>
          <Route path='/donut_drug' exact component={DonutDrug}></Route>
          <Route path='/' exact component={Home}></Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
