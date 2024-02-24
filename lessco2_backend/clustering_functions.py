from sklearn.cluster import DBSCAN, KMeans
import numpy as np
from utils import distancia_semiverseno
from scipy.spatial.distance import cdist
import math

def obtain_clusters(origin_coordinates, max_distance=30):
    x_coords = np.array([person[1] for person in origin_coordinates])
    y_coords = np.array([person[2] for person in origin_coordinates])

    clusters, final_clusters = [], []

    data = np.array([x_coords, y_coords]).T
    dbscan = DBSCAN(eps=max_distance, min_samples=1, metric=distancia_semiverseno).fit(data)

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
    distances = cdist(coords, coords, metric=distancia_semiverseno)

    kmeans = KMeans(n_clusters=math.ceil(len(cluster) / 5))

    kmeans.fit(distances)
    results = kmeans.labels_

    for i in range(max(results) + 1):
        clusters.append([cluster[j] for j in range(len(cluster)) if results[j] == i])
        centroid = obtain_centroid(clusters[i])
        clusters[i].append(centroid)

    return clusters