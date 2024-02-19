# SPDX-FileCopyrightText: 2024 EcoViaggio
#
# SPDX-License-Identifier: MIT

import math
from sklearn.cluster import DBSCAN
from scipy.spatial.distance import cdist
from sklearn.cluster import KMeans
import numpy as np
import networkx as nx
import itertools
from requests import request


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


def car_emissions(distance):
    return distance * distance * 0.118


def obtain_clusters(origin_coordinates, max_distance=30):
    x_coords = np.array([person[1] for person in origin_coordinates])
    y_coords = np.array([person[2] for person in origin_coordinates])

    clusters, final_clusters = [], []

    data = np.array([x_coords, y_coords]).T
    dbscan = DBSCAN(eps=max_distance, min_samples=1, metric=__distancia_semiverseno__).fit(data)

    results = dbscan.labels_
    for i in range(max(results) + 1):
        clusters.append([origin_coordinates[j] for j in range(len(origin_coordinates)) if results[j] == i])

    for cluster in clusters:
        centroid = obtain_centroid(cluster)
        if len(cluster) <= 5:
            cluster.append(centroid)
            final_clusters.append(cluster)
        else:
            clusters_aux = divide_cluster(cluster)
            final_clusters.extend(clusters_aux)

    return final_clusters


def obtain_centroid(cluster):
    coords = np.array([tupla[1:] for tupla in cluster])
    centroid = np.mean(coords, axis=0)
    return ["Centroid"] + list(centroid)


def divide_cluster(cluster):
    clusters = []

    coords = np.array([tupla[1:] for tupla in cluster])
    distances = cdist(coords, coords, metric=__distancia_semiverseno__)

    kmeans = KMeans(n_clusters=math.ceil(len(cluster) / 5))

    kmeans.fit(distances)
    results = kmeans.labels_

    for i in range(max(results) + 1):
        clusters.append([cluster[j] for j in range(len(cluster)) if results[j] == i])
        centroid = obtain_centroid(clusters[i])
        clusters[i].append(centroid)

    return clusters


def concat_names(path):
    if path is None:
        return None
    names = [tupla[0] for tupla in path[:-2]]
    names = ", ".join(names)
    if len(path) > 2:
        names += " y " + path[-2][0]
    return names


def route_to_graph(cluster, node_data):
    nearest_city_info, dist_city = obtain_nearest_city(cluster[-1], node_data)
    nearest_city = [nearest_city_info["name"], nearest_city_info["latitude"], nearest_city_info["longitude"]]
    travelers_and_city = cluster[:-1] + [nearest_city]
    coords = np.array([tupla[1:] for tupla in travelers_and_city])
    distances = cdist(coords, coords, metric=__distancia_semiverseno__)
    path = obtain_shortest_path(distances)

    destination_index = path.index(len(cluster) - 1)
    if destination_index == len(path) - 1:
        path_idx_1 = path[:]
        path1 = [travelers_and_city[i] for i in path_idx_1]
        path_idx_2 = None
        path2 = None
    elif destination_index == 0:
        path_idx_2 = None
        path2 = None
        path_idx_1 = path[destination_index:]
        path1 = [travelers_and_city[i] for i in path_idx_1]
    else:
        path_idx_1 = path[: destination_index + 1]
        path1 = [travelers_and_city[i] for i in path_idx_1]
        path_idx_2 = list(reversed(path[destination_index:]))
        path2 = [travelers_and_city[i] for i in path_idx_2]

    emission1 = car_emissions(get_path_length(path_idx_1, distances))
    emission2 = car_emissions(get_path_length(path_idx_2, distances))

    names1 = concat_names(path1)
    names2 = concat_names(path2)

    route = []
    route.append({"path": path1, "emissions": emission1, "names": names1})
    if path2:
        route.append({"path": path2, "emissions": emission2, "names": names2})

    return route, nearest_city_info


