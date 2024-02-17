import grafo_trenes
from itertools import combinations
import math
from models import Edge
import requests


def __distancia_semiverseno__(c1, c2):
    radioTierra = 6371
    lat1 = math.radians(c1[0])
    lon1 = math.radians(c1[1])
    lat2 = math.radians(c2[0])
    lon2 = math.radians(c2[1])

    sinChi = math.sin((lat2 - lat1) / 2)
    sinLambda = math.sin((lon2 - lon1) / 2)

    raiz = (sinChi * sinChi) + math.cos(lat1) * math.cos(lat2) * (sinLambda * sinLambda)

    return 2 * radioTierra * math.asin(math.sqrt(raiz))


tg = grafo_trenes.TrainsGraph()
pg = {}
# pg = PlanesGraph()

node_data = tg.node_data | pg.node_data
graph = tg.graph | pg.graph

for n1, n2 in combinations(node_data, 2):
    if node_data[n1].type == node_data[n2].type:
        continue

    # Generar ruta en coche si son menos de 10 km
    distancia_tierra = __distancia_semiverseno__(
        (node_data[n1].latitude, node_data[n1].longitude), (node_data[n2].latitude, node_data[n2].longitude)
    )
    if distancia_tierra < 10:
        # Generar ruta en coche
        # petición a la api de openmaps
        response = requests(
            f"http://router.project-osrm.org/route/v1/driving/{node_data[n1].latitude},{node_data[n1].longitude};{node_data[n2].latitude},{node_data[n2].longitude}?overview=false"
        )

        if response.status_code != 200:
            continue

        response = response.json()
        distancia_tierra = response["routes"][0]["distance"]
        # TODO: calcular co2
        graph[n1][n2] = Edge(origin=n1, destination=n2, distance=distancia_tierra, co2=1, type="CAR")
        graph[n2][n1] = Edge(origin=n2, destination=n1, distance=distancia_tierra, co2=1, type="CAR")
