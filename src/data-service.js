import confirmedData from './data/confirmed.json';
import recoveredData from './data/recovered.json';
import deathsData from './data/deaths.json';

export default class DataService {
    static getVerboseData() {
        return confirmedData.map(function (obj) {
            return DataService.getCountryData(obj.country);
        });
    }

    static getCountryData(countryName) {
        const countryConfirmed = confirmedData.find(c => c.country === countryName);
        const countryRecovered = recoveredData.find(c => c.country === countryName);
        const countryDeaths = deathsData.find(c => c.country === countryName);

        const countryData = {
            name: countryName,
            population: countryConfirmed.population,
            summary: {
                confirmed: {
                    new: countryConfirmed.total.new,
                    new1Mil: this.noNaN(parseInt((countryConfirmed.total.new / parseInt(countryConfirmed.population)) * 1000000)),
                    total: countryConfirmed.total.total,
                    total1Mil: this.noNaN(parseInt((countryConfirmed.total.total / parseInt(countryConfirmed.population)) * 1000000)),
                },
                recovered: {
                    new: countryRecovered.total.new,
                    total: countryRecovered.total.total,
                },
                deaths: {
                    new: countryDeaths.total.new,
                    new1Mil: this.noNaN(parseInt((countryDeaths.total.new / parseInt(countryDeaths.population)) * 1000000)),
                    total: countryDeaths.total.total,
                    total1Mil: this.noNaN(parseInt((countryDeaths.total.total / parseInt(countryDeaths.population)) * 1000000)),
                },
                closed: {
                    new: countryDeaths.total.new + countryRecovered.total.new,
                    total: countryDeaths.total.total + countryRecovered.total.total
                },
                active: {
                    new: countryConfirmed.total.new - (countryDeaths.total.new + countryRecovered.total.new),
                    total: countryConfirmed.total.total - (countryDeaths.total.total + countryRecovered.total.total),
                    total1Mil: this.noNaN(parseInt(((countryConfirmed.total.total - (countryDeaths.total.total + countryRecovered.total.total)) / parseInt(countryConfirmed.population)) * 1000000))
                }
            },
            timeline: {}
        };

        countryData.timeline = Object.keys(countryConfirmed.timeline).map(function (key) {
            return {
                date: key,
                confirmedNew: countryConfirmed.timeline[key].new,
                confirmedTotal: countryConfirmed.timeline[key].total,
                deathsNew: countryDeaths.timeline[key].new,
                deathsTotal: countryDeaths.timeline[key].total,
                recoveredNew: countryRecovered.timeline[key].new,
                recoveredTotal: countryRecovered.timeline[key].total,
                closedNew: countryDeaths.timeline[key].new + countryRecovered.timeline[key].new,
                closedTotal: countryDeaths.timeline[key].total + countryRecovered.timeline[key].total,
                activeNew: countryConfirmed.timeline[key].new - (countryDeaths.timeline[key].new + countryRecovered.timeline[key].new),
                activeTotal: countryConfirmed.timeline[key].total - (countryDeaths.timeline[key].total + countryRecovered.timeline[key].total),
                deathRateClosedCases: Number(((countryDeaths.timeline[key].total / (countryDeaths.timeline[key].total + countryRecovered.timeline[key].total)) * 100).toFixed(1)),
                deathRateTotalCases: Number(((countryDeaths.timeline[key].total / countryConfirmed.timeline[key].total) * 100).toFixed(1))
            };
        });

        // console.log(countryData)
        return countryData;
    }

    static getConfirmedTimelines(countries) {
        // get all dates
        const dates = Object.keys(confirmedData[0].timeline).map(function (d) {
            return d
        });

        const data = dates.map(function (d) {
            return {
                date: d
            }
        });


        countries.forEach(function (countryName) {
            const confirmedTimeline = confirmedData.find(c => c.country === countryName);
            data.forEach(function (obj) {
                obj[countryName] = confirmedTimeline.timeline[obj.date].total;
            });
        });

        // console.log(data);
        return data;
    }

    static noNaN(n) {
        return isNaN(n) ? 0 : n;
    }
}