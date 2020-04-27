import React, { Component } from 'react';
import './App.css';
import Charts from './Charts'
import confirmedData from './data/confirmed.json';
import recoveredData from './data/recovered.json';
import deathsData from './data/deaths.json';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: this.getCountriesData()
    };
  }

  getCountriesData = () => {
    let countries = confirmedData.map(function (val) {
      return { name: val.country, confirmed: val.total, recovered: {}, deaths: {} };
    })

    countries.forEach(populateCountryData)

    function populateCountryData(item) {
      item.recovered = getCountryData(recoveredData, item.name)
      item.deaths = getCountryData(deathsData, item.name)
    }

    function getCountryData(list, countryName) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].country === countryName) {
          return list[i].total;
        }
      }
    }

    console.log(countries)
    return countries;
  }

  render() {
    return (
      <div className="App">
        <Charts country="Romania"/>
        <div>
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th colSpan="3">Confirmed</th>
                <th colSpan="3">Deaths</th>
                <th colSpan="3">Recovered</th>
              </tr>
              <tr>
                <td></td>
                <td>Total</td>
                <td>New cases</td>
                <td>Growth</td>
                <td>Total</td>
                <td>New cases</td>
                <td>Growth</td>
                <td>Total</td>
                <td>New cases</td>
                <td>Growth</td>
              </tr>
            </thead>
            <tbody>
              {
                this.state.countries.map((country, index) =>
                  <tr key={index}>
                    <td>{country.name}</td>
                    <td>{country.confirmed.total}</td>
                    <td>{country.confirmed.new}</td>
                    <td>{country.confirmed.growth}</td>
                    <td>{country.deaths.total}</td>
                    <td>{country.deaths.new}</td>
                    <td>{country.deaths.growth}</td>
                    <td>{country.recovered.total}</td>
                    <td>{country.recovered.new}</td>
                    <td>{country.recovered.growth}</td>
                  </tr>)
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
