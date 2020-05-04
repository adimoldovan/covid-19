import React, { Component } from 'react';
import DataService from './data-service';
import { Container } from 'react-bootstrap'
import Charts from './charts';

export default class Country extends Component {
    constructor(props) {
        super(props);
        const { params } = this.props.match

        var summaryData = DataService.getCountriesSummaryData();
        this.countrySummaryData = summaryData.find(c => c.name == params.countryName);
        console.log(this.countrySummaryData);
    }
    render() {
        return (
            <Container>
                <table className="table table-condensed">
                    <thead>
                        <tr>
                            <th></th>
                            <th colSpan="3">Confirmed</th>
                            <th colSpan="3">Deaths</th>
                            <th colSpan="3">Recovered</th>
                        </tr>
                        <tr>
                            <td className="text-left"><a href="#/">All countries</a></td>
                            <td className="text-right">Total</td>
                            <td className="text-right">New</td>
                            <td className="text-right">Growth</td>
                            <td className="text-right">Total</td>
                            <td className="text-right">New</td>
                            <td className="text-right">Growth</td>
                            <td className="text-right">Total</td>
                            <td className="text-right">New</td>
                            <td className="text-right">Growth</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-left">{this.countrySummaryData.name}</td>
                            <td className="text-right">{this.countrySummaryData.confirmed.total}</td>
                            <td className="text-right">{this.countrySummaryData.confirmed.new}</td>
                            <td className="text-right">{this.countrySummaryData.confirmed.growth}</td>
                            <td className="text-right">{this.countrySummaryData.deaths.total}</td>
                            <td className="text-right">{this.countrySummaryData.deaths.new}</td>
                            <td className="text-right">{this.countrySummaryData.deaths.growth}</td>
                            <td className="text-right">{this.countrySummaryData.recovered.total}</td>
                            <td className="text-right">{this.countrySummaryData.recovered.new}</td>
                            <td className="text-right">{this.countrySummaryData.recovered.growth}</td>
                        </tr>
                    </tbody>
                </table>
                <Charts countryName={this.countrySummaryData.name} />
            </Container>
        )
    }
}