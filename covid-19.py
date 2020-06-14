import csv
import json
import os
import urllib
import urllib.request
from datetime import datetime, timedelta

DATA_BASE_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_%s"
LOOKUP_DATA = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv"
IMPORTED_DATA_DIR = "imported_data"

DATE_FORMAT_IN = "%m/%d/%y"
DATE_FORMAT_OUT = "%Y-%m-%d"

confirmed_data = []
deaths_data = []
recovered_data = []
coordinates_data = []

MAPPING = [
    {
        "input": "confirmed_global.csv",
        "object": confirmed_data,
        "json": "src/data/confirmed.json",
    },
    {
        "input": "deaths_global.csv",
        "object": deaths_data,
        "json": "src/data/deaths.json",
    },
    {
        "input": "recovered_global.csv",
        "object": recovered_data,
        "json": "src/data/recovered.json",
    },
]


def main():
    get_data_files()
    lookup = process_lookup_data()

    for e in MAPPING:
        process_input(e["input"], e["object"], lookup)
        write_json(e["object"], e["json"])


def process_lookup_data():
    with open(
            "{}/{}".format(IMPORTED_DATA_DIR, "lookup-table.csv"), newline=""
    ) as csv_file:
        data = list(csv.DictReader(csv_file, delimiter=","))

    lookup = list()
    for line in data:
        if line["Province_State"] == "":
            lookup.append(line)

    return lookup


def process_input(input_file, output, lookup):
    with open("{}/{}".format(IMPORTED_DATA_DIR, input_file), newline="") as csv_file:
        data = list(csv.DictReader(csv_file, delimiter=","))

    countries = {}
    for line in data:
        country_name = line["Country/Region"]
        del line["Country/Region"]
        del line["Province/State"]
        del line["Lat"]
        del line["Long"]

        # get all days
        days = dict(filter(lambda item: item[0], line.items()))
        days = {
            datetime.strptime(d, DATE_FORMAT_IN).strftime(DATE_FORMAT_OUT): int(a)
            for d, a in days.items()
        }

        # sum up values for provinces
        if countries.get(country_name):
            for d in countries[country_name]:
                countries[country_name][d] += days[d]
        else:
            countries[country_name] = days

    world = {}
    for country in countries.items():
        # sum up to get add world values
        for day in country[1].keys():
            if world.get(day):
                world[day] += country[1][day]
            else:
                world[day] = country[1][day]

    countries["World"] = world

    for country, timeline in countries.items():
        for day, amount in timeline.items():
            # d is "2020-01-22": 0, day is "2020-01-22", amount is 0
            timeline[day] = {"total": amount, "new": amount, "growth": 0}
            yesterday = (
                    datetime.strptime(day, DATE_FORMAT_OUT) - timedelta(days=1)
            ).strftime(DATE_FORMAT_OUT)

            # get new cases and growth since yesterday
            if timeline.get(yesterday):
                timeline[day]["new"] = (
                        timeline[day]["total"] - timeline[yesterday]["total"]
                )
                timeline[day]["growth"] = round(
                    timeline[day]["new"] / timeline[yesterday]["total"]
                    if timeline[yesterday]["total"] != 0
                    else 0,
                    2,
                )

            # add population, iso codes
            lookup_data = [line for line in lookup if line["Country_Region"] == country]

            try:
                population = int(lookup_data[0]["Population"])
            except (IndexError, ValueError):
                population = 0

            try:
                iso2 = lookup_data[0]["iso2"]
            except IndexError:
                iso2 = ""

            try:
                iso3 = lookup_data[0]["iso3"]
            except IndexError:
                iso3 = ""

        output.append(
            {
                "country": country,
                "population": population,
                "iso2": iso2,
                "iso3": iso3,
                "total": list(timeline.values())[-1],
                "timeline": timeline,
            }
        )


def write_json(data, output_file):
    with open(output_file, "w") as outfile:
        json.dump(data, outfile, indent=2)


def get_data_files():
    if not os.path.exists(IMPORTED_DATA_DIR):
        os.makedirs(IMPORTED_DATA_DIR)

    for e in MAPPING:
        urllib.request.urlretrieve(
            DATA_BASE_URL % e["input"], "{}/{}".format(IMPORTED_DATA_DIR, e["input"])
        )

    urllib.request.urlretrieve(
        LOOKUP_DATA, "{}/{}".format(IMPORTED_DATA_DIR, "lookup-table.csv")
    )


if __name__ == "__main__":
    main()
