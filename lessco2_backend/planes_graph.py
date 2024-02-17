from models import Node, Edge
import json
import math

def semiverseno(c1, c2):
    radioTierra = 6371
    lat1 = math.radians(c1[0])
    lon1 = math.radians(c1[1])
    lat2 = math.radians(c2[0])
    lon2 = math.radians(c2[1])

    sinChi = math.sin((lat2 - lat1) / 2)
    sinLambda = math.sin((lon2 - lon1) / 2)

    raiz = (sinChi * sinChi) + math.cos(lat1) * math.cos(lat2) * (sinLambda * sinLambda)

    return 2 * radioTierra * math.asin(math.sqrt(raiz))

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
                    distance = semiverseno((lat1, lon1), (lat2, lon2))
                    # TODO: Add distance and co2
                    self.planes_graph[iata][destination] = Edge(
                        origin=iata,
                        destination=destination,
                        distance=distance,
                        co2=1,
                        type="PLANE",
                    )

