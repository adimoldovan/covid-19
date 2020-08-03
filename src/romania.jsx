import React, {Component} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import Utils from "./utils";
import rawData from './data/romania_graphs_ro.json'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    ComposedChart,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import DataService from "./data-service";

export default class Romania extends Component {
    render() {
        // calculate active cases
        rawData.covid_romania.forEach(function (day) {
            let active = day.total_cases - day.total_recovered - day.total_deaths
            let closed = day.total_recovered + day.total_deaths
            day.total_active = active;
            day.percent_active = (active / day.total_cases * 100).toFixed(1);
            day.percent_deceased_closed = (day.total_deaths / closed * 100).toFixed(1);
            day.percent_deceased_total = (day.total_deaths / day.total_cases * 100).toFixed(1);
            day.percent_recovered_closed = (day.total_recovered / closed * 100).toFixed(1);
            day.percent_recovered_total = (day.total_recovered / day.total_cases * 100).toFixed(1);
            day.percent_positive_tests_today = DataService.noNaN(parseInt(day.new_cases_today) / parseInt(day.new_tests_today) * 100).toFixed(1);

            if (day.county_data) {
                day.county_data.forEach(function (cty) {
                    cty.cases_1_k_pop = (cty.total_cases / cty.county_population * 1000).toFixed(1);
                });

                day.county_data.sort((a, b) => (a.cases_1_k_pop < b.cases_1_k_pop) ? 1 : -1)
            }
        });

        let lastDay = rawData.covid_romania[0]
        let timelineData = rawData.covid_romania.reverse();
        let counties = [];

        // create initial county objects
        lastDay.county_data.forEach(function (cty) {
            let ctyObj = {
                county_id: cty.county_id,
                county_name: cty.county_name,
                county_population: cty.county_population,
                timeline: []
            }

            counties.push(ctyObj)
        });

        // fill counties objects with timeline data
        counties.forEach(function (county) {
                timelineData.forEach(function (day) {
                    if (day.county_data) {
                        let ctyDay = day.county_data.find(c => c.county_name === county.county_name);
                        county.timeline.push(
                            {
                                reporting_date: day.reporting_date,
                                total_cases: ctyDay.total_cases,
                                cases_1_k_pop: ctyDay.cases_1_k_pop
                            }
                        )
                    }
                });
            }
        );

        return (
            <Container fluid>
                <Row className="justify-content-between header">
                    <Col className="text-left"><h1>Romania</h1></Col>
                </Row>
                <hr/>
                <Row>
                    <Col className="text-right">Last update: {lastDay.reporting_date}</Col>
                </Row>
                <Row className="spaced-row">
                    <Col sm={6}>
                        <ResponsiveContainer height={250}>
                            <ComposedChart data={timelineData} style={{margin: "0 auto"}}>
                                <XAxis dataKey="reporting_date"/>
                                <YAxis orientation="right"/>
                                <Tooltip/>
                                <Area name="confirmed" type="monotone" dataKey="total_cases"
                                      stroke="none"
                                      fillOpacity={0.5} fill={Utils.CONFIRMED_COLOR}/>
                                <Area name="active" dot={false} dataKey="total_active"
                                      stroke="none"
                                      fillOpacity={0.5} fill={Utils.ACTIVE_COLOR}/>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </Col>
                    <Col sm={6}>
                        <ResponsiveContainer height={250}>
                            <LineChart data={timelineData} style={{margin: "0 auto"}}>
                                <XAxis dataKey="reporting_date"/>
                                <YAxis orientation="right"/>
                                <Tooltip/>
                                <Line name="new cases" type="monotone" dataKey="new_cases_today"
                                      dot={false}
                                      strokeWidth={2}
                                      stroke={Utils.CONFIRMED_COLOR}/>
                                <Line name="new recovered" type="monotone" dataKey="new_recovered_today"
                                      dot={false}
                                      strokeWidth={2}
                                      stroke={Utils.RECOVERED_COLOR}/>
                                <Line name="new deceased" type="monotone" dataKey="new_deaths_today"
                                      dot={false}
                                      strokeWidth={2}
                                      stroke={Utils.DECEASED_COLOR}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
                <Row className="justify-content-between header">
                    <Col sm={3}>
                        <div className="summary-box">
                            <span className="number">{Utils.formattedNumber(lastDay.total_cases)}</span>
                            <br/>
                            <span className="description">confirmed cases</span>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div className="summary-box">
                            <span className="number">{Utils.formattedNumber(lastDay.total_active)}</span>
                            <br/>
                            <span className="description">active cases</span>
                            <br/>
                            <span className="fine">{Utils.formattedNumber(lastDay.percent_active)} %</span>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div className="summary-box ">
                            <span className="number">{Utils.formattedNumber(lastDay.total_deaths)}</span>
                            <br/>
                            <span className="description">deceased</span>
                            <br/>
                            <span className="fine">{Utils.formattedNumber(lastDay.percent_deceased_closed)} % out of closed, {Utils.formattedNumber(lastDay.percent_deceased_total)} % out of total</span>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div className="summary-box ">
                            <span className="number">{Utils.formattedNumber(lastDay.total_recovered)}</span>
                            <br/>
                            <span className="description">recovered</span>
                            <br/>
                            <span className="fine">{Utils.formattedNumber(lastDay.percent_recovered_closed)} % out of closed, {Utils.formattedNumber(lastDay.percent_recovered_total)} % out of total</span>
                        </div>
                    </Col>
                </Row>
                <hr/>
                <Row className="spaced-row">
                    <Col sm={2}>
                        <div className="summary-box left">
                            <span className="number">{Utils.formattedNumber(lastDay.new_cases_today)}</span>
                            <br/>
                            <span className="description">confirmed new</span>
                        </div>
                    </Col>
                    <Col sm={10}>
                        <ResponsiveContainer height={250}>
                            <BarChart data={timelineData} style={{margin: "0 auto"}}>
                                <XAxis dataKey="reporting_date"/>
                                <YAxis orientation="right"/>
                                <Tooltip/>
                                <Bar name="daily new cases" type="monotone" dataKey="new_cases_today"
                                     stroke="none"
                                     fill={Utils.CONFIRMED_COLOR}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
                <Row className="spaced-row">
                    <Col sm={2}>
                        <div className="summary-box left">
                            <span className="number">{Utils.formattedNumber(lastDay.new_deaths_today)}</span>
                            <br/>
                            <span className="description">deceased new</span>
                        </div>
                    </Col>
                    <Col sm={10}>
                        <ResponsiveContainer height={250}>
                            <BarChart data={timelineData} style={{margin: "0 auto"}}>
                                <XAxis dataKey="reporting_date"/>
                                <YAxis orientation="right"/>
                                <Tooltip/>
                                <Bar name="daily new deaths" type="monotone" dataKey="new_deaths_today"
                                     stroke="none"
                                     fillOpacity={0.6}
                                     fill={Utils.DECEASED_COLOR}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
                <Row className="spaced-row">
                    <Col sm={2}>
                        <div className="summary-box left">
                            <span className="number">{Utils.formattedNumber(lastDay.intensive_care_right_now)}</span>
                            <br/>
                            <span className="description">serious cases</span>
                        </div>
                    </Col>
                    <Col sm={10}>
                        <ResponsiveContainer height={250}>
                            <BarChart data={timelineData} style={{margin: "0 auto"}}>
                                <XAxis dataKey="reporting_date"/>
                                <YAxis orientation="right"/>
                                <Tooltip/>
                                <Bar name="ICU cases" type="monotone" dataKey="intensive_care_right_now"
                                     stroke="none"
                                     fillOpacity={1}
                                     fill={Utils.ACTIVE_COLOR}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
                <Row className="spaced-row">
                    <Col sm={2}>
                        <div className="summary-box left">
                            <span
                                className="number">{Utils.formattedNumber(lastDay.percent_positive_tests_today)}%</span>
                            <br/>
                            <span className="description">new positive cases</span>
                        </div>
                    </Col>
                    <Col sm={10}>
                        <ResponsiveContainer height={250}>
                            <BarChart data={timelineData} style={{margin: "0 auto"}}>
                                <XAxis dataKey="reporting_date"/>
                                <YAxis orientation="right" domain={[0, 20]}/>
                                <Tooltip/>
                                <Bar name="percent of positive tests" type="monotone"
                                     dataKey="percent_positive_tests_today"
                                     stroke="none"
                                     fillOpacity={1}
                                     fill={Utils.POSITIVITY_COLOR}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
                <Row className="spaced-row">
                    <Col sm={2}>
                        <div className="summary-box left">
                            <span
                                className="number">{Utils.formattedNumber(lastDay.new_recovered_today)}</span>
                            <br/>
                            <span className="description">new recoveries</span>
                        </div>
                    </Col>
                    <Col sm={10}>
                        <ResponsiveContainer height={250}>
                            <BarChart data={timelineData} style={{margin: "0 auto"}}>
                                <XAxis dataKey="reporting_date"/>
                                <YAxis orientation="right"/>
                                <Tooltip/>
                                <Bar name="daily recoveries" type="monotone"
                                     dataKey="new_recovered_today"
                                     stroke="none"
                                     fillOpacity={1}
                                     fill={Utils.RECOVERED_COLOR}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
                <hr/>
                <Row className="spaced-row">
                    {lastDay.county_data.map((county, index) => (
                        <Col sm={6} key={index}>
                            <div className="summary-box county-box">
                                <span className="description county-name ">{county.county_name}</span>
                                <br/>
                                <span className="number">{county.total_cases} ({county.cases_1_k_pop} &#8240;)</span>
                                <br/>
                                <span className="description">total cases</span>
                            </div>
                            <ResponsiveContainer height={250}>
                                <AreaChart data={counties.find(c => c.county_name === county.county_name).timeline}
                                           style={{margin: "0 auto"}}>
                                    <XAxis dataKey="reporting_date"/>
                                    <YAxis orientation="right"/>
                                    <Tooltip/>
                                    <Area name="confirmed" type="monotone"
                                          dataKey="total_cases"
                                          stroke="none"
                                          fillOpacity={0.5} fill={Utils.CONFIRMED_COLOR}/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </Col>
                    ))}
                </Row>
                <hr/>
                <Row className="spaced-row">
                    <Col className="text-left">
                        <a href="#/">All countries</a>
                    </Col>
                    <Col className="text-right"><p>Data sources:</p>
                        <a href="https://www.graphs.ro">graphs.ro</a><br/>
                        <a href="https://stirioficiale.ro">stirioficiale.ro</a>
                    </Col>
                </Row>
            </Container>
        )
    }
}