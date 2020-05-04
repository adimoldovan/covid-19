import confirmedData from './data/confirmed.json';
import recoveredData from './data/recovered.json';
import deathsData from './data/deaths.json';

export default class DataService {

    static getCountriesSummaryData() {
        let countries = confirmedData.map(function (val) {
            return { name: val.country, confirmed: val.total, recovered: {}, deaths: {} };
        })

        countries.forEach(populateCountryData)

        function populateCountryData(item) {
            item.recovered = getCountryData(recoveredData, item.name)
            item.deaths = getCountryData(deathsData, item.name)
        }

        function getCountryData(list, countryName) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].country === countryName) {
                    return list[i].total;
                }
            }
        }

        console.log(countries)
        return countries;
    }

    static getCountriesTimelineData() {
        let countries = confirmedData.map(function (val) {
            return { name: val.country, confirmed: val.timeline, recovered: {}, deaths: {} };
        })

        countries.forEach(populateCountryData)

        function populateCountryData(item) {
            item.recovered = getCountryData(recoveredData, item.name)
            item.deaths = getCountryData(deathsData, item.name)
        }

        function getCountryData(list, countryName) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].country === countryName) {
                    return list[i].timeline;
                }
            }
        }

        console.log(countries)
        return countries;
    }
}