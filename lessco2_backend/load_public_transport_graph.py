from pathlib import Path
import json


def calculate_emissions(edge):
    # TODO: Adjust emissions
    if edge["type"] == "PLANE":
        return edge["distance"] * 0.257
    elif edge["type"] == "TRAIN":
        return edge["distance"] * 0.041
    elif edge["type"] == "CAR":
        return edge["distance"] * edge["distance"] * 0.118


def load_public_transport_graph(path):
    with open(Path(path), "r", encoding="utf-8") as f:
        graph_data = json.loads(f.read())

    node_data = graph_data["nodes"]
    edge_data = graph_data["edges"]
    emissions_graph = {}
    for origin in edge_data:
        emissions_graph[origin] = {}
        for destination in edge_data[origin]:
            edge = edge_data[origin][destination]
            emissions_graph[origin][destination] = {"weight" : calculate_emissions(edge)}

    return emissions_graph, node_data, edge_data


def load_default_public_transport_graph():
    return load_public_transport_graph("./final_graph.json")

