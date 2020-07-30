import React, {Component} from 'react';
import DataService from './data-service';
import {Card, CardDeck, Col, Container, Row} from 'react-bootstrap';
import Utils from './utils';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import ReactEcharts from 'echarts-for-react';
import BootstrapTable from 'react-bootstrap-table-next';

import 'echarts/map/js/world.js';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.js';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import ToolkitProvider, {ColumnToggle} from 'react-bootstrap-table2-toolkit';

export default class Countries extends Component {
    componentDidMount() {

    }

    render() {
        let data = DataService.getVerboseData()
        let world = data.find(c => c.name === 'World');
        data.pop(world);

        let activeRate = (world.summary.active.total / world.summary.confirmed.total * 100).toFixed(1);
        let recoveredRateTotal = (world.summary.recovered.total / world.summary.confirmed.total * 100).toFixed(1);
        let recoveredRateClosed = (world.summary.recovered.total / world.summary.closed.total * 100).toFixed(1);
        let deathRateTotal = (world.summary.deaths.total / world.summary.confirmed.total * 100).toFixed(1);
        let deathRateClosed = (world.summary.deaths.total / world.summary.closed.total * 100).toFixed(1);

        let mapData = [];

        let nameTranslator = {
            'US': 'United States',
            'South Sudan': 'S. Sudan',
            'Western Sahara': 'W. Sahara',
            'Cote d\'Ivoire': 'Cote d\'Ivoire',
            'Central African Republic': 'Central African Rep.',
            'Congo (Kinshasa)': 'Dem. Rep. Congo',
            'Congo (Brazzaville)': 'Congo',
            'Czechia': 'Czech Rep.',
            'Bosnia and Herzegovina': 'Bosnia and Herz.',
            'North Macedonia': 'Macedonia',
            'Korea, South': 'Korea',
            'Dominican Republic': 'Dominican Rep.',
            'Laos': 'Lao PDR',
            'Burma': 'Myanmar'
        }

        data.forEach(function (country) {
            let nameMatch = nameTranslator[country.name]
            let translatedName = (nameMatch) ? nameMatch : country.name
            let countryMapData = {
                name: translatedName,
                value: country.summary.confirmed.total1Mil
            };
            mapData.push(countryMapData);
        });

        let option = {
            title: {
                text: 'Total confirmed cases / 1 mil population',
                left: 'center'
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    dataZoom: {
                        show: false,
                        title: {
                            zoom: 'Area zooming',
                            back: 'Restore area zooming'
                        }
                    }
                }
            },
            tooltip: {
                trigger: 'item'
            },
            visualMap: {
                left: 'left',
                min: 50,
                max: 10000,
                inRange: {
                    color: ['#f5f5f5', '#a50026']
                },
                text: ['50', '1 000'],
                calculable: true
            },
            series: [
                {
                    name: 'Confirmed cases / 1 mil. pop.',
                    type: 'map',
                    mapType: 'world',
                    roam: 'move',
                    zoom: 1.1,
                    emphasis: {itemStyle: {areaColor: 'yellow'}},
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data: mapData
                }
            ]
        };

        function countryLink(countryName) {
            return <a href={"#/" + countryName} target="_blank" rel="noopener noreferrer">{countryName}</a>;
        }

        function sortCaret(order) {
            if (!order) return (<span className="order">&nbsp;</span>);
            else if (order === 'asc') return (<span className="caret-asc">&nbsp;</span>);
            else if (order === 'desc') return (<span className="caret-desc">&nbsp;</span>);
            return null;
        }

        const {ToggleList} = ColumnToggle;

        const columns = [{
            dataField: 'name',
            text: 'Country',
            sort: true,
            filter: textFilter({
                placeholder: 'filter',
                style: {
                    backgroundColor: '#f5f5f5',
                    border: 0,
                    margin: 5,
                    color: '#d3d3d3',
                    fontStyle: 'italic'
                }
            }),
            align: 'left',
            formatter: countryLink,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.confirmed.total',
            text: 'Total cases',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.confirmed.total1Mil',
            text: 'Total cases/1M pop.',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.confirmed.new',
            text: 'New cases',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.confirmed.new1Mil',
            text: 'New cases/1M pop.',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.active.total',
            text: 'Active cases',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.active.total1Mil',
            text: 'Active cases/1M pop.',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.deaths.total',
            text: 'Total deceased',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.deaths.total1Mil',
            text: 'Deceased/1M pop.',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.deaths.new',
            text: 'Deceased new',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.deaths.new1Mil',
            text: 'Deceased new/1M pop.',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.recovered.total',
            text: 'Recovered',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'summary.recovered.new',
            text: 'Recovered new',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }, {
            dataField: 'population',
            text: 'Population',
            sort: true,
            align: 'right',
            formatter: Utils.formattedNumber,
            sortCaret: sortCaret
        }];

