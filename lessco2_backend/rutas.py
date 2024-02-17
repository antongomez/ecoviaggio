import math
from sklearn.cluster import DBSCAN
from scipy.spatial.distance import cdist
from sklearn.cluster import KMeans
import numpy as np
import networkx as nx
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


def obtain_centroid(cluster):
    coords = np.array([tupla[1:] for tupla in cluster])
    centroid = np.mean(coords, axis=0)
    return centroid


def divide_cluster(cluster):
    clusters = []

    coords = np.array([tupla[1:] for tupla in cluster])
    distances = cdist(coords, coords, metric=__distancia_semiverseno__)

    kmeans = KMeans(n_clusters=math.ceil(len(cluster) / 5))

    kmeans.fit(distances)
    results = kmeans.labels_
    centroids = kmeans.cluster_centers_

    for i in range(max(results) + 1):
        clusters.append([cluster[j] for j in range(len(cluster)) if results[j] == i] + [centroids[i]])

    return clusters


def obtain_clusters(origin_coordinates, max_distance=1000):
    x_coords = np.array([person[1] for person in origin_coordinates])
    y_coords = np.array([person[2] for person in origin_coordinates])

    clusters, final_clusters = [], []

    data = np.array([x_coords, y_coords]).T
    dbscan = DBSCAN(eps=max_distance, min_samples=1).fit(data)

    results = dbscan.labels_
    for i in range(max(results) + 1):
        clusters.append([origin_coordinates[j] for j in range(len(origin_coordinates)) if results[j] == i])

    for cluster in clusters:
        centroid = obtain_centroid(cluster)
        if len(cluster) <= 5:
            cluster.append(centroid)
            final_clusters.append(cluster)
        else:
            clusters_aux = divide_cluster(cluster, centroid)
            final_clusters.extend(clusters_aux)

    return final_clusters


def obtain_nearest_city(cluster):
    pass

def obtain_distance_matrix(cluster):
    distance_matrix = [[0] * len(cluster) for _ in range(len(cluster))]

    for i in range(len(cluster)):
        for j in range(len(cluster)):
            distance_matrix[i][j] = __distancia_semiverseno__(cluster[i][1:], cluster[j][1:])

    return distance_matrix


def obtain_cluster_route(cluster):
    nearest_city = obtain_nearest_city(cluster[-1])
    # Al igual hace falta formatear nearest_city
    coordinates_list = [f"{position[1]},{position[2]}" for position in cluster[:-1]] + [
        f"{nearest_city[0]},{nearest_city[1]}"
    ]
    coordinates_string = ";".join(coordinates_list)
    request = f"http://router.project-osrm.org/table/v1/driving/{coordinates_string}?annotations=distance"
    response = requests.get(request)
    if response.status_code == 200:
        distances = response.json()["distances"]
        path = obtain_shortest_path(distances)
        destination_index = path.index(len(cluster) - 1)
        path1 = [cluster[i] for i in path[:destination_index + 1]]
        path2 = [cluster[i] for i in list(reversed(path[destination_index:]))]
        len1 = get_path_length(path1, distances)
        len2 = get_path_length(path2, distances)
        return path1, len1, path2, len2, nearest_city
    else:
        print("Error en la petición")
        return None

def get_path_length(path, distances):
    length = 0
    for i in range(len(path) - 1):
        length += distances[path[i]][path[i + 1]]
    return length

def obtain_shortest_path(distances):
    G = nx.Graph()
    num_nodes = len(distances)
    for i in range(num_nodes):
        G.add_node(i)
    for i in range(num_nodes):
        for j in range(i + 1, num_nodes):
            G.add_edge(i, j, weight=distances[i][j])

    return nx.approximation.traveling_salesman_problem(G, cycle=False)


def obtain_nearest_destination_cities(destination_coordinates):
    pass


def obtain_graph_route(origin, destination):
    pass


def obtain_all_routes(coordinates):
    routes = []
    clusters = obtain_clusters(coordinates[:-1])
    for cluster in clusters:
        routes.append(obtain_cluster_route(cluster))
    out_city = obtain_nearest_destination_cities(coordinates[-1])
    for route in routes:
        route["graph_route"] = obtain_graph_route(route["origin_graph"], out_city)

    # Formatar salida para facilitar el front

    pass
