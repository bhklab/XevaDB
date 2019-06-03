import React from 'react';
import './App.css';
import HeatMap from './Components/HeatMap';
import Oncoprint from './Components/Oncoprint';
import 'bootstrap/dist/css/bootstrap.min.css'

class App extends React.Component {
  render() {
  return (
     <div>
        <HeatMap/>
        <Oncoprint/>
     </div>
  )
  }
}

export default App;
