import confirmedData from './data/confirmed.json';
import recoveredData from './data/recovered.json';
import deathsData from './data/deaths.json';

export default class DataService {
    static getCountriesVerboseData() {
        var data = confirmedData.map(function (obj) {
            return DataService.getCountryData(obj.country);
        });
        return data;
    }

    static getCountryData(countryName) {
        var countryConfirmed = confirmedData.find(c => c.country === countryName);
        var countryRecovered = recoveredData.find(c => c.country === countryName);
        var countryDeaths = deathsData.find(c => c.country === countryName);

        var countryData = {
            name: countryName,
            summary: {
                confirmed: {
                    new: countryConfirmed.total.new,
                    total: countryConfirmed.total.total,
                },
                recovered: {
                    new: countryRecovered.total.new,
                    total: countryRecovered.total.total,
                },
                deaths: {
                    new: countryDeaths.total.new,
                    total: countryDeaths.total.total,
                },
                closed: {
                    new: countryDeaths.total.new + countryRecovered.total.new,
                    total: countryDeaths.total.total + countryRecovered.total.total
                },
                active: {
                    new: countryConfirmed.total.new - (countryDeaths.total.new + countryRecovered.total.new),
                    total: countryConfirmed.total.total - (countryDeaths.total.total + countryRecovered.total.total)
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
                closedTotal: countryDeaths.timeline[key].total + countryRecovered.timeline[key].total,
                activeTotal: countryConfirmed.timeline[key].total - (countryDeaths.timeline[key].total + countryRecovered.timeline[key].total)
            };
        });

        // console.log(countryData)
        return countryData;
    }

    static getConfirmedTimelines(countries) {
        // get all dates
        var dates = Object.keys(confirmedData[0].timeline).map(function (d) {
            return d
        });

        var data = dates.map(function (d) {
            return {
                date: d
            }
        });

        countries.map(function (countryName) {
            var confirmedTimeline = confirmedData.find(c => c.country === countryName);
            data.map(function (obj) {
                obj[countryName] = confirmedTimeline.timeline[obj.date].total;
            });
        });

        // console.log(data);
        return data;
    }
}