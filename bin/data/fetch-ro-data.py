import json

import requests

DATA_BASE_URL = "https://www.graphs.ro"

MAPPING = [
    {
        "input": "json.php",
        "json": "romania_graphs_ro.json",
    },
    {
         "input": "vaccinare_json.php",
          "json": "romania_graphs_ro_vaccine.json",
    },
    {
        "input": "json_apify.php",
        "json": "romania_graphs_ro_light.json",
    }
]


def main():
    for e in MAPPING:
        r = requests.get("{}/{}".format(DATA_BASE_URL, e["input"]))
        with open("./src/data/{}".format(e["json"]), "w") as outfile:
            j = json.loads(r.text)
            json.dump(j, outfile, indent=2)


if __name__ == "__main__":
    main()
