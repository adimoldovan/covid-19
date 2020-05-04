import React, { Component } from 'react';
import DataService from './data-service';
import { Container, Card, CardDeck, Row, Col } from 'react-bootstrap'
import { AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip, Legend, BarChart, Bar, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';

export default class Country extends Component {
    constructor(props) {
        super(props);
        const { params } = this.props.match

        var summaryData = DataService.getCountriesSummaryData();
        this.countrySummaryData = summaryData.find(c => c.name === params.countryName);

        this.confirmed = this.countrySummaryData.confirmed.total
        this.closed = this.countrySummaryData.recovered.total + this.countrySummaryData.deaths.total
        this.active = this.confirmed - this.closed
        this.recovered = this.countrySummaryData.recovered.total
        this.dead = this.countrySummaryData.deaths.total

        this.activeRate = (this.active / this.confirmed * 100).toFixed(1);
        this.recoveredRateTotal = (this.recovered / this.confirmed * 100).toFixed(1);
        this.recoveredRateClosed = (this.recovered / this.closed * 100).toFixed(1);
        this.deathRateTotal = (this.dead / this.confirmed * 100).toFixed(1);
        this.deathRateClosed = (this.dead / this.closed * 100).toFixed(1);



        var rawTimelineData = DataService.getCountriesTimelineData().find(c => c.name === params.countryName);

        this.timeline = Object.keys(rawTimelineData.confirmed).map(function (key) {
            return {
                date: key,
                confirmedTotal: rawTimelineData.confirmed[key].total,
                confirmedNew: rawTimelineData.confirmed[key].new,
                recoveredTotal: rawTimelineData.recovered[key].total,
                recoveredNew: rawTimelineData.recovered[key].new,
                deathsTotal: rawTimelineData.deaths[key].total,
                deathsNew: rawTimelineData.deaths[key].new,
                active: rawTimelineData.confirmed[key].total - (rawTimelineData.recovered[key].total + rawTimelineData.deaths[key].total),
                closed: rawTimelineData.recovered[key].total + rawTimelineData.deaths[key].total
            };
        });

        console.log(this.timeline);

        this.confirmedColor = "#ffc658";
        this.recoveredColor = "#82ca9d";
        this.deathsColor = "#1c1c1c";
        this.activeColor = "#fca085";
        this.closedColor = "#8884d8";
    }
    render() {
        return (
            <Container>
                <Row className="justify-content-between header">
                    <Col className="text-left"><h1>{this.countrySummaryData.name}</h1></Col>
                    <Col className="text-right"><a href="#/">All countries</a></Col>
                </Row>
                <hr />
                <Container id="summary">
                    <CardDeck>
                        <Card>
                            <Card.Header>Confirmed</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {this.confirmed}<br />&nbsp;<br />&nbsp;
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <BarChart data={this.timeline} style={{ margin: "0 auto" }}>
                                        <Bar name="confirmedNew" type="monotone" dataKey="confirmedNew" stroke={this.confirmedColor} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Active</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {this.active}<br /><small className="text-muted">{this.activeRate}% out of total</small><br />&nbsp;
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <AreaChart data={this.timeline} style={{ margin: "0 auto" }}>
                                        <Area name="active" type="monotone" dataKey="active" fill={this.activeColor} stroke="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Recovered</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {this.recovered}<br /><small className="text-muted">{this.recoveredRateTotal}% out of total</small><br /><small className="text-muted">{this.recoveredRateClosed}% out of closed</small>
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <AreaChart data={this.timeline} style={{ margin: "0 auto" }}>
                                        <Area name="active" type="monotone" dataKey="recoveredTotal" fill={this.recoveredColor} stroke="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Deceased</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {this.dead}<br /><small className="text-muted">{this.deathRateTotal}% out of total</small><br /><small className="text-muted">{this.deathRateClosed}% out of closed</small>
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <BarChart data={this.timeline} style={{ margin: "0 auto" }}>
                                        <Bar name="active" type="monotone" dataKey="deathsNew" fill={this.deathsColor} stroke="none" />
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
                                <ComposedChart data={this.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area name="total confirmed" type="monotone" dataKey="confirmedTotal" stroke="none" fillOpacity={0.5} fill={this.confirmedColor} />
                                    <Line name="total active" type="monotone" dataKey="active" stroke={this.activeColor} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>Daily cases</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer height={250}>
                                <BarChart width={730} height={250} data={this.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar name="confirmed" type="monotone" dataKey="confirmedNew" stackId="1" stroke="none" fillOpacity={0.5} fill={this.confirmedColor} />
                                    <Bar name="recovered" type="monotone" dataKey="recoveredNew" stackId="1" stroke="none" fillOpacity={0.5} fill={this.recoveredColor} />
                                    <Bar name="deceased" type="monotone" dataKey="deathsNew" stackId="1" stroke="none" fillOpacity={0.5} fill={this.deathsColor} />
                                </BarChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer height={250}>
                                <BarChart width={730} height={250} data={this.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar name="new confirmed cases" type="monotone" dataKey="confirmedNew" stroke="none" fillOpacity={0.5} fill={this.confirmedColor} />
                                </BarChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer height={250}>
                                <LineChart width={730} height={250} data={this.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line name="new confirmed cases" type="monotone" dataKey="confirmedNew" stroke={this.confirmedColor} />
                                    <Line name="new recovered cases" type="monotone" dataKey="recoveredNew" stroke={this.recoveredColor} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>Active vs closed cases</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer height={250}>
                                <AreaChart width={730} height={250} data={this.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area name="active" type="monotone" dataKey="active" stackId="1" stroke="none" fillOpacity={0.5} fill={this.activeColor} />
                                    <Area name="closed (recovered + deceased)" type="monotone" dataKey="closed" stackId="1" stroke="none" fillOpacity={0.5} fill={this.closedColor} />
                                </AreaChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer height={250}>
                                <LineChart width={730} height={250} data={this.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line name="active" type="monotone" dataKey="active" stroke={this.activeColor} />
                                    <Line name="closed (recovered + deaths)" type="monotone" dataKey="closed" stroke={this.closedColor} />
                                </LineChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer height={250}>
                                <AreaChart width={730} height={250} data={this.timeline} style={{ margin: "0 auto" }} stackOffset="expand">
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area name="total active" type="monotone" dataKey="active" stackId="1" stroke="none" fillOpacity={0.5} fill={this.activeColor} />
                                    <Area name="total recovered" type="monotone" dataKey="recoveredTotal" stackId="1" stroke="none" fillOpacity={0.5} fill={this.recoveredColor} />
                                    <Area name="total deaths" type="monotone" dataKey="deathsTotal" stackId="1" stroke="none" fillOpacity={0.5} fill={this.deathsColor} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>Cases outcome</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer height={250}>
                                <LineChart width={730} height={250} data={this.timeline} style={{ margin: "0 auto" }}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line name="deceased" type="monotone" dataKey="deathsTotal" stackId="1" stroke={this.deathsColor} />
                                    <Line name="recovered" type="monotone" dataKey="recoveredTotal" stackId="1"stroke={this.recoveredColor} />
                                </LineChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer height={250}>
                                <AreaChart width={730} height={250} data={this.timeline} style={{ margin: "0 auto" }} stackOffset="expand">
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area name="recovered" type="monotone" dataKey="recoveredTotal" stackId="1" stroke="none" fillOpacity={0.5} fill={this.recoveredColor} />
                                    <Area name="deceased" type="monotone" dataKey="deathsTotal" stackId="1" stroke="none" fillOpacity={0.5} fill={this.deathsColor} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Container>
            </Container>
        )
    }
}