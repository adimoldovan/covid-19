import csv
import json
import locale
import os
import re
import time
from datetime import date, timedelta, datetime

import requests
from bs4 import BeautifulSoup

DATA_BASE_URL = "https://stirioficiale.ro/informatii"
START_DATE = date(2020, 3, 19)
DATE_FORMAT_OUT = "%Y-%m-%d"
TESTS_STRING = "prelucrate\s*(\d*[., ]?\d*?[., ]\d*)\s*(?:de\s)*teste"
ATI_STRING = "La ATI.+ (\d+)"
NEW_CASES_STRING = "nregistrate (\d*?[.]?\d*) (?:de\s)*cazuri noi"
JSON_FILE = "src/data/romania.json"
CSV_FILE = "src/data/romania.csv"


def main():
    start = os.getenv("START_DATE", None)
    end = os.getenv("END_DATE", None)

    if not start:
        start = get_last_date() + timedelta(days=1)
    else:
        start = datetime.strptime(start, DATE_FORMAT_OUT)

    if not end:
        end = datetime.today()
    else:
        end = datetime.strptime(end, DATE_FORMAT_OUT)

    print("Scraping data from {} to {}".format(start, end))
    timeline_data = read_json()
    while start <= end:
        article_data = parse_date(start)
        yesterday_data = timeline_data[(len(timeline_data) - 1)]
        article_data["new_tests"] = article_data["tests"] - yesterday_data["tests"]
        article_data["positivity_rate"] = round(
            (article_data["new_cases"] / article_data["new_tests"]) * 100, 2
        )
        timeline_data.append(article_data)
        start = start + timedelta(days=1)
        time.sleep(3)

    # print(timeline_data)
    write_json(timeline_data)
    write_csv(timeline_data)


def parse_date(article_date):
    locale.setlocale(locale.LC_TIME, "ro_RO.UTF-8")
    article_url = "buletin-de-presa-{}-ora-13-00".format(
        article_date.strftime("%-d-%B-%Y").lower()
    )
    url = "{}/{}".format(DATA_BASE_URL, article_url)
    print("Requesting {}".format(url))

    data = {}
    response = requests.get(url)
    # print(response)
    soup = BeautifulSoup(response.text, "html.parser")
    article_content = soup.select("div.my-8.break-words.rich-text")[0].text
    # # print(article_content)
    tests = re.findall(TESTS_STRING, article_content, flags=re.IGNORECASE)
    # # print(tests)
    ati = re.findall(ATI_STRING, article_content, flags=re.IGNORECASE)
    # # print(ati)
    new_cases = re.findall(NEW_CASES_STRING, article_content, flags=re.IGNORECASE)
    # # print(new_cases)
    #
    data["date"] = article_date.strftime(DATE_FORMAT_OUT)
    data["tests"] = int(tests[0].replace(".", "").replace(" ", "").strip())
    data["new_cases"] = int(new_cases[0].replace(".", "").replace(" ", "").strip())
    data["ati"] = int(ati[0].replace(".", "").replace(" ", "").strip())

    print(data)
    return data


def write_json(data):
    with open(JSON_FILE, "w") as outfile:
        json.dump(data, outfile, indent=2)


def write_csv(data):
    with open(CSV_FILE, "w") as outfile:
        writer = csv.writer(outfile)
        writer.writerow(["date", "tests", "ati", "new cases"])

        for d in data:
            writer.writerow([d["date"], d["tests"], d["ati"], d["new_cases"]])


def read_json():
    with open(JSON_FILE, "r") as input_file:
        return json.load(input_file)


def get_last_date():
    timeline_data = read_json()
    return datetime.strptime(
        timeline_data[(len(timeline_data) - 1)]["date"], DATE_FORMAT_OUT
    )


if __name__ == "__main__":
    main()
