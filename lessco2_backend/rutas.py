# SPDX-FileCopyrightText: 2024 EcoViaggio
#
# SPDX-License-Identifier: MIT

from scipy.spatial.distance import cdist
import numpy as np
import networkx as nx
import itertools

from clustering_functions import obtain_clusters
from utils import distancia_semiverseno

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

def route_to_graph(cluster, node_data):
    nearest_city_info, _ = obtain_nearest_city(cluster[-1], node_data)
    nearest_city = [nearest_city_info["name"], nearest_city_info["latitude"], nearest_city_info["longitude"]]
    travelers_and_city = cluster[:-1] + [nearest_city]
    coords = np.array([tupla[1:] for tupla in travelers_and_city])
    distances = cdist(coords, coords, metric=distancia_semiverseno)
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
        dist = distancia_semiverseno(node_coordinates, reference_point[1:])
        if dist < min_distance:
            min_distance = dist
            nearest_city = node
    return node_data[nearest_city], min_distance

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

def car_emissions(distance):
    return distance * distance * 0.118

def get_path_length(path, distances):
    if path is None:
        return 0
    length = 0
    for i in range(len(path) - 1):
        length += distances[path[i]][path[i + 1]]
    return length

def concat_names(path):
    if path is None:
        return None
    names = [tupla[0] for tupla in path[:-2]]
    names = ", ".join(names)
    if len(path) > 2:
        names += " y " + path[-2][0]
    return names

def get_path_emissions(path):
    coords = np.array([tupla[1:] for tupla in path])
    total_distance = 0
    for i in range(len(coords) - 1):
        total_distance += distancia_semiverseno(coords[i], coords[i + 1])
    return car_emissions(total_distance)


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
