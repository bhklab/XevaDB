import React from 'react';
import { HeatMap, Oncoprint } from './Components/index';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={HeatMap}></Route>
          <Route path="/" exact component={Oncoprint}></Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