def obtain_nearest_city(reference_point, node_data):
    min_distance = 1000000
    nearest_city = None
    for node in node_data:
        node_coordinates = [node_data[node]["latitude"], node_data[node]["longitude"]]
        # coords = (
        #     f"{node_data[node]['longitude']},{node_data[node]['latitude']};{reference_point[1]},{reference_point[2]}"
        # )
        # result = request("GET", f"http://router.project-osrm.org/route/v1/driving/{coords}?overview=false")
        dist = __distancia_semiverseno__(node_coordinates, reference_point[1:])
        # if result.status_code == 200:
        #     content = result.json()
        #     dist = content["routes"][0]["distance"]
        # else:
        #     print("Error en la request a ORSM")
        #     print(result.status_code)
        #     return None
        if dist < min_distance:
            min_distance = dist
            nearest_city = node
    return node_data[nearest_city], min_distance


# De momento no hace falta
def obtain_distance_matrix(cluster):
    distance_matrix = [[0] * len(cluster) for _ in range(len(cluster))]

    for i in range(len(cluster)):
        for j in range(len(cluster)):
            distance_matrix[i][j] = __distancia_semiverseno__(cluster[i][1:], cluster[j][1:])

    return distance_matrix


def obtain_shortest_path(distances):
    num_cities = len(distances)
    cities = list(range(num_cities))
    permutations = itertools.permutations(cities)

    shortest_path = None
    shortest_distance = float("inf")

    for perm in permutations:
        perm = list(perm)
        total_distance = 0
        for i in range(len(perm) - 1):
            total_distance += distances[perm[i]][perm[i + 1]]
        if total_distance < shortest_distance:
            shortest_distance = total_distance
            shortest_path = perm

    return shortest_path


def get_path_emissions(path):
    coords = np.array([tupla[1:] for tupla in path])
    total_distance = 0
    for i in range(len(coords) - 1):
        total_distance += __distancia_semiverseno__(coords[i], coords[i + 1])
    return car_emissions(total_distance)


def get_path_length(path, distances):
    if path is None:
        return 0
    length = 0
    for i in range(len(path) - 1):
        length += distances[path[i]][path[i + 1]]
    return length


def dijkstra_route(origin, destiny, emissions_graph, node_data, edge_data):
    G = nx.from_dict_of_dicts(emissions_graph)
    shortest_route = nx.shortest_path(G, source=origin, target=destiny, weight="weight")
    len = nx.shortest_path_length(G, source=origin, target=destiny, weight="weight")

    internal_route = []
    for id1, id2 in zip(shortest_route, shortest_route[1:]):
        step = {
            "origin": node_data[id1]["name"],
            "origin_coordinates": {"latitude": node_data[id1]["latitude"], "longitude": node_data[id1]["longitude"]},
            "destiny": node_data[id2]["name"],
            "destiny_coordinates": {"latitude": node_data[id2]["latitude"], "longitude": node_data[id2]["longitude"]},
            "emission": emissions_graph[id1][id2]["weight"],
            "travel_type": edge_data[id1][id2]["type"],
        }
        internal_route.append(step)

    return internal_route, len


def obtain_all_routes(coordinates, destination, emissions_graph, node_data, edge_data):
    final_routes = []
    clusters = obtain_clusters(coordinates)
    last_city, dist_from_last_city = obtain_nearest_city(destination, node_data)
    for cluster in clusters:

        cluster_route = {}

        route, first_city = route_to_graph(cluster, node_data)
        cluster_route["step1"] = route

        if first_city["id"] == last_city["id"]:
            for group in cluster_route["step1"]:
                group["path"][-1] = destination
                group["emissions"] = get_path_emissions(group["path"])
        else:
            internal_route, total_emissions = dijkstra_route(
                first_city["id"], last_city["id"], emissions_graph, node_data, edge_data
            )
            cluster_route["step2"] = {"path": internal_route, "emissions": total_emissions}

            cluster_route["step3"] = {
                "origin": last_city,
                "destination": destination,
                "emissions": car_emissions(dist_from_last_city),
            }

        final_routes.append(cluster_route)

    return final_routes
