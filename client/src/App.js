import React, {Fragment} from 'react'
import {    CounterNav,
            Dataset,
            DatasetDonut,
            Documentation,
            DonutDrug,
            DonutTissue,
            DrugTable,
            Footer,
            HeatMapData,
            Home,
            OncoprintData,
            SearchResult,
            TopNav,
            TumorGrowthCurve, } from './Components/index'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import GlobalStyles from './GlobalStyles'



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
            <Route path='/curve' exact component={TumorGrowthCurve}></Route>
            <Route path='/datasets' exact component={DatasetDonut}></Route>
            <Route path='/dataset/:id' exact component={Dataset}></Route>
            <Route path='/doc' exact component={Documentation}></Route>
            <Route path='/drugs' exact component={DonutDrug}></Route>
            <Route path='/drug/:id' exact component={DrugTable}></Route>
            <Route path='/home' exact component={CounterNav}></Route>
            <Route path='/maps' exact component={Merge}></Route>
            <Route path='/search' exact component={SearchResult}></Route>
            <Route path='/tissues' exact component={DonutTissue}></Route>
            <Route render = { () => <h1> 404 Error </h1> } />
          </Switch>
        </Router>
      </Fragment>
    )
  }
}


export default App
