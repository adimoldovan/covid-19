import React, { Component } from 'react';
import DataService from './data-service';
import { Container, Card, CardDeck, Row, Col } from 'react-bootstrap';
import "list.js";
import List from 'list.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import Utils from './utils';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, AreaChart, Area, ComposedChart } from 'recharts';

export default class Countries extends Component {
    componentDidMount() {
        var options = {
            valueNames: ['name', 'confirmedTotal', 'confirmedNew', 'deathsTotal', 'deathsNew', 'recoveredTotal', 'recoveredNew']
        };

        var countriesList = new List('countries', options);
        countriesList.sort('confirmedTotal', { order: "desc" });
    }

    render() {
        var data = DataService.getVerboseData()
        var world = data.find(c => c.name === 'World');
        data.pop(world);

        var activeRate = (world.summary.active.total / world.summary.confirmed.total * 100).toFixed(1);
        var recoveredRateTotal = (world.summary.recovered.total / world.summary.confirmed.total * 100).toFixed(1);
        var recoveredRateClosed = (world.summary.recovered.total / world.summary.closed.total * 100).toFixed(1);
        var deathRateTotal = (world.summary.deaths.total / world.summary.confirmed.total * 100).toFixed(1);
        var deathRateClosed = (world.summary.deaths.total / world.summary.closed.total * 100).toFixed(1);

        // var colors = ['red', 'blue', 'green', 'black', 'orange', 'brown', 'blueviolet'];


        // var chartCountries = ['Spain', 'Italy', 'France', 'Germany', 'China', 'Romania']
        // var confirmedTimeline = DataService.getConfirmedTimelines(chartCountries);

        return (
            <Container>
                <Row className="justify-content-between header">
                    <Col className="text-left"><h1>COVID-19</h1></Col>
                    <Col className="text-right"><a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer">data source</a></Col>
                </Row>
                <hr />
                <Container id="summary">
                    <CardDeck>
                        <Card>
                            <Card.Header style={{ backgroundColor: Utils.CONFIRMED_COLOR, color: "#333" }}>Confirmed</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(world.summary.confirmed.total)}<br />&nbsp;<br />&nbsp;
                                </Card.Title>
                                <ResponsiveContainer height={30}>
                                    <AreaChart data={world.timeline} style={{ margin: "0 auto" }}>
                                        <Area dataKey="confirmedNew" stroke="none" fill={Utils.CONFIRMED_COLOR} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header style={{ backgroundColor: Utils.ACTIVE_COLOR, color: "#333" }}>Active</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(world.summary.active.total)}<br /><small className="text-muted">{activeRate}% out of total</small><br />&nbsp;
                                </Card.Title>
                                <ResponsiveContainer height={30}>
                                    <AreaChart data={world.timeline} style={{ margin: "0 auto" }}>
                                        <Area dataKey="activeTotal" fill={Utils.ACTIVE_COLOR} stroke="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header style={{ backgroundColor: Utils.RECOVERED_COLOR, color: "#333" }}>Recovered</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(world.summary.recovered.total)}<br /><small className="text-muted">{recoveredRateTotal}% out of total</small><br /><small className="text-muted">{recoveredRateClosed}% out of closed</small>
                                </Card.Title>
                                <ResponsiveContainer height={30}>
                                    <AreaChart data={world.timeline} style={{ margin: "0 auto" }}>
                                        <Area dataKey="recoveredNew" fill={Utils.RECOVERED_COLOR} stroke="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header style={{ backgroundColor: Utils.DECEASED_COLOR, color: "#fff" }}>Deceased</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(world.summary.deaths.total)}<br /><small className="text-muted">{deathRateTotal}% out of total</small><br /><small className="text-muted">{deathRateClosed}% out of closed</small>
                                </Card.Title>
                                <ResponsiveContainer height={30}>
                                    <AreaChart data={world.timeline} style={{ margin: "0 auto" }}>
                                        <Area dataKey="deathsNew" fill={Utils.DECEASED_COLOR} stroke="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </CardDeck>
                </Container>
                <Container id="charts">
                    <Card>
                        <Card.Header>Total cases</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer height={250}>
                                <ComposedChart data={world.timeline} style={{ margin: "0 auto" }} fontSize={10}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area name="total confirmed" type="monotone" dataKey="confirmedTotal" stroke="none" fillOpacity={0.5} fill={Utils.CONFIRMED_COLOR} />
                                    <Line name="total active" dot={false} dataKey="activeTotal" stroke={Utils.ACTIVE_COLOR} strokeWidth="2" />
                                </ComposedChart>
                            </ResponsiveContainer>
                            {/* <ResponsiveContainer height={300}>
                                <LineChart data={confirmedTimeline} style={{ margin: "0 auto" }} fontSize={10}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    {
                                        chartCountries.map((country, index) =>
                                            <Line key={index} dataKey={country} legendType="square" dot={false} strokeWidth="3" activeDot={true} stroke={colors[index]} />
                                        )
                                    }
                                </LineChart>
                            </ResponsiveContainer> */}
                        </Card.Body>
                    </Card>
                </Container>
                <Container id="countries">
                    <table className="table table-condensed table-hover">
                        <thead>
                            <tr>
                                <th colSpan="3"><input className="search" placeholder="Filter" /></th>
                                <th colSpan="2">Confirmed</th>
                                <th colSpan="2">Deaths</th>
                                <th colSpan="2">Recovered</th>
                            </tr>
                            <tr>
                                <td className="sort" data-sort="name">Country <FontAwesomeIcon icon={faSort} /></td>
                                <td></td>
                                <td></td>
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
                                        <td>
                                            {/* <ResponsiveContainer height={50}>
                                                <BarChart data={country.timeline} style={{ margin: "0 auto" }}>
                                                    <Bar dataKey="confirmedNew" stroke={Utils.CONFIRMED_COLOR} />
                                                </BarChart>
                                            </ResponsiveContainer> */}
                                        </td>
                                        <td>
                                            {/* <ResponsiveContainer height={50}>
                                                <BarChart data={country.timeline} style={{ margin: "0 auto" }}>
                                                    <Bar dataKey="activeTotal" stroke={Utils.ACTIVE_COLOR} />
                                                </BarChart>
                                            </ResponsiveContainer> */}
                                        </td>
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