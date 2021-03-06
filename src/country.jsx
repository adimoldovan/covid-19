import React, {Component} from 'react';
import DataService from './data-service';
import {Card, CardDeck, Col, Container, Row} from 'react-bootstrap'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import Utils from './utils';


export default class Country extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.match;
        this.countryName = params.countryName;
    }

    render() {
        const data = DataService.getCountryData(this.countryName);

        const activeRate = (data.summary.active.total / data.summary.confirmed.total * 100).toFixed(1);
        const recoveredRateTotal = (data.summary.recovered.total / data.summary.confirmed.total * 100).toFixed(1);
        const recoveredRateClosed = (data.summary.recovered.total / data.summary.closed.total * 100).toFixed(1);
        const deathRateTotal = (data.summary.deaths.total / data.summary.confirmed.total * 100).toFixed(1);
        const deathRateClosed = (data.summary.deaths.total / data.summary.closed.total * 100).toFixed(1);

        // const timelineSliced = data.timeline.slice(-1 * 30);
        data.timeline = data.timeline.filter(item => item.confirmedTotal !== 0);

        // console.log(data)

        return (
            <Container fluid>
                <Row className="justify-content-between header">
                    <Col className="text-left"><h1>{this.countryName}</h1></Col>
                    <Col className="text-right"><a href="#/">All countries</a></Col>
                </Row>
                <hr/>
                <Container fluid id="summary">
                    <CardDeck>
                        <Card>
                            <Card.Header
                                style={{backgroundColor: Utils.CONFIRMED_COLOR, color: "#333"}}>Confirmed</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(data.summary.confirmed.total)}<br/>&nbsp;<br/>&nbsp;
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <AreaChart data={data.timeline} style={{margin: "0 auto"}}>
                                        <Area dataKey="confirmedNew" stroke="none" fill={Utils.CONFIRMED_COLOR}/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header
                                style={{backgroundColor: Utils.ACTIVE_COLOR, color: "#333"}}>Active</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(data.summary.active.total)}<br/><small
                                    className="text-muted">{activeRate}% out of total</small><br/>&nbsp;
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <AreaChart data={data.timeline} style={{margin: "0 auto"}}>
                                        <Area dataKey="activeTotal" fill={Utils.ACTIVE_COLOR} stroke="none"/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header
                                style={{backgroundColor: Utils.RECOVERED_COLOR, color: "#333"}}>Recovered</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(data.summary.recovered.total)}<br/><small
                                    className="text-muted">{recoveredRateTotal}% out of total</small><br/><small
                                    className="text-muted">{recoveredRateClosed}% out of closed</small>
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <AreaChart data={data.timeline} style={{margin: "0 auto"}}>
                                        <Area dataKey="recoveredNew" fill={Utils.RECOVERED_COLOR} stroke="none"/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header
                                style={{backgroundColor: Utils.DECEASED_COLOR, color: "#fff"}}>Deceased</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(data.summary.deaths.total)}<br/><small
                                    className="text-muted">{deathRateTotal}% out of total</small><br/><small
                                    className="text-muted">{deathRateClosed}% out of closed</small>
                                </Card.Title>
                                <ResponsiveContainer height={50}>
                                    <AreaChart data={data.timeline} style={{margin: "0 auto"}}>
                                        <Area dataKey="deathsNew" fill={Utils.DECEASED_COLOR} stroke="none"/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </CardDeck>
                </Container>
                <Container fluid id="charts">
                    <CardDeck>
                        <Card>
                            <Card.Header>Total cases</Card.Header>
                            <Card.Body>
                                <ResponsiveContainer height={250}>
                                    <ComposedChart data={data.timeline} style={{margin: "0 auto"}}>
                                        <XAxis dataKey="date"/>
                                        <YAxis/>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <Tooltip/>
                                        <Legend verticalAlign="bottom" height={36}/>
                                        <Area name="confirmed" type="monotone" dataKey="confirmedTotal"
                                              stroke="none"
                                              fillOpacity={0.5} fill={Utils.CONFIRMED_COLOR}/>
                                        <Line name="active" dot={false} dataKey="activeTotal"
                                              stroke={Utils.ACTIVE_COLOR} strokeWidth="2"/>
                                    </ComposedChart>
                                </ResponsiveContainer>
                                <ResponsiveContainer height={250}>
                                    <AreaChart width={730} height={250} data={data.timeline} style={{margin: "0 auto"}}
                                               stackOffset="expand">
                                        <XAxis dataKey="date"/>
                                        <YAxis/>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <Tooltip/>
                                        <Legend verticalAlign="bottom" height={36}/>
                                        <Area name="active" type="monotone" dataKey="activeTotal"
                                              stackId="1"
                                              stroke="none" fillOpacity={0.5} fill={Utils.ACTIVE_COLOR}/>
                                        <Area name="closed" type="monotone" dataKey="closedTotal"
                                              stackId="1"
                                              stroke="none" fillOpacity={0.5} fill={Utils.CLOSED_COLOR}/>
                                    </AreaChart>
                                </ResponsiveContainer>
                                <ResponsiveContainer height={250}>
                                    <LineChart width={730} height={250} data={data.timeline}
                                               style={{margin: "0 auto"}}>
                                        <XAxis dataKey="date"/>
                                        <YAxis domain={[0, 'dataMax+2']}/>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <Tooltip/>
                                        <Legend verticalAlign="bottom"/>
                                        <Line name="% deceased out of closed cases" dot={false}
                                              strokeWidth="3"
                                              dataKey="deathRateClosedCases" stroke={Utils.ACTIVE_COLOR}/>
                                        <Line name="% deceased out of total cases" dot={false}
                                              strokeWidth="3"
                                              dataKey="deathRateTotalCases" stroke={Utils.DECEASED_COLOR}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Daily cases</Card.Header>
                            <Card.Body>
                                <ResponsiveContainer height={250}>
                                    <ComposedChart width={730} height={250} data={data.timeline}
                                                   style={{margin: "0 auto"}}>
                                        <XAxis dataKey="date"/>
                                        <YAxis domain={[0, 'dataMax+1']}/>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <Tooltip/>
                                        <Legend verticalAlign="bottom"/>
                                        <Line name="confirmed" dot={false} dataKey="confirmedNew"
                                              stroke={Utils.CONFIRMED_COLOR} strokeWidth="2" legendType="none"/>
                                        <Line name="recovered" dot={false} dataKey="recoveredNew"
                                              stroke={Utils.RECOVERED_COLOR} strokeWidth="2" legendType="none"/>
                                        <Line name="deceased" dot={false} dataKey="deathsNew"
                                              stroke={Utils.DECEASED_COLOR} strokeWidth="2" legendType="none"/>
                                        <Bar name="confirmed" type="monotone" dataKey="confirmedNew" stroke="none"
                                             fillOpacity={0.5} fill={Utils.CONFIRMED_COLOR}/>
                                        <Bar name="recovered" type="monotone" dataKey="recoveredNew" stroke="none"
                                             fillOpacity={0.5} fill={Utils.RECOVERED_COLOR}/>
                                        <Bar name="deceased" type="monotone" dataKey="deathsNew" stroke="none"
                                             fillOpacity={0.5} fill={Utils.DECEASED_COLOR}/>
                                    </ComposedChart>
                                </ResponsiveContainer>
                                <ResponsiveContainer height={250}>
                                    <BarChart width={730} height={250} data={data.timeline} style={{margin: "0 auto"}}>
                                        <XAxis dataKey="date"/>
                                        <YAxis domain={[0, 'dataMax+1']}/>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <Tooltip/>
                                        <Legend verticalAlign="bottom" height={36}/>
                                        <Bar name="newly confirmed cases" type="monotone" dataKey="confirmedNew"
                                             stroke="none"
                                             fill={Utils.CONFIRMED_COLOR}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </CardDeck>
                </Container>
            </Container>
        )
    }
}
