import React, { Component } from 'react';
import './App.css';
import { Route, Switch, HashRouter } from 'react-router-dom';
import Countries from './countries';
import Country from './country';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <HashRouter basename='/covid-19'>
          <Switch>
            <Route exact path={'/'} component={Countries} />
            <Route path={'/:countryName'} component={Country} />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}
