import React, { Component } from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import DataService from './data-service';
import { Container } from 'react-bootstrap';

export default class Charts extends Component {
    constructor(props) {
        super(props);

        var rawTimelineData = DataService.getCountriesTimelineData();
        var timeline = rawTimelineData.find(c => c.name == props.countryName);
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
                    <AreaChart data={this.data} style={{ margin: "0 auto" }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="confirmedTotal" stroke={this.confirmedColor} fillOpacity={0.5} fill={this.confirmedColor} />
                    </AreaChart>
                </ResponsiveContainer>
                <h3>Daily</h3>
                <ResponsiveContainer height={250}>
                    <BarChart width={730} height={250} data={this.data} style={{ margin: "0 auto" }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Bar type="monotone" dataKey="confirmedNew" stackId="1" stroke={this.confirmedColor} fillOpacity={0.5} fill={this.confirmedColor} />
                        <Bar type="monotone" dataKey="recoveredNew" stackId="1" stroke={this.recoveredColor} fillOpacity={0.5} fill={this.recoveredColor} />
                        <Bar type="monotone" dataKey="deathsNew" stackId="1" stroke={this.deathsColor} fillOpacity={0.5} fill={this.deathsColor} />
                    </BarChart></ResponsiveContainer>
                <h3>Active vs closed cases</h3>
                <ResponsiveContainer height={250}>
                    <AreaChart width={730} height={250} data={this.data} style={{ margin: "0 auto" }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="active" stackId="1" stroke={this.activeColor} fillOpacity={0.5} fill={this.activeColor} />
                        <Area type="monotone" dataKey="closed" stackId="1" stroke={this.closedColor} fillOpacity={0.5} fill={this.closedColor} />
                    </AreaChart></ResponsiveContainer>
                <h3>Stacked active, recovered and deaths</h3>
                <ResponsiveContainer height={250}>
                    <AreaChart width={730} height={250} data={this.data} style={{ margin: "0 auto" }} stackOffset="expand">
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="active" stackId="1" stroke={this.activeColor} fillOpacity={0.5} fill={this.activeColor} />
                        <Area type="monotone" dataKey="recoveredTotal" stackId="1" stroke={this.recoveredColor} fillOpacity={0.5} fill={this.recoveredColor} />
                        <Area type="monotone" dataKey="deathsTotal" stackId="1" stroke={this.deathsColor} fillOpacity={0.5} fill={this.deathsColor} />
                    </AreaChart></ResponsiveContainer>
            </Container>
        )
    }
}
