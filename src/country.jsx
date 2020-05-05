import React, { Component } from 'react';
import DataService from './data-service';
import { Container, Card, CardDeck, Row, Col } from 'react-bootstrap'
import { AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip, Legend, BarChart, Bar, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import Utils from './utils';

export default class Country extends Component {
    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.countryName = params.countryName;
    }
    render() {
        var data = DataService.getCountryData(this.countryName);

        var activeRate = (data.summary.active.total / data.summary.confirmed.total * 100).toFixed(1);
        var recoveredRateTotal = (data.summary.recovered.total / data.summary.confirmed.total * 100).toFixed(1);
        var recoveredRateClosed = (data.summary.recovered.total / data.summary.closed.total * 100).toFixed(1);
        var deathRateTotal = (data.summary.deaths.total / data.summary.confirmed.total * 100).toFixed(1);
        var deathRateClosed = (data.summary.deaths.total / data.summary.closed.total * 100).toFixed(1);

        return (
            <Container>
                <Row className="justify-content-between header">
                    <Col className="text-left"><h1>{this.countryName}</h1></Col>
                    <Col className="text-right"><a href="#/">All countries</a></Col>
                </Row>
                <hr />
                <Container id="summary">
                    <CardDeck>
                        <Card>
                            <Card.Header style={{ backgroundColor: Utils.CONFIRMED_COLOR, color: "#333" }}>Confirmed</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(data.summary.confirmed.total)}<br />&nbsp;<br />&nbsp;
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <BarChart data={data.timeline} style={{ margin: "0 auto" }}>
                                        <Bar name="confirmedNew" type="monotone" dataKey="confirmedNew" stroke={Utils.CONFIRMED_COLOR} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header style={{ backgroundColor: Utils.ACTIVE_COLOR, color: "#333" }}>Active</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(data.summary.active.total)}<br /><small className="text-muted">{activeRate}% out of total</small><br />&nbsp;
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <AreaChart data={data.timeline} style={{ margin: "0 auto" }}>
                                        <Area name="active" type="monotone" dataKey="activeTotal" fill={Utils.ACTIVE_COLOR} stroke="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header style={{ backgroundColor: Utils.RECOVERED_COLOR, color: "#333" }}>Recovered</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(data.summary.recovered.total)}<br /><small className="text-muted">{recoveredRateTotal}% out of total</small><br /><small className="text-muted">{recoveredRateClosed}% out of closed</small>
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <AreaChart data={data.timeline} style={{ margin: "0 auto" }}>
                                        <Area name="active" type="monotone" dataKey="recoveredTotal" fill={Utils.RECOVERED_COLOR} stroke="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header style={{ backgroundColor: Utils.DECEASED_COLOR, color: "#fff" }}>Deceased</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(data.summary.deaths.total)}<br /><small className="text-muted">{deathRateTotal}% out of total</small><br /><small className="text-muted">{deathRateClosed}% out of closed</small>
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <BarChart data={data.timeline} style={{ margin: "0 auto" }}>
                                        <Bar name="active" type="monotone" dataKey="deathsNew" fill={Utils.DECEASED_COLOR} stroke="none" />
                                    </BarChart>
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
                                <ComposedChart data={data.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area name="total confirmed" type="monotone" dataKey="confirmedTotal" stroke="none" fillOpacity={0.5} fill={Utils.CONFIRMED_COLOR} />
                                    <Line name="total active" dot={false} dataKey="activeTotal" stroke={Utils.ACTIVE_COLOR} strokeWidth="2" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>Daily cases</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer height={250}>
                                <BarChart width={730} height={250} data={data.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar name="confirmed" type="monotone" dataKey="confirmedNew" stackId="1" stroke="none" fillOpacity={0.5} fill={Utils.CONFIRMED_COLOR} />
                                    <Bar name="recovered" type="monotone" dataKey="recoveredNew" stackId="1" stroke="none" fillOpacity={0.5} fill={Utils.RECOVERED_COLOR} />
                                    <Bar name="deceased" type="monotone" dataKey="deathsNew" stackId="1" stroke="none" fillOpacity={0.5} fill={Utils.DECEASED_COLOR} />
                                </BarChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer height={250}>
                                <BarChart width={730} height={250} data={data.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar name="new confirmed cases" type="monotone" dataKey="confirmedNew" stroke="none" fillOpacity={0.5} fill={Utils.CONFIRMED_COLOR} />
                                </BarChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer height={250}>
                                <LineChart width={730} height={250} data={data.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line name="new confirmed cases" dot={false} strokeWidth="3" dataKey="confirmedNew" stroke={Utils.CONFIRMED_COLOR} />
                                    <Line name="new recovered cases" dot={false} strokeWidth="3" dataKey="recoveredNew" stroke={Utils.RECOVERED_COLOR} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>Active vs closed cases</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer height={250}>
                                <AreaChart width={730} height={250} data={data.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area name="active" type="monotone" dataKey="activeTotal" stackId="1" stroke="none" fillOpacity={0.5} fill={Utils.ACTIVE_COLOR} />
                                    <Area name="closed (recovered + deceased)" type="monotone" dataKey="closedTotal" stackId="1" stroke="none" fillOpacity={0.5} fill={Utils.CLOSED_COLOR} />
                                </AreaChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer height={250}>
                                <LineChart width={730} height={250} data={data.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line name="active" dot={false} strokeWidth="3" dataKey="activeTotal" stroke={Utils.ACTIVE_COLOR} />
                                    <Line name="closed (recovered + deaths)" dot={false} strokeWidth="3" dataKey="closedTotal" stroke={Utils.CLOSED_COLOR} />
                                </LineChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer height={250}>
                                <AreaChart width={730} height={250} data={data.timeline} style={{ margin: "0 auto" }} stackOffset="expand">
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area name="total active" type="monotone" dataKey="activeTotal" stackId="1" stroke="none" fillOpacity={0.5} fill={Utils.ACTIVE_COLOR} />
                                    <Area name="total recovered" type="monotone" dataKey="recoveredTotal" stackId="1" stroke="none" fillOpacity={0.5} fill={Utils.RECOVERED_COLOR} />
                                    <Area name="total deaths" type="monotone" dataKey="deathsTotal" stackId="1" stroke="none" fillOpacity={0.5} fill={Utils.DECEASED_COLOR} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>Cases outcome</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer height={250}>
                                <LineChart width={730} height={250} data={data.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line name="deceased" dot={false} strokeWidth="3" dataKey="deathsTotal" stackId="1" stroke={Utils.DECEASED_COLOR} />
                                    <Line name="recovered" dot={false} strokeWidth="3" dataKey="recoveredTotal" stackId="1" stroke={Utils.RECOVERED_COLOR} />
                                </LineChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer height={250}>
                                <AreaChart width={730} height={250} data={data.timeline} style={{ margin: "0 auto" }} stackOffset="expand">
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area name="recovered" type="monotone" dataKey="recoveredTotal" stackId="1" stroke="none" fillOpacity={0.5} fill={Utils.RECOVERED_COLOR} />
                                    <Area name="deceased" type="monotone" dataKey="deathsTotal" stackId="1" stroke="none" fillOpacity={0.5} fill={Utils.DECEASED_COLOR} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Container>
            </Container>
        )
    }
}