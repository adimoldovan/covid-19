import React, { Component } from 'react';
import DataService from './data-service';
import { Container, Card, CardDeck, Row, Col } from 'react-bootstrap';
import "list.js";
import List from 'list.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons'

export default class Countries extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var options = {
            valueNames: ['name', 'confirmedTotal', 'confirmedNew', 'deathsTotal', 'deathsNew', 'recoveredTotal', 'recoveredNew']
        };

        var countriesList = new List('countries', options);
        countriesList.sort('confirmedTotal', { order: "desc" });
    }

    render() {
        var data = DataService.getCountriesSummaryData()
        var totalConfirmed = 0;
        var totalActive = 0;
        var totalRecovered = 0;
        var totalDeceased = 0;
        var totalClosed = 0;

        Object.keys(data).map(function (key) {
            totalConfirmed = totalConfirmed + data[key].confirmed.total;
            totalRecovered = totalRecovered + data[key].recovered.total;
            totalDeceased = totalDeceased + data[key].deaths.total;
        });


        return (
            <Container>
                <Row className="justify-content-between header">
                    <Col className="text-left"><h1>COVID-19</h1></Col>
                    <Col className="text-right"><a href="https://github.com/CSSEGISandData/COVID-19">data source</a></Col>
                </Row>
                <hr />
                <Container id="summary">
                    <CardDeck>
                        <Card>
                            <Card.Header>Confirmed</Card.Header>
                            <Card.Body>
                                <Card.Title>{totalConfirmed}</Card.Title>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Active</Card.Header>
                            <Card.Body>
                                <Card.Title>{totalConfirmed}</Card.Title>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Recovered</Card.Header>
                            <Card.Body>
                                <Card.Title>{totalRecovered}</Card.Title>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Deceased</Card.Header>
                            <Card.Body>
                                <Card.Title>{totalDeceased}</Card.Title>
                            </Card.Body>
                        </Card>
                    </CardDeck>
                </Container>
                <Container id="countries">
                    <table className="table table-condensed table-hover">
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
                                data.map((country, index) =>
                                    <tr key={index}>
                                        <td className="text-left name"><a href={"#/" + country.name} target="_blank" rel="noopener noreferrer">{country.name}</a></td>
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
                    <div>Data source: <a href="https://github.com/CSSEGISandData/COVID-19">https://github.com/CSSEGISandData/COVID-19</a></div>
                </Container>
            </Container>
        )
    }
}