        const defaultSorted = [{
            dataField: 'summary.confirmed.total',
            order: 'desc'
        }];

        return (
            <Container fluid>
                <Row className="justify-content-between header">
                    <Col className="text-left"><h1>COVID-19</h1></Col>
                    <Col className="text-right"><a href="https://github.com/CSSEGISandData/COVID-19" target="_blank"
                                                   rel="noopener noreferrer">data source</a></Col>
                </Row>
                <hr/>
                <Container fluid id="summary">
                    <CardDeck>
                        <Card>
                            <Card.Header
                                style={{backgroundColor: Utils.CONFIRMED_COLOR, color: "#333"}}>Confirmed</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {Utils.formattedNumber(world.summary.confirmed.total)}<br/>&nbsp;<br/>&nbsp;
                                </Card.Title>
                                <ResponsiveContainer height={30}>
                                    <AreaChart data={world.timeline} style={{margin: "0 auto"}}>
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
                                    {Utils.formattedNumber(world.summary.active.total)}<br/><small
                                    className="text-muted">{activeRate}% out of total</small><br/>&nbsp;
                                </Card.Title>
                                <ResponsiveContainer height={30}>
                                    <AreaChart data={world.timeline} style={{margin: "0 auto"}}>
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
                                    {Utils.formattedNumber(world.summary.recovered.total)}<br/><small
                                    className="text-muted">{recoveredRateTotal}% out of total</small><br/><small
                                    className="text-muted">{recoveredRateClosed}% out of closed</small>
                                </Card.Title>
                                <ResponsiveContainer height={30}>
                                    <AreaChart data={world.timeline} style={{margin: "0 auto"}}>
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
                                    {Utils.formattedNumber(world.summary.deaths.total)}<br/><small
                                    className="text-muted">{deathRateTotal}% out of total</small><br/><small
                                    className="text-muted">{deathRateClosed}% out of closed</small>
                                </Card.Title>
                                <ResponsiveContainer height={30}>
                                    <AreaChart data={world.timeline} style={{margin: "0 auto"}}>
                                        <Area dataKey="deathsNew" fill={Utils.DECEASED_COLOR} stroke="none"/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </CardDeck>
                </Container>
                <Container fluid id="charts">
                    <Card>
                        <Card.Body>
                            <ReactEcharts
                                option={option || {}}
                                style={{height: '550px', width: '100%'}}
                                className='react_for_echarts'/>
                            <CardDeck>
                                <Card border="light">
                                    <Card.Body>
                                        <ResponsiveContainer height={250}>
                                            <ComposedChart data={world.timeline} style={{margin: "0 auto"}}
                                                           fontSize={10}>
                                                <XAxis dataKey="date"/>
                                                <YAxis/>
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <Tooltip/>
                                                <Legend verticalAlign="bottom" height={36}/>
                                                <Area name="total confirmed" type="monotone" dataKey="confirmedTotal"
                                                      stroke="none"
                                                      fillOpacity={0.5} fill={Utils.CONFIRMED_COLOR}/>
                                                <Line name="total active" dot={false} dataKey="activeTotal"
                                                      stroke={Utils.ACTIVE_COLOR} strokeWidth="2"/>
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                                <Card border="light">
                                    <Card.Body>
                                        <ResponsiveContainer height={250}>
                                            <BarChart width={730} height={250} data={world.timeline}
                                                      style={{margin: "0 auto"}}>
                                                <XAxis dataKey="date"/>
                                                <YAxis domain={[0, 'dataMax+1']}/>
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <Tooltip/>
                                                <Legend verticalAlign="bottom" height={36}/>
                                                <Bar name="daily confirmed" type="monotone" dataKey="confirmedNew"
                                                     stroke="none"
                                                     fill={Utils.CONFIRMED_COLOR}/>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </CardDeck>
                        </Card.Body>
                    </Card>
                </Container>
                <Container fluid id="countries">
                    <ToolkitProvider
                        keyField='name'
                        data={data}
                        columns={columns}
                        columnToggle>
                        {
                            props => (
                                <div>
                                    <ToggleList
                                        contextual="light"
                                        {...props.columnToggleProps} />
                                    <hr/>
                                    <BootstrapTable
                                        {...props.baseProps}
                                        filter={filterFactory()}
                                        hover
                                        bordered={false}
                                        defaultSorted={defaultSorted}
                                    />
                                </div>
                            )
                        }
                    </ToolkitProvider>
                    <div>Data source: <a
                        href="https://github.com/CSSEGISandData/COVID-19">https://github.com/CSSEGISandData/COVID-19</a>
                    </div>
                </Container>
            </Container>
        )
    }
}