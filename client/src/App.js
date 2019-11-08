/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
    CounterNav,
    Dataset,
    DatasetDonut,
    Documentation,
    DonutDrug,
    DonutTissue,
    DrugTable,
    Footer,
    GrowthCurveData,
    HeatMapData,
    Home,
    Login,
    OncoprintData,
    SearchResult,
    TumorGrowthCurve,
} from './Components/index';


const Merge = () => (
    <div>
        <HeatMapData />
        <OncoprintData />
        <Footer />
    </div>
);


class App extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/curve" exact component={GrowthCurveData} />
                        <Route path="/datasets" exact component={DatasetDonut} />
                        <Route path="/dataset/:id" exact component={Dataset} />
                        <Route path="/doc" exact component={Documentation} />
                        <Route path="/drugs" exact component={DonutDrug} />
                        <Route path="/drug/:id" exact component={DrugTable} />
                        <Route path="/home" exact component={CounterNav} />
                        <Route path="/login" exact component={Login} />
                        <Route path="/maps" exact component={Merge} />
                        <Route path="/search" exact component={SearchResult} />
                        <Route path="/tissues" exact component={DonutTissue} />
                        <Route render={() => <h1> 404 Error </h1>} />
                    </Switch>
                </Router>
            </div>
        );
    }
}


export default App;
