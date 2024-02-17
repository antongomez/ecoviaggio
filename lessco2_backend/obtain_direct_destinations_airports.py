# SPDX-FileCopyrightText: 2024 EcoViaggio
#
# SPDX-License-Identifier: MIT

# SPDX-FileCopyrightText: 2024 EcoViaggio
#
# SPDX-License-Identifier: MIT

import requests
import json
import sys

# Obtener el argumento desde la línea de comandos
if len(sys.argv) != 2:
    print("Uso: python script.py <token_amadeus>")
    sys.exit(1)

token = sys.argv[1]

codigos_iata = [
    'LHR', 'CDG', 'AMS', 'FRA', 'IST', 'MAD', 'BCN', 'LGW', 'MUC', 'FCO',
    'SVO', 'SAW', 'DME', 'DUB', 'ZRH', 'CPH', 'PMI', 'MAN', 'OSL', 'LIS',
    'ARN', 'AYT', 'STN', 'BRU', 'DUS', 'VIE', 'MXP', 'ATH', 'HEL', 'TFS',
    'AGP', 'VKO', 'HAM', 'GVA', 'LED', 'ESB', 'LTN', 'WAW', 'PRG', 'ALC',
    'EDI', 'NCE', 'BUD', 'LPA', 'BHX', 'BER', 'ADB', 'OTP', 'CGN', 'BGY'
]  # fmt: skip

url = "https://test.api.amadeus.com/v1/airport/direct-destinations"
url_locations = "https://test.api.amadeus.com/v1/reference-data/locations"
headers = {"Authorization": "Bearer " + token}

destinations = dict()
locations = dict()

print("Obtaining coordinates...")
for iata in codigos_iata:
    print("IATA code:", iata)
    # set of direct destinations from iata
    destinations[iata] = set()
    # request to obtain location data (name, latitude, longitude)
    parameters = {
        "subType": "AIRPORT",
        "keyword": iata,
        "page[limit]": 1,
        "page[offset]": 0,
        "sort": "analytics.travelers.score",
        "view": "FULL",
    }
    response = requests.get(url_locations, params=parameters, headers=headers)
    if response.status_code == 200:
        data = response.json()

        if data["meta"]["count"] == 0:
            print("No location data for", iata)
            continue

        locations[iata] = {
            "name": data["data"][0]["name"],
            "latitude": data["data"][0]["geoCode"]["latitude"],
            "longitude": data["data"][0]["geoCode"]["longitude"],
        }
    else:
        print("Request error. IATA code:", iata)
        print("Status code:", response.status_code)
        print("Error content:", response.text)
        continue

print("Obtaining direct conections...")
for iata in codigos_iata:
    parameters = {"departureAirportCode": iata}

    print("IATA code:", iata)

    respuesta = requests.get(url, params=parameters, headers=headers)

    if respuesta.status_code == 200:
        datos = respuesta.json()

        if datos["meta"]["count"] == 0:
            print("No direct destinations for", iata)
            continue

        datos = datos["data"]

        for destino in datos:
            if destino["iataCode"] in codigos_iata:
                # Non-directed Graph
                destinations[iata].add(destino["iataCode"])
                destinations[destino["iataCode"]].add(iata)

    else:
        print("Request error. IATA code:", iata)
        print("Status code:", respuesta.status_code)
        print("Error content:", respuesta.text)
        continue

# Cast set to list to make it serializable
for iata in destinations.keys():
    destinations[iata] = list(destinations[iata])

locations_destinations = {"locations": locations, "destinations": destinations}
json_resultante = json.dumps(locations_destinations, indent=2)

with open("locations_destinations_airports.json", "w") as file:
    json.dump(locations_destinations, file, indent=2)
