import React, { Component } from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip, Legend, BarChart, Bar, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import DataService from './data-service';
import { Container } from 'react-bootstrap';

export default class Charts extends Component {
    constructor(props) {
        super(props);

        var rawTimelineData = DataService.getCountriesTimelineData();
        var timeline = rawTimelineData.find(c => c.name === props.countryName);
        console.log(timeline);
        console.log(timeline.confirmed);

        this.data = Object.keys(timeline.confirmed).map(function (key) {

            return {
                date: key,
                confirmedTotal: timeline.confirmed[key].total,
                confirmedNew: timeline.confirmed[key].new,
                recoveredTotal: timeline.recovered[key].total,
                recoveredNew: timeline.recovered[key].new,
                deathsTotal: timeline.deaths[key].total,
                deathsNew: timeline.deaths[key].new,
                active: timeline.confirmed[key].total - (timeline.recovered[key].total + timeline.deaths[key].total),
                closed: timeline.recovered[key].total + timeline.deaths[key].total
            };
        });

        console.log(this.data);

        this.confirmedColor = "#ffc658";
        this.recoveredColor = "#82ca9d";
        this.deathsColor = "#1c1c1c";
        this.activeColor = "#fca085";
        this.closedColor = "#8884d8";
    }

    render() {
        return (
            <Container>
                <h3>Confirmed cases</h3>
                <ResponsiveContainer height={250}>
                    <ComposedChart data={this.data} style={{ margin: "0 auto" }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Area name="confirmed" type="monotone" dataKey="confirmedTotal" stroke="none" fillOpacity={0.5} fill={this.confirmedColor} />
                        <Line name="active" type="monotone" dataKey="active" stroke={this.activeColor} />
                    </ComposedChart>
                </ResponsiveContainer>
                <h3>Daily mixed</h3>
                <ResponsiveContainer height={250}>
                    <BarChart width={730} height={250} data={this.data} style={{ margin: "0 auto" }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Bar name="new confirmed" type="monotone" dataKey="confirmedNew" stackId="1" stroke="none" fillOpacity={0.5} fill={this.confirmedColor} />
                        <Bar name="new recovered" type="monotone" dataKey="recoveredNew" stackId="1" stroke="none" fillOpacity={0.5} fill={this.recoveredColor} />
                        <Bar name="new deaths" type="monotone" dataKey="deathsNew" stackId="1" stroke="none" fillOpacity={0.5} fill={this.deathsColor} />
                    </BarChart>
                </ResponsiveContainer>
                <h3>Daily new confirmed cases</h3>
                <ResponsiveContainer height={250}>
                    <BarChart width={730} height={250} data={this.data} style={{ margin: "0 auto" }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Bar name="new confirmed cases" type="monotone" dataKey="confirmedNew" stroke="none" fillOpacity={0.5} fill={this.confirmedColor} />
                    </BarChart>
                </ResponsiveContainer>
                <h3>Active vs closed cases</h3>
                <ResponsiveContainer height={250}>
                    <AreaChart width={730} height={250} data={this.data} style={{ margin: "0 auto" }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Area name="active" type="monotone" dataKey="active" stackId="1" stroke="none" fillOpacity={0.5} fill={this.activeColor} />
                        <Area name="closed (recovered + deaths)" type="monotone" dataKey="closed" stackId="1" stroke="none" fillOpacity={0.5} fill={this.closedColor} />
                    </AreaChart>
                </ResponsiveContainer>
                <ResponsiveContainer height={250}>
                    <LineChart width={730} height={250} data={this.data} style={{ margin: "0 auto" }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Line name="active" type="monotone" dataKey="active" stroke={this.activeColor} />
                        <Line name="closed (recovered + deaths)" type="monotone" dataKey="closed" stroke={this.closedColor} />
                    </LineChart>
                </ResponsiveContainer>
                <h3>Stacked active, recovered and deaths</h3>
                <ResponsiveContainer height={250}>
                    <AreaChart width={730} height={250} data={this.data} style={{ margin: "0 auto" }} stackOffset="expand">
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
                <h3>New confirmed vs new recoveries</h3>
                <ResponsiveContainer height={250}>
                    <LineChart width={730} height={250} data={this.data} style={{ margin: "0 auto" }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Line name="new confirmed cases" type="monotone" dataKey="confirmedNew" stroke={this.confirmedColor} />
                        <Line name="new recovered cases" type="monotone" dataKey="recoveredNew" stroke={this.recoveredColor} />
                    </LineChart>
                </ResponsiveContainer>
            </Container>
        )
    }
}
