import React, {Component} from 'react';
import {Card} from 'react-bootstrap'
import {Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import Utils from './utils';
import data from './data/romania.json';
import BarChart from "recharts/lib/chart/BarChart";

export default class Romania extends Component {
    render() {
        // console.log(data)

        return (
            <div>
                <Card>
                    <Card.Header>Positivity rate</Card.Header>
                    <Card.Body>
                        <ResponsiveContainer height={250}>
                            <BarChart data={data} style={{margin: "0 auto"}}>
                                <XAxis dataKey="date"/>
                                <YAxis domain={[0, 'dataMax+1']}/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Legend verticalAlign="top" height={36}/>
                                <Bar name="positivity rate (daily positive tests)" dot={false} dataKey="positivity_rate"
                                     fill={Utils.POSITIVITY_COLOR}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header>Serious cases (daily)</Card.Header>
                    <Card.Body>
                        <ResponsiveContainer height={250}>
                            <BarChart data={data} style={{margin: "0 auto"}}>
                                <XAxis dataKey="date"/>
                                <YAxis domain={[0, 'dataMax+1']}/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Legend verticalAlign="top" height={36}/>
                                <Bar name="serious cases" dot={false} dataKey="ati"
                                     fill={Utils.ACTIVE_COLOR}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}