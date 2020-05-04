import React, { Component } from 'react';
import DataService from './data-service';
import { Container, Card, CardDeck, Row, Col } from 'react-bootstrap';
import "list.js";
import List from 'list.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import Utils from './utils';
import { AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip, Legend, BarChart, Bar, ResponsiveContainer, LineChart, Line, ComposedChart, CartesianAxis } from 'recharts';

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
        var data = DataService.getCountriesVerboseData()
        var totalConfirmed = 0;
        var totalActive = 0;
        var totalRecovered = 0;
        var totalDeceased = 0;
        var totalClosed = 0;

        Object.keys(data).map(function (key) {
            totalConfirmed = totalConfirmed + data[key].summary.confirmed.total;
            totalRecovered = totalRecovered + data[key].summary.recovered.total;
            totalDeceased = totalDeceased + data[key].summary.deaths.total;
            totalClosed = totalClosed + data[key].summary.closed.total;
            totalActive = totalActive + data[key].summary.active.total;
        });

        var colors = ['red', 'blue', 'green', 'black', 'orange', 'brown', 'blueviolet'];


        var chartCountries = ['China', 'Romania', 'Italy', 'Spain', 'Germany', 'France']
        var confirmedTimeline = DataService.getConfirmedTimelines(chartCountries);

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
                            <Card.Header style={{ backgroundColor: Utils.CONFIRMED_COLOR, color: "#333" }}>Confirmed</Card.Header>
                            <Card.Body>
                                <Card.Title>{Utils.formattedNumber(totalConfirmed)}</Card.Title>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header style={{ backgroundColor: Utils.ACTIVE_COLOR, color: "#333" }}>Active</Card.Header>
                            <Card.Body>
                                <Card.Title>{Utils.formattedNumber(totalActive)}</Card.Title>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header style={{ backgroundColor: Utils.RECOVERED_COLOR, color: "#333" }}>Recovered</Card.Header>
                            <Card.Body>
                                <Card.Title>{Utils.formattedNumber(totalRecovered)}</Card.Title>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header style={{ backgroundColor: Utils.DECEASED_COLOR, color: "#fff" }}>Deceased</Card.Header>
                            <Card.Body>
                                <Card.Title>{Utils.formattedNumber(totalDeceased)}</Card.Title>
                            </Card.Body>
                        </Card>
                    </CardDeck>
                </Container>
                <Container id="charts">
                    <Card>
                        <Card.Header>Total cases</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer height={800}>
                                <LineChart data={confirmedTimeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    {/* <CartesianAxis y={1000, 10000, 100000}/> */}
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    {
                                        chartCountries.map((country, index) =>
                                            <Line key={index} dataKey={country} legendType="square" dot={false} activeDot={true} stroke={colors[index]} />
                                        )
                                    }
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
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
                                        <td className="text-right confirmedTotal">{country.summary.confirmed.total}</td>
                                        <td className="text-right confirmedNew">{country.summary.confirmed.new}</td>
                                        <td className="text-right deathsTotal">{country.summary.deaths.total}</td>
                                        <td className="text-right deathsNew">{country.summary.deaths.new}</td>
                                        <td className="text-right recoveredTotal">{country.summary.recovered.total}</td>
                                        <td className="text-right recoveredNew">{country.summary.recovered.new}</td>
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