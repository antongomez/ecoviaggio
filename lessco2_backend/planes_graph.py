# SPDX-FileCopyrightText: 2024 EcoViaggio
#
# SPDX-License-Identifier: MIT

from models import Node, Edge
import json

from utils import distancia_semiverseno

class PlanesGraph:
    def __init__(self):
        with open("locations_destinations_airports.json") as f:
            data = json.load(f)

            locations = data["locations"]
            destinations = data["destinations"]

            self.node_data = {}
            self.planes_graph = {}

            for iata in locations:
                self.node_data[iata] = Node(
                    id=iata,
                    name=locations[iata]["name"],
                    latitude=locations[iata]["latitude"],
                    longitude=locations[iata]["longitude"],
                    type="AIRPORT",
                )
                self.planes_graph[iata] = {}
                for destination in destinations[iata]:
                    lat1 = locations[iata]["latitude"]
                    lon1 = locations[iata]["longitude"]
                    lat2 = locations[destination]["latitude"]
                    lon2 = locations[destination]["longitude"]
                    distance = distancia_semiverseno((lat1, lon1), (lat2, lon2))
                    # TODO: Add distance and co2
                    self.planes_graph[iata][destination] = Edge(
                        origin=iata,
                        destination=destination,
                        distance=distance,
                        co2=1,
                        type="PLANE",
                    )

