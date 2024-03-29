/* eslint-disable react/prefer-stateless-function */
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
    Biomarker,
    CounterNav,
    CurveComponent,
    Dataset,
    DatasetSummary,
    Documentation,
    Drug,
    DrugSummary,
    DrugResponse,
    // Footer,
    // HeatMapData,
    Home,
    Login,
    Patient,
    PatientSummary,
    // OncoprintData,
    SearchResult,
    StatTable,
    Tissue,
    TissueSummary,
    TopNav,
} from './Components/index';

// const Merge = () => (
//     <>
//         <HeatMapData />
//         <OncoprintData />
//         <Footer />
//     </>
// );

const App = () => {
    // Google Analytics setup.
    useEffect(() => {
        ReactGA.initialize('UA-102362625-5');
        // To Report Page View
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);

    useEffect(() => {
        console.log(window.location.pathname);
    });

    return (
        <div>
            <Router>
                <Route
                    path='/'
                    render={(props) => props.location.pathname !== '/login' && (<TopNav />)}
                />
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/biomarker' exact component={Biomarker} />
                    <Route path='/curve' exact component={CurveComponent} />
                    <Route path='/datasets' exact component={DatasetSummary} />
                    <Route path='/dataset/:id' exact component={Dataset} />
                    <Route path='/doc' exact component={Documentation} />
                    <Route path='/drugs' exact component={DrugSummary} />
                    <Route path='/drug/:id' exact component={Drug} />
                    <Route path='/response' exact component={DrugResponse} />
                    <Route path='/home' exact component={CounterNav} />
                    <Route path='/login' exact component={Login} />
                    {/* <Route path='/maps' exact component={Merge} /> */}
                    <Route path='/patient/:id' exact component={Patient} />
                    <Route path='/patients' exact component={PatientSummary} />
                    <Route path='/search' exact component={SearchResult} />
                    <Route path='/tissues' exact component={TissueSummary} />
                    <Route path='/tissue/:id' exact component={Tissue} />
                    <Route path='/stat' exact component={StatTable} />
                    <Route render={() => <h1> 404 Error </h1>} />
                </Switch>
            </Router>
        </div>
    );
};

export default App;
