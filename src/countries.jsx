import React, {Component} from 'react';
import DataService from './data-service';
import {Col, Container, Row} from 'react-bootstrap';
import Utils from './utils';
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

        let deathRateTotal = (world.summary.deaths.total / world.summary.confirmed.total * 100).toFixed(1);

        const countryNameDict = {
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

        // Map data
        const confirmedMapData = [];
        data.forEach(function (country) {
            let nameMatch = countryNameDict[country.name]
            let translatedName = (nameMatch) ? nameMatch : country.name
            let countryMapData = {
                name: translatedName,
                value: country.summary.confirmed.total1Mil
            };
            confirmedMapData.push(countryMapData);
        });

        function getMapOptions(title, color, data) {
            return {
                title: {
                    text: title,
                    right: 5,
                    bottom: 5,
                    textStyle: {
                        fontWeight: 'normal'
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
                        color: ['#f5f5f5', color]
                    },
                    text: ['50', '1 000'],
                    calculable: true
                },
                series: [
                    {
                        name: title,
                        type: 'map',
                        mapType: 'world',
                        roam: 'move',
                        zoom: 1.2,
                        emphasis: {itemStyle: {areaColor: 'red'}},
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        data: data
                    }
                ]
            }
        }

        const confirmedMapOptions = getMapOptions('Confirmed cases / 1 mil. pop.', Utils.CONFIRMED_COLOR, confirmedMapData);

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
                    <Col className="text-left"><h1>COVID-19 worldwide</h1></Col>
                    <Col className="text-right"><a href="https://github.com/CSSEGISandData/COVID-19" target="_blank"
                                                   rel="noopener noreferrer">data source</a></Col>
                </Row>
                <hr/>
                <Row className="justify-content-between header">
                    <Col sm={3}>
                        <div className="summary-box">
                            <span className="number">{Utils.formattedNumber(world.summary.confirmed.total)}</span>
                            <br/>
                            <span className="description">confirmed cases</span>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div className="summary-box ">
                            <span className="number">{Utils.formattedNumber(world.summary.deaths.total)}</span>
                            <br/>
                            <span className="description">deceased</span>
                            <br/>
                            <span
                                className="fine">{Utils.formattedNumber(deathRateTotal)} % out of confirmed cases</span>
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-between header">
                    <Col>
                        <ReactEcharts
                            option={confirmedMapOptions || {}}
                            className='react_for_echarts'/>
                    </Col>
                </Row>
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
