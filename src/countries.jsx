import React, { Component } from 'react';
import DataService from './data-service';
import { Container } from 'react-bootstrap';
import "list.js";
import List from 'list.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons'

export default class Countries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countries: DataService.getCountriesSummaryData()
        };
    }

    componentDidMount() {
        var options = {
            valueNames: ['name', 'confirmedTotal', 'confirmedNew', 'deathsTotal', 'deathsNew', 'recoveredTotal', 'recoveredNew']
        };

        var countriesList = new List('countries', options);
    }

    render() {


        return (
            <Container id="countries">
                <table className="table table-hover table-condensed">
                    <thead>
                        <tr>
                            <th><input className="search" placeholder="Filter" /></th>
                            <th colSpan="2">Confirmed</th>
                            <th colSpan="2">Deaths</th>
                            <th colSpan="2">Recovered</th>
                        </tr>
                        <tr>
                            <td className="sort" data-sort="name">Country <FontAwesomeIcon icon={faSort} /></td>
                            <td className="text-right sort" data-sort="confirmedTotal">Total <FontAwesomeIcon icon={faSort} /></td>
                            <td className="text-right sort" data-sort="confirmedNew">New <FontAwesomeIcon icon={faSort} /></td>
                            <td className="text-right sort" data-sort="deathsTotal">Total <FontAwesomeIcon icon={faSort} /></td>
                            <td className="text-right sort" data-sort="deathsNew">New <FontAwesomeIcon icon={faSort} /></td>
                            <td className="text-right sort" data-sort="recoveredTotal">Total <FontAwesomeIcon icon={faSort} /></td>
                            <td className="text-right sort" data-sort="recoveredNew">New <FontAwesomeIcon icon={faSort} /></td>
                        </tr>
                    </thead>
                    <tbody className="list">
                        {
                            this.state.countries.map((country, index) =>
                                <tr key={index}>
                                    <td className="text-left name"><a href={"#/" + country.name} target="_blank">{country.name}</a></td>
                                    <td className="text-right confirmedTotal">{country.confirmed.total}</td>
                                    <td className="text-right confirmedNew">{country.confirmed.new}</td>
                                    <td className="text-right deathsTotal">{country.deaths.total}</td>
                                    <td className="text-right deathsNew">{country.deaths.new}</td>
                                    <td className="text-right recoveredTotal">{country.recovered.total}</td>
                                    <td className="text-right recoveredNew">{country.recovered.new}</td>
                                </tr>)
                        }
                    </tbody>
                </table>

            </Container>
        )
    }
}