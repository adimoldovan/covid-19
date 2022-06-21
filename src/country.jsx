import React, {Component} from 'react';
import DataService from './data-service';
import {Col, Container, Row} from 'react-bootstrap'
import Utils from './utils';
import ReactEcharts from "echarts-for-react";

export default class Country extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.match;
        this.countryName = params.countryName;
    }

    render() {
        const data = DataService.getCountryData(this.countryName);
        const deathRateTotal = (data.summary.deaths.total / data.summary.confirmed.total * 100).toFixed(1);

        data.timeline = data.timeline.filter(item => item.confirmedTotal !== 0);

        const chartOptions =
            {
                grid: {
                    left: 100,
                    right: 100,
                },
                dataZoom: [
                    {
                        type: 'slider',
                    },
                ],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    },
                },
                legend: {
                    left: 'right',
                },
                xAxis: [
                    {
                        type: 'category',
                        data: data.timeline.map(function (e) {
                            return e.date;
                        }),
                        axisLabel: {
                            formatter: '{value}',
                        },
                        axisPointer: {
                            label: {
                                formatter: '{value}',
                            },
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            lineStyle: {
                                width: 0,
                                type: 'dotted',
                                color: '#6b6d76',
                            },
                        },
                    },
                    {
                        type: 'value',
                        splitLine: {
                            lineStyle: {
                                width: 0.5,
                                type: 'dashed',
                                color: '#6b6d76',
                            },
                        },
                        min: 0,
                        axisLabel: {
                            formatter: '{value}',
                        },
                    },
                ],
                series: [
                    {
                        name: 'total confirmed',
                        type: 'line',
                        areaStyle: {},
                        color: Utils.CONFIRMED_COLOR,
                        data: data.timeline.map(function (e) {
                            return e.confirmedTotal;
                        }),
                    },
                    {
                        name: 'daily confirmed',
                        type: 'bar',
                        yAxisIndex: 1,
                        color: Utils.ACTIVE_COLOR,
                        data: data.timeline.map(function (e) {
                            return e.confirmedNew;
                        }),
                    },
                    {
                        name: 'daily deaths',
                        type: 'bar',
                        yAxisIndex: 1,
                        color: Utils.DECEASED_COLOR,
                        data: data.timeline.map(function (e) {
                            return e.deathsNew;
                        }),
                    },
                ],
            };

        return (
            <Container fluid>
                <Row className="justify-content-between header">
                    <Col className="text-left"><h1>{this.countryName}</h1></Col>
                    <Col className="text-right"><a href="#/">All countries</a></Col>
                </Row>
                <hr/>
                <Row className="justify-content-between header">
                    <Col sm={3}>
                        <div className="summary-box">
                            <span className="number">{Utils.formattedNumber(data.summary.confirmed.total)}</span>
                            <br/>
                            <span className="description">confirmed cases</span>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div className="summary-box ">
                            <span className="number">{Utils.formattedNumber(data.summary.deaths.total)}</span>
                            <br/>
                            <span className="description">deceased</span>
                            <br/>
                            <span
                                className="fine">{Utils.formattedNumber(deathRateTotal)} % out of confirmed cases</span>
                        </div>
                    </Col>
                </Row>
                <Row id="charts">
                    <Col>
                        <ReactEcharts option={chartOptions}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}
